import { Module } from '@nestjs/common';

import { DrizzleModule } from '~/drizzle/drizzle.module';

import { CsvService } from '~/csv/csv.service';
import { CsvRepository } from '~/csv/csv.repository';
import { CsvValidator } from '~/csv/csv.validator';
import { CsvParser } from '~/csv/csv.parser';

@Module({
  imports: [DrizzleModule],
  providers: [CsvService, CsvRepository, CsvValidator, CsvParser],
})
export class CsvModule {}
