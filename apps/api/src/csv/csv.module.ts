import { Module } from '@nestjs/common';

import { DrizzleModule } from '~/drizzle/drizzle.module';

import { CsvService } from '~/csv/csv.service';

@Module({
  imports: [DrizzleModule],
  providers: [CsvService],
})
export class CsvModule {}
