import { createContext, useContext, useState } from 'react';
import * as reviewService from '../services/reviewService';
import { useToast } from './ToastContext';

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPage: 1,
    total: 0
  });
  const toast = useToast();

  // Review functions
  const fetchProductReviews = async (productId, params = {}) => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId, params);
      setReviews(response.data || []);
      setPagination({
        page: params.page || 1,
        totalPage: response.totalPage || 1,
        total: response.total || 0
      });
      return response;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async (productId) => {
    try {
      const response = await reviewService.getReviewStats(productId);
      setReviewStats(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  };

  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      const response = await reviewService.createReview(reviewData);
      
      // Add the new review to the beginning of the list
      setReviews(prev => [response.data, ...prev]);
      
      toast.success('Review submitted successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      const errorMessage = error.message || 'Failed to submit review';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, updateData) => {
    try {
      setLoading(true);
      const response = await reviewService.updateReview(reviewId, updateData);
      
      // Update the review in the list
      setReviews(prev => prev.map(review => 
        review.Review_Id === reviewId ? { ...review, ...response.data } : review
      ));
      
      toast.success('Review updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      
      // Remove the review from the list
      setReviews(prev => prev.filter(review => review.Review_Id !== reviewId));
      
      // Remove associated comments
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[reviewId];
        return newComments;
      });
      
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
      throw error;
    }
  };

  const markReviewHelpful = async (reviewId) => {
    try {
      await reviewService.markReviewHelpful(reviewId);
      
      // Update helpful count in the list
      setReviews(prev => prev.map(review => 
        review.Review_Id === reviewId 
          ? { ...review, Helpful_Count: (review.Helpful_Count || 0) + 1 }
          : review
      ));
      
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error marking review helpful:', error);
      toast.error('Failed to mark review as helpful');
      throw error;
    }
  };


  const value = {
    // State
    reviews,
    reviewStats,
    comments,
    loading,
    pagination,
    
    // Review functions
    fetchProductReviews,
    fetchReviewStats,
    createReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    
    // Utility functions
    clearReviews: () => {
      setReviews([]);
      setReviewStats(null);
      setComments({});
      setPagination({ page: 1, totalPage: 1, total: 0 });
    }
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};