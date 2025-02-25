export class RateDto {
  rate?: 'usd' | 'aud' | 'gbp';
  sort?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
