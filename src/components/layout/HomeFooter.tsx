import { Link } from "react-router-dom"
import logo from "@/assets/images/logo.jpg"
import { buildGmailComposeUrl } from "@/lib/gmail"
import { useSameOriginHashClick } from "@/lib/useSectionScroll"

/** `.footer` on index.html — the "big" variant with the top CTA banner. */
export function HomeFooter() {
  const onHashClick = useSameOriginHashClick()

  return (
    <footer
      className="footer"
      style={{ background: "var(--primary-navy)", color: "#FFFFFF", padding: "2.75rem 0 1.5rem 0", borderTop: "4px solid var(--primary-green)" }}
    >
      <div className="container">
        {/* Top CTA Banner */}
        <div
          className="footer-top-cta"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "1.25rem 1.75rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fas fa-hands-helping" style={{ color: "var(--accent-gold)" }} /> Dynamique Nationale de l'ESS au Sénégal
            </h4>
            <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.9rem", margin: 0 }}>
              Rejoignez la Confédération Nationale des Entreprises de l’Économie Sociale et Solidaire.
            </p>
          </div>
          <Link
            to="/adhesion"
            className="btn btn-primary"
            style={{
              background: "var(--primary-green)",
              color: "#FFFFFF",
              fontWeight: 700,
              border: "none",
              padding: "0.65rem 1.25rem",
              fontSize: "0.925rem",
              borderRadius: "8px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <i className="fas fa-id-card" /> Rejoindre le CONESESS
          </Link>
        </div>

        {/* Main Footer Grid (2 Columns Desktop / 1 Column Mobile) */}
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "3rem", justifyContent: "space-between", marginBottom: "2.25rem" }}>
          {/* Brand Col */}
          <div className="footer-col-brand">
            <div className="logo-brand mb-3" style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <img src={logo} alt="CONESESS Logo" style={{ width: "52px", height: "52px", borderRadius: "50%", border: "2px solid var(--accent-gold)", flexShrink: 0 }} />
              <div>
                <span style={{ color: "#FFFFFF", fontSize: "1.45rem", fontWeight: 800, display: "block", lineHeight: 1.1, letterSpacing: "-0.01em" }}>CONESESS</span>
                <span style={{ color: "#E9C46A", fontSize: "0.775rem", fontWeight: 800, letterSpacing: "0.08em", display: "block", marginTop: "0.15rem" }}>SÉNÉGAL</span>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", lineHeight: 1.55, color: "rgba(255, 255, 255, 0.92)", marginBottom: "0.85rem" }} className="footer-brand-desc">
              <strong style={{ color: "#FFFFFF", fontSize: "0.95rem" }}>Confédération Nationale des Entreprises de l’Économie Sociale et Solidaire du Sénégal</strong>
              <br />
              <span style={{ color: "rgba(255, 255, 255, 0.82)" }}>Cadre national fédérateur des entreprises de l’ESS.</span>
            </p>

            <div
              className="footer-motto-pill mb-3"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                padding: "0.45rem 0.95rem",
                borderRadius: "30px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#E9C46A",
                fontWeight: 700,
                fontSize: "0.8rem",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.05)",
              }}
            >
              Représenter • Fédérer • Structurer • Accélérer
            </div>

            <div style={{ display: "flex", gap: "0.85rem", marginTop: "0.5rem" }} className="footer-social-links">
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.15rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="Facebook">
                <i className="fab fa-facebook" />
              </a>
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.15rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="Twitter">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.15rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="LinkedIn">
                <i className="fab fa-linkedin" />
              </a>
              <a href="#" style={{ color: "#FFFFFF", fontSize: "1.15rem", opacity: 0.85, transition: "opacity 0.2s" }} aria-label="YouTube">
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>

          {/* Contact Direct Column */}
          <div className="footer-col-contact">
            <h4 style={{ color: "#FFFFFF", fontSize: "1.05rem", fontWeight: 700, marginBottom: "1rem", borderBottom: "2px solid #E9C46A", paddingBottom: "0.4rem", display: "inline-block" }}>
              Secrétariat Général
            </h4>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.88)", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fas fa-map-marker-alt" style={{ color: "#E9C46A" }} /> Dakar, République du Sénégal
            </p>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.88)", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fas fa-envelope" style={{ color: "#E9C46A" }} />{" "}
              <a href={buildGmailComposeUrl({ to: "contact@conesess.sn" })} target="_blank" rel="noopener noreferrer" style={{ color: "#FFFFFF", textDecoration: "none" }}>
                contact@conesess.sn
              </a>
            </p>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.88)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fab fa-whatsapp" style={{ color: "#25D366", fontSize: "1.1rem" }} />{" "}
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
            fontSize: "0.825rem",
            color: "rgba(255, 255, 255, 0.75)",
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; 2026 <strong>CONESESS</strong> - Confédération Nationale des Entreprises de l'ESS du Sénégal. Tous droits réservés. |{" "}
            <Link to="/admin" style={{ color: "#E9C46A", fontWeight: 600, textDecoration: "underline" }}>
              <i className="fas fa-lock" /> Espace Administration
            </Link>
          </p>
          <a
            href="#accueil"
            style={{ margin: 0, color: "#E9C46A", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}
            onClick={(e) => onHashClick(e, "#accueil")}
          >
            <i className="fas fa-arrow-up" /> Retour en haut
          </a>
        </div>
      </div>
    </footer>
  )
}
