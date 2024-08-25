import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

export const EntityProviders = TypeOrmModule.forFeature([User]);
