import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './constants/auth-constants';
import { AuthDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() auth: AuthDto) {
    return await this.authService.signIn(auth.username, auth.password);
  }

  @UseGuards(LocalAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
