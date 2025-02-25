import { Cache } from 'cache-manager';

import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Db } from '@repo/database/types';
import { exchangeRates } from '@repo/database/schema';

import { DRIZZLE } from '~/constants/db.constants';
import { CsvRepository } from '~/csv/csv.repository';
import { CsvParser } from '~/csv/csv.parser';

@Injectable()
export class CsvService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(DRIZZLE) private conn: Db,
    private csvRepository: CsvRepository,
    private csvParser: CsvParser,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async getLatestExchangeRates(): Promise<void> {
    const csv = await this.csvRepository.findExchangeRates();
    const rates = this.csvParser.parseExchangeRates(csv);

    await this.conn
      .insert(exchangeRates)
      .values({ audRate: rates.AUD, gbpRate: rates.GBP, usdRate: rates.USD });

    await this.cacheManager.reset();
  }
}
