import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              Kaliber <span className="italic-serif" style={{ color: "var(--amber)" }}>Autonomy.</span>
            </h3>
            <p>Custom automation, engineered for the trades.</p>
          </div>
          <div className="footer-col">
            <h4>Pages</h4>
            <Link to="/#services">Services</Link>
            <Link to="/demo">Demo</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="tel:2898026510">(289) 802-6510</a>
            <a href="mailto:daniel@kaliberautonomy.com">daniel@kaliberautonomy.com</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <span style={{ color: "var(--steel-2)", fontSize: "14px", opacity: 0.78 }}>© 2026 Kaliber Autonomy</span>
            <span style={{ color: "var(--steel-2)", fontSize: "14px", opacity: 0.78 }}>Ontario, Canada</span>
          </div>
        </div>
        <div className="rule-dark"></div>
        <div className="footer-bottom">
          <span>© 2026 Kaliber Autonomy</span>
          <span>Ontario, Canada</span>
        </div>
      </div>
    </footer>
  );
}
