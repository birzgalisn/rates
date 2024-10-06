import { Injectable } from '@nestjs/common';

@Injectable()
export class UpService {
  getUp(): string {
    return 'OK';
  }
}
