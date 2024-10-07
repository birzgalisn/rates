import { queryOptions } from '@tanstack/react-query';

import { Rate } from '@repo/api/rates/entities/rate.entity';

export function createRatesOptions(searchParams: URLSearchParams) {
  const rate = searchParams.get('rate') ?? 'usd';
  const sort = searchParams.get('sort') ?? 'desc';
  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('perPage') ?? '10';

  const url =
    `${process.env.NEXT_PUBLIC_API_HOST}/rates` +
    `?rate=${rate}` +
    `&sort=${sort}` +
    `&page=${page}` +
    `&perPage=${perPage}`;

  return queryOptions<Rate>({
    queryKey: ['rates', rate, sort, page, perPage],
    queryFn: async () => {
      const res = await fetch(url, { next: { revalidate: 600 } });
      return res.json();
    },
  });
}
