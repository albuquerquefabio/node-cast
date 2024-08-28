import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ttl, ttlSecToMs } from './cache-constants';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createData', () => {
    it('should store access_token with ttl', async () => {
      const bearer = 'testBearer';
      const ttlInSeconds = ttl.hour;
      const ttlMs = ttlSecToMs(ttlInSeconds);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      await service.createData(bearer, { access_token: bearer }, ttlInSeconds);

      expect(cacheManager.set).toHaveBeenCalledWith(
        bearer,
        { access_token: bearer },
        ttlMs
      );
    });
  });

  describe('readData', () => {
    it('should return access_token if present', async () => {
      const bearer = 'testBearer';
      const accessToken = 'testAccessToken';
      jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue({ access_token: accessToken });

      const result = await service.readData<{ access_token: string }>(bearer);
      expect(result).toStrictEqual({ access_token: accessToken });
      expect(cacheManager.get).toHaveBeenCalledWith(bearer);
    });

    it('should return null if access_token is not present', async () => {
      const bearer = 'testBearer';
      jest.spyOn(cacheManager, 'get').mockResolvedValue({});

      const result = await service.readData(bearer);
      expect(result).toBeNull();
      expect(cacheManager.get).toHaveBeenCalledWith(bearer);
    });
  });
});
