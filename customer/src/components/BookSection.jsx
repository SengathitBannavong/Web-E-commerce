import { useId, useRef, useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import "./BookSection.css";
import { SkeletonCard } from "./SkeletonLoader";

export default function BookSection({
  title,
  books = [],
  onCtaClick,
  sectionId,
  className = "",
  withCta = false,
  loading = false,
  viewAllLink = "/books",
}) {
  const generatedId = useId();
  const headingId = sectionId
    ? `${sectionId}-heading`
    : `book-section-${generatedId}`;
  const displayedBooks = books.slice(0, 10);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  // Check scroll on mount and when books change
  useState(() => {
    setTimeout(checkScroll, 100);
  }, [displayedBooks]);

  return (
    <section
      className={`book-section ${className}`.trim()}
      aria-labelledby={headingId}
      id={sectionId}
    >
      <div className="book-section__header">
        <div className="book-section__title-group">
          <h3 id={headingId}>{title}</h3>
          {!loading && books.length > 0 && (
            <span className="book-section__count">{books.length} books</span>
          )}
        </div>
        {!loading && books.length > 0 && (
          <Link to={viewAllLink} className="book-section__view-all">
            View All <FaArrowRight />
          </Link>
        )}
      </div>

      <div className="book-section__container">
        {!loading && canScrollLeft && (
          <button
            className="book-section__nav book-section__nav--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
        )}

        <div 
          className="book-section__grid"
          ref={scrollContainerRef}
          onScroll={checkScroll}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            displayedBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                cover={book.cover}
                title={book.title}
                author={book.author}
                price={book.price}
                badge={book.badge}
                rawPrice={book.rawPrice}
              />
            ))
          )}
        </div>

        {!loading && canScrollRight && (
          <button
            className="book-section__nav book-section__nav--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {!loading && books.length > displayedBooks.length && (
        <div className="book-section__footer">
          <Link
            to={viewAllLink}
            className="book-section__more"
          >
            <span>View All {books.length} Books</span>
            <FaArrowRight />
          </Link>
        </div>
      )}
    </section>
  );
}
