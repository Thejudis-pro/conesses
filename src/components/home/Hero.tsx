import logo from "@/assets/images/logo.jpg"
import { Link } from "react-router-dom"

export function Hero() {
  return (
    <section id="accueil" className="hero">
      <div className="hero-overlay-shapes" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badges">
              <span className="badge badge-green">
                <i className="fas fa-hands-helping" /> Cadre National Fédérateur ESS
              </span>
            </div>
            <h1>
              Le cadre national fédérateur des <span>entreprises de l’Économie Sociale et Solidaire du Sénégal</span>
            </h1>
            <p className="hero-subtitle">
              Le CONESESS fédère, représente et accompagne le développement économique des coopératives, mutuelles, GIE et
              entreprises sociales de l’ESS au Sénégal, pour un écosystème inclusif, créateur d’emplois durables et ancré dans
              les territoires.
            </p>
            <div className="hero-actions">
              <Link to="/adhesion" className="btn btn-primary">
                <i className="fas fa-id-card" /> Rejoindre le CONESESS
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <img src={logo} alt="Badge CONESESS Logo" />
              <div>
                <h2 className="hero-card-title">CONESESS Sénégal</h2>
                <p className="hero-card-sub">Notre Ambition</p>
              </div>
            </div>

            <div className="hero-stats-list">
              <div className="stat-item">
                <div className="stat-number">14</div>
                <div className="stat-label">Régions Ciblées</div>
                <div className="stat-desc">Pour construire progressivement une représentation nationale et territoriale.</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5</div>
                <div className="stat-label">Modèles de Hubs d’Incubation Projetés</div>
                <div className="stat-desc">Pour rapprocher l’accompagnement des entreprises ESS de leurs territoires.</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4</div>
                <div className="stat-label">Pôles Sectoriels Initiaux</div>
                <div className="stat-desc">Pour structurer les filières et favoriser les synergies économiques.</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">+70</div>
                <div className="stat-label">Membres Fondateurs</div>
                <div className="stat-desc">
                  <strong>Une communauté nationale en construction :</strong> réunissant entreprises ESS, organisations
                  professionnelles, collectivités, institutions financières, universités et partenaires.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
