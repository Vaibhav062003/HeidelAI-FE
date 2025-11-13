import { useEffect, useState, useCallback } from 'react';

interface PaginationFooterProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function PaginationFooter({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationFooterProps) {

  const calculateOptimalItemsPerPage = useCallback(() => {
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  
  const baseHeight = 800;
  const itemHeight = 80;
  const headerHeight = 120;
  const paginationHeight = 80;
  const padding = 100;

  const availableHeight = screenHeight - headerHeight - paginationHeight - padding;
  const maxItemsBasedOnHeight = Math.floor(availableHeight / itemHeight);

  let optimalItems;
  if (screenWidth < 768) {
    // Mobile
    optimalItems = Math.max(10, Math.min(12, maxItemsBasedOnHeight));
  } else if (screenWidth < 1024) {
    // Tablet
    optimalItems = Math.max(10, Math.min(15, maxItemsBasedOnHeight));
  } else if (screenWidth < 1440) {
    // Desktop
    optimalItems = Math.max(10, Math.min(20, maxItemsBasedOnHeight));
  } else if (screenWidth < 1920) {
    // Large desktop
    optimalItems = Math.max(10, Math.min(25, maxItemsBasedOnHeight));
  } else {
    // Ultra-wide
    optimalItems = Math.max(10, Math.min(30, maxItemsBasedOnHeight));
  }

  // Ensure minimum of 10 items 
  return Math.max(10, Math.min(optimalItems, 30));
}, []);

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = calculateOptimalItemsPerPage();
      if (newItemsPerPage !== itemsPerPage && onItemsPerPageChange) {
        onItemsPerPageChange(newItemsPerPage);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateOptimalItemsPerPage, itemsPerPage, onItemsPerPageChange]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 5 : 7;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
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
      <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6">

        {/* Desktop Layout */}
        <div className="hidden md:flex md:justify-between md:items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {startItem} to {endItem} of {totalItems} contacts
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {itemsPerPage} per page
            </span>
          </div>
          
          <div className="flex items-center gap-2">
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
            
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-gray-600 text-white shadow-sm'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            
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
      </div>
    </div>
  );
}
