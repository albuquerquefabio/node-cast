import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../users/interfaces/users.interface';

export const Roles = (...roles: Array<UserRoles>) =>
  SetMetadata('roles', roles);
