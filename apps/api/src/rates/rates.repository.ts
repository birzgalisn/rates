import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE } from '~/constants/db.constants';
import { RatesUtility } from '~/rates/rates.utility';

import { Db } from '@repo/database/types';
import { sql } from '@repo/database/db';
import { exchangeRates } from '@repo/database/schema';

import { RateDto } from '@repo/api/rates/dto/rate.dto';

@Injectable()
export class RatesRepository {
  constructor(
    @Inject(DRIZZLE) private conn: Db,
    private ratesUtility: RatesUtility,
  ) {}

  public async findRate(query: RateDto) {
    const sqlParams = this.ratesUtility.getSqlParams(query);

    return this.conn.transaction((tx) =>
      Promise.all([
        this.findData(tx, sqlParams),
        this.findMetadata(tx, sqlParams),
        this.findTotalCount(tx),
      ]),
    );
  }

  public async findData(
    tx: Db,
    { sort, column, offset, perPage }: ReturnType<RatesUtility['getSqlParams']>,
  ) {
    return tx
      .select({
        id: exchangeRates.id,
        rate: column,
        createdAt: exchangeRates.createdAt,
      })
      .from(exchangeRates)
      .orderBy(sort(exchangeRates.createdAt))
      .limit(perPage)
      .offset(offset);
  }

  public async findMetadata(
    tx: Db,
    { column }: ReturnType<RatesUtility['getSqlParams']>,
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

  public async findTotalCount(tx: Db) {
    return tx
      .select({ count: sql<number>`count(*)` })
      .from(exchangeRates)
      .then(([result]) => result.count);
  }
}
