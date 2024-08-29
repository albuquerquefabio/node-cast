import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from './interfaces/users.interface';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    user = {
      id: '1',
      name: 'Jack Daniel',
      username: 'jackdaniel',
      email: 'jack.daniel@example.com',
      password: 'password123',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [UserRoles.USER],
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      expect(await controller.findOne('1', { user })).toEqual(user);
    });
    it('should return not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await controller.findOne('1', { user })).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Jack Daniel',
        username: 'jackdaniel',
        email: 'jack.daniel@example.com',
        password: 'password123',
      };

      const user: User = {
        id: '1',
        ...createUserDto,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [UserRoles.USER],
      };
      jest.spyOn(service, 'create').mockResolvedValue(user);

      expect(await controller.create(createUserDto)).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [user];
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newUsername',
      };

      const updatedUser: User = {
        ...user,
        id: '1',
        username: 'newUsername',
      };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const req = { user: { id: '1' } };
      expect(await controller.update(updateUserDto, req)).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const req = { user: { id: '1' } };
      expect(await controller.delete(req)).toEqual({
        message: 'Done',
        status: true,
      });
    });
  });
});
