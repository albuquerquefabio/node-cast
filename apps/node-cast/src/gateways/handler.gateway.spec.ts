import { Test, TestingModule } from '@nestjs/testing';
import { HandlerGateway } from './handler.gateway';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
describe('HandlerGateway', () => {
  let gateway: HandlerGateway;
  let app: INestApplication;
  let ioClient: Socket;
  let port: number;
  beforeEach(async () => {
    port = Math.floor(Math.random() * (40000 - 3000 + 1)) + 3000;
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandlerGateway],
    }).compile();

    app = module.createNestApplication();
    await app.listen(port);

    gateway = module.get<HandlerGateway>(HandlerGateway);

    ioClient = io(`http://localhost:${port}`, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "pong" on "ping"', async () => {
    ioClient.connect();
    ioClient.emit('ping', { message: 'Hello world!' });
    await new Promise<void>((resolve, reject) => {
      ioClient.on('connect', () => {
        console.log('connected');
      });
      // ioClient.on('disconnected', () => console.log('disconnected'));
      ioClient.on('pong', (data) => {
        try {
          expect(data).toStrictEqual({
            message: 'Thanks!',
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
    ioClient.close();
  });
});
