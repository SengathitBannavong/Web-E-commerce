import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-title">Về Chúng Tôi</h3>
            <p className="footer-text">
              Cung cấp sản phẩm chất lượng cao với giá cả hợp lý. Chúng tôi cam
              kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Liên Kết Nhanh</h3>
            <ul className="footer-list">
              <li>
                <Link to="/" className="footer-link">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/books" className="footer-link">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/account" className="footer-link">
                  Tài khoản
                </Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Hỗ Trợ Khách Hàng</h3>
            <ul className="footer-list">
              <li>
                <span className="footer-text">Thanh toán an toàn</span>
              </li>
              <li>
                <span className="footer-text">Hỗ trợ 24/7</span>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Liên Hệ</h3>
            <div className="footer-contact">
              <p className="footer-text">📍 123 Đường ABC, Quận 1, TP.HCM</p>
              <p className="footer-text">📞 Hotline: 1900 1009</p>
              <p className="footer-text">✉️ contact@bookstore.com</p>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© 2025 Bookstore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
