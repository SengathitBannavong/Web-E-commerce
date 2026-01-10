import { useEffect, useState } from "react";
import { FiChevronRight, FiPackage, FiShoppingCart } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { SkeletonDetail } from "../components/SkeletonLoader";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { getProductById } from "../services/productService";
import { getStockByProductId } from "../services/stockService";
import "./BookDetail.css";

const adaptProductData = (product) => {
  const imagePath = product.Photo_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png";
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.Price || 0);

  return {
    id: product.Product_Id,
    name: product.Name,
    author: product.Author,
    price: formattedPrice,
    description: product.Description,
    cover: imagePath,
    rawPrice: product.Price,
  };
};

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        if (productData) {
          setBook(adaptProductData(productData));
          
          try {
            const stockData = await getStockByProductId(id);
            setStock(stockData);
          } catch (stockErr) {
            console.warn("Stock information not available:", stockErr);
            setStock(null);
          }
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        setError("Đã có lỗi xảy ra khi tải thông tin sản phẩm.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="page book-detail-page">
        <div className="container">
          <SkeletonDetail />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="page book-detail-page">
        <div className="container">
          <div className="error-state">
            <p className="error-message">{error || "Không có thông tin chi tiết cho sản phẩm này."}</p>
            <Link to="/books" className="btn-link">Browse Books</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (stock && stock.Quantity <= 0) {
      toast.error("Sản phẩm này hiện đã hết hàng!");
      return;
    }

    if (stock && quantity > stock.Quantity) {
      toast.warning(`Only ${stock.Quantity} items available in stock!`);
      return;
    }
    
    const success = await addToCart(book.id, quantity);
    if (!success) {
      toast.error("Failed to add item to cart");
    }
  };

  const isOutOfStock = stock && stock.Quantity <= 0;

  return (
    <div className="page book-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to="/books">Books</Link>
          <FiChevronRight />
          <span>{book.name}</span>
        </nav>

        <div className="book-detail-grid">
          {/* Book Cover */}
          <div className="book-detail__image">
            <img
              src={book.cover}
              alt={`Bìa sách ${book.name}`}
              className="book-cover"
            />
          </div>

          {/* Book Info */}
          <div className="book-detail__content">
            <h1 className="book-title">{book.name}</h1>
            <p className="book-author">by {book.author}</p>

            <div className="book-price-section">
              <span className="book-price">{book.price}</span>
            </div>

            {/* Stock Info */}
            {stock && (
              <div className={`stock-badge ${isOutOfStock ? 'stock-badge--out' : 'stock-badge--in'}`}>
                <FiPackage />
                {isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <span>In Stock ({stock.Quantity} available)</span>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {!isOutOfStock && (
              <div className="book-actions">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={stock?.Quantity || 999}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      disabled={stock && quantity >= stock.Quantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
              </div>
            )}

            {/* Description */}
            <div className="book-description-section">
              <h2 className="section-title">Description</h2>
              <p className="book-description">
                {book.description || "Chưa có mô tả cho sản phẩm này."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
