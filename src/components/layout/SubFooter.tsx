import { Link } from "react-router-dom"
import logo from "@/assets/images/logo.jpg"
import { buildGmailComposeUrl } from "@/lib/gmail"
import type { Page } from "./SiteHeader"

interface FooterNavLink {
  to: string
  label: string
  icon: string
  gold?: boolean
}

// Reproduces the ORIGINAL per-page inconsistency exactly: adhesion.html and
// contact.html share one footer nav-link list (with "Gouvernance"),
// candidature.html has a different one (no "Gouvernance", 2 extra gold
// links) — this is preserved literally rather than "fixed" for consistency.
const FOOTER_NAV_LINKS: Record<Exclude<Page, "home">, FooterNavLink[]> = {
  adhesion: [
    { to: "/", label: "Accueil", icon: "fas fa-chevron-right" },
    { to: "/#contexte", label: "Contexte", icon: "fas fa-chevron-right" },
    { to: "/#vision", label: "Vision", icon: "fas fa-chevron-right" },
    { to: "/gouvernance", label: "Gouvernance", icon: "fas fa-chevron-right" },
    { to: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ],
  contact: [
    { to: "/", label: "Accueil", icon: "fas fa-chevron-right" },
    { to: "/#contexte", label: "Contexte", icon: "fas fa-chevron-right" },
    { to: "/#vision", label: "Vision", icon: "fas fa-chevron-right" },
    { to: "/gouvernance", label: "Gouvernance", icon: "fas fa-chevron-right" },
    { to: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ],
  candidature: [
    { to: "/", label: "Accueil", icon: "fas fa-chevron-right" },
    { to: "/#contexte", label: "Contexte", icon: "fas fa-chevron-right" },
    { to: "/#vision", label: "Vision", icon: "fas fa-chevron-right" },
    { to: "/adhesion", label: "Formulaire Adhésion", icon: "fas fa-id-card", gold: true },
    { to: "/candidature", label: "Candidature Comité", icon: "fas fa-users-cog", gold: true },
    { to: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ],
  gouvernance: [
    { to: "/", label: "Accueil", icon: "fas fa-chevron-right" },
    { to: "/#contexte", label: "Contexte", icon: "fas fa-chevron-right" },
    { to: "/#vision", label: "Vision", icon: "fas fa-chevron-right" },
    { to: "/poles-action", label: "Pôles & Action", icon: "fas fa-chevron-right" },
    { to: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ],
  "poles-action": [
    { to: "/", label: "Accueil", icon: "fas fa-chevron-right" },
    { to: "/#contexte", label: "Contexte", icon: "fas fa-chevron-right" },
    { to: "/#vision", label: "Vision", icon: "fas fa-chevron-right" },
    { to: "/gouvernance", label: "Gouvernance", icon: "fas fa-chevron-right" },
    { to: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ],
  actualites: [
    { to: "/", label: "Accueil", icon: "fas fa-chevron-right" },
    { to: "/gouvernance", label: "Gouvernance", icon: "fas fa-chevron-right" },
    { to: "/poles-action", label: "Pôles & Action", icon: "fas fa-chevron-right" },
    { to: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ],
}

/** `.footer` on adhesion.html / candidature.html / contact.html (the simpler variant). */
export function SubFooter({ page }: { page: Exclude<Page, "home"> }) {
  const links = FOOTER_NAV_LINKS[page]

  return (
    <footer
      className="footer"
      style={{ background: "var(--primary-navy)", color: "#FFFFFF", padding: "2.75rem 0 1.5rem 0", borderTop: "4px solid var(--primary-green)", overflowX: "hidden" }}
    >
      <div className="container" style={{ maxWidth: "1200px", paddingLeft: "1.25rem", paddingRight: "1.25rem" }}>
        <div
          className="footer-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", justifyContent: "space-between", marginBottom: "2rem" }}
        >
          {/* Brand & Navigation Col */}
          <div className="footer-col-brand" style={{ maxWidth: "100%" }}>
            <div className="logo-brand mb-3" style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <img src={logo} alt="CONESESS Logo" style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid var(--accent-gold)", flexShrink: 0 }} />
              <div>
                <span style={{ color: "#FFFFFF", fontSize: "1.35rem", fontWeight: 800, display: "block", lineHeight: 1.1 }}>CONESESS</span>
                <span style={{ color: "#E9C46A", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", display: "block", marginTop: "0.15rem" }}>SÉNÉGAL</span>
              </div>
            </div>

            <p style={{ fontSize: "0.875rem", lineHeight: 1.55, color: "rgba(255, 255, 255, 0.92)", marginBottom: "0.85rem" }} className="footer-brand-desc">
              <strong style={{ color: "#FFFFFF", fontSize: "0.9rem" }}>Confédération Nationale des Entreprises de l’Économie Sociale et Solidaire du Sénégal</strong>
              <br />
              <span style={{ color: "rgba(255, 255, 255, 0.82)" }}>Cadre national fédérateur des entreprises de l’ESS.</span>
            </p>

            <div
              className="footer-motto-pill mb-3"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                padding: "0.4rem 0.85rem",
                borderRadius: "30px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#E9C46A",
                fontWeight: 700,
                fontSize: "0.775rem",
              }}
            >
              Représenter • Fédérer • Structurer • Accélérer
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.6rem 1rem", fontSize: "0.825rem" }}>
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      style={link.gold ? { color: "#E9C46A", textDecoration: "none", fontWeight: 700 } : { color: "rgba(255,255,255,0.85)", textDecoration: "none" }}
                    >
                      <i className={link.icon} style={{ color: "#E9C46A", fontSize: "0.65rem", marginRight: "0.3rem" }} /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", gap: "0.85rem", marginTop: "0.5rem" }} className="footer-social-links">
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.1rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="Facebook">
                <i className="fab fa-facebook" />
              </a>
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.1rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="Twitter">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.1rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="LinkedIn">
                <i className="fab fa-linkedin" />
              </a>
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.1rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="YouTube">
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>

          {/* Contact Direct Column */}
          <div className="footer-col-contact" style={{ maxWidth: "100%" }}>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 700, marginBottom: "0.85rem", borderBottom: "2px solid #E9C46A", paddingBottom: "0.35rem", display: "inline-block" }}>
              Secrétariat Général
            </h4>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.88)", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fas fa-map-marker-alt" style={{ color: "#E9C46A" }} /> Dakar, République du Sénégal
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.88)", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fas fa-envelope" style={{ color: "#E9C46A" }} />{" "}
              <a href={buildGmailComposeUrl({ to: "contact@conesess.sn" })} target="_blank" rel="noopener noreferrer" style={{ color: "#FFFFFF", textDecoration: "none" }}>
                contact@conesess.sn
              </a>
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.88)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fab fa-whatsapp" style={{ color: "#25D366", fontSize: "1.05rem" }} />{" "}
              <a href="https://wa.me/221775386627" target="_blank" rel="noreferrer" style={{ color: "#FFFFFF", textDecoration: "none", fontWeight: 700 }}>
                +221 77 538 66 27
              </a>
            </p>
          </div>
        </div>

        {/* Footer Sub-Bottom */}
        <div
          className="footer-bottom"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.75)",
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; 2026 <strong>CONESESS</strong> - Confédération Nationale des Entreprises de l'ESS du Sénégal. Tous droits réservés. |{" "}
            <Link to="/admin" style={{ color: "#E9C46A", fontWeight: 600, textDecoration: "underline" }}>
              <i className="fas fa-lock" /> Espace Administration
            </Link>
          </p>
          <a href="#" style={{ margin: 0, color: "#E9C46A", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <i className="fas fa-arrow-up" /> Retour en haut
          </a>
        </div>
      </div>
    </footer>
  )
}
