import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded font-semibold border transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
