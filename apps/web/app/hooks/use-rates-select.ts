import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useRatesSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rate = (searchParams.get('rate') ?? 'USD').toUpperCase();

  const handleRateChange = (rate: string) => {
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('rate', rate);
    router.push(`${pathname}?${urlParams}`);
  };

  return { rate, handleRateChange } as const;
}
