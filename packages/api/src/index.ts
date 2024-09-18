import { RateDto } from 'rates/dto/rate.dto';
import { Rate } from 'rates/entities/rate.entity';

import { CsvDto } from 'csv/dto/csv.dto';
import { Csv } from 'csv/entities/csv.entity';

export const rates = { dto: { RateDto }, entities: { Rate } };

export const csv = { dto: { CsvDto }, entities: { Csv } };
