import { useToast } from "../contexts/ToastContext";
import "./Newsletter.css";

export default function Newsletter() {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for subscribing to our newsletter!");
    e.target.reset();
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h3>Đăng ký nhận bản tin</h3>
        <p>
          Đừng bỏ lỡ các chương trình khuyến mãi, sách mới và những tin tức thú
          vị từ Bookstore!
        </p>
      </div>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          required
          aria-label="Email for newsletter"
        />
        <button type="submit">Đăng ký</button>
      </form>
    </section>
  );
}
