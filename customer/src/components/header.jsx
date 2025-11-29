import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import "./header.css";
import SearchBox from "./search_box";

export default function Header() {
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
              <NavLink to="/profile" className="icon-text-link">
                <FaUser />
                <span>Account</span>
              </NavLink>
              <div className="dropdown-content">
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
