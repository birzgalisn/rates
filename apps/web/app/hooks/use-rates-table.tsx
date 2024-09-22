import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { CaretSortIcon } from '@radix-ui/react-icons';

import { Text } from '@repo/ui/components/text';
import { Rate } from '@repo/api/rates/entities/rate.entity';
import { Button } from '@repo/ui/components/ui/button';

import { makeClientRatesOptions } from '~/query-options/rates/client';
import { RatesSelect } from '~/components/rates-select';
import { formatDateTime } from '~/lib/format-date-time';
import { formatRate } from '~/lib/format-rate';

export function useRatesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: rates } = useSuspenseQuery(makeClientRatesOptions());

  const table = useReactTable({
    data: rates.data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return { table, columns } as const;
}

const columns: ColumnDef<Rate['data'][number]>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <Text>{formatDateTime(row.original.createdAt)}</Text>,
  },
  {
    accessorKey: 'rate',
    header: () => (
      <Text className="flex items-center justify-end">
        EUR to
        <RatesSelect />
      </Text>
    ),
    cell: ({ row }) => (
      <Text className="text-right">
        {formatRate(row.original.rate, row.original.sign)}
      </Text>
    ),
  },
];
