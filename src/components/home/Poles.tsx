import { cssStringToObject as css } from "@/lib/cssToObject"

const poles = [
  {
    icon: "fas fa-seedling",
    iconBg: "var(--accent-soft-green)",
    iconColor: "var(--primary-green)",
    borderTop: "var(--primary-green)",
    title: "Pôle 1 – Agriculture, agroécologie et souveraineté alimentaire",
    desc: "Agriculture • élevage • pêche • transformation agroalimentaire • stockage • logistique • commercialisation • intrants • irrigation.",
  },
  {
    icon: "fas fa-hand-holding-usd",
    iconBg: "var(--accent-soft-green)",
    iconColor: "var(--primary-green)",
    borderTop: "var(--primary-green)",
    title: "Pôle 2 – Finance inclusive, mutuelles, SFD et assurance",
    desc: "Finance inclusive • microfinance • mutuelles • micro-assurance • financement des chaînes de valeur • finance éthique et solidaire.",
  },
  {
    icon: "fas fa-hammer",
    iconBg: "var(--accent-soft-gold)",
    iconColor: "#D97706",
    borderTop: "var(--accent-gold)",
    title: "Pôle 3 – Artisanat, énergie, habitat et économie circulaire",
    desc: "Artisanat • transformation locale • énergie renouvelable • recyclage • habitat durable • économie circulaire.",
  },
  {
    icon: "fas fa-laptop-code",
    iconBg: "var(--accent-soft-gold)",
    iconColor: "#D97706",
    borderTop: "var(--accent-gold)",
    title: "Pôle 4 – Services, numérique, éducation et innovation sociale",
    desc: "Entreprises sociales • startups d’impact • numérique • EdTech • formation • plateformes mutualisées • services aux entreprises ESS.",
  },
]

export function Poles() {
  return (
    <section id="poles" className="section">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-green">
            <i className="fas fa-network-wired" /> Organisation Sectorielle
          </span>
          <h2 className="section-title">Quatre pôles sectoriels initiaux</h2>
          <p className="section-description">
            Le CONESESS propose d’organiser progressivement sa base économique autour de pôles sectoriels permettant aux
            entreprises d’une même chaîne de valeur de coopérer, mutualiser leurs besoins et développer des projets communs.
          </p>
        </div>

        <div className="sector-grid mb-4">
          {poles.map((p) => (
            <div
              key={p.title}
              className="sector-card"
              style={{
                ...css("background: #FFFFFF; border: 1px solid var(--border-light); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;"),
                borderTop: `4px solid ${p.borderTop}`,
              }}
            >
              <div
                className="sector-card-icon"
                style={{
                  ...css("width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 0.85rem;"),
                  background: p.iconBg,
                  color: p.iconColor,
                }}
              >
                <i className={p.icon} />
              </div>
              <h3 style={css("font-size: 1.05rem; color: var(--primary-navy); line-height: 1.35; margin-bottom: 0.6rem; font-weight: 700;")}>{p.title}</h3>
              <p style={css("font-size: 0.835rem; color: var(--text-body); line-height: 1.5; margin: 0; flex-grow: 1;")}>{p.desc}</p>
            </div>
          ))}

          <div
            style={css(
              "background: var(--bg-alt); border: 1px solid var(--border-light); border-left: 4px solid var(--primary-green); padding: 0.85rem 1.25rem; border-radius: var(--radius-md); text-align: center; max-width: 900px; margin: 0 auto 1.5rem auto;",
            )}
          >
            <p style={css("font-size: 0.85rem; color: var(--text-dark); margin: 0; font-weight: 500;")}>
              <i className="fas fa-plus-circle" style={{ color: "var(--primary-green)" }} /> D’autres pôles pourront être créés
              en fonction de l’évolution de la base des membres et des besoins des filières.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
