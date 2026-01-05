import { Link } from "react-router-dom";
export default function FooterQuickLinks() {
  const quickLinks = [
    { to: "/", icon: "🏠", text: "Home" },
    { to: "/books", icon: "📖", text: "Book List" },
    { to: "/account", icon: "👤", text: "Account" },
    { to: "/cart", icon: "🛒", text: "Cart" }
  ];

  return (
    <div className="footer-column">
      <h3 className="footer-title">Quick Links</h3>
      <ul className="footer-list">
        {quickLinks.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="footer-link">
              <span className="footer-link-icon">{link.icon}</span>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
