export class Rate {
  data: {
    id: number;
    rate: string;
    createdAt: string;
  }[];
  metadata: {
    minimum: number;
    maximum: number;
    average: number;
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
