import { Inject, Injectable } from '@nestjs/common';
import { exchangeRates } from '@repo/database/schema';
import { Db } from '@repo/database/types';
import { asc, desc, sql } from '@repo/database/db';

import { DRIZZLE } from 'src/constants/db.constants';

import { RateDto } from '@repo/api/rates/dto/rate.dto';
import { Rate } from '@repo/api/rates/entities/rate.entity';

@Injectable()
export class RatesService {
  constructor(@Inject(DRIZZLE) private conn: Db) {}

  public async findAll(query: RateDto): Promise<Rate> {
    const { rate = 'usd', order = 'desc', page = 1, perPage = 10 } = query;

    const offset = RatesService.getOffset(page, perPage);
    const rateColumn = RatesService.getColumn(rate);
    const sortOrder = RatesService.getSortOrder(order);

    return this.conn.transaction(async (tx) => {
      const [data, metadata, totalCount] = await Promise.all([
        RatesService.fetchData(tx, rateColumn, sortOrder, perPage, offset),
        RatesService.fetchMetadata(tx, rateColumn),
        RatesService.fetchTotalCount(tx),
      ]);

      return {
        data,
        metadata: RatesService.formatMetadata(metadata),
        pagination: RatesService.calculatePagination(page, perPage, totalCount),
      };
    });
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

  private static getSortOrder(order: string) {
    const sort = { desc, asc }[order] ?? desc;
    return sort;
  }

  private static fetchData(
    tx: Db,
    rateColumn: ReturnType<typeof RatesService.getColumn>,
    sortOrder: ReturnType<typeof RatesService.getSortOrder>,
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
      .orderBy(sortOrder(rateColumn))
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

  private static formatMetadata([meta]: Awaited<
    ReturnType<typeof RatesService.fetchMetadata>
  >) {
    return {
      minimum: +meta.minimum,
      maximum: +meta.maximum,
      average: +meta.average,
      updatedAt: { gmt: meta.updatedAt },
    };
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
