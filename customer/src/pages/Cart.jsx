import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useCart } from "../contexts/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page cart-page">
        <div className="container">
          <EmptyState type="cart" />
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <h2 className="cart-title">Shopping Cart</h2>
        <p className="cart-subtitle">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__image">
                  <img src={item.cover} alt={item.title} />
                </div>

                <div className="cart-item__details">
                  <h4 className="cart-item__title">{item.title}</h4>
                  <p className="cart-item__price">
                    {Number(item.price).toLocaleString()}₫
                  </p>
                </div>

                <div className="cart-item__quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, Number(e.target.value))
                    }
                    min="1"
                    className="quantity-input"
                    aria-label="Quantity"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="cart-item__total">
                  <p className="item-total">
                    {(Number(item.price) * Number(item.quantity)).toLocaleString()}₫
                  </p>
                </div>

                <button
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row summary-total">
              <span>Total</span>
              <span className="total-amount">{total.toLocaleString()}₫</span>
            </div>

            <NavLink to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </NavLink>
            
            <NavLink to="/books" className="continue-shopping">
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
