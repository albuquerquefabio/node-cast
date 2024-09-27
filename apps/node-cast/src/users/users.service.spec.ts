import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from './interfaces/users.interface';
import { UsersRepository } from './repositories/users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let usersRepo: UsersRepository;
  let user: User;
  const id = Date.now();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    usersRepo = module.get<UsersRepository>(UsersRepository);

    user = {
      id,
      name: 'Jack Daniel',
      username: 'jackdaniel' + id,
      email: `jack.daniel.${id}@example.com`,
      password: 'hashedPassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [UserRoles.USER],
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jack Daniel',
        username: 'jackdaniel' + id,
        email: `jack.daniel.${id}@example.com`,
        password: 'password123',
      };

      const user = new User();
      user.name = createUserDto.name;
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      user.password = createUserDto.password;

      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockReturnValue('hashedPassword');

      const result = await service.create(createUserDto);

      expect(result).toEqual(user);
    });

    it('should throw an error if required fields are missing', async () => {
      const createUserDto: CreateUserDto = {
        name: '',
        username: 'jackdaniel' + id,
        email: '',
        password: '',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Missing required fields'
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [user];

      jest.spyOn(repository, 'find').mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.findOne(String(id))).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('User not found'));

      expect(service.findOne(String(id))).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update the password', async () => {
      const userData: UpdateUserDto = {
        password: 'newPassword',
        oldPassword: 'password',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...user, password: 'newHashedPassword' });
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password } = await service.findOne(String(user.id));

      const result = await service.update(user.id, {
        password: userData.password,
        oldPassword: userData.oldPassword,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.oldPassword,
        password
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(repository.save).toHaveBeenCalledWith({
        ...user,
        password: 'newHashedPassword',
      });
      delete user['oldPassword'];
      expect(result).toEqual({ ...user, password: 'newHashedPassword' });
    });
    it('should update the username', async () => {
      const userData: UpdateUserDto = {
        username: 'newUsername',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...user,
        username: userData.username,
      });

      const result = await service.update(user.id, userData);

      expect(result.username).toBe(userData.username);
      expect(repository.save).toHaveBeenCalledWith({
        ...user,
        username: userData.username,
      });
    });
    it('should throw an error if user sends a duplicated username', async () => {
      const userData: UpdateUserDto = {
        username: 'existingUsername',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(usersRepo, 'findByUsername').mockResolvedValueOnce({
        ...user,
        username: userData.username,
      });
      jest.spyOn(repository, 'save').mockImplementation();

      await expect(service.update(user.id, userData)).rejects.toThrow(
        'Username already in use.'
      );
      expect(usersRepo.findByUsername).toHaveBeenCalledWith(userData.username);
      expect(repository.save).not.toHaveBeenCalled();
    });
    it('should throw an error if user sends the wrong password confirmation', async () => {
      const userData: UpdateUserDto = {
        password: 'newPassword',
        oldPassword: 'wrongOldPassword',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      jest.spyOn(repository, 'save').mockImplementation();

      const { password } = await service.findOne(String(user.id));

      await expect(
        service.update(user.id, {
          password: userData.password,
          oldPassword: userData.oldPassword,
        })
      ).rejects.toThrow('Password incorrect.');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.oldPassword,
        password
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
  // describe('delete', () => {});
});
