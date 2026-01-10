import apiFetch from "./api";

// Review services
export const getProductReviews = async (productId, params = {}) => {
  const queryParams = {
    page: params.page || 1,
    limit: params.limit || 10,
    sortBy: params.sortBy || 'created_at',
    sortOrder: params.sortOrder || 'DESC'
  };

  const query = new URLSearchParams(queryParams).toString();
  return apiFetch(`/reviews/product/${productId}?${query}`);
};

export const getReviewStats = async (productId) => {
  return apiFetch(`/reviews/product/${productId}/stats`);
};

export const createReview = async (reviewData) => {
  return apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
};

export const updateReview = async (reviewId, updateData) => {
  return apiFetch(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

export const deleteReview = async (reviewId) => {
  return apiFetch(`/reviews/${reviewId}`, {
    method: 'DELETE'
  });
};

export const markReviewHelpful = async (reviewId) => {
  return apiFetch(`/reviews/${reviewId}/helpful`, {
    method: 'POST'
  });
};