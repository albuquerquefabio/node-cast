import { User } from './../../users/entities/user.entity';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../../users/interfaces/users.interface';
import { hasRole } from '../../util/utility';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()]
    );
    console.log({ requiredRoles });
    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: Omit<User, 'password'> }>();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    return hasRole(requiredRoles, user.roles);
  }
}
