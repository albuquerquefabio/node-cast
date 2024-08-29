import { Controller, Get, Param } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get(':key')
  async read(@Param('key') key: string) {
    const data = await this.cacheService.readData(key);

    return data;
  }
}
