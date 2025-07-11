import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-10 space-x-4">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-semibold disabled:opacity-50 transition"
      >
        Anterior
      </button>
      <span className="px-4 py-2 text-lg">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-semibold disabled:opacity-50 transition"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
