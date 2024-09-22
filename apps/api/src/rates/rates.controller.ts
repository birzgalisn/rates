import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { RateDto } from '@repo/api/rates/dto/rate.dto';

import { RatesService } from '~/rates/rates.service';

@Controller('rates')
@UsePipes(new ValidationPipe({ transform: true }))
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  public findAll(@Query() query: RateDto) {
    return this.ratesService.findAll(query);
  }
}
