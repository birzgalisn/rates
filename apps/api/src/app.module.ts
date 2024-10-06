import { redisStore } from 'cache-manager-redis-yet';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { AppService } from '~/app.service';
import { AppController } from '~/app.controller';

import { UpModule } from '~/up/up.module';
import { RatesModule } from '~/rates/rates.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.CACHE_URL,
    }),
    UpModule,
    RatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
