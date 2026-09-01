import { useEffect } from "react"
import { Link } from "react-router-dom"
import logo from "@/assets/images/logo.jpg"
import type { Page } from "./SiteHeader"

interface MobileNavDrawerProps {
  page: Page
  isOpen: boolean
  onClose: () => void
}

/**
 * Reproduces `.mobile-nav-drawer` for all public pages. The brand
 * block (3 lines on home vs 2 on subpages) and footer WhatsApp pill
 * (present everywhere except adhesion.html in the original) are kept
 * exactly as they were, not "fixed" for consistency.
 */
export function MobileNavDrawer({ page, isOpen, onClose }: MobileNavDrawerProps) {
  const isHome = page === "home"

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <div className={`mobile-nav-overlay${isOpen ? " active" : ""}`} onClick={onClose} />
      <aside className={`mobile-nav-drawer${isOpen ? " active" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <img src={logo} alt="Logo CONESESS" className="logo-img" />
            {isHome ? (
              <div>
                <strong style={{ color: "#FFFFFF", fontSize: "1.05rem", display: "block" }}>CONESESS</strong>
                <small style={{ color: "var(--accent-gold)", fontSize: "0.68rem", display: "block" }}>
                  Cadre national fédérateur des entreprises de l’ESS
                </small>
                <small style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.6rem", display: "block", fontWeight: 600 }}>
                  Représenter • Fédérer • Structurer • Accélérer
                </small>
              </div>
            ) : (
              <div>
                <strong style={{ color: "#FFFFFF", fontSize: "1.05rem", display: "block" }}>CONESESS</strong>
                <small style={{ color: "var(--accent-gold)", fontSize: "0.68rem" }}>Cadre National Fédérateur ESS Sénégal</small>
              </div>
            )}
          </div>
          <button className="mobile-drawer-close" aria-label="Fermer le menu" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="mobile-drawer-body">
          <nav className="mobile-drawer-links">
            <div className="mobile-drawer-section-title">
              <i className="fas fa-compass" /> PRÉSENTATION & STRATÉGIE
            </div>
            <Link to="/" className={`mobile-nav-item${isHome ? " active" : ""}`} onClick={onClose}>
              <i className="fas fa-home" /> <span>Accueil</span>
            </Link>
            <Link to="/actualites" className={`mobile-nav-item${page === "actualites" ? " active" : ""}`} onClick={onClose}>
              <i className="fas fa-newspaper" /> <span>Actualités</span>
            </Link>

            <div className="mobile-drawer-section-title">
              <i className="fas fa-sitemap" /> GOUVERNANCE & PILIERS
            </div>
            <Link to="/gouvernance" className={`mobile-nav-item${page === "gouvernance" ? " active" : ""}`} onClick={onClose}>
              <i className="fas fa-sitemap" /> <span>Gouvernance</span>
            </Link>

            <div className="mobile-drawer-section-title">
              <i className="fas fa-network-wired" /> PÔLES & PARTENARIATS
            </div>
            <Link to="/poles-action" className={`mobile-nav-item${page === "poles-action" ? " active" : ""}`} onClick={onClose}>
              <i className="fas fa-th-large" /> <span>Pôles & Action</span>
            </Link>

            <div className="mobile-drawer-section-title">
              <i className="fas fa-paper-plane" /> FORMULAIRES & ACCÈS
            </div>
            <Link
              to="/adhesion"
              className={`mobile-nav-item${page === "adhesion" ? " active" : ""}`}
              onClick={onClose}
            >
              <i className="fas fa-id-card" /> <span>Rejoindre le CONESESS</span>
            </Link>
            <Link
              to="/candidature"
              className={`mobile-nav-item${page === "candidature" ? " active" : ""}`}
              onClick={onClose}
            >
              <i className="fas fa-users-cog" /> <span>Candidature Comité de Pilotage</span>
            </Link>
            <Link
              to="/contact"
              className={`mobile-nav-item${page === "contact" ? " active" : ""}`}
              onClick={onClose}
            >
              <i className="fas fa-envelope" /> <span>Contact Officiel</span>
            </Link>
            <Link to="/admin" className="mobile-nav-item" style={{ color: "#E9C46A" }} onClick={onClose}>
              <i className="fas fa-lock" /> <span>Espace Administration</span>
            </Link>
          </nav>
        </div>

        {page !== "adhesion" && (
          <div className="mobile-drawer-footer">
            <a
              href="https://wa.me/221775386627?text=Bonjour%20CONESESS,%20je%20souhaite%20des%20informations."
              target="_blank"
              rel="noreferrer"
              className="mobile-contact-pill"
            >
              <i className="fab fa-whatsapp" /> <span>WhatsApp Direct : +221 77 538 66 27</span>
            </a>
          </div>
        )}
      </aside>
    </>
  )
}
