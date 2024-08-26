import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';

export const EntityProviders = TypeOrmModule.forFeature([User]);
