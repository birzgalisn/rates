import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useUpdateSearchParams(searchParams = useSearchParams()) {
  const router = useRouter();
  const pathname = usePathname();

  const updateSearchParam = (
    key: string,
    value: number | string | string[] | undefined = '',
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(key, `${value}`);

    router.push(`${pathname}?${newSearchParams}`);
  };

  return { searchParams, updateSearchParam } as const;
}
