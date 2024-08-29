import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DatabaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST') ?? '127.0.0.1',
        port: parseInt(configService.get<string>('POSTGRES_PORT') ?? '5432'),
        username: configService.get<string>('POSTGRES_USER') ?? 'postgres',
        password:
          configService.get<string>('POSTGRES_PASSWORD') ?? 'postgres123',
        database: configService.get<string>('POSTGRES_DB') ?? 'node_cast',
        autoLoadEntities: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      };
    },
  }),
];
