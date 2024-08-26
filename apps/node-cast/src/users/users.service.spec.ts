import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from './interfaces/users.interface';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  const id = Date.now().toString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
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

      expect(await service.create(createUserDto)).toEqual(user);
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
      const users: User[] = [
        {
          id,
          name: 'Jack Daniel',
          username: 'jackdaniel' + id,
          email: `jack.daniel.${id}@example.com`,
          password: 'password123',
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: [UserRoles.USER],
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: User = {
        id,
        name: 'Jack Daniel',
        username: 'jackdaniel' + id,
        email: `jack.daniel.${id}@example.com`,
        password: 'password123',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [UserRoles.USER],
      };

      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(user);

      expect(await service.findOne(id)).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('User not found'));

      await expect(service.findOne(id)).rejects.toThrow('User not found');
    });
  });
});
