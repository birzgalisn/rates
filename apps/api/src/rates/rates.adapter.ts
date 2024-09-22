import { Injectable } from '@nestjs/common';

import { RatesRepository } from '~/rates/rates.repository';
import { RatesUtility } from '~/rates/rates.utility';

import { Rate } from '@repo/api/rates/entities/rate.entity';
import { RateDto } from '@repo/api/rates/dto/rate.dto';

@Injectable()
export class RatesAdapter {
  constructor(private ratesUtility: RatesUtility) {}

  public adaptRate(
    [data, metadata, totalCount]: Awaited<
      ReturnType<RatesRepository['findRate']>
    >,
    query: RateDto,
  ): Rate {
    return {
      data: this.adaptData(data, query),
      metadata: this.adaptMetadata(metadata, query),
      pagination: this.adaptPagination(totalCount, query),
    } as const;
  }

  private adaptData(
    data: Awaited<ReturnType<RatesRepository['findData']>>,
    { rate }: RateDto,
  ) {
    const sign = this.ratesUtility.getSign({ rate });

    return data.map((entry) => ({ ...entry, sign }));
  }

  private adaptMetadata(
    [{ minimum, maximum, average, updatedAt }]: Awaited<
      ReturnType<RatesRepository['findMetadata']>
    >,
    query: RateDto,
  ) {
    const sign = this.ratesUtility.getSign(query);

    return {
      minimum: +minimum,
      maximum: +maximum,
      average: +average,
      updatedAt: { gmt: updatedAt },
      sign,
    } as const;
  }

  private adaptPagination(
    totalCount: Awaited<ReturnType<RatesRepository['findTotalCount']>>,
    { page, perPage }: RateDto,
  ) {
    return this.ratesUtility.getPagination(page, perPage, totalCount);
  }
}
