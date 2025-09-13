import { useEffect, useState, useCallback } from 'react';

interface PaginationFooterProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

// Add named export
export function PaginationFooter({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationFooterProps) {
  const [screenHeight, setScreenHeight] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);

  // Calculate optimal items per page based on screen size
  const calculateOptimalItemsPerPage = useCallback(() => {
    const baseHeight = 800; // Baseline height for 10 items
    const itemHeight = 80; // Approximate height per contact item
    const headerHeight = 120; // Header space
    const paginationHeight = 80; // Footer space
    const padding = 100; // Extra padding/margins

    const availableHeight = screenHeight - headerHeight - paginationHeight - padding;
    const maxItemsBasedOnHeight = Math.floor(availableHeight / itemHeight);

    // Screen width considerations for better UX
    let optimalItems;
    if (screenWidth < 768) {
      // Mobile: fewer items for better performance
      optimalItems = Math.min(8, maxItemsBasedOnHeight);
    } else if (screenWidth < 1024) {
      // Tablet: moderate number
      optimalItems = Math.min(12, maxItemsBasedOnHeight);
    } else if (screenWidth < 1440) {
      // Desktop: standard amount
      optimalItems = Math.min(15, maxItemsBasedOnHeight);
    } else if (screenWidth < 1920) {
      // Large desktop: more items
      optimalItems = Math.min(20, maxItemsBasedOnHeight);
    } else {
      // Ultra-wide: maximum utilization
      optimalItems = Math.min(25, maxItemsBasedOnHeight);
    }

    // Ensure minimum of 5 items and maximum reasonable limit
    return Math.max(5, Math.min(optimalItems, 30));
  }, [screenHeight, screenWidth]);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update items per page when screen size changes
  useEffect(() => {
    if (screenHeight > 0 && screenWidth > 0) {
      const newItemsPerPage = calculateOptimalItemsPerPage();
      if (newItemsPerPage !== itemsPerPage && onItemsPerPageChange) {
        onItemsPerPageChange(newItemsPerPage);
      }
    }
  }, [screenHeight, screenWidth, calculateOptimalItemsPerPage, itemsPerPage, onItemsPerPageChange]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = screenWidth < 768 ? 3 : screenWidth < 1024 ? 5 : 7;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="border-t bg-white">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Mobile Layout */}
        {screenWidth < 768 && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {startItem}-{endItem} of {totalItems}
              </span>
              <span className="text-xs text-gray-500">
                {itemsPerPage}/page
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        {screenWidth >= 768 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Showing {startItem} to {endItem} of {totalItems} contacts
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {itemsPerPage} per page
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* First page */}
              {pageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => onPageChange(1)}
                    className="w-8 h-8 text-sm rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    1
                  </button>
                  {pageNumbers[0] > 2 && <span className="text-gray-400">...</span>}
                </>
              )}
              
              {/* Page numbers */}
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* Last page */}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className="text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className="w-8 h-8 text-sm rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              {/* Navigation buttons */}
              <div className="flex items-center gap-1 ml-4 border-l pl-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
