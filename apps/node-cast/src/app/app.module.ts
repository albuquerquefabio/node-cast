import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { DatabaseModule } from '../shared/database.module';
import { EntityProviders } from '../util/entities/entity.providers';
import { AppCacheModule } from '../cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EntityProviders,
    AppCacheModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
