import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useReview } from '../contexts/ReviewContext';
import './ReviewItem.css';
import StarRating from './StarRating';

const ReviewItem = ({ review }) => {
  const { user, isAuthenticated } = useAuth();
  const { deleteReview, markReviewHelpful } = useReview();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwnReview = isAuthenticated && user?.User_Id === review.User_Id;
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(review.Review_Id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleMarkHelpful = async () => {
    try {
      await markReviewHelpful(review.Review_Id);
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-details">
            <span className="reviewer-name">{review.user?.Name || 'Anonymous'}</span>
            <span className="review-date">{formatDate(review.created_at)}</span>
          </div>
          <StarRating rating={review.Rating} size="small" />
        </div>
        
        {isOwnReview && (
          <div className="review-actions">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="review-content">
        <h4 className="review-title">{review.Title}</h4>
        <p className="review-text">{review.Content}</p>
      </div>

      <div className="review-footer">
        <div className="review-interactions">
          <button
            className="helpful-btn"
            onClick={handleMarkHelpful}
            disabled={!isAuthenticated || isOwnReview}
          >
            👍 Helpful ({review.Helpful_Count || 0})
          </button>
          
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)} />
          <div className="modal-content">
            <h3>Delete Review</h3>
            <p>Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;