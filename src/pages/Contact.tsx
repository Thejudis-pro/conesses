import { PublicLayout } from "@/components/layout/PublicLayout"

export default function ContactPage() {
  return (
    <PublicLayout page="contact">
      <section
        className="section hero-themed-section"
        style={{ padding: "4rem 0 4.5rem 0", background: "linear-gradient(135deg, #0A2540 0%, #163B66 60%, #006837 100%)", position: "relative" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 3rem auto" }}>
            <div
              style={{
                background: "rgba(233, 196, 106, 0.18)",
                border: "1.5px solid #E9C46A",
                color: "#E9C46A",
                padding: "0.4rem 1.25rem",
                borderRadius: "30px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
              }}
            >
              <i className="fas fa-certificate" /> SECRÉTARIAT GÉNÉRAL CONFÉDÉRAL • SÉNÉGAL
            </div>
            <h1 style={{ fontSize: "2.5rem", color: "#FFFFFF", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.85rem" }}>
              Contactez le CONESESS Sénégal
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              Cadre National Fédérateur des Entreprises de l'Économie Sociale et Solidaire. Retrouvez ci-dessous nos
              coordonnées officielles directes.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem", maxWidth: "1100px", margin: "0 auto" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                padding: "2rem",
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(37, 211, 102, 0.25)",
                  color: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <i className="fab fa-whatsapp" />
              </div>
              <h3 style={{ color: "#FFFFFF", fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.35rem" }}>Téléphone & WhatsApp</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>Ligne officielle du Secrétariat Général</p>
              <strong style={{ fontSize: "1.25rem", color: "#E9C46A", fontWeight: 800, display: "block", marginBottom: "1.25rem" }}>+221 77 538 66 27</strong>
              <a
                href="https://wa.me/221775386627?text=Bonjour%20CONESESS,%20je%20souhaite%20des%20informations."
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  background: "#25D366",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  padding: "0.65rem 1.35rem",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "none",
                  marginTop: "auto",
                }}
              >
                <i className="fab fa-whatsapp" /> Discuter sur WhatsApp
              </a>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                padding: "2rem",
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(233, 196, 106, 0.25)",
                  color: "#E9C46A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  marginBottom: "1.25rem",
                }}
              >
                <i className="fas fa-envelope-open-text" />
              </div>
              <h3 style={{ color: "#FFFFFF", fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.35rem" }}>Adresse Courriel</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>Courrier électronique officiel</p>
              <strong style={{ fontSize: "1.15rem", color: "#E9C46A", fontWeight: 800, display: "block", marginBottom: "1.25rem" }}>contact@conesess.sn</strong>
              <a
                href="mailto:contact@conesess.sn"
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#FFFFFF",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  fontWeight: 700,
                  padding: "0.65rem 1.35rem",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "auto",
                }}
              >
                <i className="fas fa-envelope" /> Envoyer un e-mail
              </a>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                padding: "2rem",
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(0, 255, 136, 0.25)",
                  color: "#00FF88",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  marginBottom: "1.25rem",
                }}
              >
                <i className="fas fa-map-marked-alt" />
              </div>
              <h3 style={{ color: "#FFFFFF", fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.35rem" }}>Siège Confédéral</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>Présidence & Secrétariat Général</p>
              <strong style={{ fontSize: "1.05rem", color: "#FFFFFF", fontWeight: 800, display: "block", marginBottom: "0.35rem" }}>Dakar, Sénégal</strong>
              <small style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginTop: "auto" }}>Lundi - Vendredi : 08h00 - 17h00</small>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
