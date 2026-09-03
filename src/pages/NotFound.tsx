import { Link } from "react-router-dom"
import { PublicLayout } from "@/components/layout/PublicLayout"

export default function NotFoundPage() {
  return (
    <PublicLayout page="home">
      <section
        className="section hero-themed-section"
        style={{ padding: "5rem 0", background: "linear-gradient(135deg, #0A2540 0%, #163B66 60%, #006837 100%)" }}
      >
        <div className="container" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#E9C46A", marginBottom: "0.5rem" }}>404</div>
          <h1 style={{ fontSize: "1.75rem", color: "#FFFFFF", fontWeight: 800, margin: "0 0 1rem 0" }}>Page introuvable</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "2rem" }}>
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/" className="btn btn-outline btn-sm">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
