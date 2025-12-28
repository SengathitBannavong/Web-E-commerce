import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                    currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
                Prev
            </button>

            {pages[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`px-3 py-1 rounded border ${
                            currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        1
                    </button>
                    {pages[0] > 2 && <span className="text-gray-400">...</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded border ${
                        currentPage === page 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                 <>
                    {pages[pages.length - 1] < totalPages - 1 && <span className="text-gray-400">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                         className={`px-3 py-1 rounded border ${
                            currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                    currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
