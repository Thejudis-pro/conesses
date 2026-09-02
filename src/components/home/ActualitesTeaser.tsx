import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchPublishedNews, type NewsPost } from "@/lib/news"

const excerpt = (text: string, max = 140) => (text.length > max ? `${text.slice(0, max).trim()}…` : text)

export function ActualitesTeaser() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedNews(3).then(({ data }) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  if (loading) return null

  return (
    <section className="section" style={{ background: "var(--bg-surface)", padding: "3rem 0" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          <div>
            <span className="badge badge-green mb-2">
              <i className="fas fa-newspaper" /> Actualités
            </span>
            <h2 style={{ color: "var(--primary-navy)", fontSize: "1.75rem", fontWeight: 800, margin: "0.4rem 0 0 0" }}>Dernières actualités</h2>
          </div>
          <Link to="/actualites" className="btn btn-outline btn-sm">
            Voir toutes les actualités <i className="fas fa-arrow-right" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div
            style={{
              background: "var(--bg-alt)",
              border: "1px dashed var(--border-light)",
              borderRadius: "var(--radius-md)",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
            }}
          >
            <i className="fas fa-bullhorn" style={{ fontSize: "1.75rem", color: "var(--primary-green)", marginBottom: "0.75rem", display: "block" }} />
            <p style={{ color: "var(--text-body)", fontWeight: 600, margin: 0, fontSize: "0.95rem" }}>
              Les activités arrivent bientôt — restez connectés !
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {posts.map((post) => (
              <Link
                key={post.id}
                to="/actualites"
                style={{
                  textDecoration: "none",
                  background: "#FFFFFF",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {post.image_urls[0] && (
                  <img src={post.image_urls[0]} alt={post.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                )}
                <div style={{ padding: "1.25rem" }}>
                  <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </small>
                  <h3 style={{ color: "var(--primary-navy)", fontSize: "1.05rem", fontWeight: 700, margin: "0.35rem 0 0.5rem 0", lineHeight: 1.35 }}>
                    {post.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>{excerpt(post.content)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
