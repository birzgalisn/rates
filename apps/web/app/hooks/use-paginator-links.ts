import { usePathname, useSearchParams } from 'next/navigation';

import { Rate } from '@repo/api/rates/entities/rate.entity';

export function usePaginatorLinks({
  paginator,
}: {
  paginator: ReturnType<typeof constructPaginator>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = (page = paginator.current) => {
    const params = new URLSearchParams(searchParams);
    params[page ? 'set' : 'delete']('page', `${page}`);

    return `${pathname}?${params}`;
  };

  return {
    previous: paginator.previous ? buildUrl(paginator.previous) : pathname,
    next: paginator.next ? buildUrl(paginator.next) : pathname,
    buildUrl,
  } as const;
}

export function constructPaginator(
  pagination: Rate['pagination'],
  burstSize = 5,
  visibleRange = 2,
) {
  const { previous, next, current, total } = pagination;

  const burstNext = Math.min(burstSize, total - current);
  const burstPrevious = Math.min(burstSize, current - 1);

  const visibleStart = Math.max(1, current - visibleRange);
  const visibleEnd = Math.min(total, current + visibleRange);

  const visible = Array.from(
    { length: visibleEnd - visibleStart + 1 },
    (_, i) => i + visibleStart,
  );

  return {
    previous,
    next,
    current,
    visible,
    burstNext: burstNext ? current + burstNext : undefined,
    burstPrevious: burstPrevious ? current - burstPrevious : undefined,
  } as const;
}
