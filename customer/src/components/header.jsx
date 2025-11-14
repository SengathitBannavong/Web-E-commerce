import { NavLink } from "react-router-dom";
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
            <NavLink end to="/">
              Home
            </NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/cart">Your Cart</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
