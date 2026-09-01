import { Gouvernance } from "@/components/home/Gouvernance"
import { Incubateur } from "@/components/home/Incubateur"
import { Observatoire } from "@/components/home/Observatoire"
import { PublicLayout } from "@/components/layout/PublicLayout"

export default function GouvernancePage() {
  return (
    <PublicLayout page="gouvernance">
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
              <i className="fas fa-sitemap" /> GOUVERNANCE & PILOTAGE STRATÉGIQUE
            </div>
            <h1 style={{ fontSize: "2.5rem", color: "#FFFFFF", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.85rem" }}>
              Gouvernance du CONESESS
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              L'architecture institutionnelle du CONESESS, son incubateur national IAN-ESS et son observatoire ON-ESS —
              les trois piliers qui structurent le pilotage et la connaissance de l'écosystème.
            </p>
          </div>
        </div>
      </section>

      <Gouvernance />
      <Incubateur />
      <Observatoire />
    </PublicLayout>
  )
}
