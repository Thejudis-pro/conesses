import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { fetchPublishedNewsById, type NewsPost } from "@/lib/news"

export default function ActualiteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchPublishedNewsById(id).then(({ data }) => {
      setPost(data)
      setNotFound(!data)
      setLoading(false)
    })
  }, [id])

  return (
    <PublicLayout page="actualites">
      <section
        className="section hero-themed-section"
        style={{ padding: "3rem 0 3.5rem 0", background: "linear-gradient(135deg, #0A2540 0%, #163B66 60%, #006837 100%)", position: "relative" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <Link to="/actualites" style={{ color: "#E9C46A", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
              <i className="fas fa-arrow-left" /> Retour aux actualités
            </Link>
            {!loading && post && (
              <>
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
                  <i className="fas fa-calendar" />{" "}
                  {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <h1 style={{ fontSize: "2.15rem", color: "#FFFFFF", fontWeight: 800, lineHeight: 1.3, margin: 0 }}>{post.title}</h1>
              </>
            )}
            {loading && <h1 style={{ fontSize: "1.5rem", color: "#FFFFFF", fontWeight: 700, margin: 0 }}>Chargement...</h1>}
            {notFound && <h1 style={{ fontSize: "1.5rem", color: "#FFFFFF", fontWeight: 700, margin: 0 }}>Actualité introuvable</h1>}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-surface)", padding: "3rem 0 3.5rem 0" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          {notFound ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
              <p>Cette actualité n'existe pas ou n'est plus disponible.</p>
              <Link to="/actualites" className="btn btn-outline btn-sm">
                Voir toutes les actualités
              </Link>
            </div>
          ) : (
            post && (
              <>
                {post.image_urls.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <img
                      src={post.image_urls[0]}
                      alt={post.title}
                      style={{ width: "100%", maxHeight: "480px", objectFit: "cover", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}
                    />
                    {post.image_urls.length > 1 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.6rem", marginTop: "0.6rem" }}>
                        {post.image_urls.slice(1).map((url, i) => (
                          <img
                            key={url}
                            src={url}
                            alt={`${post.title} ${i + 2}`}
                            style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "var(--radius-md)" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <p style={{ color: "var(--text-body)", fontSize: "1rem", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{post.content}</p>
              </>
            )
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
