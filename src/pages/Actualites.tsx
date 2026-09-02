import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { fetchPublishedNews, newsExcerpt, type NewsPost } from "@/lib/news"

export default function ActualitesPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedNews().then(({ data }) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  return (
    <PublicLayout page="actualites">
      <section
        className="section hero-themed-section"
        style={{ padding: "4rem 0 4.5rem 0", background: "linear-gradient(135deg, #0A2540 0%, #163B66 60%, #006837 100%)", position: "relative" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <div
              style={{
                background: "rgba(233, 196, 106, 0.18)",
                border: "1.5px solid #E9C46A",
                color: "#E9C46A",
                padding: "0.4rem 1.25rem",
                borderRadius: "30px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
              }}
            >
              <i className="fas fa-newspaper" /> VIE DU RÉSEAU CONESESS
            </div>
            <h1 style={{ fontSize: "2.5rem", color: "#FFFFFF", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.85rem" }}>Actualités</h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              Suivez les annonces, activités et temps forts du CONESESS Sénégal.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-surface)", padding: "3rem 0 3.5rem 0" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Chargement...</p>
          ) : posts.length === 0 ? (
            <div
              style={{
                background: "var(--bg-alt)",
                border: "1px dashed var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "3.5rem 1.5rem",
                textAlign: "center",
              }}
            >
              <i className="fas fa-bullhorn" style={{ fontSize: "2.25rem", color: "var(--primary-green)", marginBottom: "1rem", display: "block" }} />
              <h3 style={{ color: "var(--primary-navy)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Les activités arrivent bientôt — restez connectés !
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "480px", margin: "0 auto" }}>
                Aucune actualité publiée pour le moment. Revenez prochainement pour suivre la vie du réseau CONESESS.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/actualites/${post.id}`}
                  style={{
                    textDecoration: "none",
                    background: "#FFFFFF",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "var(--transition)",
                  }}
                  className="news-card"
                >
                  <div style={{ width: "100%", height: "190px", background: "var(--bg-alt)", overflow: "hidden" }}>
                    {post.image_urls[0] ? (
                      <img src={post.image_urls[0]} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fas fa-newspaper" style={{ fontSize: "2rem", color: "var(--border-light)" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </small>
                    <h2 style={{ color: "var(--primary-navy)", fontSize: "1.15rem", fontWeight: 800, margin: "0.4rem 0 0.6rem 0", lineHeight: 1.35 }}>
                      {post.title}
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.55, margin: 0, flex: 1 }}>{newsExcerpt(post.content)}</p>
                    <span style={{ color: "var(--primary-green)", fontSize: "0.85rem", fontWeight: 700, marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      Lire la suite <i className="fas fa-arrow-right" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
