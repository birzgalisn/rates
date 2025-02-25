import { useSuspenseQuery } from '@tanstack/react-query';

import { makeClientRatesOptions } from '~/app/query-options/rates/client';

export function useRatesStatistics() {
  const { data: rates } = useSuspenseQuery(makeClientRatesOptions());
  const { metadata } = rates;

  const formatSummary = (summary: number) =>
    `${metadata.sign}${summary.toFixed(4)}`;

  const createdAt = new Date(
    metadata.updatedAt.gmt.replace(' ', 'T') + 'Z',
  ).toLocaleString();

  return {
    minimum: formatSummary(metadata.minimum),
    maximum: formatSummary(metadata.maximum),
    average: formatSummary(metadata.average),
    createdAt,
  } as const;
}
