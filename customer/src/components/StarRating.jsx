import './StarRating.css';

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'medium', 
  interactive = false, 
  onRatingChange = null,
  showLabel = false 
}) => {
  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleStarHover = (value) => {
    if (interactive) {
      // Could add hover state here if needed
    }
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const filled = starValue <= rating;
    const halfFilled = !filled && starValue - 0.5 <= rating;

    return (
      <span
        key={index}
        className={`star ${size} ${interactive ? 'interactive' : ''} ${
          filled ? 'filled' : halfFilled ? 'half-filled' : 'empty'
        }`}
        onClick={() => handleStarClick(starValue)}
        onMouseEnter={() => handleStarHover(starValue)}
        role={interactive ? 'button' : 'img'}
        aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
        tabIndex={interactive ? 0 : -1}
      >
        ★
      </span>
    );
  };

  return (
    <div className="star-rating">
      <div className="stars">
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      </div>
      {showLabel && (
        <span className="rating-label">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;