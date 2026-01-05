import FooterSocialLinks from './FooterSocialLinks';

export default function FooterBrand() {
  return (
    <div className="footer-column-brand footer-column-about">
      <div className="footer-brand">
        <h3 className="footer-brand-title">J9 Bookstore</h3>
        <p className="footer-tagline">The source of knowledge</p>
      </div>
      <p className="footer-text footer-description">
        J9 Bookstore is so proud to be a trusted destination for book lovers. We are committed to providing a diverse selection of books, exceptional customer service, and a seamless shopping experience.
      </p>
      <FooterSocialLinks />
    </div>
  );
}
