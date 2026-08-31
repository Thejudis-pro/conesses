import { cssStringToObject as css } from "@/lib/cssToObject"

const partners = [
  { icon: "fas fa-building", border: "#008748", title: "Entreprises de l’ESS", desc: "Coopératives, mutuelles, GIE, entreprises sociales et autres organisations éligibles." },
  { icon: "fas fa-landmark", border: "#008748", title: "Collectivités territoriales", desc: "Pour favoriser l’ancrage économique local et le développement des chaînes de valeur territoriales." },
  { icon: "fas fa-briefcase", border: "#008748", title: "Organisations patronales", desc: "Relations commerciales, industrielles et technologiques avec l'économie conventionnelle." },
  { icon: "fas fa-coins", border: "#00A859", title: "Finances & Assurances", desc: "Solutions de financement et de garanties adaptées aux entreprises ESS." },
  { icon: "fas fa-graduation-cap", border: "#00A859", title: "Universités & Recherche", desc: "Soutenir l’innovation, la recherche appliquée et la production de données." },
  { icon: "fas fa-flag", border: "#00A859", title: "État & Organismes Publics", desc: "Contribuer au dialogue public-privé et aux politiques nationales de l’ESS." },
  { icon: "fas fa-handshake", border: "#008748", title: "Partenaires Techniques", desc: "Accompagner les programmes de structuration et de développement territorial." },
]

export function Ecosysteme() {
  return (
    <section id="ecosysteme" className="section" style={css("background: var(--bg-surface); padding: 1.75rem 0;")}>
      <div className="container">
        <div style={css("background: #F4F9F6; border: 1px solid #C8E6C9; border-radius: var(--radius-lg); padding: 1.75rem 2rem; box-shadow: 0 4px 20px rgba(0, 135, 72, 0.05);")}>
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <span
              className="badge"
              style={css(
                "background: #E8F5E9; color: #008748; border: 1px solid rgba(0, 135, 72, 0.3); font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 20px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;",
              )}
            >
              <i className="fas fa-handshake" /> Alliances & Synergies
            </span>
            <h2 style={css("font-size: 1.8rem; margin-bottom: 0.25rem; color: #00502A; font-weight: 800;")}>Écosystème et partenariats</h2>
            <strong style={css("color: #008748; font-size: 0.95rem; display: block; margin-bottom: 0.4rem; font-weight: 700;")}>
              <i className="fas fa-users-cog" style={{ color: "#008748" }} /> Construire des convergences pour l'ESS
            </strong>
            <p style={css("color: #335C49; font-size: 0.875rem; line-height: 1.55; margin: 0 auto; max-width: 850px;")}>
              Le CONESESS se veut un espace ouvert de coopération entre les différentes composantes de l’économie sénégalaise.
              Il entend développer des partenariats stratégiques avec :
            </p>
          </div>

          <div style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.85rem;")}>
            {partners.map((p) => (
              <div
                key={p.title}
                className="dynamic-green-card"
                style={{
                  ...css("background: #FFFFFF; border: 1px solid #C8E6C9; padding: 1.1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;"),
                  borderLeft: `4px solid ${p.border}`,
                }}
              >
                <strong style={css("color: #00502A; font-size: 0.9rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 700;")}>
                  <i className={`${p.icon} dynamic-icon`} style={{ color: p.border, fontSize: "1rem" }} /> {p.title}
                </strong>
                <p style={css("font-size: 0.8rem; color: #335C49; line-height: 1.4; margin: 0;")}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
