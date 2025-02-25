import { Injectable } from '@nestjs/common';

import { CsvValidator } from '~/csv/csv.validator';

import { Csv } from '@repo/api/csv/entities/csv.entity';

@Injectable()
export class CsvParser {
  constructor(private csvValidator: CsvValidator) {}

  public parseExchangeRates(csv: string) {
    return this.splitExchangeRateLines(csv).reduce((acc, line) => {
      const [currency, rate] = this.parseExchangeRateLine(line);

      if (this.csvValidator.isValidExchangeRate(currency, rate)) {
        acc[currency] = rate;
      }

      return acc;
    }, {} as Csv);
  }

  private splitExchangeRateLines(csv: string) {
    return csv.trim().split('\n');
  }

  private parseExchangeRateLine(line: string) {
    return line.replace('\r', '').split('\t');
  }
}
