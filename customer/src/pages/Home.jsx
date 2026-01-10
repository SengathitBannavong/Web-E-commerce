import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookSection from "../components/BookSection";
import HeroSlider from "../components/HeroSlider";
import ServiceFeatures from "../components/ServiceFeatures"; 
import CategoryShowcase from "../components/CategoryShowcase"; // New Import
import { HERO_BANNERS } from "../data/heroBanners";
import { getCategories } from "../services/categoryService";
import { getBestsellers, getNewReleases } from "../services/productService";
import "./Home.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price || 0
  );

const adaptProductData = (product) => ({
  id: product.Product_Id,
  title: product.Name,
  author: product.Author,
  price: formatPrice(product.Price),
  cover: product.Photo_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png",
  rawPrice: product.Price,
});

export default function Home() {
  const [data, setData] = useState({
    newReleases: [],
    bestsellers: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [newReleasesRes, bestsellersRes, categoriesRes] =
          await Promise.all([
            getNewReleases({ page: 1, limit: 10 }), // Fetched more for slider
            getBestsellers({ page: 1, limit: 10 }),
            getCategories(),
          ]);
        
        setData({
          newReleases: newReleasesRes.data.map(adaptProductData),
          bestsellers: bestsellersRes.data.map(adaptProductData),
          categories: categoriesRes.data || [],
        });
      } catch (err) {
        console.error(err);
        setError(
          "Không thể tải dữ liệu trang chủ. Vui lòng kiểm tra kết nối."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (error) {
    return (
      <div className="page home-page">
        <div className="container">
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <div className="hero-section">
        <div className="container">
           <div className="hero-grid">
              <div className="hero-slider-wrapper">
                <HeroSlider slides={HERO_BANNERS} />
              </div>
              <div className="hero-services-wrapper">
                <ServiceFeatures />
              </div>
           </div>
        </div>
      </div>

      <main className="home-main-content">
        <section className="category-list-section">
          <div className="container">
            <div className="section-header">
              <h3>Popular Categories</h3>
              <Link to="/categories" className="view-all-link">
                Browse All Categories →
              </Link>
            </div>
            {loading ? (
              <div className="category-grid-home">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton category-skeleton"></div>
                ))}
              </div>
            ) : (
              <div className="category-grid-home">
                {data.categories.slice(0, 4).map((cat) => (
                  <Link
                    to={`/books?category=${cat.Category_Id}`}
                    key={cat.Category_Id}
                    className="category-card"
                  >
                    <div className="category-content">
                      <span className="cat-name">{cat.Name}</span>
                      {cat.Description && (
                        <span className="cat-description">{cat.Description}</span>
                      )}
                    </div>
                  </Link>
                ))}
                
                <Link to="/categories" className="category-card see-all-card">
                  <div className="see-all-content">
                    <div className="see-all-icon">📚</div>
                    <span className="see-all-text">View All Categories</span>
                    <span className="see-all-count">{data.categories.length} total</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Regular Sections */}
        <BookSection title="New Releases" books={data.newReleases} loading={loading} withCta />
        <BookSection title="Bestsellers" books={data.bestsellers} loading={loading} withCta />
        
        {/* Dynamic Tabbed Section */}
        {!loading && data.categories.length > 0 && (
           <CategoryShowcase categories={data.categories} />
        )}
        
        {/* Banner / CTA Section */}
        <section className="see-all-books-section">
          <div className="container">
            <div className="see-all-books-card">
              <div className="see-all-books-content">
                <div className="see-all-books-icon">📖</div>
                <h2 className="see-all-books-title">Discover More Books</h2>
                <p className="see-all-books-description">
                  Explore our complete collection of books across all categories
                </p>
                <Link to="/books" className="see-all-books-btn">
                  Browse All Books
                  <span className="see-all-books-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
