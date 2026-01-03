import { useState } from "react";
import { FaEye, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import "./BookCard.css";

export default function BookCard({
  id,
  cover,
  title,
  author,
  price,
  badge,
  rating = 0,
  reviewCount = 0,
}) {
  const { addToCart } = useCart();
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;
    setIsAdding(true);

    const itemToAdd = {
      id,
      name: title,
      price,
      cover,
      quantity: 1,
    };
    
    try {
      const success = await addToCart(itemToAdd);
      if (success) {
        toast.success(`Added "${title}" to cart`);
      } else {
        toast.error(`Failed to add "${title}" to cart`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="book-card">
      <div className="book-card-inner">
        <div className="book-card-cover">
          <Link to={`/books/${id}`} aria-label={`View details for ${title}`}>
            <div className={`book-card-image-wrapper ${imageLoaded ? 'loaded' : ''} ${imageError ? 'error' : ''}`}>
              {!imageLoaded && !imageError && (
                <div className="book-card-image-skeleton">
                  <div className="skeleton-shimmer"></div>
                  <div className="skeleton-book-icon">📚</div>
                </div>
              )}
              
              <img 
                src={imageError ? '/images/books/placeholder.jpg' : cover} 
                alt={title} 
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
                className={imageLoaded ? 'visible' : 'hidden'}
              />
              
              {imageLoaded && !imageError && (
                <div className="book-card-overlay">
                  <div className="book-card-quick-view">
                    <FaEye />
                    <span>Quick View</span>
                  </div>
                </div>
              )}
            </div>
          </Link>
          
          {badge && <span className="book-card-badge">{badge}</span>}
        </div>

        <div className="book-card-body">
          <div className="book-card-info">
            <h3 className="book-card-title">
              <Link to={`/books/${id}`} className="book-card-title-link">
                {title}
              </Link>
            </h3>
            <p className="book-card-author">{author}</p>
            
            {rating > 0 && (
              <div className="book-card-rating">
                <div className="book-card-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rating ? 'filled' : ''}>
                      ★
                    </span>
                  ))}
                </div>
                {reviewCount > 0 && (
                  <span className="book-card-review-count">({reviewCount})</span>
                )}
              </div>
            )}
          </div>

          <div className="book-card-footer">
            <div className="book-card-pricing">
              <span className="book-price">{price}</span>
            </div>
            
            <button
              type="button"
              className={`book-card-add-to-cart ${isAdding ? 'adding' : ''}`}
              aria-label="Add to cart"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <div className="spinner"></div>
              ) : (
                <FaShoppingCart />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
