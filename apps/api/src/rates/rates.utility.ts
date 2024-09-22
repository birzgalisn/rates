import { Injectable } from '@nestjs/common';

import { asc, desc } from '@repo/database/db';
import { exchangeRates } from '@repo/database/schema';

import { RateDto } from '@repo/api/rates/dto/rate.dto';

@Injectable()
export class RatesUtility {
  public getSqlParams({ rate, sort, page, perPage }: RateDto): {
    offset: ReturnType<typeof RatesUtility.getOffset>;
    column: ReturnType<typeof RatesUtility.getColumn>;
    sort: ReturnType<typeof RatesUtility.getSort>;
    perPage: RateDto['perPage'];
  } {
    return {
      offset: RatesUtility.getOffset({ page, perPage }),
      column: RatesUtility.getColumn({ rate }),
      sort: RatesUtility.getSort({ sort }),
      perPage,
    };
  }

  private static getOffset({
    page,
    perPage,
  }: Pick<RateDto, 'page' | 'perPage'>) {
    return (page - 1) * perPage;
  }

  private static getColumn({ rate }: Pick<RateDto, 'rate'>) {
    return (
      {
        aud: exchangeRates.audRate,
        gbp: exchangeRates.gbpRate,
        usd: exchangeRates.usdRate,
      }[rate] ?? exchangeRates.usdRate
    );
  }

  private static getSort({ sort }: Pick<RateDto, 'sort'>) {
    return { desc, asc }[sort] ?? desc;
  }

  public getSign({ rate }: Pick<RateDto, 'rate'>) {
    return { aud: 'A$', gbp: '£', usd: '$' }[rate] ?? '$';
  }

  public getPagination(
    ...pagination: [page: number, perPage: number, totalCount: number]
  ) {
    const [page, perPage, totalCount] = pagination.map(Number);

    return {
      previous: page > 1 ? page - 1 : undefined,
      next: page * perPage < totalCount ? page + 1 : undefined,
      current: page,
      total: Math.ceil(totalCount / perPage),
    } as const;
  }
}
