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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="hover:cursor-pointer"
            onClick={() =>
              paginator.previous && handlePageChange(paginator.previous)
            }
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis
            className="hover:cursor-pointer"
            onClick={() =>
              paginator.burstPrevious &&
              handlePageChange(paginator.current - paginator.burstPrevious)
            }
          />
        </PaginationItem>

        {paginator.visible.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === paginator.current}
              className="hover:cursor-pointer"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis
            className="hover:cursor-pointer"
            onClick={() =>
              !!paginator.burstNext &&
              handlePageChange(paginator.current + paginator.burstNext)
            }
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className="hover:cursor-pointer"
            onClick={() => paginator.next && handlePageChange(paginator.next)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
