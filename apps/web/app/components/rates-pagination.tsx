'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/components/ui/pagination';

import { useRatesPagination } from '~/hooks/use-rates-pagination';
import { usePaginatorLinks } from '~/hooks/use-paginator-links';

export function RatesPagination() {
  const { paginator, handlePageChange } = useRatesPagination();
  const { previous, next, buildUrl } = usePaginatorLinks({ paginator });

  const handleClick =
    (page?: number) =>
    (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
      e.preventDefault();
      page && handlePageChange(page);
    };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previous}
            onClick={handleClick(paginator.previous)}
            className={PAGINATION_STYLES_MAP[`${!!paginator.previous}`]}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis
            onClick={handleClick(paginator.burstPrevious)}
            className={PAGINATION_STYLES_MAP[`${!!paginator.burstPrevious}`]}
          />
        </PaginationItem>

        {paginator.visible.map((visiblePage) => (
          <PaginationItem key={visiblePage}>
            <PaginationLink
              isActive={visiblePage === paginator.current}
              href={buildUrl(visiblePage)}
              onClick={handleClick(visiblePage)}
              className="select-none hover:cursor-pointer"
            >
              {visiblePage}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis
            onClick={handleClick(paginator.burstNext)}
            className={PAGINATION_STYLES_MAP[`${!!paginator.burstNext}`]}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href={next}
            onClick={handleClick(paginator.next)}
            className={PAGINATION_STYLES_MAP[`${!!paginator.next}`]}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const PAGINATION_STYLES_MAP = Object.freeze({
  true: 'select-none hover:cursor-pointer',
  false: 'select-none hover:cursor-not-allowed',
});
