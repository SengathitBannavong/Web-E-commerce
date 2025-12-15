import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useCart } from "../contexts/CartContext";
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

  const handleAddToCart = (book) => {
    // Lấy hàm addToCart từ context giỏ hàng
    
    addToCart({
      id: book.id,
      cover: book.cover,
      title: book.title,
      author: book.author,
      price: book.price,
      badge: book.badge, 
    });
  };
  return (
    <article className="book-card">
      <div className="book-card-cover">
        <NavLink to={`/books/${id}`} aria-label={`Xem chi tiết sách ${title}`}>
          <img src={cover} alt={title} loading="lazy" />
        </NavLink>

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
          <NavLink to={`/books/${id}`} className="book-card-title-link">
            {title}
          </NavLink>
          <Link to={`/books/${id}`} className="book-card-title-link">
            {title}
          </Link>
        </h4>
        <p>{author}</p>
      </div>

      <div className="book-card-footer">
        <span className="book-price">{price} đ</span>
        <button
          type="button"
          className="book-card-add-to-cart"
          aria-label="Thêm vào giỏ hàng"
          onClick={() => {
            console.log(`Đã thêm sách "${title}" vào giỏ hàng!`);
            handleAddToCart({ id, cover, title, author, price, badge });
          }}
          onClick={handleAddToCart}
        >
          <FaShoppingCart />
        </button>
      </div>
    </article>
  );
}
