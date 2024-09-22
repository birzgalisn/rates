import { Module } from '@nestjs/common';

import { db } from '@repo/database/db';

import { DRIZZLE } from '~/constants/db.constants';

@Module({
  providers: [
    {
      provide: DRIZZLE,
      async useFactory() {
        return db;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
