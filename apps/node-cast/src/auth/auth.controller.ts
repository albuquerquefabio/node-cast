import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './constants/auth-constants';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() auth: AuthDto) {
    return await this.authService.signIn(auth.username, auth.password);
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Delete('/logout')
  async logout(@Request() req) {
    return await this.authService.signOut(
      req.headers.authorization,
      req.user.id
    );
  }
}
