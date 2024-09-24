import { Module } from '@nestjs/common';
import { HandlerGateway } from './handler.gateway';

@Module({
  providers: [HandlerGateway],
  exports: [HandlerGateway],
})
export class HandlerModule {}
