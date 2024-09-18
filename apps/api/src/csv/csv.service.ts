import https from 'node:https';

import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';

import { Db } from '@repo/database/types';
import { exchangeRates } from '@repo/database/schema';

import { Csv } from '@repo/api/csv/entities/csv.entity';

import { DRIZZLE } from 'src/constants/db.constants';

@Injectable()
export class CsvService {
  constructor(@Inject(DRIZZLE) private conn: Db) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async getLatestExchangeRates(): Promise<void> {
    const csv = await CsvService.fetchExchangeRates();
    const rates = CsvService.parseExchangeRates(csv);

    await this.conn
      .insert(exchangeRates)
      .values({ audRate: rates.AUD, gbpRate: rates.GBP, usdRate: rates.USD });
  }

  private static fetchExchangeRates(
    url = 'https://www.bank.lv/vk/ecb.csv',
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      https
        .get(url, (stream) => {
          let data = '';
          stream.on('data', (chunk) => (data += chunk));
          stream.on('end', () => resolve(data));
        })
        .on('error', reject);
    });
  }

  private static parseExchangeRates(csv: string): Csv {
    return this.splitExchangeRateLines(csv).reduce((acc, line) => {
      const [currency, rate] = this.parseExchangeRateLine(line);
      if (this.isValidExchangeRate(currency, rate)) {
        acc[currency] = rate;
      }
      return acc;
    }, {} as Csv);
  }

  private static splitExchangeRateLines(csv: string): string[] {
    return csv.trim().split('\n');
  }

  private static parseExchangeRateLine(
    csvLine: string,
  ): [currency: string, rate: string] {
    const [currency, rate] = csvLine.replace('\r', '').split('\t');
    return [currency, rate];
  }

  private static isValidExchangeRate(currency: string, rate: string): boolean {
    return this.isValidCurrency(currency) && this.isValidRate(rate);
  }

  private static isValidCurrency(currency: string): boolean {
    return /^[A-Z]{3}$/.test(currency);
  }

  private static isValidRate(rate: string): boolean {
    const parsedRate = parseFloat(rate);
    return !isNaN(parsedRate) && parsedRate > 0;
  }
}