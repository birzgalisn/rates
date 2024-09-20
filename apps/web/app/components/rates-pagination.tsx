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

import { useRatesPagination } from '~/app/hooks/use-rates-pagination';

export function RatesPagination() {
  const { paginator, handlePageChange } = useRatesPagination();

  const getPaginationClassName = (page?: number) =>
    PAGINATION_STYLES_MAP[`${!!page}`];

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={getPaginationClassName(paginator.previous)}
            onClick={() =>
              paginator.previous && handlePageChange(paginator.previous)
            }
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis
            className={getPaginationClassName(paginator.burstPrevious)}
            onClick={() =>
              paginator.burstPrevious &&
              handlePageChange(paginator.burstPrevious)
            }
          />
        </PaginationItem>

        {paginator.visible.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === paginator.current}
              className="select-none hover:cursor-pointer"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis
            className={getPaginationClassName(paginator.burstNext)}
            onClick={() =>
              !!paginator.burstNext && handlePageChange(paginator.burstNext)
            }
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={getPaginationClassName(paginator.next)}
            onClick={() => paginator.next && handlePageChange(paginator.next)}
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
