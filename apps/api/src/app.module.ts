import { redisStore } from 'cache-manager-redis-yet';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { RatesModule } from './rates/rates.module';
import { CsvModule } from './csv/csv.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.CACHE_URL,
    }),
    RatesModule,
    CsvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
