import { Cache } from 'cache-manager';

import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { RatesRepository } from '~/rates/rates.repository';
import { RatesAdapter } from '~/rates/rates.adapter';
import { RATES_TTL } from '~/constants/cache.constants';

import { RateDto } from '@repo/api/rates/dto/rate.dto';
import { Rate } from '@repo/api/rates/entities/rate.entity';

@Injectable()
export class RatesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private ratesRepository: RatesRepository,
    private ratesAdapter: RatesAdapter,
  ) {}

  public async findAll(query: RateDto): Promise<Rate> {
    const cachedResult = await this.cacheManager.get<Rate>(query.cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const rate = await this.ratesRepository.findRate(query);
    const adaptedRate = this.ratesAdapter.adaptRate(rate, query);

    await this.cacheManager.set(query.cacheKey, adaptedRate, RATES_TTL);

    return adaptedRate;
  }
}
