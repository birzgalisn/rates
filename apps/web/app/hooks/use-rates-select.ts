import { useUpdateSearchParams } from '~/hooks/use-update-search-params';

export function useRatesSelect() {
  const { searchParams, updateSearchParam } = useUpdateSearchParams();

  const handleRateChange = (rate: string) => updateSearchParam('rate', rate);

  const rate = (searchParams.get('rate') ?? 'usd').toUpperCase();

  return { rate, handleRateChange } as const;
}
