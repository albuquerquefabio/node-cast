import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import Redis from 'ioredis';
import { INestApplication } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly redisClient: Redis;

  constructor(private readonly app: INestApplication) {
    super(app);
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: +(process.env.REDIS_PORT ?? 6379),
    });
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      socket: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: +(process.env.REDIS_PORT ?? 6379),
      },
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
