import { cssStringToObject as css } from "@/lib/cssToObject"

const pipelineSteps = [
  { num: "01", color: "#D4A373", colorBg: "rgba(212, 163, 115, 0.2)", colorBorder: "rgba(212, 163, 115, 0.35)", titleColor: "#D4A373", title: "Production & Transformation", desc: "Normes de qualité et équipements mutualisés." },
  { num: "02", color: "#D4A373", colorBg: "rgba(212, 163, 115, 0.2)", colorBorder: "rgba(212, 163, 115, 0.35)", titleColor: "#D4A373", title: "Financement & Assurance", desc: "Finance éthique, mutuelles et garanties." },
  { num: "03", color: "#00A859", colorBg: "rgba(0, 168, 89, 0.2)", colorBorder: "rgba(0, 168, 89, 0.3)", titleColor: "#FFFFFF", title: "Logistique & Distribution", desc: "Hubs logistiques et plateformes d'achats." },
  { num: "04", color: "#00A859", colorBg: "rgba(0, 168, 89, 0.2)", colorBorder: "rgba(0, 168, 89, 0.3)", titleColor: "#FFFFFF", title: "Accès aux Marchés", desc: "Commande publique et marchés sous-régionaux." },
]

const levers = [
  { icon: "fas fa-boxes", color: "#D4A373", text: "Achats groupés & centrales d'approvisionnement" },
  { icon: "fas fa-tools", color: "#D4A373", text: "Mutualisation d'équipements de production" },
  { icon: "fas fa-warehouse", color: "#D4A373", text: "Plateformes logistiques et stockage partagés" },
  { icon: "fas fa-exchange-alt", color: "#D4A373", text: "Interconnexion Producteurs ➔ Transformateurs" },
  { icon: "fas fa-coins", color: "#00A859", text: "Financements & assurances adaptés" },
  { icon: "fas fa-handshake", color: "#00A859", text: "Partenariats ESS & entreprises classiques" },
  { icon: "fas fa-globe-africa", color: "#00A859", text: "Marchés nationaux & sous-régionaux" },
  { icon: "fas fa-laptop-code", color: "#00A859", text: "Digitalisation & traçabilité des chaînes" },
]

export function ChainesDeValeur() {
  return (
    <section id="chaines-de-valeur" className="section hero-themed-section" style={css("background: var(--bg-surface); padding: 1.75rem 0;")}>
      <div className="container">
        <div
          style={css(
            "background: linear-gradient(135deg, #164E40 0%, #103B31 50%, #0B2922 100%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-lg); padding: 1.75rem 2rem; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25); backdrop-filter: blur(10px); color: #FFFFFF;",
          )}
        >
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <span
              className="badge"
              style={css(
                "background: rgba(212, 163, 115, 0.15); color: #D4A373; border: 1px solid rgba(212, 163, 115, 0.35); font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 20px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;",
              )}
            >
              <i className="fas fa-link" /> Intégration Économique
            </span>
            <h2 style={css("font-size: 1.8rem; margin-bottom: 0.25rem; color: #FFFFFF; font-weight: 800;")}>
              Chaînes de valeur & Opportunités Économiques
            </h2>
            <strong style={css("color: #D4A373; font-size: 0.95rem; display: block; margin-bottom: 0.4rem; font-weight: 700;")}>
              <i className="fas fa-chart-line" style={{ color: "#D4A373" }} /> De la solidarité à la puissance économique collective
            </strong>
            <p className="section-description" style={css("color: rgba(255, 255, 255, 0.92); font-size: 0.875rem; line-height: 1.5; margin: 0 auto; max-width: 850px;")}>
              Le CONESESS favorise les synergies économiques entre membres et construit des passerelles stratégiques avec le
              secteur privé classique, les partenaires financiers et les marchés publics et internationaux.
            </p>
          </div>

          <div
            style={css(
              "background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; backdrop-filter: blur(10px);",
            )}
          >
            <strong style={css("color: #D4A373; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 0.45rem; margin-bottom: 1rem; font-weight: 800; text-align: center;")}>
              <i className="fas fa-project-diagram" style={{ color: "#D4A373" }} /> Une Chaîne de Valeur Complète & Intégrée
            </strong>

            <div className="value-chain-pipeline" style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem;")}>
              {pipelineSteps.map((s) => (
                <div
                  key={s.num}
                  className="dynamic-green-card"
                  style={{
                    ...css("background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 0.85rem; border-radius: 10px; text-align: center;"),
                    borderTop: `3px solid ${s.color}`,
                  }}
                >
                  <div
                    className="dynamic-icon"
                    style={{
                      ...css("width: 32px; height: 32px; border-radius: 50%; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.4rem; font-size: 0.85rem;"),
                      background: s.colorBg,
                      color: s.color,
                      border: `1px solid ${s.colorBorder}`,
                    }}
                  >
                    {s.num}
                  </div>
                  <h3 style={{ ...css("font-size: 0.875rem; font-weight: 700; margin: 0 0 0.25rem 0;"), color: s.titleColor }}>{s.title}</h3>
                  <p style={css("font-size: 0.775rem; color: rgba(255, 255, 255, 0.88); margin: 0; line-height: 1.35;")}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={css("color: #FFFFFF; font-size: 1.1rem; font-weight: 800; margin-bottom: 0.85rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.45rem;")}>
              <i className="fas fa-handshake" style={{ color: "#D4A373" }} /> Huit Leviers de Compétitivité Collective
            </h3>

            <div style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.65rem; margin-bottom: 1.25rem;")}>
              {levers.map((l) => (
                <div
                  key={l.text}
                  className="dynamic-green-card"
                  style={{
                    ...css("background: rgba(255, 255, 255, 0.08); padding: 0.75rem 0.85rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.12); display: flex; align-items: center; gap: 0.6rem;"),
                    borderLeft: `3px solid ${l.color}`,
                  }}
                >
                  <i className={`${l.icon} dynamic-icon`} style={{ color: l.color, fontSize: "1rem", flexShrink: 0 }} />
                  <span style={css("font-size: 0.8rem; color: rgba(255, 255, 255, 0.92); font-weight: 600;")}>{l.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={css("background: rgba(212, 163, 115, 0.12); border: 1px solid rgba(212, 163, 115, 0.35); border-left: 4px solid #D4A373; padding: 1rem 1.25rem; border-radius: 10px; color: #FFFFFF;")}>
            <strong style={css("color: #D4A373; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; margin-bottom: 0.25rem;")}>
              <i className="fas fa-bullseye" /> Notre objectif
            </strong>
            <p style={css("font-size: 0.85rem; color: rgba(255, 255, 255, 0.92); line-height: 1.5; margin: 0;")}>
              Transformer la force collective de l’ESS en opportunités économiques, emplois et création de richesse dans les
              territoires.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
