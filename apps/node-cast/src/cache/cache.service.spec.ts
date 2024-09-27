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
            del: jest.fn(),
            store: {
              keys: jest.fn(),
              mget: jest.fn(),
            },
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

  describe('readDataByPattern', () => {
    it('should return an array of values matching the pattern', async () => {
      const pattern = 'test*';
      const keys = ['test1', 'test2'];
      const values = [{ access_token: 'token1' }, { access_token: 'token2' }];
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue(keys);
      jest.spyOn(cacheManager.store, 'mget').mockResolvedValue(values);

      const result = await service.readDataByPattern<{ access_token: string }>(
        pattern
      );

      expect(result).toStrictEqual(values);
      expect(cacheManager.store.keys).toHaveBeenCalledWith(pattern);
      expect(cacheManager.store.mget).toHaveBeenCalledWith(...keys);
    });

    it('should return null if no keys match the pattern', async () => {
      const pattern = 'test*';
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([]);

      const result = await service.readDataByPattern<{ access_token: string }>(
        pattern
      );

      expect(result).toBeNull();
      expect(cacheManager.store.keys).toHaveBeenCalledWith(pattern);
    });

    it('should filter out null values', async () => {
      const pattern = 'test*';
      const keys = ['test1', 'test2'];
      const values = [{ access_token: 'token1' }, null];
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue(keys);
      jest.spyOn(cacheManager.store, 'mget').mockResolvedValue(values);

      const result = await service.readDataByPattern<{ access_token: string }>(
        pattern
      );

      expect(result).toStrictEqual([{ access_token: 'token1' }]);
      expect(cacheManager.store.keys).toHaveBeenCalledWith(pattern);
      expect(cacheManager.store.mget).toHaveBeenCalledWith(...keys);
    });
  });

  describe('updateData', () => {
    it('should update data with ttl', async () => {
      const key = 'testKey';
      const value = { access_token: 'newToken' };
      const ttlInSeconds = ttl.hour;
      const ttlMs = ttlSecToMs(ttlInSeconds);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      await service.updateData(key, value, ttlInSeconds);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value, ttlMs);
    });

    it('should update data without ttl', async () => {
      const key = 'testKey';
      const value = { access_token: 'newToken' };
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      await service.updateData(key, value);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value, undefined);
    });
  });

  describe('deleteData', () => {
    it('should delete data', async () => {
      const key = 'testKey';
      jest.spyOn(cacheManager, 'del').mockResolvedValue(undefined);

      await service.deleteData(key);

      expect(cacheManager.del).toHaveBeenCalledWith(key);
    });
  });
});
