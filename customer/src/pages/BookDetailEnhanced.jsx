import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from '../contexts/ToastContext';
import { getCategoryById } from "../services/categoryService";
import { getProductById } from "../services/productService";
import { getStockByProductId } from "../services/stockService";
import ProductReviews from "../components/ProductReviews";
import "./BookDetailEnhanced.css";

export default function BookDetailEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product data
        const productData = await getProductById(id);
        if (!productData) {
          setError("Product not found");
          return;
        }
        setProduct(productData);

        // Fetch stock information
        try {
          const stockData = await getStockByProductId(id);
          setStock(stockData);
        } catch (err) {
          toast.error("Stock information not available:", err);
          setStock(null);
        }

        // Fetch category information
        if (productData.Category_Id) {
          try {
            const categoryData = await getCategoryById(productData.Category_Id);
            setCategory(categoryData);
          } catch (err) {
            toast.error("Category information not available:", err);
          }
        }
      } catch (err) {
        toast.error("Error fetching product:", err);
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    // Check stock availability
    if (stock && stock.Quantity <= 0) {
      toast.error("This product is currently out of stock!");
      return;
    }

    if (stock && quantity > stock.Quantity) {
      toast.error(`Only ${stock.Quantity} items available in stock!`);
      return;
    }

    setAddingToCart(true);
    try {
      
      const success = await addToCart(product.Product_Id, quantity);
      if (success) {
        toast.success(`Added "${product.Name}" to cart successfully!`);
        navigate('/cart');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-error">
        <div className="error-icon">⚠</div>
        <h2>Error Loading Product</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/books")} className="btn-back">
          Back to Books
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate("/books")} className="btn-back">
          Back to Books
        </button>
      </div>
    );
  }

  const isOutOfStock = stock && stock.Quantity <= 0;
  const isLowStock = stock && stock.Quantity > 0 && stock.Quantity <= 10;

  return (
    <div className="product-detail-enhanced">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back-inline">
          ← Back
        </button>

        <div className="product-detail-grid">
          {/* Product Image Section */}
          <div className="product-image-section">
            <div className="product-image-wrapper">
              <img
                src={product.Photo_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png"}
                alt={product.Name}
                className="product-image"
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png";
                }}
              />
              {isOutOfStock && (
                <div className="out-of-stock-badge">Out of Stock</div>
              )}
              {isLowStock && (
                <div className="low-stock-badge">Low Stock</div>
              )}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.Name}</h1>
              <div className="description-content">
                {product.Description || "No description available for this product."}
              </div>
              {category && (
                <span className="product-category-badge">
                  {category.Name}
                </span>
              )}
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Author:</span>
                <span className="meta-value">{product.Author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Product ID:</span>
                <span className="meta-value">{product.Product_Id}</span>
              </div>
            </div>

            <div className="product-price-section">
              <div className="price-main">{formatPrice(product.Price)}</div>
              {/* Stock Information */}
              {stock && (
                <div className={`stock-status ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
                  <div className="stock-indicator"></div>
                  <div className="stock-info">
                    {isOutOfStock ? (
                      <span className="stock-text">Out of Stock</span>
                    ) : (
                      <>
                        <span className="stock-text">
                          {isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                        <span className="stock-quantity">
                          ({stock.Quantity} available)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>


            {/* Quantity Selector and Add to Cart */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-input-group">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(stock?.Quantity || 999, val)));
                    }}
                    min="1"
                    max={stock?.Quantity || 999}
                    disabled={isOutOfStock}
                    className="quantity-input"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(stock?.Quantity || 999, quantity + 1))}
                    disabled={isOutOfStock}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className={`btn-add-to-cart ${isOutOfStock ? 'disabled' : ''}`}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-small"></span>
                    Adding...
                  </>
                ) : isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        <ProductReviews productId={product.Product_Id} />
      </div>
    </div>
  );
}
