import { useId } from "react";
import BookCard from "./BookCard";
import "./BookSection.css";

export default function BookSection({
  title,
  books = [],
  onCtaClick,
  sectionId,
  className = "",
  withCta = false,
}) {
  const generatedId = useId();
  const headingId = sectionId
    ? `${sectionId}-heading`
    : `book-section-${generatedId}`;
  const displayedBooks = books.slice(0, 5);

  return (
    <section
      className={`book-section ${className}`.trim()}
      aria-labelledby={headingId}
      id={sectionId}
    >
      <div className="book-section__header">
        <h3 id={headingId}>{title}</h3>
      </div>

      <div className="book-section__grid">
        {displayedBooks.map((book) => (
          <BookCard
            key={book.id}
            cover={book.cover}
            title={book.title}
            author={book.author}
            price={book.price}
            badge={book.badge}
          />
        ))}
      </div>

      {withCta ? (
        <div className="book-section__footer">
          <button
            type="button"
            className="book-section__more"
            onClick={onCtaClick}
          >
            Xem thêm
          </button>
        </div>
      ) : null}
    </section>
  );
}
