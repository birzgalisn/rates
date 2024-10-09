import { usePathname, useSearchParams } from 'next/navigation';

import { Rate } from '@repo/api/rates/entities/rate.entity';

export function usePaginationLinkBuilder({
  paginator,
}: {
  paginator: ReturnType<typeof constructPaginator>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const linkBuilder = (page = paginator.current) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', `${page}`);

    return `${pathname}?${params}`;
  };

  return linkBuilder;
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
