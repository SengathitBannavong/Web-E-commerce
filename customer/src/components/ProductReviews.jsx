import { useEffect } from 'react';
import { ReviewProvider, useReview } from '../contexts/ReviewContext';
import './ProductReviews.css';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewStats from './ReviewStats';

const ProductReviewsContent = ({ productId }) => {
  const { reviewStats, fetchReviewStats, clearReviews } = useReview();

  useEffect(() => {
    if (productId) {
      fetchReviewStats(productId);
    }
    
    return () => clearReviews();
  }, [productId]);

  const handleReviewSubmitted = () => {
    // Refresh stats when a new review is submitted
    if (productId) {
      fetchReviewStats(productId);
    }
  };

  return (
    <div className="product-reviews">
      <div className="product-reviews-container">
        {/* Review Statistics */}
        <div className="review-stats-section">
          <ReviewStats stats={reviewStats} />
        </div>

        {/* Review Form */}
        <div className="review-form-section">
          <ReviewForm 
            productId={productId} 
            onSuccess={handleReviewSubmitted}
          />
        </div>

        {/* Review List */}
        <div className="review-list-section">
          <ReviewList productId={productId} />
        </div>
      </div>
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  if (!productId) {
    return (
      <div className="product-reviews">
        <div className="product-reviews-error">
          <p>Product ID is required to load reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <ReviewProvider>
      <ProductReviewsContent productId={productId} />
    </ReviewProvider>
  );
};

export default ProductReviews;