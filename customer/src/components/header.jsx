import { useEffect, useState } from "react";
import { FaBars, FaBook, FaSearch, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaTimes, FaUser, FaUserCircle, FaUserPlus } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./header.css";
import SearchBox from "./search_box";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const avatarSrc = user?.Profile_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1767510418/temp_profile_selxqo.jpg";
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-left">
          {/* Hamburger Menu Button - Mobile Only */}
          <button 
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <h1 className="logo-title">
            <NavLink to="/" onClick={closeMobileMenu}>Bookstore</NavLink>
          </h1>
        </div>

        {/* Desktop Search - Hidden on Mobile */}
        <div className="header-center desktop-search">
          <SearchBox />
        </div>

        {/* Mobile Search Icon */}
        <button 
          className="mobile-search-toggle"
          onClick={toggleMobileSearch}
          aria-label="Toggle search"
        >
          <FaSearch />
        </button>

        {/* Desktop Navigation */}
        <div className="header-right desktop-nav">
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
                    <NavLink 
                      to="/account?tab=profile" 
                      className={({ isActive }) => {
                        const isProfileActive = location.pathname === '/account' && location.search === '?tab=profile';
                        return `dropdown-item ${isProfileActive ? 'active' : ''}`;
                      }}
                    >
                      <FaUserCircle className="dropdown-icon" />
                      <span>My Profile</span>
                    </NavLink>
                    <NavLink 
                      to="/account?tab=orders" 
                      className={({ isActive }) => {
                        const isOrdersActive = location.pathname === '/account' && location.search === '?tab=orders';
                        return `dropdown-item ${isOrdersActive ? 'active' : ''}`;
                      }}
                    >
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

      {/* Mobile Search Expandable - Shown when toggled */}
      <div className={`mobile-search-bar ${isMobileSearchOpen ? 'open' : ''}`}>
        <div className="container">
          <SearchBox />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Navigation Drawer */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          {isAuthenticated && user ? (
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                <img src={avatarSrc} alt="User" />
              </div>
              <div className="mobile-user-details">
                <p className="mobile-user-name">{user?.name || 'User'}</p>
                <p className="mobile-user-email">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="mobile-guest-info">
              <FaUser className="mobile-guest-icon" />
              <p className="mobile-guest-text">Welcome, Guest</p>
            </div>
          )}
        </div>

        <div className="mobile-nav-divider"></div>

        <div className="mobile-nav-links">
          <NavLink to="/books" className="mobile-nav-item" onClick={closeMobileMenu}>
            <FaBook className="mobile-nav-icon" />
            <span>Browse Books</span>
          </NavLink>
          
          <NavLink to="/cart" className="mobile-nav-item" onClick={closeMobileMenu}>
            <FaShoppingCart className="mobile-nav-icon" />
            <span>Shopping Cart</span>
            {cartItemCount > 0 && (
              <span className="mobile-cart-badge">{cartItemCount}</span>
            )}
          </NavLink>

          {isAuthenticated ? (
            <>
              <div className="mobile-nav-divider"></div>
              
              <NavLink 
                to="/account?tab=profile" 
                className={({ isActive }) => {
                  const isProfileActive = location.pathname === '/account' && location.search === '?tab=profile';
                  return `mobile-nav-item ${isProfileActive ? 'active' : ''}`;
                }}
                onClick={closeMobileMenu}
              >
                <FaUserCircle className="mobile-nav-icon" />
                <span>My Profile</span>
              </NavLink>
              
              <NavLink 
                to="/account?tab=orders" 
                className={({ isActive }) => {
                  const isOrdersActive = location.pathname === '/account' && location.search === '?tab=orders';
                  return `mobile-nav-item ${isOrdersActive ? 'active' : ''}`;
                }}
                onClick={closeMobileMenu}
              >
                <FaBook className="mobile-nav-icon" />
                <span>My Orders</span>
              </NavLink>

              <div className="mobile-nav-divider"></div>

              <button onClick={handleLogout} className="mobile-nav-item mobile-logout-btn">
                <FaSignOutAlt className="mobile-nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <div className="mobile-nav-divider"></div>
              
              <NavLink to="/login" className="mobile-nav-item" onClick={closeMobileMenu}>
                <FaSignInAlt className="mobile-nav-icon" />
                <span>Login</span>
              </NavLink>
              
              <NavLink to="/register" className="mobile-nav-item" onClick={closeMobileMenu}>
                <FaUserPlus className="mobile-nav-icon" />
                <span>Register</span>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
