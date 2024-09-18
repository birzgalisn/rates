import { Module } from '@nestjs/common';

import { DrizzleModule } from 'src/drizzle/drizzle.module';

import { CsvService } from './csv.service';

@Module({
  imports: [DrizzleModule],
  providers: [CsvService],
})
export class CsvModule {}
