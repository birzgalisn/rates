import { Module } from '@nestjs/common';

import { DrizzleModule } from '~/drizzle/drizzle.module';

import { RatesService } from '~/rates/rates.service';
import { RatesController } from '~/rates/rates.controller';

@Module({
  imports: [DrizzleModule],
  providers: [RatesService],
  controllers: [RatesController],
})
export class RatesModule {}
