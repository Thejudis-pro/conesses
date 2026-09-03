import { useState } from "react"
import { SubmissionSuccessModal } from "@/components/SubmissionSuccessModal"
import { useToasts } from "@/components/Toast"
import { PublicLayout } from "@/components/layout/PublicLayout"
import type { ReceiptField } from "@/lib/pdfReceipt"
import { genCandidatureRef } from "@/lib/refs"
import { readForm, submitWebForm } from "@/lib/submissions"

const ROLES = [
  "Coordinateur National",
  "Coordinateur Adjoint",
  "Rapporteur Général",
  "Responsable Admin & AG",
  "Responsable Partenariats",
  "Responsable Financier",
  "Responsable Communication",
]
const ROLE_LABELS: Record<string, string> = {
  "Coordinateur National": "1. Coordinateur National",
  "Coordinateur Adjoint": "2. Coordinateur Adjoint",
  "Rapporteur Général": "3. Rapporteur Général",
  "Responsable Admin & AG": "4. Responsable Organisation & AG",
  "Responsable Partenariats": "5. Responsable Partenariats & Fonds",
  "Responsable Financier": "6. Responsable Administration & Finances",
  "Responsable Communication": "7. Responsable Communication & Médias",
}

const REGIONS = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Fatick", "Kaolack", "Kaffrine", "Ziguinchor",
  "Kolda", "Sédhiou", "Tambacounda", "Kédougou", "Louga", "Matam", "Diaspora",
]

export default function CandidaturePage() {
  const [successOpen, setSuccessOpen] = useState(false)
  const [refNum, setRefNum] = useState("")
  const [sending, setSending] = useState(false)
  const [receiptFields, setReceiptFields] = useState<ReceiptField[]>([])
  const { showToast, ToastContainer } = useToasts()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    const form = e.currentTarget
    const f = readForm(form)
    const ref = genCandidatureRef()

    const error = await submitWebForm({
      reference: ref,
      form_type: "Candidature Comité de Pilotage",
      org_name: f.org_name,
      contact_name: f.contact_name,
      email: f.email,
      phone: f.phone,
      region: f.region,
      role_wanted: f.role_wanted,
      message: f.message,
    })
    setSending(false)

    if (error) {
      showToast(error)
      return
    }

    setReceiptFields([
      { label: "Nom & Prénom", value: f.contact_name ?? "" },
      { label: "Organisation / Structure", value: f.org_name ?? "" },
      { label: "Téléphone", value: f.phone ?? "" },
      { label: "E-mail", value: f.email ?? "" },
      { label: "Poste souhaité", value: ROLE_LABELS[f.role_wanted ?? ""] ?? f.role_wanted ?? "" },
      { label: "Région d'ancrage", value: f.region ?? "" },
      { label: "Présentation & motivations", value: f.message ?? "" },
    ])
    setRefNum(ref)
    form.reset()
    setSuccessOpen(true)
    showToast(`Votre candidature (${ref}) a été transmise avec succès au Secrétariat technique !`)
  }

  return (
    <PublicLayout page="candidature">
      <section
        className="hero-themed-section"
        style={{ padding: "4rem 0 3.5rem 0", background: "linear-gradient(135deg, #0A2540 0%, #163B66 50%, #006837 100%)", textAlign: "center" }}
      >
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
              <i className="fas fa-award" /> APPEL OFFICIEL À CANDIDATURES
            </div>
            <h1 style={{ fontSize: "2.5rem", color: "#FFFFFF", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.85rem" }}>
              Comité de Pilotage du CONESESS
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              Postulez pour constituer l'instance nationale de gouvernance de la Confédération Nationale des Entreprises de l’Économie
              Sociale et Solidaire.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-surface)", padding: "3rem 0 3.5rem 0" }}>
        <div className="container">
          <div
            id="candidature-comite"
            style={{ background: "#FFFFFF", padding: "2.25rem", borderRadius: "20px", border: "1.5px solid var(--border-light)", boxShadow: "0 12px 30px rgba(10, 37, 64, 0.05)" }}
          >
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <span className="badge badge-gold mb-2" style={{ fontSize: "0.775rem", fontWeight: 700 }}>
                <i className="fas fa-paper-plane" /> Formulaire Simplifié
              </span>
              <h2 style={{ fontSize: "1.6rem", color: "var(--primary-navy)", fontWeight: 800, marginBottom: "0.35rem" }}>
                Déposer votre Candidature au Comité de Pilotage
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Remplissez les informations ci-dessous pour transmettre directement votre candidature au Secrétariat Général.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div className="wizard-form-group">
                  <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                    <i className="fas fa-user" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Nom & Prénom *
                  </label>
                  <input
                    type="text" name="contact_name"
                    className="wizard-form-control"
                    required
                    placeholder="ex: Mamadou Diallo"
                    style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                  />
                </div>

                <div className="wizard-form-group">
                  <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                    <i className="fas fa-building" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Organisation /
                    Structure *
                  </label>
                  <input
                    type="text" name="org_name"
                    className="wizard-form-control"
                    required
                    placeholder="ex: Union Régionale des Coopératives"
                    style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div className="wizard-form-group">
                  <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                    <i className="fas fa-phone-alt" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Téléphone /
                    WhatsApp *
                  </label>
                  <input
                    type="tel" name="phone"
                    className="wizard-form-control"
                    required
                    placeholder="+221 77 000 00 00"
                    style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                  />
                </div>

                <div className="wizard-form-group">
                  <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                    <i className="fas fa-at" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Adresse E-mail *
                  </label>
                  <input
                    type="email" name="email"
                    className="wizard-form-control"
                    required
                    placeholder="votre.email@domaine.sn"
                    style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div className="wizard-form-group">
                  <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                    <i className="fas fa-award" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Poste Souhaité *
                  </label>
                  <select
                    className="wizard-form-control" name="role_wanted"
                    required
                    defaultValue=""
                    style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                  >
                    <option value="" disabled>
                      Sélectionnez un poste...
                    </option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="wizard-form-group">
                  <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                    <i className="fas fa-map-marker-alt" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Région
                    d'Ancrage *
                  </label>
                  <select
                    className="wizard-form-control" name="region"
                    required
                    defaultValue="Dakar"
                    style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="wizard-form-group mb-4">
                <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                  <i className="fas fa-comment-alt" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Brève Présentation
                  & Motivations *
                </label>
                <textarea
                  className="wizard-form-control" name="message"
                  rows={4}
                  required
                  placeholder="Présentez brièvement votre parcours et les raisons de votre candidature..."
                  style={{ fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)", padding: "0.75rem" }}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "1.05rem",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #006837 0%, #008748 100%)",
                  color: "#FFFFFF",
                  border: "2px solid #E9C46A",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.65rem",
                  boxShadow: "0 8px 25px rgba(0, 104, 55, 0.35)",
                }}
              >
                <i className="fas fa-paper-plane" style={{ fontSize: "1.15rem", color: "#E9C46A" }} /> {sending ? "Envoi en cours..." : "Transmettre ma Candidature Officielle"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <SubmissionSuccessModal
        open={successOpen}
        refNum={refNum}
        onClose={() => setSuccessOpen(false)}
        formType="Candidature Comité de Pilotage"
        fields={receiptFields}
      />
      <ToastContainer />
    </PublicLayout>
  )
}
