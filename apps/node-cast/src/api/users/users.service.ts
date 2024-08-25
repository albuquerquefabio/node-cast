import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../util/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../util/dtos/users/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, username, email, password } = createUserDto;

    if (!name || !email || !password) {
      throw new Error('Missing required fields');
    }

    const user = this.usersRepository.create({
      name,
      email,
      username,
      password,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<Array<User>> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ where: { id } });
  }
}
