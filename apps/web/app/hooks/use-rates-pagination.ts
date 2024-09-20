import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { makeClientRatesOptions } from '~/app/query-options/rates/client';
import { useUpdateSearchParams } from '~/app/hooks/use-update-search-params';

import { Rate } from '@repo/api/rates/entities/rate.entity';

export function useRatesPagination() {
  const { updateSearchParam } = useUpdateSearchParams();

  const { data: rates } = useSuspenseQuery(makeClientRatesOptions());

  const handlePageChange = (page: number) => updateSearchParam('page', page);

  const paginator = useMemo(
    () => constructPaginator(rates.pagination),
    [rates.pagination.current],
  );

  return { paginator, handlePageChange } as const;
}

function constructPaginator(
  pagination: Rate['pagination'],
  burstSize = 5,
  visibleRange = 2,
) {
  const { previous, next, current, total } = pagination;

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

  return {
    previous,
    next,
    current,
    visible,
    burstNext: burstNext ? current + burstNext : undefined,
    burstPrevious: burstPrevious ? current - burstPrevious : undefined,
  } as const;
}
