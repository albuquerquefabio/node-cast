import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CacheService } from '../../cache/cache.service';
import { IS_PUBLIC_KEY, jwtConstants } from '../constants/auth-constants';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private redisCache: CacheService
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    const redisToken = await this.getRedisToken(token);

    if (!redisToken) throw new UnauthorizedException();

    try {
      const payload = await this.verifyToken(redisToken);

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async getRedisToken(token: string): Promise<string> {
    const { access_token } = await this.redisCache.readData<{
      access_token: string;
    }>(token);
    return access_token;
  }

  private async verifyToken(
    token: string
  ): Promise<Pick<User, 'username' | 'email' | 'id'>> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
