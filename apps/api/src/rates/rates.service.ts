import { Cache } from 'cache-manager';

import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Db } from '@repo/database/types';
import { exchangeRates } from '@repo/database/schema';
import { asc, desc, sql } from '@repo/database/db';

import { RATES_KEY, RATES_TTL } from '~/constants/cache.constants';
import { DRIZZLE } from '~/constants/db.constants';

import { RateDto } from '@repo/api/rates/dto/rate.dto';
import { Rate } from '@repo/api/rates/entities/rate.entity';

@Injectable()
export class RatesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(DRIZZLE) private conn: Db,
  ) {}

  public async findAll(query: RateDto): Promise<Rate> {
    const { rate, sort, page, perPage } = RatesService.parseQuery(query);
    const cacheKey = RatesService.buildCacheKey({ rate, sort, page, perPage });

    const cachedResult = await this.cacheManager.get<Rate>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const offset = RatesService.getOffset(page, perPage);
    const rateColumn = RatesService.getColumn(rate);
    const sortOrder = RatesService.getSort(sort);

    const result = await this.conn.transaction(async (tx) => {
      const [data, metadata, totalCount] = await Promise.all([
        RatesService.fetchData(tx, rateColumn, sortOrder, perPage, offset),
        RatesService.fetchMetadata(tx, rateColumn),
        RatesService.fetchTotalCount(tx),
      ]);

      return {
        data: RatesService.formatData(data, rate),
        metadata: RatesService.formatMetadata(metadata, rate),
        pagination: RatesService.calculatePagination(page, perPage, totalCount),
      };
    });

    await this.cacheManager.set(cacheKey, result, RATES_TTL);

    return result;
  }

  private static parseQuery({
    rate = 'usd',
    sort = 'desc',
    page = 1,
    perPage = 10,
  }: RateDto) {
    return { page: +page, perPage: +perPage, rate, sort };
  }

  private static buildCacheKey(
    query: ReturnType<typeof RatesService.parseQuery>,
  ) {
    return `${RATES_KEY}_${Object.values(query).join('_')}`;
  }

  private static getOffset(page: number, perPage: number) {
    return (page - 1) * perPage;
  }

  private static getColumn(rate: string) {
    const column =
      {
        aud: exchangeRates.audRate,
        gbp: exchangeRates.gbpRate,
        usd: exchangeRates.usdRate,
      }[rate] ?? exchangeRates.usdRate;
    return column;
  }

  private static getSort(sort: string) {
    const direction = { desc, asc }[sort] ?? desc;
    return direction;
  }

  private static fetchData(
    tx: Db,
    rateColumn: ReturnType<typeof RatesService.getColumn>,
    sortOrder: ReturnType<typeof RatesService.getSort>,
    perPage: number,
    offset: number,
  ) {
    return tx
      .select({
        id: exchangeRates.id,
        rate: rateColumn,
        createdAt: exchangeRates.createdAt,
      })
      .from(exchangeRates)
      .orderBy(sortOrder(exchangeRates.createdAt))
      .limit(perPage)
      .offset(offset);
  }

  private static fetchMetadata(
    tx: Db,
    column: ReturnType<typeof RatesService.getColumn>,
  ) {
    return tx
      .select({
        minimum: sql<number>`min(${column})`,
        maximum: sql<number>`max(${column})`,
        average: sql<number>`avg(${column})`,
        updatedAt: sql<string>`max(${exchangeRates.createdAt})`,
      })
      .from(exchangeRates);
  }

  private static fetchTotalCount(tx: Db) {
    return tx
      .select({ count: sql<number>`count(*)` })
      .from(exchangeRates)
      .then(([result]) => result.count);
  }

  private static formatData(
    data: Awaited<ReturnType<typeof RatesService.fetchData>>,
    rate: ReturnType<typeof RatesService.parseQuery>['rate'],
  ) {
    return data.map((row) => ({ ...row, sign: RatesService.getSign(rate) }));
  }

  private static formatMetadata(
    [meta]: Awaited<ReturnType<typeof RatesService.fetchMetadata>>,
    rate: ReturnType<typeof RatesService.parseQuery>['rate'],
  ) {
    return {
      minimum: +meta.minimum,
      maximum: +meta.maximum,
      average: +meta.average,
      sign: RatesService.getSign(rate),
      updatedAt: { gmt: meta.updatedAt },
    };
  }

  private static getSign(
    rate: ReturnType<typeof RatesService.parseQuery>['rate'],
  ) {
    const sign = { aud: 'A$', gbp: '£', usd: '$' }[rate] ?? '$';
    return sign;
  }

  private static calculatePagination(
    ...pagination: [
      page: number,
      perPage: number,
      totalCount: Awaited<ReturnType<typeof RatesService.fetchTotalCount>>,
    ]
  ) {
    const [page, perPage, totalCount] = pagination.map(Number);
    return {
      previous: page > 1 ? page - 1 : undefined,
      next: page * perPage < totalCount ? page + 1 : undefined,
      current: page,
      total: Math.ceil(totalCount / perPage),
    };
  }
}
