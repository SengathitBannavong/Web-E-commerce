import { useEffect, useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { SkeletonGrid } from "../components/SkeletonLoader";
import { getCategories } from "../services/categoryService";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="categories-page">
        <div className="container">
          <EmptyState
            type="error"
            title="Error Loading Categories"
            message={error}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="breadcrumbs">
            <Link to="/" className="breadcrumb-item">
              <FaHome /> Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">All Categories</span>
          </div>

          <button
            className="back-to-home-btn"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="page-title-section">
          <div className="title-group">
            <h1 className="page-title">Browse All Categories</h1>
            {!loading && categories.length > 0 && (
              <p className="page-subtitle">
                Explore our collection of {categories.length} book categories
              </p>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <SkeletonGrid count={12} />
        ) : categories.length === 0 ? (
          <EmptyState
            type="search"
            title="No Categories Available"
            message="Check back later for new categories"
          />
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/books?category=${cat.Category_Id}`}
                key={cat.Category_Id}
                className="category-card-full"
              >
                {cat.Photo_URL ? (
                  <div className="category-image-full">
                    <img src={cat.Photo_URL} alt={cat.Name} loading="lazy" />
                    <div className="category-overlay">
                      <span className="view-books-btn">View Books</span>
                    </div>
                  </div>
                ) : (
                  <div className="category-image-full category-placeholder">
                    <div className="placeholder-icon">📚</div>
                  </div>
                )}
                
                <div className="category-info">
                  <h3 className="category-name">{cat.Name}</h3>
                  {cat.Description && (
                    <p className="category-description">{cat.Description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
