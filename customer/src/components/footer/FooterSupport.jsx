export default function FooterSupport() {
  const supportLinks = [
    { icon: "🔒", text: "Secure Payment" },
    { icon: "💬", text: "Service Support 24/7" },
    { icon: "🚚", text: "Shipping Policy" }
  ];

  return (
    <div className="footer-column">
      <h3 className="footer-title">Customer Support</h3>
      <ul className="footer-list">
        {supportLinks.map((link) => (
          <li key={link.text}>
            <a href="#" className="footer-link">
              <span className="footer-link-icon">{link.icon}</span>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
