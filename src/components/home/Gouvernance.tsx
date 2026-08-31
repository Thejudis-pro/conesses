import { cssStringToObject as css } from "@/lib/cssToObject"

const organes = [
  {
    icon: "fas fa-sitemap",
    iconColor: "#A8E6CF",
    borderTop: "#A8E6CF",
    title: "Conseil d’Administration",
    tag: "Orientation",
    desc: "Assure l'orientation stratégique, valide les orientations et contrôle l'exécution des décisions de l'AG.",
  },
  {
    icon: "fas fa-briefcase",
    iconColor: "#E8F5E9",
    borderTop: "#E8F5E9",
    title: "Bureau Exécutif",
    tag: "Pilotage",
    desc: "Assure le pilotage politique, la représentation institutionnelle et le suivi opérationnel permanent.",
  },
  {
    icon: "fas fa-user-shield",
    iconColor: "#A8E6CF",
    borderTop: "#A8E6CF",
    title: "Secrétariat Général",
    tag: "Gestion",
    desc: "Gère l'administration quotidienne, coordonne les commissions techniques et exécute les programmes.",
  },
  {
    icon: "fas fa-network-wired",
    iconColor: "#E8F5E9",
    borderTop: "#E8F5E9",
    title: "Pôles & Territoires",
    tag: "Action Terrain",
    desc: "Anime les filières économiques et meuble l'ancrage régional au plus près des entreprises de l'ESS.",
  },
]

export function Gouvernance() {
  return (
    <section id="gouvernance" className="section hero-themed-section" style={css("padding: 2rem 0;")}>
      <div className="container">
        <div
          style={css(
            "background: linear-gradient(135deg, #3E6E5A 0%, #325848 100%); border-radius: var(--radius-lg); padding: 2.25rem 2.5rem; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 15px 35px rgba(50, 88, 72, 0.25); color: #FFFFFF;",
          )}
        >
          <div style={css("margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;")}>
            <div
              style={css(
                "width: 64px; height: 64px; border-radius: 16px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; color: #FFFFFF; flex-shrink: 0;",
              )}
            >
              <i className="fas fa-sitemap" />
            </div>
            <div style={css("flex: 1; min-width: 260px;")}>
              <span
                className="badge"
                style={css(
                  "background: rgba(255, 255, 255, 0.15); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.3); font-weight: 700; font-size: 0.8rem; padding: 0.35rem 0.9rem; border-radius: 30px; display: inline-flex; align-items: center; gap: 0.45rem; margin-bottom: 0.4rem;",
                )}
              >
                ARCHITECTURE & GOUVERNANCE INSTITUTIONNELLE
              </span>
              <h2 style={css("color: #FFFFFF; font-size: 1.95rem; margin: 0; font-weight: 800;")}>
                Une gouvernance <span style={{ color: "#A8E6CF" }}>démocratique</span> & <span style={{ color: "#E8F5E9" }}>structurée</span>
              </h2>
            </div>
          </div>
          <p style={css("color: rgba(255, 255, 255, 0.92); font-size: 0.925rem; max-width: 850px; margin: 0 0 1.75rem 0; line-height: 1.55;")}>
            Structure organique du CONESESS conciliant démocratie participative, transparence et efficacité opérationnelle.
          </p>

          <div style={css("display: flex; flex-direction: column; gap: 1.15rem;")}>
            <div
              className="dynamic-green-card"
              style={css(
                "background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.22); border-top: 4px solid #A8E6CF; padding: 1.25rem 1.5rem; border-radius: var(--radius-md); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: space-between; gap: 1.15rem; flex-wrap: wrap;",
              )}
            >
              <div style={css("display: flex; align-items: center; gap: 1.15rem;")}>
                <div
                  className="dynamic-icon"
                  style={css(
                    "width: 46px; height: 46px; border-radius: 12px; background: rgba(255, 255, 255, 0.2); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.3);",
                  )}
                >
                  <i className="fas fa-crown" />
                </div>
                <div>
                  <div style={css("display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem; flex-wrap: wrap;")}>
                    <h3 style={css("color: #FFFFFF; font-size: 1.2rem; margin: 0; font-weight: 800;")}>L’Assemblée Générale</h3>
                    <span
                      style={css(
                        "background: rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 800; text-transform: uppercase; border: 1px solid rgba(255, 255, 255, 0.35);",
                      )}
                    >
                      Instance Souveraine
                    </span>
                  </div>
                  <p style={css("color: rgba(255, 255, 255, 0.92); font-size: 0.865rem; margin: 0; line-height: 1.5;")}>
                    Organe délibérant souverain rassemblant tous les membres affiliés. Elle fixe la vision stratégique, évalue
                    les bilans et élit les instances dirigeantes selon les principes de{" "}
                    <strong>Démocratie, Transparence, Représentativité & Redevabilité</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="governance-grid"
              style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;")}
            >
              {organes.map((o) => (
                <div
                  key={o.title}
                  className="dynamic-green-card"
                  style={{
                    ...css(
                      "background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); padding: 1.15rem; border-radius: var(--radius-md); backdrop-filter: blur(8px); display: flex; flex-direction: column; justify-content: space-between;",
                    ),
                    borderTop: `4px solid ${o.borderTop}`,
                  }}
                >
                  <div>
                    <div style={css("display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.55rem;")}>
                      <div style={css("display: flex; align-items: center; gap: 0.5rem;")}>
                        <i className={`${o.icon} dynamic-icon`} style={{ color: o.iconColor, fontSize: "1.05rem" }} />
                        <strong style={css("color: #FFFFFF; font-size: 0.95rem; font-weight: 700;")}>{o.title}</strong>
                      </div>
                      <span style={css("background: rgba(255, 255, 255, 0.18); color: #FFFFFF; font-size: 0.685rem; padding: 0.18rem 0.5rem; border-radius: 12px; font-weight: 700;")}>
                        {o.tag}
                      </span>
                    </div>
                    <p style={css("color: rgba(255, 255, 255, 0.88); font-size: 0.825rem; margin: 0; line-height: 1.45;")}>{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={css(
              "background: rgba(0, 0, 0, 0.18); border: 1px solid rgba(255, 255, 255, 0.2); border-left: 4px solid #A8E6CF; padding: 0.75rem 1.15rem; border-radius: var(--radius-md); margin-top: 1.15rem; text-align: center;",
            )}
          >
            <p style={css("font-size: 0.835rem; color: rgba(255, 255, 255, 0.95); margin: 0; font-weight: 500;")}>
              <i className="fas fa-info-circle" style={{ color: "#A8E6CF", marginRight: "0.35rem" }} />
              <strong style={{ color: "#A8E6CF" }}>Phase Constitutive :</strong> Architecture transitoire proposée par le Comité
              d’initiative jusqu'à l'Assemblée Générale constitutive.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
