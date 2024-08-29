import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CacheService } from '../cache/cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        Reflector,
        LocalAuthGuard,
        CacheService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const authDto: AuthDto = { username: 'testuser', password: 'testpass' };
      const result = { access_token: 'testtoken' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      const response = await authController.login(authDto);

      expect(response).toEqual(result);
      expect(authService.signIn).toHaveBeenCalledWith(
        authDto.username,
        authDto.password
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = { user: { id: 1, username: 'testuser' } };
      const result = authController.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });
});
