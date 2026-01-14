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
}) {
  const { addToCart } = useCart();
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    setTimeout(() => {
      // check id is string
      const productId = typeof id === 'string' ? id : String(id);
      addToCart(productId);
      setIsAdding(false);
    }, 600);

    toast.success(`Added "${title}" to cart`);
  };

  return (
    <article className="book-card">
      {/* Image Container */}
      <div className="book-card__image">
        {badge && <span className="book-card__badge">{badge}</span>}
        
        {!imageLoaded && (
          <div className="book-card__skeleton">
            <div>📚</div>
          </div>
        )}
        
        <Link to={`/books/${id}`} aria-label={`View details for ${title}`}>
          <img
            src={cover}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={imageLoaded ? 'loaded' : ''}
          />
        </Link>
        
        <div className="book-card__overlay">
           <Link to={`/books/${id}`} aria-label={`View details for ${title}`}>
            <button className="book-card__quick-view">
                <FaEye size={16} />
                <span>Quick View</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="book-card__content">
        <p className="book-card__author">{author}</p>
        <h3 className="book-card__title">
            <Link to={`/books/${id}`} title={title}>
                {title}
            </Link>
        </h3>
      </div>

      {/* Footer */}
      <div className="book-card__footer">
        <span className="book-card__price">
            {price}
        </span>
        <button
          className="book-card__add-to-cart"
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label={`Add "${title}" to cart`}
        >
          <FaShoppingCart />
        </button>
      </div>
    </article>
  );
}