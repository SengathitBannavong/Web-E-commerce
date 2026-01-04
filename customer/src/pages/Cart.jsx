import { FaArrowLeft, FaShoppingBag, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import "./Cart.css";

export default function CartEnhanced() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm("Are you sure you want to remove this item from your cart?")) {
      removeFromCart(itemId);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="empty-cart-icon">
          <FaShoppingBag />
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => navigate("/books")} className="btn-shop-now">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-enhanced">
      <div className="container">
        <div className="cart-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            <FaArrowLeft /> Back
          </button>
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-item-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</div>
        </div>

        <div className="cart-content-grid">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img
                    src={item.cover}
                    alt={item.title || item.name}
                    onError={(e) => {
                      e.target.src = "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png";
                    }}
                  />
                </div>

                <div className="cart-item-details">
                  <h3 className="item-title">{item.title || item.name}</h3>
                  <p className="item-price">{formatPrice(item.price)}</p>
                  
                  <div className="item-actions">
                    <div className="quantity-control">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="qty-btn"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.id, Math.max(1, val));
                        }}
                        className="qty-input"
                        min="1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn-remove"
                      title="Remove item"
                    >
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="cart-item-subtotal">
                  <span className="subtotal-label">Subtotal</span>
                  <span className="subtotal-amount">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-amount">{formatPrice(total)}</span>
                </div>
              </div>

              <NavLink to="/checkout" className="btn-checkout">
                Proceed to Checkout
              </NavLink>

              <button onClick={() => navigate("/books")} className="btn-continue-shopping">
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <div className="cart-info-box">
              <h4>✓ Free Shipping</h4>
              <p>On all orders</p>
            </div>
            <div className="cart-info-box">
              <h4>✓ Secure Payment</h4>
              <p>Multiple payment options</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
