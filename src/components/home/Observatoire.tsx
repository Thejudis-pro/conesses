import { cssStringToObject as css } from "@/lib/cssToObject"

const missions = [
  { n: "1. Cartographier", desc: "Cartographier les acteurs et filières de l’ESS.", border: "#D4A373" },
  { n: "2. Mesurer l'impact", desc: "Mesurer la contribution à l’emploi et au développement territorial.", border: "#D4A373" },
  { n: "3. Analyser les besoins", desc: "Analyser les besoins de financement et de formation.", border: "#D4A373" },
  { n: "4. Études & Baromètres", desc: "Produire études, baromètres et notes de conjoncture.", border: "#D4A373" },
  { n: "5. Partenariats", desc: "Partenariats avec universités, centres et institutions publiques.", border: "#00A859" },
  { n: "6. Labellisation ESS", desc: "Normes, référentiels et labellisation de l'ESS.", border: "#00A859" },
]

export function Observatoire() {
  return (
    <section id="observatoire" className="section observatory-section" style={css("background: var(--bg-surface); padding: 1.75rem 0;")}>
      <div className="container">
        <div
          style={css(
            "background: linear-gradient(135deg, #164E40 0%, #103B31 50%, #0B2922 100%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-lg); padding: 1.5rem 1.85rem; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25); backdrop-filter: blur(10px); color: #FFFFFF;",
          )}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <span
              className="badge"
              style={css(
                "background: rgba(212, 163, 115, 0.15); color: #D4A373; border: 1px solid rgba(212, 163, 115, 0.35); font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 20px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;",
              )}
            >
              <i className="fas fa-chart-line" /> Grand Pilier Opérationnel II
            </span>
            <h2 style={css("font-size: 1.7rem; margin-bottom: 0.25rem; color: #FFFFFF; font-weight: 800;")}>
              Observatoire National de l’Économie Sociale et Solidaire – ON-ESS
            </h2>
            <strong style={css("color: #D4A373; font-size: 0.95rem; display: block; margin-bottom: 0.35rem; font-weight: 700;")}>
              <i className="fas fa-search" style={{ color: "#D4A373" }} /> Comprendre, mesurer et anticiper
            </strong>
            <p style={css("color: rgba(255, 255, 255, 0.9); font-size: 0.875rem; line-height: 1.5; margin: 0;")}>
              Produire et consolider des données fiables pour mieux connaître les entreprises ESS, leurs besoins et leur
              contribution économique et sociale au Sénégal.
            </p>
          </div>

          <div className="context-grid" style={css("display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.25rem; align-items: stretch; margin-bottom: 1rem;")}>
            <div
              style={css(
                "background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.15rem; border-radius: var(--radius-md); display: flex; flex-direction: column; justify-content: space-between;",
              )}
            >
              <strong style={css("color: #FFFFFF; font-size: 0.95rem; display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.85rem; font-weight: 700;")}>
                <i className="fas fa-tasks" style={{ color: "#D4A373" }} /> Ses principales missions
              </strong>

              <div style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.65rem;")}>
                {missions.map((m) => (
                  <div
                    key={m.n}
                    className="dynamic-green-card"
                    style={{
                      ...css("background: rgba(255, 255, 255, 0.08); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.12);"),
                      borderLeft: `3px solid ${m.border}`,
                    }}
                  >
                    <strong style={css("color: #D4A373; font-size: 0.815rem; display: block; margin-bottom: 0.2rem;")}>{m.n}</strong>
                    <p style={css("font-size: 0.765rem; color: rgba(255, 255, 255, 0.88); margin: 0; line-height: 1.35;")}>{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={css(
                "background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); padding: 1.15rem; border-radius: var(--radius-md); display: flex; flex-direction: column; justify-content: space-between;",
              )}
            >
              <strong style={css("color: #FFFFFF; font-size: 0.95rem; display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.85rem; font-weight: 700;")}>
                <i className="fas fa-sitemap" style={{ color: "#D4A373" }} /> Architecture territoriale envisagée
              </strong>

              <div style={css("display: flex; flex-direction: column; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem;")}>
                <div
                  className="dynamic-green-card"
                  style={css(
                    "background: rgba(212, 163, 115, 0.12); border: 1px solid #D4A373; width: 100%; text-align: center; padding: 0.6rem 0.85rem; border-radius: 8px; font-weight: 700; color: #D4A373; font-size: 0.825rem;",
                  )}
                >
                  <i className="fas fa-map-marker-alt" /> Relais territoriaux
                </div>

                <div style={{ color: "#D4A373", fontSize: "0.75rem" }}>
                  <i className="fas fa-arrow-down" />
                </div>

                <div
                  className="dynamic-green-card"
                  style={css(
                    "background: rgba(212, 163, 115, 0.18); border: 1px solid #D4A373; width: 100%; text-align: center; padding: 0.6rem 0.85rem; border-radius: 8px; font-weight: 700; color: #D4A373; font-size: 0.825rem;",
                  )}
                >
                  <i className="fas fa-network-wired" /> Coordination régionale
                </div>

                <div style={{ color: "#D4A373", fontSize: "0.75rem" }}>
                  <i className="fas fa-arrow-down" />
                </div>

                <div
                  className="dynamic-green-card"
                  style={css(
                    "background: #00A859; border: 1px solid #00A859; width: 100%; text-align: center; padding: 0.6rem 0.85rem; border-radius: 8px; font-weight: 700; color: #FFFFFF; font-size: 0.825rem; box-shadow: 0 4px 15px rgba(0, 168, 89, 0.3);",
                  )}
                >
                  <i className="fas fa-chart-line" style={{ color: "#FFFFFF" }} /> Observatoire national
                </div>
              </div>

              <div style={css("background: rgba(255, 255, 255, 0.08); border-radius: var(--radius-md); padding: 0.65rem 0.85rem; border-left: 3px solid #D4A373; border: 1px solid rgba(255, 255, 255, 0.12);")}>
                <p style={css("font-size: 0.775rem; color: rgba(255, 255, 255, 0.88); line-height: 1.4; margin: 0;")}>
                  <i className="fas fa-info-circle" style={{ color: "#D4A373" }} /> Remontée progressive des informations
                  économiques depuis les territoires vers le niveau national.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
