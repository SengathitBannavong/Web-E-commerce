import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { SkeletonGrid } from "../components/SkeletonLoader";
import { getCategoryById } from "../services/categoryService";
import { getProducts } from "../services/productService";
import "./BookList.css";

const BookList = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Tất cả sách");
  
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

  return (
    <div className="book-list-page">
      <div className="container">
        <h1 className="page-title">{title}</h1>
        
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
            <div className="book-grid">
              {books.map((book) => {
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
      </div>
    </div>
  );
};

export default BookList;