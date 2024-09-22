import { useSuspenseQuery } from '@tanstack/react-query';

import { makeClientRatesOptions } from '~/query-options/rates/client';
import { formatDateTime } from '~/lib/format-date-time';
import { formatRate } from '~/lib/format-rate';

export function useRatesStatistics() {
  const { data: rates } = useSuspenseQuery(makeClientRatesOptions());
  const { metadata } = rates;

  return {
    minimum: formatRate(metadata.minimum, metadata.sign),
    maximum: formatRate(metadata.maximum, metadata.sign),
    average: formatRate(metadata.average, metadata.sign),
    updatedAt: formatDateTime(metadata.updatedAt.gmt),
  } as const;
}
