import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersController } from '../api/users/users.controller';
import { UsersService } from '../api/users/users.service';
import { DatabaseModule } from '../shared/database.module';
import { EntityProviders } from '../util/entities/entity.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EntityProviders,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
