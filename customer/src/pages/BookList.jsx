import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import { getCategories, getCategoryById } from "../services/categoryService";
import BookCard from "../components/BookCard"; 
import "./BookList.css";

const BookList = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Tất cả sách");

  // Lấy params từ URL
  const categoryId = searchParams.get("category");
  const searchTerm = searchParams.get("search");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: 1,
          limit: 20,
        };
        
        if (categoryId) params.category = parseInt(categoryId);
        if (searchTerm) params.search = searchTerm;

        const productRes = await getProducts(params);
        setBooks(productRes.data);

        // Logic set tiêu đề
        if (categoryId) {
            try {
                const catRes = await getCategoryById(categoryId);
                setTitle(`Thể loại: ${catRes.Name}`);
            } catch (e) {
                setTitle("Danh sách theo thể loại");
            }
        } else if (searchTerm) {
            setTitle(`Kết quả tìm kiếm: "${searchTerm}"`);
        } else {
            setTitle("Tất cả sách");
        }

      } catch (error) {
        console.error("Lỗi tải sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, searchTerm]);

  const formatBookData = (book) => {
    const formattedPrice = new Intl.NumberFormat("vi-VN").format(book.Price);
    
    return {
        id: book.Product_Id,
        title: book.Name,
        author: book.Author,
        price: formattedPrice, 
        cover: `/images/books/${book.Photo_Id || "default.jpg"}`,
        rawPrice: book.Price
    };
  };

  if (loading) return <div className="book-list-page container" style={{paddingTop: '100px'}}>Đang tải...</div>;

  return (
    <div className="book-list-page">
      <div className="container">
        <h1 className="page-title">{title}</h1>
        
        {books.length === 0 ? (
            <p className="no-results">Không tìm thấy cuốn sách nào.</p>
        ) : (
            <div className="book-grid">
            {books.map((book) => {
                const formattedBook = formatBookData(book);
                return (
                    <BookCard
                        key={formattedBook.id}
                        {...formattedBook} 
                    />
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};

export default BookList;