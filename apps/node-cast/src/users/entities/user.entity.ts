import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '../interfaces/users.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @Index({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  status: boolean;

  @Column({
    type: 'simple-array',
    enum: Object.values(UserRoles),
    default: UserRoles.USER,
  })
  roles: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
