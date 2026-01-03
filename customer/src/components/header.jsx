import { FaBook, FaShoppingCart, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./header.css";
import SearchBox from "./search_box";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    logout();
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-left">
          <h1 className="logo-title">
            <NavLink to="/">Bookstore</NavLink>
          </h1>
        </div>

        <div className="header-center">
          <SearchBox />
        </div>

        <div className="header-right">
          <nav>
            <NavLink to="/books" className="icon-text-link">
              <FaBook />
              <span>Books</span>
            </NavLink>
            <NavLink to="/cart" className="icon-text-link cart-link">
              <div className="cart-icon-wrapper">
                <FaShoppingCart />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </div>
              <span>Cart</span>
            </NavLink>
            <div className="account-dropdown">
              <NavLink to="/account" className="icon-text-link">
                <FaUser />
                <span>Account</span>
              </NavLink>
              <div className="dropdown-content">
                {isAuthenticated ? (
                  <>
                    <NavLink to="/account">Profile</NavLink>
                    <button onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
