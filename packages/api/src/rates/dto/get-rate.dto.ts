export class GetRateDto {
  rate?: 'usd' | 'aud' | 'gbp';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
