import { Link } from "react-router-dom"
import { BannerVision } from "@/components/home/BannerVision"
import { Contexte } from "@/components/home/Contexte"
import { Hero } from "@/components/home/Hero"
import { Vision } from "@/components/home/Vision"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useScrollToHashOnMount } from "@/lib/useSectionScroll"

const TEASERS = [
  {
    to: "/gouvernance",
    icon: "fas fa-sitemap",
    title: "Gouvernance",
    desc: "L'architecture institutionnelle du CONESESS, son incubateur national IAN-ESS et son observatoire ON-ESS.",
  },
  {
    to: "/poles-action",
    icon: "fas fa-th-large",
    title: "Pôles & Action",
    desc: "Les quatre pôles sectoriels, les chaînes de valeur, l'écosystème de partenaires et le plaidoyer avec l'État.",
  },
]

export default function IndexPage() {
  useScrollToHashOnMount()

  return (
    <PublicLayout page="home">
      <Hero />
      <BannerVision />
      <Contexte />
      <Vision />

      <section className="section" style={{ background: "var(--bg-alt)", padding: "3rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 2.5rem auto" }}>
            <span className="badge badge-green mb-2">
              <i className="fas fa-compass" /> EN SAVOIR PLUS
            </span>
            <h2 style={{ color: "var(--primary-navy)", fontSize: "1.9rem", fontWeight: 800, marginBottom: "0.5rem" }}>Explorer le CONESESS</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              Deux volets détaillés pour comprendre notre organisation et notre action économique.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem", maxWidth: "1000px", margin: "0 auto" }}>
            {TEASERS.map((t) => (
              <Link key={t.to} to={t.to} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--border-light)",
                    borderTop: "4px solid var(--primary-green)",
                    borderRadius: "var(--radius-md)",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "var(--accent-soft-green)",
                      color: "var(--primary-green)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <i className={t.icon} />
                  </div>
                  <h3 style={{ color: "var(--primary-navy)", fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>{t.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.55, marginBottom: "1.25rem" }}>{t.desc}</p>
                  <span className="btn btn-outline btn-sm">
                    En savoir plus <i className="fas fa-arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
