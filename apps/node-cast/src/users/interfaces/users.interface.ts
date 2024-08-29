import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export enum UserRoles {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<Array<User>>;
  findOne(
    id: string,
    select?: Partial<Record<keyof User, boolean>>
  ): Promise<Partial<User>>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}
