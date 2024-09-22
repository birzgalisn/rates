import { IsInt, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class RateDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'usd')
  public rate?: 'usd' | 'aud' | 'gbp';

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'desc')
  public sort?: 'asc' | 'desc';

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value || 1)
  public page?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value || 10)
  public perPage?: number;

  @Expose()
  get cacheKey() {
    return `rate_${this.rate}_${this.sort}_${this.page}_${this.perPage}`;
  }
}
