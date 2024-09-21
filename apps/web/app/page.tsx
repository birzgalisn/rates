import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '~/app/lib/get-query-client';
import { makeServerRatesOptions } from '~/app/query-options/rates/server';
import { RatesStatistics } from '~/app/components/rates-statistics';
import { RatesTable } from '~/app/components/rates-table';
import { RatesPagination } from '~/app/components/rates-pagination';

import { Title } from '@repo/ui/components/title';

export default function RootPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(makeServerRatesOptions(searchParams));

  return (
    <main className="m-auto h-screen max-w-screen-sm p-4">
      <div className="flex flex-col gap-4 rounded-md border p-4">
        <Title>Exchange rates</Title>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RatesPagination />
          <RatesTable />
          <RatesStatistics />
          <RatesPagination />
        </HydrationBoundary>
      </div>
    </main>
  );
}
