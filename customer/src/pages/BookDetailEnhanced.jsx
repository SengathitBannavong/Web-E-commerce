import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getCategoryById } from "../services/categoryService";
import { getProductById } from "../services/productService";
import { getStockByProductId } from "../services/stockService";
import "./BookDetailEnhanced.css";

export default function BookDetailEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
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
          console.warn("Stock information not available:", err);
          setStock(null);
        }

        // Fetch category information
        if (productData.Category_Id) {
          try {
            const categoryData = await getCategoryById(productData.Category_Id);
            setCategory(categoryData);
          } catch (err) {
            console.warn("Category information not available:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
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
      alert("This product is currently out of stock!");
      return;
    }

    if (stock && quantity > stock.Quantity) {
      alert(`Only ${stock.Quantity} items available in stock!`);
      return;
    }

    setAddingToCart(true);
    try {
      const itemToAdd = {
        id: product.Product_Id,
        name: product.Name,
        price: product.Price,
        cover: product.Photo_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png",
        quantity: quantity,
      };

      const success = await addToCart(itemToAdd);
      if (success) {
        alert(`Added "${product.Name}" to cart successfully!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
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
              {category && (
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{category.Name}</span>
                </div>
              )}
            </div>

            <div className="product-price-section">
              <div className="price-main">{formatPrice(product.Price)}</div>
            </div>

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

            {/* Product Description */}
            <div className="product-description-section">
              <h3 className="section-title">Product Description</h3>
              <div className="description-content">
                {product.Description || "No description available for this product."}
              </div>
            </div>

            {/* Additional Details */}
            <div className="product-details-section">
              <h3 className="section-title">Additional Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Price</span>
                  <span className="detail-value">{formatPrice(product.Price)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Availability</span>
                  <span className="detail-value">
                    {isOutOfStock ? 'Out of Stock' : stock ? `${stock.Quantity} in stock` : 'Check availability'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{category?.Name || 'Uncategorized'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Author</span>
                  <span className="detail-value">{product.Author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
