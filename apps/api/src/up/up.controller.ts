import { Controller, Get } from '@nestjs/common';

import { UpService } from '~/up/up.service';

@Controller('up')
export class UpController {
  constructor(private readonly upService: UpService) {}

  @Get()
  getUp(): string {
    return this.upService.getUp();
  }
}
