import './Pagination.css';

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
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
            >
                Previous
            </button>

            {pages[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                    >
                        1
                    </button>
                    {pages[0] > 2 && <span className="pagination-ellipsis">...</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                >
                    {page}
                </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                 <>
                    {pages[pages.length - 1] < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
