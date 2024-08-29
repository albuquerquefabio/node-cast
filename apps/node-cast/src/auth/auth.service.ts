import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
// import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/cache.service';
import { ttl } from '../cache/cache-constants';
import { User } from '../users/entities/user.entity';
import { checkPassword } from '../util/utility';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisCache: CacheService
  ) {}

  async signIn(
    username: string,
    password: string
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(username, password);
    const access_token = await this.generateToken(user);
    await this.storeToken(access_token);
    return { access_token };
  }

  private async validateUser(
    username: string,
    pass: string
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException();
    const { password, ...result } = user;
    await checkPassword(pass, password);
    return result as Required<User>;
  }

  private async generateToken(user: Omit<User, 'password'>): Promise<string> {
    const { username, name, id } = user;
    const payload = { username, name, id };
    return await this.jwtService.signAsync(payload);
  }

  private async storeToken(token: string): Promise<void> {
    await this.redisCache.createData(token, { access_token: token }, ttl.hour);
  }
}
