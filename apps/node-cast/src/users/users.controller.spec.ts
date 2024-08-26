import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from './interfaces/users.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  // const id = Date.now().toString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: User = {
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
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      expect(await controller.findOne('1')).toEqual(user);
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
});
