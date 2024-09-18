export class RateDto {
  rate?: 'usd' | 'aud' | 'gbp';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
