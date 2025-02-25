import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';

import { makeClientRatesOptions } from '~/app/query-options/rates/client';

import { Rate } from '@repo/api/rates/entities/rate.entity';

export function useRatesPagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: rates } = useSuspenseQuery(makeClientRatesOptions());

  const handlePageChange = (page: number) => {
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('page', `${page}`);
    router.push(`${pathname}?${urlParams}`);
  };

  const paginator = useMemo(
    () => constructPaginator(rates.pagination),
    [rates.pagination.current],
  );

  return { paginator, handlePageChange } as const;
}

function constructPaginator(pagination: Rate['pagination']) {
  const { previous, next, current, total } = pagination;
  const burstSize = 5;
  const visibleRange = 2;

  const burstNext = Math.min(burstSize, total - current);
  const burstPrevious = Math.min(burstSize, current - 1);

  const visibleStart = Math.max(1, current - visibleRange);
  const visibleEnd = Math.min(total, current + visibleRange);

  const visible: number[] = [];
  for (let i = visibleStart; i <= visibleEnd; i++) {
    if (!visible.includes(i)) {
      visible.push(i);
    }
  }

  return { previous, next, current, burstNext, burstPrevious, visible };
}
