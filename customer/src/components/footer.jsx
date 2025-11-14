import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Về chúng tôi */}
          <div className="footer-column">
            <h3 className="footer-title">Về Chúng Tôi</h3>
            <p className="footer-text">
              Cung cấp sản phẩm chất lượng cao với giá cả hợp lý. Chúng tôi cam
              kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="footer-column">
            <h3 className="footer-title">Liên Kết Nhanh</h3>
            <ul className="footer-list">
              <li>
                <a href="#" className="footer-link">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Sản phẩm
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="footer-column">
            <h3 className="footer-title">Hỗ Trợ Khách Hàng</h3>
            <ul className="footer-list">
              <li>
                <a href="#" className="footer-link">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="footer-column">
            <h3 className="footer-title">Liên Hệ</h3>
            <div className="footer-contact">
              <p> Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
              <p> Hotline: 1900 1009</p>
              <p> Email: contact@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>© 2025 Bookstore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
