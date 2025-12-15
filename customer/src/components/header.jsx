import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import "./header.css";
import SearchBox from "./search_box";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="site-header">
      <div className="container">
        {/* Left: Logo/title */}
        <div className="header-left">
          <h1 className="logo-title">
            <NavLink to="/">Bookstore</NavLink>
          </h1>
        </div>

        {/* Center: Search Box */}
        <div className="header-center">
          <SearchBox />
        </div>

        {/* Right: Navigation */}
        <div className="header-right">
          <nav>
            <NavLink to="/cart" className="icon-text-link">
              <FaShoppingCart />
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
