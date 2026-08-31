import { cssStringToObject as css } from "@/lib/cssToObject"

const propositions = [
  {
    icon: "fas fa-comments",
    title: "1. Dialogue institutionnel",
    desc: "Mettre en place un cadre structuré de concertation permettant aux entreprises ESS de contribuer aux politiques publiques qui concernent leur développement.",
  },
  {
    icon: "fas fa-hand-holding-usd",
    title: "2. Financement et accompagnement",
    desc: "Construire des passerelles avec les dispositifs publics de financement, de garantie et d’accompagnement pour faciliter l’accès des entreprises ESS aux ressources dont elles ont besoin.",
  },
  {
    icon: "fas fa-chart-pie",
    title: "3. Données et mesure d’impact",
    desc: "Collaborer avec institutions publiques, universités et centres de recherche pour améliorer la connaissance statistique de l’ESS et mesurer sa contribution économique et sociale.",
  },
  {
    icon: "fas fa-map-marked-alt",
    title: "4. Développement territorial",
    desc: "Expérimenter avec les collectivités territoriales des dispositifs permettant de structurer les chaînes de valeur locales, mutualiser les infrastructures économiques et créer davantage d’emplois dans les territoires.",
  },
  {
    icon: "fas fa-file-contract",
    title: "5. Commande publique et accès aux marchés",
    desc: "Engager une réflexion avec les autorités compétentes pour faciliter l’accès des entreprises ESS structurées à la commande publique, dans le respect de la réglementation.",
  },
]

interface PlaidoyerProps {
  onOpenMembershipModal: () => void
}

export function Plaidoyer({ onOpenMembershipModal }: PlaidoyerProps) {
  return (
    <section id="plaidoyer" className="section hero-themed-section" style={css("padding: 2rem 0;")}>
      <div className="container">
        <div
          className="hero-themed-card"
          style={css(
            "background: linear-gradient(135deg, #164E40 0%, #103B31 50%, #0B2922 100%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-lg); padding: 1.75rem 2rem; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25); backdrop-filter: blur(10px); color: #FFFFFF;",
          )}
        >
          <div className="advocacy-grid" style={css("display: grid; grid-template-columns: 1fr 1.35fr; gap: 1.5rem; align-items: start;")}>
            <div>
              <span
                className="badge"
                style={css(
                  "background: rgba(212, 163, 115, 0.15); color: #D4A373; border: 1px solid rgba(212, 163, 115, 0.35); font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 20px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 0.6rem;",
                )}
              >
                <i className="fas fa-gavel" /> Partenariat Stratégique
              </span>
              <h2 style={css("font-size: 1.75rem; margin-bottom: 0.5rem; color: #FFFFFF; font-weight: 800;")}>Partenariat avec l’État</h2>
              <strong style={css("color: #D4A373; font-size: 0.95rem; display: block; margin-bottom: 0.6rem; font-weight: 700;")}>
                Propositions pour un partenariat stratégique avec l’État du Sénégal
              </strong>
              <p style={css("color: rgba(255,255,255,0.9); font-size: 0.875rem; line-height: 1.55; margin-bottom: 1.25rem;")}>
                Le CONESESS souhaite contribuer, aux côtés de l’État, des collectivités territoriales, des organisations
                professionnelles et des partenaires, à la consolidation de l’écosystème national de l’Économie Sociale et
                Solidaire.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-join-modal dynamic-green-card"
                onClick={onOpenMembershipModal}
                style={css(
                  "background: #00A859; color: #FFFFFF; border: none; font-weight: 700; padding: 0.6rem 1.25rem; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;",
                )}
              >
                <i className="fas fa-signature" /> Soutenir le Partenariat Stratégique
              </button>
            </div>

            <div className="advocacy-list" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {propositions.map((p) => (
                <div
                  key={p.title}
                  className="advocacy-item dynamic-green-card"
                  style={css(
                    "background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 0.85rem 1.15rem; border-radius: var(--radius-md); backdrop-filter: blur(10px); display: flex; gap: 0.85rem; align-items: flex-start;",
                  )}
                >
                  <i className={`${p.icon} dynamic-icon`} style={css("color: #D4A373; font-size: 1.15rem; flex-shrink: 0; margin-top: 0.2rem;")} />
                  <div>
                    <h3 style={css("color: #D4A373; font-size: 0.925rem; font-weight: 700; margin-bottom: 0.25rem;")}>{p.title}</h3>
                    <p style={css("font-size: 0.8rem; color: rgba(255,255,255,0.88); margin: 0; line-height: 1.45;")}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
