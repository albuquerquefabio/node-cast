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
            find: jest.fn().mockResolvedValue('true'),
            store: jest.fn().mockResolvedValue('true'),
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

  describe('find', () => {
    it('should return true', async () => {
      const result = await controller.find();
      expect(result).toBe('true');
      expect(service.retrieveData).toHaveBeenCalled();
    });
  });

  describe('store', () => {
    it('should return true', async () => {
      const result = await controller.store();
      expect(result).toBe('true');
      expect(service.storeData).toHaveBeenCalled();
    });
  });
});
