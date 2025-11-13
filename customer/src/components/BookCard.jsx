import "./BookCard.css";
import { FaShoppingCart } from "react-icons/fa";

export default function BookCard({
  cover,
  title,
  author,
  price,
  badge,
  bookLink,
}) {
  return (
    <article className="book-card">
      <div className="book-card-cover">
        <a href={bookLink} aria-label={`Xem chi tiết sách ${title}`}>
          <img src={cover} alt={title} loading="lazy" />
        </a>
        {badge ? <span className="book-card-badge">{badge}</span> : null}
      </div>

      <div className="book-card-body">
        <h4>
          <a href={bookLink} className="book-card-title-link">
            {title}
          </a>
        </h4>
        <p>{author}</p>
      </div>

      <div className="book-card-footer">
        <span className="book-price">{price}</span>
        <button
          type="button"
          className="book-card-add-to-cart"
          aria-label="Thêm vào giỏ hàng"
          onClick={() => {
            //  logic thêm giỏ hàng
            console.log(`Đã thêm sách "${title}" vào giỏ hàng!`);
          }}
        >
          <FaShoppingCart />
        </button>
      </div>
    </article>
  );
}
