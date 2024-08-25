import { Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers';

@Module({
  imports: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}
