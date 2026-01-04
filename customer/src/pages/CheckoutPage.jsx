import { useEffect, useState } from "react";
import { FaCity, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaShoppingBag, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { createCheckoutSession } from "../services/paymentService";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Vietnam",
    zipcode: "",
    paymentMethod: "stripe"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      navigate("/cart");
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.Name || user.name || "",
        email: user.Email || user.email || "",
        phone: user.PhoneNumber || user.phone || "",
        address: user.Address || user.address || "",
      }));
    }
  }, [user, isAuthenticated, cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare shipping address
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.country}`.trim();
      
      // For Stripe payment, redirect to Stripe checkout
      if (formData.paymentMethod === "stripe") {
        const stripeSession = await createCheckoutSession(shippingAddress);
        if (stripeSession && stripeSession.url) {
          // Redirect to Stripe checkout page
          window.location.href = stripeSession.url;
          return;
        } else {
          setError("Failed to create payment session. Please try again.");
          setLoading(false);
          return;
        }
      }
      setError("Cash on Delivery is not currently available. Please use Stripe payment.");
      setLoading(false);

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <FaShoppingBag className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some items to proceed with checkout</p>
            <button onClick={() => navigate("/books")} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <div className="header-content">
            <FaLock className="lock-icon" />
            <div>
              <h1 className="page-title">Secure Checkout</h1>
              <p className="page-subtitle">Complete your order securely</p>
            </div>
          </div>
          <button onClick={() => navigate("/cart")} className="btn-back">
            ← Back to Cart
          </button>
        </div>

        <div className="checkout-grid">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Personal Information */}
              <div className="form-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Personal Information</h2>
                    <p className="section-subtitle">We'll use this to contact you about your order</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <FaUser /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="form-input"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-input"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      <FaPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="form-input"
                      placeholder="+84 123 456 789"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="form-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Shipping Address</h2>
                    <p className="section-subtitle">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label htmlFor="address" className="form-label">
                      <FaMapMarkerAlt /> Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="form-input"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      <FaCity /> City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className="form-input"
                      placeholder="Ho Chi Minh City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      className="form-input"
                      value={formData.country}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </div>
              </div>


              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-submit"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.cover} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {(Number(item.price) * Number(item.quantity)).toLocaleString()}₫
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-badge">Free</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span className="total-amount">{total.toLocaleString()}₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;