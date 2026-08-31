import { Fragment } from "react"
import { cssStringToObject as css } from "@/lib/cssToObject"
import { IncubateurExplorer } from "./IncubateurExplorer"

const methodologyBadges = [
  { text: "Diagnostic entrepreneurial", color: "#008748" },
  { text: "Business Mentoring", color: "#00A859" },
  { text: "Formation", color: "#008748" },
  { text: "Digitalisation", color: "#00A859" },
  { text: "Ingénierie financière", color: "#008748" },
  { text: "Accès au financement", color: "#00A859" },
  { text: "Accès aux marchés", color: "#008748" },
]

export function Incubateur() {
  return (
    <section id="incubateur" className="section" style={css("background: var(--bg-surface); padding: 2rem 0;")}>
      <div className="container">
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <span
            className="badge"
            style={css(
              "background: #E8F5E9; color: #008748; border: 1px solid rgba(0, 135, 72, 0.3); font-weight: 700; font-size: 0.8rem; padding: 0.35rem 0.9rem; border-radius: 30px; display: inline-flex; align-items: center; gap: 0.45rem; margin-bottom: 0.6rem;",
            )}
          >
            <i className="fas fa-rocket" /> GRAND PILIER OPÉRATIONNEL I
          </span>
          <h2 style={css("font-size: 1.95rem; margin-bottom: 0.5rem; color: #002B18; font-weight: 800;")}>
            Incubateur-Accélérateur National de l’ESS – <span style={{ color: "#008748" }}>IAN-ESS</span>
          </h2>
          <p style={css("color: #335C49; font-size: 0.925rem; line-height: 1.6; max-width: 820px; margin: 0 auto;")}>
            Le programme stratégique d’incubation et d’accélération territoriale du CONESESS, pour rapprocher accompagnement,
            formation et financement des entreprises ESS à travers <strong>5 modèles complémentaires</strong>.
          </p>
        </div>

        <IncubateurExplorer />

        <div
          style={css(
            "background: #FFFFFF; border: 1px solid #C8E6C9; border-left: 4px solid #008748; padding: 1rem 1.35rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);",
          )}
        >
          <strong style={css("color: #002B18; font-size: 0.925rem; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;")}>
            <i className="fas fa-cogs" style={{ color: "#008748" }} /> Méthodologie d'accompagnement IAN-ESS
          </strong>
          <div style={css("display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;")}>
            {methodologyBadges.map((b, i) => (
              <Fragment key={b.text}>
                <span
                  className="badge"
                  style={{
                    ...css("font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 12px; font-weight: 600;"),
                    background: "#E8F5E9",
                    color: b.color,
                  }}
                >
                  {b.text}
                </span>
                {i < methodologyBadges.length - 1 && (
                  <span style={{ color: b.color, fontWeight: "bold", fontSize: "0.75rem" }}>•</span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
