import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('DatabaseModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres123',
          database: process.env.POSTGRES_DB || 'node_cast',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        DatabaseModule,
      ],
    }).compile();
  }, 10000);

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
