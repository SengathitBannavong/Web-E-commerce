import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import "./BookCard.css";

export default function BookCard({
  id,
  cover,
  title,
  author,
  price,
  badge,
  rawPrice,
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const itemToAdd = {
      id,
      name: title,
      price: rawPrice,
      cover,
      quantity: 1,
    };
    addToCart(itemToAdd);
    alert(`Đã thêm sách "${title}" vào giỏ hàng!`);
  };

  return (
    <article className="book-card">
      <div className="book-card-cover">
        <Link to={`/books/${id}`} aria-label={`Xem chi tiết sách ${title}`}>
          <img src={cover} alt={title} loading="lazy" />
        </Link>
        {badge ? <span className="book-card-badge">{badge}</span> : null}
      </div>

      <div className="book-card-body">
        <h4>
          <Link to={`/books/${id}`} className="book-card-title-link">
            {title}
          </Link>
        </h4>
        <p>{author}</p>
      </div>

      <div className="book-card-footer">
        <span className="book-price">{price}</span>
        <button
          type="button"
          className="book-card-add-to-cart"
          aria-label="Thêm vào giỏ hàng"
          onClick={handleAddToCart}
        >
          <FaShoppingCart />
        </button>
      </div>
    </article>
  );
}
