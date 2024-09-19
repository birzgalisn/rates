export class Rate {
  data: {
    id: number;
    rate: string;
    sign: string;
    createdAt: string;
  }[];
  metadata: {
    minimum: number;
    maximum: number;
    average: number;
    sign: string;
    updatedAt: {
      gmt: string;
    };
  };
  pagination: {
    previous?: number;
    next?: number;
    current: number;
    total: number;
  };
}
