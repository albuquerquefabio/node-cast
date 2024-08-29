import { AuthService } from './../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // async validate(
  //   username: string,
  //   password: string
  // ): Promise<Promise<Omit<Partial<User>, 'password'>>> {
  //   const user = await this.authService.validateUser(username, password);
  //   if (!user) throw new UnauthorizedException();
  //   return user;
  // }
}
