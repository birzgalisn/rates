import { createRatesOptions } from '~/app/query-options/rates/create';
import { serverUrlSearchParamsAdapter } from '~/app/lib/server-url-search-params-adapter';

export function makeServerRatesOptions(
  searchParams: {
    [key: string]: string | string[] | undefined;
  } = {},
  searchParamsAdapter = serverUrlSearchParamsAdapter,
) {
  return createRatesOptions(searchParamsAdapter(searchParams));
}
