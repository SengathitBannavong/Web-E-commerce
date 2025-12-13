import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../contexts/CartContext";
import "./BookDetail.css";

// Adapter function to map backend data to frontend component props
const adaptProductData = (product) => {
  const imagePath = `/images/books/${product.Photo_Id || "default.jpg"}`;
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
    rawPrice: product.Price, // Keep raw price for cart logic
  };
};

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        if (productData) {
          setBook(adaptProductData(productData));
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
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page book-detail-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="page book-detail-page">
        <p>Không có thông tin chi tiết cho sản phẩm này.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    const itemToAdd = {
      id: book.id,
      name: book.name,
      price: book.rawPrice,
      cover: book.cover,
      quantity: 1,
    };
    addToCart(itemToAdd);
    // You can add a toast notification here to confirm addition to cart
    alert(`Đã thêm "${book.name}" vào giỏ hàng!`);
  };

  return (
    <div className="page book-detail-page">
      <main className="book-detail-container">
        <div className="book-cover-container">
          <img
            src={book.cover}
            alt={`Bìa sách ${book.name}`}
            className="book-cover-large"
          />
        </div>
        <div className="book-info-container">
          <h1 className="book-title">{book.name}</h1>
          <p className="book-author">Tác giả: {book.author}</p>
          <p className="book-price">{book.price}</p>
          <div className="book-actions">
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className="book-description">
            <h3 className="description-title">Mô tả sản phẩm</h3>
            <p>{book.description || "Chưa có mô tả cho sản phẩm này."}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
