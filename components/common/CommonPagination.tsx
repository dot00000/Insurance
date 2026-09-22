import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type CommonPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
};

export function CommonPagination({
  currentPage = 1,
  onPageChange = () => {},
  totalPages = 5,
}: Partial<CommonPaginationProps>) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={currentPage === 1}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={(event) => {
                event.preventDefault();
                onPageChange(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={currentPage === totalPages}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
