import { useState } from "react"
import { cssStringToObject as css } from "@/lib/cssToObject"

interface HubData {
  num: string
  icon: string
  shortTitle: string
  title: string
  badge: string
  desc: string
  target: string
  methodology: string
  impact: string
}

// Matches `incubatorData` in the original js/app.js exactly.
const HUBS: Record<string, HubData> = {
  proximite: {
    num: "01",
    icon: "fas fa-city",
    shortTitle: "Incubateurs de proximité",
    title: "1. Incubateurs territoriaux de proximité",
    badge: "Ancrage Territorial",
    desc: "Accompagner les entreprises et projets ESS au plus près des communes et bassins économiques.",
    target: "Projets ESS communaux, GIE locaux, coopératives de quartier et mutuelles de santé/épargne.",
    methodology: "Diagnostic entrepreneurial, Business Mentoring hebdomadaire, formation pratique et digitalisation de proximité.",
    impact: "Structuration directe des acteurs économiques locaux et création d'emplois durables au niveau municipal.",
  },
  thematiques: {
    num: "02",
    icon: "fas fa-leaf",
    shortTitle: "Hubs thématiques & environnementaux",
    title: "2. Hubs thématiques et environnementaux",
    badge: "Transition Écologique & Climat",
    desc: "Développer des dispositifs spécialisés autour des enjeux environnementaux, agricoles, climatiques et territoriaux.",
    target: "Initiatives d'agro-écologie, de gestion des déchets, de reboisement et d'économie verte/bleue.",
    methodology: "Accompagnement thématique ciblé, ingénierie de projets éco-responsables et valorisation des filières durables.",
    impact: "Restauration des écosystèmes locaux, résilience climatique et développement des chaînes de valeur vertes.",
  },
  mobile: {
    num: "03",
    icon: "fas fa-bus",
    shortTitle: "Incubateur mobile",
    title: "3. Incubateur mobile",
    badge: "Équité Territoriale & Inclusion",
    desc: "Déployer des équipes et services d’accompagnement vers les territoires ne disposant pas encore d’infrastructures permanentes.",
    target: "Entreprises et groupements solidaires situés dans les communes et zones rurales enclavées.",
    methodology: "Dispositif nomade d'accompagnement terrain, ateliers de formation mobiles et caravanes de conseil.",
    impact: "Accès équitable aux services d'ingénierie et intégration des territoires ruraux dans la dynamique nationale.",
  },
  partenariats: {
    num: "04",
    icon: "fas fa-hands-helping",
    shortTitle: "Partenariats communautaires",
    title: "4. Partenariats communautaires et confessionnels",
    badge: "Finance Solidaire & Éthique",
    desc: "Construire, lorsque cela est pertinent, des partenariats avec les organisations communautaires et confessionnelles engagées dans l’entrepreneuriat solidaire et le développement économique.",
    target: "Organisations communautaires, associations citoyennes et groupements solidaires confessionnels.",
    methodology: "Partenariats éthiques, structuration en coopératives autonomes et ingénierie de finance sociale solidaire.",
    impact: "Autonomisation économique des communautés et valorisation de l'entrepreneuriat solidaire ancré.",
  },
  universitaires: {
    num: "05",
    icon: "fas fa-graduation-cap",
    shortTitle: "Hubs universitaires",
    title: "5. Hubs universitaires",
    badge: "Recherche, Innovation & ESS",
    desc: "Créer des passerelles entre universités, recherche, innovation et entreprises ESS à travers des conventions avec les établissements intéressés.",
    target: "Étudiants-entrepreneurs, enseignants-chercheurs, laboratoires de recherche et startups sociales.",
    methodology: "Conventions université-entreprise, transfert d'innovation, incubation académique et mentoring d'experts.",
    impact: "Valorisation de la recherche appliquée, innovation sociale et émergence d'entreprises ESS à fort potentiel.",
  },
}

const HUB_ORDER = ["proximite", "thematiques", "mobile", "partenariats", "universitaires"]

export function IncubateurExplorer() {
  const [active, setActive] = useState<string>("proximite")
  const data = HUBS[active]

  return (
    <div className="incubator-explorer" style={{ marginBottom: "1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
        <span
          className="badge"
          style={css(
            "background: #E8F5E9; color: #008748; border: 1px solid rgba(0, 135, 72, 0.3); font-size: 0.775rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.65rem; border-radius: 20px;",
          )}
        >
          <i className="fas fa-hand-pointer" /> Cliquez pour explorer les 5 modèles
        </span>
      </div>

      <div className="incubator-timeline">
        {HUB_ORDER.map((key) => (
          <div
            key={key}
            className={`incubator-tab-card dynamic-green-card${active === key ? " active" : ""}`}
            data-hub={key}
            onClick={() => setActive(key)}
          >
            <span className="incubator-timeline-num">{HUBS[key].num}</span>
            <h3>
              <i className={`${HUBS[key].icon} dynamic-icon`} /> {HUBS[key].shortTitle}
            </h3>
          </div>
        ))}
      </div>

      <div
        id="incubator-detail-display"
        style={css(
          "background: #FFFFFF; border: 1px solid #C8E6C9; border-top: 4px solid #008748; padding: 1.5rem 1.75rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);",
        )}
      >
        <div className="incubator-detail-grid" style={{ gap: "1.5rem" }}>
          <div>
            <span
              className="badge"
              style={css(
                "background: #E8F5E9; color: #008748; border: 1px solid rgba(0, 135, 72, 0.3); font-size: 0.75rem; margin-bottom: 0.5rem; display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 700;",
              )}
            >
              {data.badge}
            </span>
            <h3 style={css("font-size: 1.25rem; color: #008748; margin-bottom: 0.4rem; font-weight: 700;")}>{data.title}</h3>
            <p style={css("font-size: 0.875rem; color: #335C49; line-height: 1.55; margin-bottom: 0.85rem;")}>{data.desc}</p>
            <div style={css("background: #F4F9F6; padding: 0.75rem 1rem; border-radius: var(--radius-md); border-left: 3px solid #008748; border: 1px solid #C8E6C9;")}>
              <strong style={css("color: #008748; font-size: 0.825rem;")}>
                <i className="fas fa-users" /> Public & Cible :
              </strong>
              <p style={css("font-size: 0.835rem; color: #335C49; margin-top: 0.2rem; margin-bottom: 0; line-height: 1.45;")}>{data.target}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={css("background: #F4F9F6; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid #C8E6C9;")}>
              <h4 style={css("color: #002B18; font-size: 0.85rem; margin-bottom: 0.25rem; font-weight: 700;")}>
                <i className="fas fa-cogs" style={{ color: "#008748", marginRight: "0.4rem" }} /> Méthodologie d'Action
              </h4>
              <p style={css("font-size: 0.825rem; color: #335C49; margin: 0;")}>{data.methodology}</p>
            </div>
            <div style={css("background: #F4F9F6; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid #C8E6C9;")}>
              <h4 style={css("color: #002B18; font-size: 0.85rem; margin-bottom: 0.25rem; font-weight: 700;")}>
                <i className="fas fa-chart-line" style={{ color: "#00A859", marginRight: "0.4rem" }} /> Impact Attendu
              </h4>
              <p style={css("font-size: 0.825rem; color: #335C49; margin: 0;")}>{data.impact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
