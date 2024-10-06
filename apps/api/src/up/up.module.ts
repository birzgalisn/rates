import { Module } from '@nestjs/common';

import { UpController } from '~/up/up.controller';
import { UpService } from '~/up/up.service';

@Module({
  imports: [],
  controllers: [UpController],
  providers: [UpService],
})
export class UpModule {}
