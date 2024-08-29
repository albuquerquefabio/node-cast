import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ttlSecToMs } from './cache-constants';
import { ICacheService } from './interface/cache.interface';
import { hasObject } from '../util/utility';

@Injectable()
export class CacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async createData<T>(
    key: string,
    value: T,
    ttlInSeconds?: number
  ): Promise<void> {
    const ttlMs = ttlInSeconds ? ttlSecToMs(ttlInSeconds) : undefined;
    await this.cacheManager.set(key, value, ttlMs);
  }

  async readData<T>(key: string): Promise<T> {
    const value = await this.cacheManager.get<T>(key);
    if (hasObject(value)) return value;
    return null;
  }

  async updateData<T>(
    key: string,
    value: T,
    ttlInSeconds?: number
  ): Promise<void> {
    const ttlMs = ttlInSeconds ? ttlSecToMs(ttlInSeconds) : undefined;
    await this.cacheManager.set(key, value, ttlMs);
  }

  async deleteData(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
