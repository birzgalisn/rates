import { IsArray, IsDefined, IsObject } from 'class-validator';

export class Rate {
  @IsArray()
  @IsDefined()
  public data: {
    id: number;
    rate: string;
    sign: string;
    createdAt: string;
  }[];

  @IsObject()
  @IsDefined()
  public metadata: {
    minimum: number;
    maximum: number;
    average: number;
    sign: string;
    updatedAt: {
      gmt: string;
    };
  };

  @IsObject()
  @IsDefined()
  public pagination: {
    previous?: number;
    next?: number;
    current: number;
    total: number;
  };
}
