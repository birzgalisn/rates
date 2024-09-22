import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvValidator {
  public isValidExchangeRate(currency: string, rate: string) {
    return this.isValidCurrency(currency) && this.isValidRate(rate);
  }

  public isValidCurrency(currency: string) {
    return /^[A-Z]{3}$/.test(currency);
  }

  public isValidRate(rate: string) {
    const parsedRate = parseFloat(rate);
    return !isNaN(parsedRate) && parsedRate > 0;
  }
}
