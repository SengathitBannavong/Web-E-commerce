import "./footer.css";
import FooterBottom from "./footer/FooterBottom";
import FooterBrand from "./footer/FooterBrand";
import FooterContact from "./footer/FooterContact";
import FooterQuickLinks from "./footer/FooterQuickLinks";
import FooterSupport from "./footer/FooterSupport";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          <FooterBrand />
          <FooterQuickLinks />
          <FooterSupport />
          <FooterContact />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
