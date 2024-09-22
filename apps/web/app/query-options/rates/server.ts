import { createRatesOptions } from '~/query-options/rates/create';
import { serverUrlSearchParamsAdapter } from '~/lib/server-url-search-params-adapter';

export function makeServerRatesOptions(
  searchParams: {
    [key: string]: string | string[] | undefined;
  } = {},
  searchParamsAdapter = serverUrlSearchParamsAdapter,
) {
  return createRatesOptions(searchParamsAdapter(searchParams));
}
