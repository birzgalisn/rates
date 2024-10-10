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
import { usePaginationLinkBuilder } from '~/hooks/use-pagination-link-builder';

export function RatesPagination() {
  const { paginator, handlePageChange } = useRatesPagination();
  const linkBuilder = usePaginationLinkBuilder({ paginator });

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
            href={linkBuilder(paginator.previous)}
            onClick={handleClick(paginator.previous)}
            className={PAGINATION_STYLES_MAP[`${!!paginator.previous}`]}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href={linkBuilder(paginator.burstPrevious)}
            onClick={handleClick(paginator.burstPrevious)}
            className={PAGINATION_STYLES_MAP[`${!!paginator.burstPrevious}`]}
          >
            <PaginationEllipsis />
          </PaginationLink>
        </PaginationItem>

        {paginator.visible.map((visiblePage) => (
          <PaginationItem key={visiblePage}>
            <PaginationLink
              isActive={visiblePage === paginator.current}
              href={linkBuilder(visiblePage)}
              onClick={handleClick(visiblePage)}
              className="select-none hover:cursor-pointer"
            >
              {visiblePage}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            href={linkBuilder(paginator.burstNext)}
            onClick={handleClick(paginator.burstNext)}
            className={PAGINATION_STYLES_MAP[`${!!paginator.burstNext}`]}
          >
            <PaginationEllipsis />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href={linkBuilder(paginator.next)}
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
