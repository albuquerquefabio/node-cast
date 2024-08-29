import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';

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
