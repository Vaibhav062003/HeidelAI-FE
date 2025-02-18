interface PaginationFooterProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  }
  
  // Add named export
  export function PaginationFooter({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
  }: PaginationFooterProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    return (
      <div className="border-t p-4 flex justify-between items-center">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  }