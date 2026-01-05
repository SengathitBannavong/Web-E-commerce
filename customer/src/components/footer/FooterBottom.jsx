export default function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer-bottom">
      <div className="footer-copyright">
        <p>© {currentYear} Bookstore. All rights reserved.</p>
        <p className="footer-made-with">Made with ❤️ in Mock</p>
      </div>
    </div>
  );
}
