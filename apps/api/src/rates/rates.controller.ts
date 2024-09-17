import { Controller, Get, Query } from '@nestjs/common';

import { GetRateDto } from '@repo/api/rates/dto/get-rate.dto';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  findAll(@Query() query: GetRateDto) {
    return this.ratesService.findAll(query);
  }
}
