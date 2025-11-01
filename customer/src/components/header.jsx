import { NavLink } from "react-router-dom";
import "./header.css";

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
