import { User } from './../users/entities/user.entity';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { UserRoles } from '../users/interfaces/users.interface';

export const hasObject = (obj: unknown): boolean =>
  obj && typeof obj === 'object' && Boolean(Object.keys(obj).length);

export const hashPassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  const hashedPassword = await hash(password, saltOrRounds);

  if (!hashedPassword)
    throw new InternalServerErrorException('Password hashing failed.');

  return hashedPassword;
};

export const checkPassword = async (
  password: string,
  hashed: string
): Promise<void> => {
  const bool = await compare(password, hashed);

  if (!bool) throw new UnauthorizedException('Password incorrect.');
};

export const hasRole = (
  base: UserRoles | User['roles'],
  roles: User['roles']
): boolean => {
  if (typeof base === 'string') return roles.includes(base);
  const baseSet = new Set(base);
  return roles.some((role) => baseSet.has(role));
};
