import { cssStringToObject as css } from "@/lib/cssToObject"

const piliers = [
  {
    n: "01",
    numBg: "var(--accent-soft-gold)",
    numColor: "#D97706",
    borderColor: "var(--accent-gold)",
    title: "Représenter et défendre",
    desc: "Porter les intérêts et propositions des entreprises ESS auprès des pouvoirs publics et partenaires.",
  },
  {
    n: "02",
    numBg: "var(--accent-soft-green)",
    numColor: "var(--primary-green)",
    borderColor: "var(--primary-green)",
    title: "Structurer les filières",
    desc: "Organiser des chaînes de valeur inclusives reliant production, transformation, financement et marchés.",
  },
  {
    n: "03",
    numBg: "rgba(10, 37, 64, 0.1)",
    numColor: "var(--primary-navy)",
    borderColor: "var(--primary-navy)",
    title: "Renforcer la performance",
    desc: "Accompagner la professionnalisation via l’incubation, la digitalisation et l’innovation.",
  },
  {
    n: "04",
    numBg: "rgba(42, 157, 143, 0.15)",
    numColor: "#2A9D8F",
    borderColor: "#2A9D8F",
    title: "Mutualiser & Créer des opportunités",
    desc: "Encourager les achats groupés, équipements partagés et l’accès commun aux grands marchés.",
  },
]

export function Vision() {
  return (
    <section id="vision" className="section" style={css("background: var(--bg-surface); padding: 2.25rem 0;")}>
      <div className="container">
        <div style={css("background: var(--bg-alt); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2rem 2.25rem; box-shadow: var(--shadow-sm);")}>
          <div
            style={css(
              "margin-bottom: 2rem; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1.5rem; border-bottom: 2px solid var(--border-light); padding-bottom: 1.5rem;",
            )}
          >
            <div style={css("max-width: 480px;")}>
              <span className="badge badge-gold mb-2">
                <i className="fas fa-compass" /> Cap Stratégique & Ligne Directrice
              </span>
              <h2 style={css("color: var(--primary-navy); font-size: 2rem; margin-bottom: 0; font-weight: 800;")}>
                Vision, Ambition & Piliers d'Action
              </h2>
            </div>
            <p style={css("color: var(--text-muted); font-size: 0.95rem; max-width: 400px; margin: 0; line-height: 1.6; text-align: left;")}>
              Un cap clair pour transformer l’Économie Sociale et Solidaire en un moteur stratégique de souveraineté et de
              croissance au Sénégal.
            </p>
          </div>

          <div
            className="context-split-grid"
            style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem; align-items: stretch;")}
          >
            <div
              style={css(
                "background: linear-gradient(135deg, rgba(10, 37, 64, 0.92) 0%, rgba(22, 59, 102, 0.88) 100%); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); color: #FFFFFF; padding: 2rem; border-radius: var(--radius-md); border-top: 4px solid var(--accent-gold); box-shadow: var(--shadow-md); position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;",
              )}
            >
              <div style={css("position: absolute; top: -20px; right: -20px; font-size: 8rem; color: rgba(255, 255, 255, 0.04); pointer-events: none;")}>
                <i className="fas fa-compass" />
              </div>

              <div>
                <div
                  style={css(
                    "display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(233, 196, 106, 0.15); border: 1px solid rgba(233, 196, 106, 0.4); padding: 0.35rem 0.85rem; border-radius: 30px; color: #E9C46A; font-weight: 700; font-size: 0.85rem; margin-bottom: 1.25rem;",
                  )}
                >
                  <i className="fas fa-eye" /> Notre Vision Stratégique
                </div>

                <h3 style={css("color: #FFFFFF; font-size: 1.3rem; font-weight: 800; margin-bottom: 0.85rem; line-height: 1.35;")}>
                  Faire du CONESESS la référence patronale de l'ESS au Sénégal
                </h3>

                <p style={css("font-size: 0.95rem; line-height: 1.65; color: rgba(255, 255, 255, 0.95); margin-bottom: 1rem; font-weight: 500;")}>
                  Bâtir un cadre national d’intégration, de concertation, de coopération économique et d'accélération pour
                  toutes les entreprises de l’Économie Sociale et Solidaire.
                </p>
              </div>

              <div style={css("background: rgba(0, 104, 55, 0.45); border: 1px solid rgba(42, 157, 143, 0.45); border-left: 3px solid #2A9D8F; padding: 1rem 1.15rem; border-radius: 10px; margin-top: 1.5rem;")}>
                <strong style={css("color: #E9C46A; display: block; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.25rem; letter-spacing: 0.03em;")}>
                  <i className="fas fa-compass" /> Notre Ligne Directrice
                </strong>
                <p style={css("font-size: 0.85rem; color: #FFFFFF; margin: 0; line-height: 1.5;")}>
                  Faire de l’ESS non seulement un outil d'inclusion sociale, mais un véritable levier de production, de
                  création massive d’emplois durables et de développement territorial équilibré.
                </p>
              </div>
            </div>

            <div
              style={css(
                "background: #FFFFFF; border: 1px solid var(--border-light); border-top: 4px solid var(--primary-green); padding: 1.85rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;",
              )}
            >
              <div>
                <div style={css("display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;")}>
                  <h3 style={css("color: var(--primary-navy); font-size: 1.25rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;")}>
                    <i className="fas fa-cubes" style={css("color: var(--primary-green);")} /> Quatre Piliers d'Action
                  </h3>
                  <span style={css("font-size: 0.75rem; font-weight: 700; color: var(--primary-green); background: var(--accent-soft-green); padding: 0.25rem 0.65rem; border-radius: 20px;")}>
                    Axes Stratégiques
                  </span>
                </div>

                <div style={css("display: flex; flex-direction: column; gap: 0.85rem;")}>
                  {piliers.map((p) => (
                    <div
                      key={p.n}
                      style={{
                        ...css("background: var(--bg-surface); border: 1px solid var(--border-light); padding: 0.85rem 1rem; border-radius: 8px; display: flex; align-items: flex-start; gap: 0.85rem;"),
                        borderLeft: `3px solid ${p.borderColor}`,
                      }}
                    >
                      <div
                        style={{
                          ...css("width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 800; flex-shrink: 0;"),
                          background: p.numBg,
                          color: p.numColor,
                        }}
                      >
                        {p.n}
                      </div>
                      <div>
                        <h4 style={css("color: var(--primary-navy); font-size: 0.925rem; font-weight: 700; margin: 0 0 0.2rem 0; text-align: left;")}>{p.title}</h4>
                        <p style={css("font-size: 0.815rem; color: var(--text-body); margin: 0; line-height: 1.45; text-align: left;")}>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
