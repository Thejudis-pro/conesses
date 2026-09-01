import { useState } from "react"
import { SubmissionSuccessModal } from "@/components/SubmissionSuccessModal"
import { useToasts } from "@/components/Toast"
import { ChainesDeValeur } from "@/components/home/ChainesDeValeur"
import { Ecosysteme } from "@/components/home/Ecosysteme"
import { MembershipModal } from "@/components/home/MembershipModal"
import { Plaidoyer } from "@/components/home/Plaidoyer"
import { Poles } from "@/components/home/Poles"
import { PublicLayout } from "@/components/layout/PublicLayout"

export default function PolesActionPage() {
  const [membershipOpen, setMembershipOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successRef, setSuccessRef] = useState("")
  const { showToast, ToastContainer } = useToasts()

  const handleMembershipSuccess = (ref: string) => {
    setSuccessRef(ref)
    setSuccessOpen(true)
    showToast(`Votre demande a bien été transmise (${ref}).`)
  }

  return (
    <PublicLayout page="poles-action">
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
              <i className="fas fa-th-large" /> PÔLES SECTORIELS & PARTENARIAT
            </div>
            <h1 style={{ fontSize: "2.5rem", color: "#FFFFFF", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.85rem" }}>
              Pôles & Action Économique
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              Les quatre pôles sectoriels du CONESESS, les chaînes de valeur qu'ils structurent, l'écosystème de
              partenaires qui les soutient, et le plaidoyer mené auprès de l'État.
            </p>
          </div>
        </div>
      </section>

      <Poles />
      <ChainesDeValeur />
      <Ecosysteme />
      <Plaidoyer onOpenMembershipModal={() => setMembershipOpen(true)} />

      <MembershipModal open={membershipOpen} onClose={() => setMembershipOpen(false)} onSuccess={handleMembershipSuccess} />
      <SubmissionSuccessModal open={successOpen} refNum={successRef} onClose={() => setSuccessOpen(false)} />
      <ToastContainer />
    </PublicLayout>
  )
}
