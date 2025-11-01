import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
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

        {/* Center: Search bar */}
        <div className="header-center">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              name="search"
              placeholder="Search for books, authors..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        {/* Right: Navigation */}
        <div className="header-right">
          <nav>
            <NavLink to="/#">Books</NavLink>
            <NavLink to="/#">Cart</NavLink>
            <NavLink to="/login">Login</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
