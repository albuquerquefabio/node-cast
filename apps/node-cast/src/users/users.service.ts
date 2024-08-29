import { UpdateUserDto } from './dto/update-user.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { checkPassword, hashPassword } from '../util/utility';
import { IUsersService } from './interfaces/users.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersRepo: UsersRepository
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, username, email, password } = createUserDto;

    if (!name || !email || !password) {
      throw new Error('Missing required fields');
    }

    await this.hasUser({ username, email });

    const hashPassword = await this.hashPassword(password);

    const user = this.usersRepository.create({
      name,
      email,
      username,
      password: hashPassword,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<Array<User>> {
    return this.usersRepository.find({
      where: { status: true },
      select: { password: false },
    });
  }

  async findOne(
    id: string,
    select?: Partial<Record<keyof User, boolean>>
  ): Promise<Partial<User>> {
    return this.usersRepository.findOne({
      where: [
        ...(!isNaN(+id) ? [{ id, status: true }] : []),
        { username: id, status: true },
        { email: id, status: true },
      ],
      ...(select && Object.keys(select).length ? select : {}),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found.');

    if (updateUserDto.username)
      await this.hasUser({ username: updateUserDto.username });

    if (updateUserDto.password && updateUserDto.oldPassword) {
      await this.checkPassword(updateUserDto.oldPassword, user.password);
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.update(id, { status: false });
  }

  private async hasUser(
    identifier: Partial<Pick<CreateUserDto, 'username' | 'email'>>
  ): Promise<void> {
    if (identifier.email) {
      const existingUserByEmail = await this.usersRepo.findByEmail(
        identifier.email
      );
      if (existingUserByEmail) {
        throw new ConflictException('Email already in use.');
      }
    }

    if (identifier.username) {
      const existingUserByUsername = await this.usersRepo.findByUsername(
        identifier.username
      );
      if (existingUserByUsername) {
        throw new ConflictException('Username already in use.');
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await hashPassword(password);
  }

  private async checkPassword(password: string, hashed: string): Promise<void> {
    await checkPassword(password, hashed);
  }
}
