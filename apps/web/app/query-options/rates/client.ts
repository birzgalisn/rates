import { useSearchParams } from 'next/navigation';

import { createRatesOptions } from '~/query-options/rates/create';

export function makeClientRatesOptions(searchParams = useSearchParams()) {
  return createRatesOptions(searchParams);
}
