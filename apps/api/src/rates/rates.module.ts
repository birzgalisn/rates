import { Module } from '@nestjs/common';

import { DrizzleModule } from '~/drizzle/drizzle.module';

import { RatesService } from '~/rates/rates.service';
import { RatesController } from '~/rates/rates.controller';
import { RatesRepository } from '~/rates/rates.repository';
import { RatesAdapter } from '~/rates/rates.adapter';
import { RatesUtility } from '~/rates/rates.utility';

@Module({
  imports: [DrizzleModule],
  providers: [RatesService, RatesRepository, RatesAdapter, RatesUtility],
  controllers: [RatesController],
})
export class RatesModule {}
