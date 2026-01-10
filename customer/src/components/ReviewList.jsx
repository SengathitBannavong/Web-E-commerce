import { useEffect, useState } from 'react';
import { useReview } from '../contexts/ReviewContext';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import ReviewItem from './ReviewItem';
import './ReviewList.css';

const ReviewList = ({ productId }) => {
  const { 
    reviews, 
    loading, 
    pagination,
    fetchProductReviews,
    clearReviews 
  } = useReview();
  
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (productId) {
      loadReviews(1);
    }
    
    // Cleanup when component unmounts or productId changes
    return () => clearReviews();
  }, [productId, sortBy, sortOrder]);

  const loadReviews = async (page = currentPage) => {
    try {
      await fetchProductReviews(productId, {
        page,
        limit: 10,
        sortBy,
        sortOrder
      });
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSortChange = (newSortBy, newSortOrder = null) => {
    setSortBy(newSortBy);
    if (newSortOrder) {
      setSortOrder(newSortOrder);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    loadReviews(page);
  };

  const getSortButtonClass = (field, order = null) => {
    let className = 'sort-btn';
    if (sortBy === field) {
      className += ' active';
      if (order && sortOrder === order) {
        className += ' current';
      }
    }
    return className;
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="review-list">
        <div className="review-list-header">
          <h3>Customer Reviews</h3>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="review-list-header">
        <h3>Customer Reviews ({pagination.total})</h3>
        
        {reviews.length > 0 && (
          <div className="review-sort-controls">
            <span className="sort-label">Sort by:</span>
            <div className="sort-buttons">
              <button
                className={getSortButtonClass('created_at')}
                onClick={() => handleSortChange('created_at', sortOrder === 'DESC' ? 'ASC' : 'DESC')}
              >
                Date {sortBy === 'created_at' && (sortOrder === 'DESC' ? '↓' : '↑')}
              </button>
              <button
                className={getSortButtonClass('Rating')}
                onClick={() => handleSortChange('Rating', sortOrder === 'DESC' ? 'ASC' : 'DESC')}
              >
                Rating {sortBy === 'Rating' && (sortOrder === 'DESC' ? '↓' : '↑')}
              </button>
              <button
                className={getSortButtonClass('Helpful_Count')}
                onClick={() => handleSortChange('Helpful_Count', sortOrder === 'DESC' ? 'ASC' : 'DESC')}
              >
                Helpful {sortBy === 'Helpful_Count' && (sortOrder === 'DESC' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="review-list-content">
        {reviews.length > 0 ? (
          <>
            <div className="reviews-container">
              {reviews.map((review) => (
                <ReviewItem key={review.Review_Id} review={review} />
              ))}
            </div>
            
            {pagination.totalPage > 1 && (
              <div className="review-pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-content">
              <h4>No reviews yet</h4>
              <p>Be the first to share your experience with this product!</p>
            </div>
          </div>
        )}
      </div>

      {loading && reviews.length > 0 && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default ReviewList;