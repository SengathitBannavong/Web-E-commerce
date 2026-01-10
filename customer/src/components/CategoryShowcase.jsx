import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import "./CategoryShowcase.css";
import { SkeletonCard } from "./SkeletonLoader";
import { getProducts } from "../services/productService";

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

export default function CategoryShowcase({ categories = [] }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set default active category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  // Fetch products when active category changes
  useEffect(() => {
    if (!activeCategory) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ 
          page: 1, 
          limit: 10, 
          category: activeCategory.Category_Id 
        });
        
        if (res?.data) {
          setProducts(res.data.map(adaptProductData));
        }
      } catch (error) {
        console.error("Failed to fetch products for category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="category-showcase">
      <div className="container">
        <div className="showcase-header">
          <h3>Books by Genres</h3>
          <div className="showcase-tabs">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.Category_Id}
                className={`tab-btn ${activeCategory?.Category_Id === cat.Category_Id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.Name}
              </button>
            ))}
            <Link to="/categories" className="tab-view-all">
              All Genres +
            </Link>
          </div>
        </div>

        <div className="showcase-content">
          {loading ? (
             <div className="showcase-grid">
               {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
             </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="showcase-grid">
                  {products.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      cover={book.cover}
                      title={book.title}
                      author={book.author}
                      price={book.price}
                      rawPrice={book.rawPrice}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No books found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {activeCategory && (
           <div className="showcase-footer">
              <Link to={`/books?category=${activeCategory.Category_Id}`} className="btn-outline">
                See All
              </Link>
           </div>
        )}
      </div>
    </section>
  );
}
