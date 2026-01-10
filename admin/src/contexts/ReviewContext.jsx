import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const AdminReviewContext = createContext();

export const useAdminReview = () => {
  const context = useContext(AdminReviewContext);
  if (!context) {
    throw new Error('useAdminReview must be used within an AdminReviewProvider');
  }
  return context;
};

export const AdminReviewProvider = ({ children, API, token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPage: 1, total: 0 });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1
  });

  // Fetch reviews with filters and pagination
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page,
        limit: 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`${API}admin/reviews?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data.data || []);
      setPagination({
        page: filters.page,
        totalPage: data.totalPage || 1,
        total: data.total || 0
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Update review status (approve/reject)
  const updateReviewStatus = async (reviewId, status) => {
    try {
      const response = await fetch(`${API}admin/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update review status');

      toast.success(`Review ${status} successfully`);
      await fetchReviews(); // Refresh the list
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  };

  // Delete review
  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${API}admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete review');

      toast.success('Review deleted successfully');
      await fetchReviews(); // Refresh the list
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: field !== 'page' ? 1 : value // Reset to first page when filtering, except for page changes
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({ status: '', search: '', page: 1 });
  };

  // Utility functions
  const getReviewStats = () => {
    return {
      total: pagination.total,
      approved: reviews.filter(r => r.Status === 'approved').length,
      pending: reviews.filter(r => r.Status === 'pending').length,
      rejected: reviews.filter(r => r.Status === 'rejected').length
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-yellow-400 ${index < rating ? 'fill-current' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const value = {
    // State
    reviews,
    loading,
    pagination,
    filters,
    
    // Actions
    fetchReviews,
    updateReviewStatus,
    deleteReview,
    handleFilterChange,
    resetFilters,
    
    // Utilities
    getReviewStats,
    formatDate,
    renderStars,
    getStatusBadgeClass
  };

  return (
    <AdminReviewContext.Provider value={value}>
      {children}
    </AdminReviewContext.Provider>
  );
};