import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AppCacheModule } from '../cache/cache.module';
import { jwtConstants } from './constants/auth-constants';
import { ttl } from '../cache/cache-constants';

@Module({
  imports: [
    AppCacheModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: `${ttl.hour}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
