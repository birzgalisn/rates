import { queryOptions } from '@tanstack/react-query';

import { Rate } from '@repo/api/rates/entities/rate.entity';

export function createRatesOptions(searchParams: URLSearchParams) {
  const rate = searchParams.get('rate') ?? 'usd';
  const order = searchParams.get('order') ?? 'desc';
  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('perPage') ?? '10';

  const url =
    `${process.env.NEXT_PUBLIC_API_HOST}/rates` +
    `?rate=${rate}` +
    `&order=${order}` +
    `&page=${page}` +
    `&perPage=${perPage}`;

  return queryOptions<Rate>({
    queryKey: ['rates', rate, order, page, perPage],
    queryFn: async () => {
      const res = await fetch(url);
      return res.json();
    },
  });
}
