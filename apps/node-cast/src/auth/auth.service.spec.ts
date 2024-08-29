import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/cache.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

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
          },
        },
        {
          provide: CacheService,
          useValue: {
            createData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    cacheService = module.get<CacheService>(CacheService);
    user = {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [],
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
        id: '1',
      });
      expect(cacheService.createData).toHaveBeenCalledWith(
        'token',
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
        id: '1',
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        status: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        roles: [],
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
        id: '1',
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [],
      };

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await service['generateToken'](user);

      expect(result).toBe('token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'testuser',
        name: 'Test User',
        id: '1',
      });
    });
  });

  describe('storeToken', () => {
    it('should store the token in cache', async () => {
      jest.spyOn(cacheService, 'createData').mockResolvedValue(undefined);

      await service['storeToken']('token');

      expect(cacheService.createData).toHaveBeenCalledWith(
        'token',
        { access_token: 'token' },
        expect.any(Number)
      );
    });
  });
});
