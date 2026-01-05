import { useState } from "react";
import { FaEye, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
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


  return (
    <article className="book-card group">
      <div className="book-card-inner">
        {/* --- Image Section --- */}
        <div className="book-card-cover-wrapper">
          
          {/* Badge */}
          {badge && <span className="book-card-badge">{badge}</span>}


          <Link to={`/books/${id}`} aria-label={`View details for ${title}`}>
            <div className={`book-card-image-container ${imageLoaded ? 'loaded' : ''}`}>
              
              {/* Skeleton / Placeholder */}
              {!imageLoaded && !imageError && (
                <div className="book-card-skeleton">
                  <div className="skeleton-icon">📚</div>
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
                className={`book-card-img ${imageLoaded ? 'visible' : ''}`}
              />
              
              {/* Hover Overlay */}
              <div className="book-card-overlay">
                <span className="quick-view-btn">
                  <FaEye /> Quick View
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* --- Content Section --- */}
        <div className="book-card-body">
          <div className="book-card-info">
            <p className="book-card-author">{author}</p>
            
            <h3 className="book-card-title">
              <Link to={`/books/${id}`}>
                {title}
              </Link>
            </h3>
          </div>

          <div className="book-card-footer">
            <div className="price-container">
              <span className="book-price">{price}</span>
            </div>
            
            <Link to={`/books/${id}`} aria-label={`View details for ${title}`}>
              <button
                type="button"
                className={`add-to-cart-btn ${isAdding ? 'loading' : ''}`}
                disabled={isAdding}
              >
                {isAdding ? (
                  <div className="spinner"></div>
                ) : (
                  <FaShoppingCart />
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}