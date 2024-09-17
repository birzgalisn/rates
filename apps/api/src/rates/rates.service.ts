import { Inject, Injectable } from '@nestjs/common';
import { exchangeRates } from '@repo/database/schema';
import { Db } from '@repo/database/types';
import { asc, desc, sql } from '@repo/database/db';

import { DRIZZLE } from 'src/constants/db.constants';

import { Rate } from '@repo/api/rates/entities/rate.entity';
import { GetRateDto } from '@repo/api/rates/dto/get-rate.dto';

@Injectable()
export class RatesService {
  constructor(@Inject(DRIZZLE) private conn: Db) {}

  async findAll(query: GetRateDto): Promise<Rate> {
    const { rate = 'usd', order = 'desc', page = 1, perPage = 10 } = query;

    const offset = (page - 1) * perPage;

    const rateColumn =
      { aud: exchangeRates.audRate, gbp: exchangeRates.gbpRate }[rate] ??
      exchangeRates.usdRate;

    const sortOrder = { desc }[order] ?? asc;

    return this.conn.transaction(async (tx) => {
      const [data, [metadata], totalCount] = await Promise.all([
        tx
          .select({
            id: exchangeRates.id,
            rate: rateColumn,
            createdAt: exchangeRates.createdAt,
          })
          .from(exchangeRates)
          .orderBy(sortOrder(rateColumn))
          .limit(perPage)
          .offset(offset),

        tx
          .select({
            minimum: sql<number>`min(${rateColumn})`,
            maximum: sql<number>`max(${rateColumn})`,
            average: sql<number>`avg(${rateColumn})`,
            updatedAt: sql<string>`max(${exchangeRates.createdAt})`,
          })
          .from(exchangeRates),

        tx
          .select({ count: sql<number>`count(*)` })
          .from(exchangeRates)
          .then(([result]) => result.count),
      ]);

      return {
        data,
        metadata: {
          minimum: +metadata.minimum,
          maximum: +metadata.maximum,
          average: +metadata.average,
          updatedAt: {
            gmt: metadata.updatedAt,
          },
        },
        pagination: {
          previous: +page > 1 ? +page - 1 : undefined,
          next: +page * +perPage < +totalCount ? +page + 1 : undefined,
          current: +page,
          total: Math.ceil(+totalCount / +perPage),
        },
      };
    });
  }
}
