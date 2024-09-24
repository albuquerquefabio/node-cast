import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class HandlerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(_client: Socket) {
    console.log(`Client connected: ${this.server.listenerCount('connected')}`);
  }

  handleDisconnect(_client: Socket) {
    console.log(
      `client disconnected: ${this.server.listenerCount('connected')}`
    );
  }

  @SubscribeMessage('ping')
  handleMessage(_client: Socket, _data: Record<string, unknown>) {
    return {
      event: 'pong',
      data: { message: 'Thanks!' },
    };
  }
}
