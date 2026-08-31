import { cssStringToObject as css } from "@/lib/cssToObject"

const challenges = [
  {
    n: "1",
    title: "Une représentation encore fragmentée",
    desc: "Renforcer la concertation et la capacité collective de représentation des différentes familles de l'ESS.",
  },
  {
    n: "2",
    title: "Un accès insuffisant aux financements adaptés",
    desc: "Favoriser le développement de mécanismes financiers compatibles avec les réalités économiques et la finalité sociale des entreprises ESS.",
  },
  {
    n: "3",
    title: "Un déficit de données économiques consolidées",
    desc: "Produire des données permettant de mieux mesurer la contribution de l'ESS à l'emploi, aux territoires, aux chaînes de valeur et à l'économie nationale.",
  },
  {
    n: "4",
    title: "Une mutualisation économique encore limitée",
    desc: "Développer le partage d'équipements, de services, de plateformes logistiques, de technologies et d'opportunités commerciales entre entreprises.",
  },
]

export function Contexte() {
  return (
    <section id="contexte" className="section" style={css("background: var(--bg-surface); padding: 2.25rem 0;")}>
      <div className="container">
        <div
          className="context-showcase-container"
          style={css(
            "background: var(--bg-alt); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2rem 2.25rem; box-shadow: var(--shadow-sm);",
          )}
        >
          <div style={css("margin-bottom: 2rem; text-align: center;")}>
            <span className="badge badge-green mb-2">
              <i className="fas fa-search" /> CONTEXTE & DIAGNOSTIC
            </span>
            <h2 style={css("color: var(--primary-navy); font-size: 2rem; margin-bottom: 0.5rem; font-weight: 800;")}>
              Pourquoi le CONESESS ?
            </h2>
            <p style={css("color: var(--text-muted); font-size: 0.95rem; max-width: 820px; margin: 0 auto; line-height: 1.6;")}>
              L’Économie Sociale et Solidaire constitue un levier important de développement économique, de création d’emplois,
              de cohésion sociale et de développement territorial au Sénégal.
            </p>
          </div>

          <div
            className="context-split-grid"
            style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem; align-items: stretch;")}
          >
            <div
              style={css(
                "background: #FFFFFF; border: 1px solid var(--border-light); border-left: 4px solid var(--primary-green); padding: 1.85rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;",
              )}
            >
              <div>
                <p style={css("font-size: 0.925rem; line-height: 1.65; color: var(--text-body); margin: 0;")}>
                  Coopératives, mutuelles, GIE et entreprises sociales contribuent chaque jour à la production, à l'inclusion
                  financière, à la sécurité alimentaire et au développement des territoires. Mais l'écosystème reste fragmenté
                  : représentation dispersée, financements inadaptés, données insuffisantes et faible mutualisation des
                  moyens.
                </p>
              </div>

              <div style={css("background: var(--accent-soft-green); border-left: 3px solid var(--primary-green); padding: 1rem 1.15rem; border-radius: 10px; margin-top: 1.25rem;")}>
                <strong style={css("color: var(--primary-green); font-size: 0.875rem; line-height: 1.5; display: flex; align-items: flex-start; gap: 0.55rem;")}>
                  <i className="fas fa-leaf" style={css("margin-top: 0.2rem; flex-shrink: 0;")} />
                  <span>
                    Le CONESESS est né de la volonté de contribuer à rapprocher ces différentes composantes autour d'un cadre
                    fédérateur, ouvert et complémentaire aux organisations existantes.
                  </span>
                </strong>
              </div>
            </div>

            <div style={css("display: flex; flex-direction: column; justify-content: space-between;")}>
              <h3 style={css("color: var(--primary-navy); font-size: 1.2rem; font-weight: 800; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;")}>
                <i className="fas fa-bullseye" style={css("color: #D97706;")} /> Quatre Défis Prioritaires
              </h3>

              <div style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;")}>
                {challenges.map((c) => (
                  <div
                    key={c.n}
                    style={css(
                      "background: #FFFFFF; border: 1px solid var(--border-light); padding: 1.15rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 0.5rem;",
                    )}
                  >
                    <div style={css("color: #D97706; font-size: 1.1rem; font-weight: 800;")}>{c.n}</div>
                    <h4 style={css("color: var(--primary-navy); font-size: 0.95rem; font-weight: 700; margin: 0; line-height: 1.35;")}>{c.title}</h4>
                    <p style={css("font-size: 0.825rem; color: var(--text-muted); margin: 0; line-height: 1.45;")}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
