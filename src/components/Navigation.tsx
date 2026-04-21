import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowIcon from "./ArrowIcon";

export default function Navigation() {
  const loc = useLocation();
  const navigate = useNavigate();
  const isDemo = loc.pathname === "/demo";

  const scrollToSection = (sectionId: string) => {
    if (loc.pathname !== "/") {
      // Navigate to home first, then scroll after page loads
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // Already on home page — just scroll
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="brand" aria-label="Kaliber Autonomy home">
          <span className="brand-mark" aria-hidden="true">K</span>
          <span>Kaliber Autonomy</span>
        </Link>
        <div className="nav-links">
          <button
            className="nav-link-btn"
            onClick={() => scrollToSection("services")}
            aria-label="Services section"
          >
            Services
          </button>
          <button
            className="nav-link-btn"
            onClick={() => scrollToSection("founding")}
            aria-label="Founding offer section"
          >
            Founding offer
          </button>
          <Link
            to="/demo"
            aria-label="See a demo"
            aria-current={isDemo ? "page" : undefined}
          >
            Demo
          </Link>
          <Link to="/register" className="nav-cta" aria-label="Register your interest">
            Register <ArrowIcon className="arr arr-svg" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
