import { Rate } from 'rates/entities/rate.entity';

import { CsvDto } from 'csv/dto/csv.dto';
import { Csv } from 'csv/entities/csv.entity';

export const rates = {
  dto: {
    GetRateDto,
  },
  entities: {
    Rate,
  },
};

export const csv = { dto: { CsvDto }, entities: { Csv } };
