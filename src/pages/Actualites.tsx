import { useEffect, useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { fetchPublishedNews, type NewsPost } from "@/lib/news"

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
        <div className="container" style={{ maxWidth: "900px" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {posts.map((post) => (
                <article
                  key={post.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {post.image_urls.length > 0 &&
                    (post.image_urls.length === 1 ? (
                      <img src={post.image_urls[0]} alt={post.title} style={{ width: "100%", maxHeight: "360px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2px" }}>
                        {post.image_urls.map((url, i) => (
                          <img key={url} src={url} alt={`${post.title} ${i + 1}`} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                        ))}
                      </div>
                    ))}
                  <div style={{ padding: "1.75rem" }}>
                    <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </small>
                    <h2 style={{ color: "var(--primary-navy)", fontSize: "1.4rem", fontWeight: 800, margin: "0.4rem 0 0.85rem 0" }}>{post.title}</h2>
                    <p style={{ color: "var(--text-body)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>{post.content}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
