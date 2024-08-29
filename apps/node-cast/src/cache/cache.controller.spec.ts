import { Test, TestingModule } from '@nestjs/testing';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';

describe('CacheController', () => {
  let controller: CacheController;
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheController],
      providers: [
        {
          provide: CacheService,
          useValue: {
            readData: jest
              .fn()
              .mockResolvedValue({ access_token: 'testAccessToken' }),
          },
        },
      ],
    }).compile();

    controller = module.get<CacheController>(CacheController);
    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('read', () => {
    it('should return true', async () => {
      const key = 'testKey';
      const result = await controller.read(key);
      expect(result).toStrictEqual({ access_token: 'testAccessToken' });
      expect(service.readData).toHaveBeenCalledWith(key);
    });
  });
});
