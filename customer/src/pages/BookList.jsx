import { useEffect, useState } from "react";
import { FaArrowLeft, FaFilter, FaHome, FaSortAmountDown } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { SkeletonGrid } from "../components/SkeletonLoader";
import { getCategoryById } from "../services/categoryService";
import { getProducts } from "../services/productService";
import "./BookList.css";

const BookList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("All Books");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const categoryId = searchParams.get("category");
  const searchTerm = searchParams.get("search");

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: limit,
        };
        
        if (categoryId) params.category = parseInt(categoryId);
        if (searchTerm) params.search = searchTerm;

        const productRes = await getProducts(params);
        setBooks(productRes.data);
        setTotalPages(productRes.totalPage || productRes.totalPages || 1);

        if (categoryId) {
            try {
                const catRes = await getCategoryById(categoryId);
                setTitle(`Category: ${catRes.Name}`);
            } catch (e) {
                setTitle("Category List");
            }
        } else if (searchTerm) {
            setTitle(`Search Results: "${searchTerm}"`);
        } else {
            setTitle("All Books");
        }

      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, searchTerm, currentPage]);

  const formatBookData = (book) => {
    const formattedPrice = new Intl.NumberFormat("vi-VN").format(book.Price);
    
    return {
        id: book.Product_Id,
        title: book.Name,
        author: book.Author,
        price: formattedPrice, 
        cover: book.Photo_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png",
        rawPrice: book.Price
    };
  };

  const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortBooks = (booksToSort) => {
    const sorted = [...booksToSort];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.Price - b.Price);
      case "price-high":
        return sorted.sort((a, b) => b.Price - a.Price);
      case "name-asc":
        return sorted.sort((a, b) => a.Name.localeCompare(b.Name));
      case "name-desc":
        return sorted.sort((a, b) => b.Name.localeCompare(a.Name));
      default:
        return sorted;
    }
  };

  const filterBooks = (booksToFilter) => {
    return booksToFilter.filter(book => {
      // Price filter
      if (priceFilter !== "all") {
        const price = book.Price;
        switch (priceFilter) {
          case "under-100k":
            if (price >= 100000) return false;
            break;
          case "100k-200k":
            if (price < 100000 || price >= 200000) return false;
            break;
          case "200k-500k":
            if (price < 200000 || price >= 500000) return false;
            break;
          case "over-500k":
            if (price < 500000) return false;
            break;
          default:
            break;
        }
      }
      return true;
    });
  };

  const filteredAndSortedBooks = sortBooks(filterBooks(books));

  const clearFilters = () => {
    setPriceFilter("all");
  };

  const hasActiveFilters = priceFilter !== "all";

  return (
    <div className="book-list-page">
      <div className="container">
        {/* Breadcrumbs & Back Button */}
        <div className="page-header">
          <div className="breadcrumbs">
            <Link to="/" className="breadcrumb-item">
              <FaHome /> Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{title}</span>
          </div>
          
          <button 
            className="back-to-home-btn"
            onClick={() => navigate('/')}
            aria-label="Back to home"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Page Title & Controls */}
        <div className="page-title-section">
          <div className="title-group">
            <h1 className="page-title">{title}</h1>
            {!loading && books.length > 0 && (
              <span className="results-count">
                {filteredAndSortedBooks.length} of {books.length} books
                {hasActiveFilters && " (filtered)"}
              </span>
            )}
          </div>

          {!loading && books.length > 0 && (
            <div className="page-controls">
              <button 
                className={`filter-toggle-btn ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
                <span>Filter</span>
                {hasActiveFilters && <span className="filter-badge">1</span>}
              </button>
              
              <div className="sort-dropdown">
                <FaSortAmountDown />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Default</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && !loading && books.length > 0 && (
          <div className="filter-panel">
            <div className="filter-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    value="all"
                    checked={priceFilter === "all"}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  />
                  <span>All Prices</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    value="under-100k"
                    checked={priceFilter === "under-100k"}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  />
                  <span>Under 100,000 VND</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    value="100k-200k"
                    checked={priceFilter === "100k-200k"}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  />
                  <span>100,000 - 200,000 VND</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    value="200k-500k"
                    checked={priceFilter === "200k-500k"}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  />
                  <span>200,000 - 500,000 VND</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    value="over-500k"
                    checked={priceFilter === "over-500k"}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  />
                  <span>Over 500,000 VND</span>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <SkeletonGrid count={12} />
        ) : books.length === 0 ? (
          <EmptyState 
            type="search" 
            title={searchTerm ? "No books found" : "No books available"}
            message={searchTerm ? `We couldn't find any books matching "${searchTerm}"` : "Check back later for new arrivals"}
          />
        ) : (
          <>
            {filteredAndSortedBooks.length === 0 ? (
              <EmptyState 
                type="search" 
                title="No books match your filters"
                message="Try adjusting your filters or clearing them to see more results"
              />
            ) : (
              <>
                <div className="book-grid">
                  {filteredAndSortedBooks.map((book) => {
                    const formattedBook = formatBookData(book);
                    return (
                      <BookCard
                        key={formattedBook.id}
                        id={formattedBook.id}
                        cover={formattedBook.cover}
                        title={formattedBook.title}
                        author={formattedBook.author}
                        price={formattedBook.price}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;