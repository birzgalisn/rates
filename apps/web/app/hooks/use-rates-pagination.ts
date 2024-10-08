import { useMemo } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { makeClientRatesOptions } from '~/query-options/rates/client';
import { useUpdateSearchParams } from '~/hooks/use-update-search-params';
import { constructPaginator } from '~/hooks/use-paginator-links';

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
