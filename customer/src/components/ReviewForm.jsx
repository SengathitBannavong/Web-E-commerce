import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useReview } from '../contexts/ReviewContext';
import './ReviewForm.css';
import StarRating from './StarRating';

const ReviewForm = ({ productId, onSuccess, existingReview = null }) => {
  const { user, isAuthenticated } = useAuth();
  const { createReview, updateReview, loading } = useReview();
  
  const [formData, setFormData] = useState({
    rating: existingReview?.Rating || 0,
    title: existingReview?.Title || '',
    content: existingReview?.Content || ''
  });
  
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rating) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Review content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Review must be at least 10 characters';
    } else if (formData.content.length > 2000) {
      newErrors.content = 'Review must be less than 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Transform form data to match API expectations
      const apiData = {
        Rating: formData.rating,
        Title: formData.title,
        Content: formData.content
      };

      if (existingReview) {
        await updateReview(existingReview.Review_Id, apiData);
      } else {
        await createReview({
          Product_Id: productId,
          ...apiData
        });
      }
      
      // Reset form
      setFormData({
        rating: 0,
        title: '',
        content: ''
      });
      setShowForm(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="review-form-login">
        <p>Please log in to write a review.</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/login'}
        >
          Log In
        </button>
      </div>
    );
  }

  if (!showForm && !existingReview) {
    return (
      <div className="review-form-toggle">
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Write a Review
        </button>
      </div>
    );
  }

  return (
    <div className="review-form">
      <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Rating *</label>
          <div className="rating-input">
            <StarRating
              rating={formData.rating}
              interactive={true}
              onRatingChange={(rating) => handleInputChange('rating', rating)}
              size="large"
            />
            <span className="rating-text">
              {formData.rating > 0 && (
                `${formData.rating} star${formData.rating !== 1 ? 's' : ''}`
              )}
            </span>
          </div>
          {errors.rating && <div className="error-message">{errors.rating}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your experience"
            maxLength={200}
            className={errors.title ? 'error' : ''}
          />
          <div className="character-count">
            {formData.title.length}/200
          </div>
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Review *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Tell others about your experience with this product..."
            rows={6}
            maxLength={2000}
            className={errors.content ? 'error' : ''}
          />
          <div className="character-count">
            {formData.content.length}/2000
          </div>
          {errors.content && <div className="error-message">{errors.content}</div>}
        </div>

        <div className="form-actions">
          {!existingReview && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;