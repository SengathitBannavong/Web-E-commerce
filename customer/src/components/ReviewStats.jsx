import './ReviewStats.css';
import StarRating from './StarRating';

const ReviewStats = ({ stats }) => {
  if (!stats) return null;

  const { 
    averageRating = 0, 
    totalReviews = 0,
    fiveStars = 0,
    fourStars = 0,
    threeStars = 0,
    twoStars = 0,
    oneStar = 0
  } = stats;

  const ratingData = [
    { stars: 5, count: parseInt(fiveStars) },
    { stars: 4, count: parseInt(fourStars) },
    { stars: 3, count: parseInt(threeStars) },
    { stars: 2, count: parseInt(twoStars) },
    { stars: 1, count: parseInt(oneStar) }
  ];

  const getPercentage = (count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  if (totalReviews === 0) {
    return (
      <div className="review-stats no-reviews">
        <div className="stats-header">
          <div className="overall-rating">
            <span className="rating-number">0.0</span>
            <StarRating rating={0} size="large" />
            <span className="review-count">No reviews yet</span>
          </div>
        </div>
        <p className="no-reviews-text">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="review-stats">
      <h3>Customer Reviews</h3>
      
      <div className="stats-overview">
        <div className="overall-rating">
          <span className="rating-number">{parseFloat(averageRating).toFixed(1)}</span>
          <StarRating rating={parseFloat(averageRating)} size="large" />
          <span className="review-count">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="rating-breakdown">
          {ratingData.map(({ stars, count }) => (
            <div key={stars} className="rating-bar-row">
              <span className="star-label">{stars} star{stars !== 1 ? 's' : ''}</span>
              <div className="rating-bar">
                <div 
                  className="rating-bar-fill" 
                  style={{ width: `${getPercentage(count)}%` }}
                />
              </div>
              <span className="rating-count">{count}</span>
              <span className="rating-percentage">
                ({getPercentage(count).toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;