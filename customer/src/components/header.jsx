import { FaBook, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUser, FaUserCircle, FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./header.css";
import SearchBox from "./search_box";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    logout();
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const avatarSrc = user?.Profile_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1767510418/temp_profile_selxqo.jpg";
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
              <button className="icon-text-link account-trigger">
                {isAuthenticated && user ? (
                  <div className="header-user-avatar">
                    <img src={avatarSrc} alt="User" />
                  </div>
                ) : (
                  <FaUser style={{ color: "#737373" }} />
                )}
                <span style={{ color: "#737373" }} >Account</span>
              </button>
              <div className="dropdown-content">
                {isAuthenticated ? (
                  <>
                    <div className="dropdown-user-info">
                      <div className="dropdown-avatar">
                        <img src={avatarSrc} alt="User" />
                      </div>
                      <div className="dropdown-user-details">
                        <p className="dropdown-user-name">{user?.name || 'User'}</p>
                        <p className="dropdown-user-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <NavLink to="/account?tab=profile" className="dropdown-item">
                      <FaUserCircle className="dropdown-icon" />
                      <span>My Profile</span>
                    </NavLink>
                    <NavLink to="/account?tab=orders" className="dropdown-item">
                      <FaBook className="dropdown-icon" />
                      <span>My Orders</span>
                    </NavLink>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <FaSignOutAlt className="dropdown-icon" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="dropdown-item">
                      <FaSignInAlt className="dropdown-icon" />
                      <span>Login</span>
                    </NavLink>
                    <NavLink to="/register" className="dropdown-item">
                      <FaUserPlus className="dropdown-icon" />
                      <span>Register</span>
                    </NavLink>
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
