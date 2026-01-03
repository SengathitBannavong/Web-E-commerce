import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookSection from "../components/BookSection";
import HeroSlider from "../components/HeroSlider";
import Newsletter from "../components/Newsletter";
import { HERO_BANNERS } from "../data/heroBanners";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
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
            getProducts({ page: 1, limit: 5 }),
            getProducts({ page: 2, limit: 5 }),
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
      <HeroSlider slides={HERO_BANNERS} />

      <main className="home-main-content">
        <section className="category-list-section">
          <div className="container">
            <h3>Khám phá theo thể loại</h3>
            {loading ? (
              <div className="category-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton category-skeleton"></div>
                ))}
              </div>
            ) : (
              <div className="category-grid">
                {data.categories.slice(0, 6).map((cat) => (
                  <Link
                    to={`/books?category=${cat.Category_Id}`}
                    key={cat.Category_Id}
                    className="category-card"
                  >
                    <span className="cat-name">{cat.Name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <BookSection title="Mới phát hành" books={data.newReleases} loading={loading} withCta />
        <BookSection title="Sách bán chạy" books={data.bestsellers} loading={loading} withCta />
        <Newsletter />
      </main>
    </div>
  );
}