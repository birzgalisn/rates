'use client';

import { Text } from '@repo/ui/components/text';

import { useRatesStatistics } from '~/app/hooks/use-rates-statistics';

export function RatesStatistics() {
  const { minimum, maximum, average, createdAt } = useRatesStatistics();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4 w-full">
        <Text>Minimum: {minimum}</Text>
        <Text>Maximum: {maximum}</Text>
        <Text>Average: {average}</Text>
      </div>
      <div>
        <Text suppressHydrationWarning>Last updated at: {createdAt}</Text>
      </div>
    </div>
  );
}
