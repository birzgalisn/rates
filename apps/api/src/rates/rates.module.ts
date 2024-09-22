import { Module } from '@nestjs/common';

import { DrizzleModule } from 'src/drizzle/drizzle.module';

import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';

@Module({
  imports: [DrizzleModule],
  providers: [RatesService],
  controllers: [RatesController],
})
export class RatesModule {}
