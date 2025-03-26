import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxPagesToShow = 5;

  if (totalPages <= 1) return null;

  const getPaginationRange = () => {
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [];
    const leftBound = Math.max(2, currentPage - 1);
    const rightBound = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (leftBound > 2) {
      pages.push("...");
    }

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    if (rightBound < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    onPageChange(newPage);
  };

  return (
    <nav className="pagination m-12" aria-label="Pagination">
      <div className="flex justify-center mt-6">
        <button
          type="button"
          className={`px-4 py-2  cursor-pointer ${
            currentPage === 1
              ? "hidden"
              : "bg-[var(--color-white)] text-[var(--color-text-primary)] border border-gray-200 hover:bg-gray-200"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Page précédente"
        >
          ◀ Précédent
        </button>

        {getPaginationRange().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-6 py-3 flex items-center bg-[var(--color-white)] border border-gray-200"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`px-6 py-3 cursor-pointer ${
                currentPage === page
                  ? "bg-[var(--color-primary)] text-[var(--color-white)] font-bold"
                  : "bg-[var(--color-white)] border border-gray-200 hover:bg-gray-200 text-[var(--color-text-primary)]"
              }`}
              onClick={() => handlePageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          className={`px-4 py-2 cursor-pointer ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed bg-gray-200"
              : "bg-[var(--color-white)] text-[var(--color-text-primary)] border border-gray-200 hover:bg-gray-200"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="Page suivante"
        >
          Suivant ▶
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
