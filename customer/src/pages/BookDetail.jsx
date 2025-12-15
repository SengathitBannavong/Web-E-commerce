import React from 'react'
import { useParams } from 'react-router-dom';
import { BESTSELLERS } from '../data/bestsellers';
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from '../contexts/CartContext'; // <<< QUAN TRỌNG

const BookDetail = () => {
    const { id } = useParams();

    // Ép kiểu thành number
    const book = BESTSELLERS.find((b) => b.id ==id);

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: book.id,
            title: book.title,
            price: book.price,
            cover: book.cover,
            author: book.author,
            badge: book.badge,
        });
    };

    return (
        <div className='flex justify-center items-center m-10 p-4'>
            <div><div className='m-4'>
                <h2>{book.title}</h2>
                <p><b>Author:</b> {book.author}</p>
                <p><b>Description:</b> {book.description}</p>
                <p><b>Badge:</b> {book.badge}</p>
                <p><b>Price:</b> {book.price}</p>
            </div>
                <button 
                    onClick={handleAddToCart} // gắn onClick cho cả button
                    className='btn-primary px-6 space-x-1 flex items-center gap-1'
                >
                    <FaShoppingCart size={24} />
                        <p>Add cart</p>
                </button>
            </div>
            <div>
                <img className='w-50 h-auto rounded-lg shadow-lg' src={book.cover} alt={book.title} />
            </div>
        </div>
    );
}

export default BookDetail;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../contexts/CartContext";
import "./BookDetail.css";

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
