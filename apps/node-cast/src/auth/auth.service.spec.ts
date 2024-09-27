import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/cache.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../users/interfaces/users.interface';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let cacheService: CacheService;

  let user: User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            createData: jest.fn(),
            deleteData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    cacheService = module.get<CacheService>(CacheService);
    user = {
      id: 1,
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [UserRoles.USER],
    };
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
      jest.spyOn(cacheService, 'createData').mockResolvedValue(undefined);

      const result = await service.signIn('testuser', 'password');

      expect(result).toEqual({ access_token: 'token' });
      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'testuser',
        name: 'Test User',
        id: 1,
        roles: [UserRoles.USER],
      });
      expect(cacheService.createData).toHaveBeenCalledWith(
        `#Session-${user.id}:token`,
        { access_token: 'token' },
        expect.any(Number)
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(service.signIn('invaliduser', 'password')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockRejectedValue(false);

      jest.spyOn(service, 'signIn').mockImplementation(async () => {
        throw new UnauthorizedException('Password incorrect.');
      });

      await expect(service.signIn('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('validateUser', () => {
    it('should return user data without password for valid credentials', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service['validateUser']('testuser', 'password');

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        status: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        roles: [UserRoles.USER],
      });
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(
        service['validateUser']('invaliduser', 'password')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service['validateUser']('testuser', 'wrongpassword')
      ).rejects.toThrow('Password incorrect.');
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [UserRoles.USER],
      };

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await service['generateToken'](user);

      expect(result).toBe('token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'testuser',
        name: 'Test User',
        id: 1,
        roles: [UserRoles.USER],
      });
    });
  });

  describe('storeToken', () => {
    it('should store the token in cache', async () => {
      jest.spyOn(cacheService, 'createData').mockResolvedValue(undefined);

      await service['storeToken'](user.id, 'token');

      expect(cacheService.createData).toHaveBeenCalledWith(
        `#Session-${user.id}:token`,
        { access_token: 'token' },
        expect.any(Number)
      );
    });
  });

  describe('signOut', () => {
    it('should call doubleCheck and deleteData with correct arguments', async () => {
      const token = 'Bearer validtoken';
      const userId = 1;

      (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ id: userId });
      (cacheService.deleteData as jest.Mock).mockResolvedValue(undefined);

      await service.signOut(token, userId);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('validtoken', {
        secret: 'very_secret_code_GOES_HERE',
      });

      expect(cacheService.deleteData).toHaveBeenCalledWith('validtoken');
    });

    it('should throw BadRequestException when token or userId is empty', async () => {
      await expect(service.signOut('', 1)).rejects.toThrow(BadRequestException);
      await expect(service.signOut('Bearer validtoken', null)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'Bearer invalidtoken';
      const userId = 1;

      await expect(service['doubleCheck'](token, userId)).rejects.toThrow(
        UnauthorizedException
      );

      await expect(service.signOut(token, userId)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
