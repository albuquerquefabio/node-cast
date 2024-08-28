import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { RedisClientOptions } from 'redis';
// import redisStore from 'cache-manager-redis-store';
import { redisStore } from 'cache-manager-redis-yet';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ttl } from './cache-constants';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: +(process.env.REDIS_PORT ?? 6379),
      },
      // isGlobal: true,
      // imports: [ConfigModule],
      // useFactory: async () => ({
      //   ttl: ttl.hour,
      //   store: await redisStore({
      //     url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${
      //       process.env.REDIS_PORT ?? '6379'
      //     }`,
      //   }),
      // }),
      // inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  controllers: [CacheController],
  exports: [CacheService],
})
export class AppCacheModule {}
