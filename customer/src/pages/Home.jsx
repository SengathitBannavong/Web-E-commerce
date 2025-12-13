import { useState, useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import BookSection from "../components/BookSection";
import Newsletter from "../components/Newsletter";
import { HERO_BANNERS } from "../data/heroBanners";
import { getProducts } from "../services/productService";
import "./Home.css";

// Adapter function to map backend data to frontend component props
const adaptProductData = (product) => {
  // Assuming Photo_Id is just the image file name like '1.jpg'
  // and our public images are in '/images/books/'
  const imagePath = `/images/books/${product.Photo_Id || "default.jpg"}`;

  // Formatting price from a number (e.g., 240000) to a string (e.g., "240.000đ")
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.Price || 0);

  return {
    id: product.Product_Id,
    title: product.Name,
    author: product.Author,
    price: formattedPrice,
    cover: imagePath,
    rawPrice: product.Price,
    // Backend doesn't have a badge, so we can omit it or add logic later
  };
};

export default function Home() {
  const [newReleases, setNewReleases] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products for "New Releases" - e.g., first page, 5 items
        const newReleasesData = await getProducts({ page: 1, limit: 5 });
        setNewReleases(newReleasesData.data.map(adaptProductData));

        // Fetch products for "Bestsellers" - e.g., second page, 5 items
        // In a real app, this would likely be a separate API or query param
        const bestsellersData = await getProducts({ page: 2, limit: 5 });
        setBestsellers(bestsellersData.data.map(adaptProductData));
      } catch (err) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Display loading or error states
  if (loading) {
    return (
      <div className="page home-page">
        <main className="home-main-content">
          <p>Đang tải sản phẩm...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page home-page">
        <main className="home-main-content">
          <p style={{ color: "red" }}>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <HeroSlider slides={HERO_BANNERS} />

      <main className="home-main-content">
        <BookSection title="Mới phát hành" books={newReleases} withCta />
        <BookSection title="Bán chạy nhất" books={bestsellers} withCta />
        <Newsletter />
      </main>
    </div>
  );
}
