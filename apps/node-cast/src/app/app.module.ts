import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../shared/database.module';
import { EntityProviders } from '../util/entities/entity.providers';
import { AppCacheModule } from '../cache/cache.module';
import { APP_GUARD } from '@nestjs/core';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { HandlerGateway } from '../gateways/handler.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    DatabaseModule,
    EntityProviders,
    AuthModule,
    AppCacheModule,
    HandlerGateway,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LocalAuthGuard,
    },
  ],
})
export class AppModule {}
