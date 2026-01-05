export default function FooterContact() {
  const contactInfo = [
    {
      icon: "📍",
      content: <p className="footer-text">25 Ta Quang Buu, Hai Ba Trung, Hanoi</p>
    },
    {
      icon: "📞",
      content: (
        <div>
          <p className="footer-text footer-contact-main">Hotline: 123456789</p>
          <p className="footer-text footer-contact-sub">(8:00 - 22:00 daily)</p>
        </div>
      )
    },
    {
      icon: "✉️",
      content: (
        <a href="mailto:contact@bookstore.com" className="footer-text footer-contact-link">
          contact@bookstore.com
        </a>
      )
    }
  ];

  return (
    <div className="footer-column">
      <h3 className="footer-title">Contact Info</h3>
      <div className="footer-contact">
        {contactInfo.map((item, index) => (
          <div key={index} className="footer-contact-item">
            <span className="footer-contact-icon">{item.icon}</span>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
