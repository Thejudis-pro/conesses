import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import logo from "@/assets/images/logo.jpg"

export type Page = "home" | "adhesion" | "candidature" | "contact" | "gouvernance" | "poles-action"

interface SiteHeaderProps {
  page: Page
  onToggleMobileNav: () => void
}

/**
 * Reproduces `.main-header` / `.navbar` from every public page.
 * Every top-level item is now a real route (no more anchor/dropdown
 * scroll-links), so "active" is just a direct `page === "..."` check.
 */
export function SiteHeader({ page, onToggleMobileNav }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinkClass = (id: Page) => `nav-link${page === id ? " active" : ""}`

  return (
    <header className={`main-header${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <nav className="navbar">
          {page === "home" ? (
            <Link to="/" className="logo-brand">
              <img src={logo} alt="Logo CONESESS" className="logo-img" />
              <div className="logo-text">
                <span className="logo-title">CONESESS</span>
                <span className="logo-subtitle">Cadre national fédérateur des entreprises de l’ESS</span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--accent-gold)",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    display: "block",
                    marginTop: "0.1rem",
                  }}
                >
                  Représenter • Fédérer • Structurer • Accélérer
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/" className="logo-brand">
              <img src={logo} alt="Logo CONESESS" className="logo-img" />
              <div className="logo-text">
                <span className="logo-title">CONESESS</span>
                <span className="logo-subtitle">CADRE NATIONAL FÉDÉRATEUR DES ENTREPRISES DE L'ESS DU SÉNÉGAL</span>
              </div>
            </Link>
          )}

          <ul className="nav-menu">
            <li>
              <Link to="/" className={navLinkClass("home")}>
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/gouvernance" className={navLinkClass("gouvernance")}>
                Gouvernance
              </Link>
            </li>
            <li>
              <Link to="/poles-action" className={navLinkClass("poles-action")}>
                Pôles & Action
              </Link>
            </li>

            {page === "adhesion" && (
              <li>
                <Link to="/adhesion" className={navLinkClass("adhesion")}>
                  Rejoindre
                </Link>
              </li>
            )}
            <li>
              <Link to="/candidature" className={navLinkClass("candidature")}>
                Candidature Comité
              </Link>
            </li>
            <li>
              <Link to="/contact" className={navLinkClass("contact")}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="nav-cta">
            {page !== "adhesion" && (
              <Link to="/adhesion" className="btn btn-primary btn-sm nav-cta-join desktop-only-btn">
                <i className="fas fa-id-card" /> Rejoindre
              </Link>
            )}
            <button className="mobile-toggle" aria-label="Toggle Menu" onClick={onToggleMobileNav}>
              <i className="fas fa-bars" />
              <span>Menu</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
