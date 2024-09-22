import https from 'node:https';

import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvRepository {
  public findExchangeRates(
    url = `https://www.bank.lv/vk/ecb.csv` + this.getSearchParams(),
  ) {
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

  private getSearchParams(now = new Date()) {
    const y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(now);
    const m = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(now);
    const d = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(now);

    return `?date=${y}${m}${d}`;
  }
}
