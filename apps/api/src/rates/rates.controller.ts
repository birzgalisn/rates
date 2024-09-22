import { Controller, Get, Query } from '@nestjs/common';

import { RateDto } from '@repo/api/rates/dto/rate.dto';

import { RatesService } from '~/rates/rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  public findAll(@Query() query: RateDto) {
    return this.ratesService.findAll(query);
  }
}
