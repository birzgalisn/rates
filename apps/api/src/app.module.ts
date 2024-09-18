import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { RatesModule } from './rates/rates.module';
import { CsvModule } from './csv/csv.module';

@Module({
  imports: [ScheduleModule.forRoot(), RatesModule, CsvModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
