import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { RatesModule } from './rates/rates.module';

@Module({
  imports: [RatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
