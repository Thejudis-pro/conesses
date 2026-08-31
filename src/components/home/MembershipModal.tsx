import { useState } from "react"
import logo from "@/assets/images/logo.jpg"
import { genAdhesionRef } from "@/lib/refs"
import { readForm, submitWebForm } from "@/lib/submissions"

const REGIONS = [
  "Dakar", "Thiès", "Saint-Louis", "Fatick", "Kaolack", "Ziguinchor", "Kolda", "Tambacounda",
  "Matam", "Kaffrine", "Kedougou", "Sédhiou", "Louga", "Diourbel",
]

const SECTORS = [
  "Agroécologie & Souveraineté Alimentaire",
  "Finance inclusive, Mutuelles & SFD",
  "Artisanat, Énergie & Économie Circulaire",
  "Services, Numérique & Éducation",
  "Autre secteur d'activité",
]

interface MembershipModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (ref: string) => void
}

/**
 * Reproduces `#membership-modal` (manifestation d'intérêt) from index.html.
 *
 * TODO(Supabase): on submit this only generates a reference and shows the
 * success modal, exactly like every other form here — see the other forms'
 * TODO comments for the intended `organizations`/`web_forms` insert.
 */
export function MembershipModal({ open, onClose, onSuccess }: MembershipModalProps) {
  const [legalForm, setLegalForm] = useState("Coopérative")
  const [otherLegalForm, setOtherLegalForm] = useState("")

  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setErrorMsg(null)
    const form = e.currentTarget
    const f = readForm(form)
    const ref = genAdhesionRef()

    const error = await submitWebForm({
      reference: ref,
      form_type: "Manifestation d'intérêt",
      org_name: f.org_name,
      contact_name: f.contact_name,
      email: f.email,
      phone: f.phone,
      region: f.region,
      sector: f.sector,
      legal_form: f.legal_form === "autre" ? f.legal_form_other : f.legal_form,
      message: f.message,
      details: { commune: f.commune, staff_count: f.staff_count, presentation: f.presentation },
    })
    setSending(false)

    if (error) {
      setErrorMsg(error)
      return
    }

    form.reset()
    setLegalForm("Coopérative")
    setOtherLegalForm("")
    onClose()
    onSuccess(ref)
  }

  return (
    <div className={`modal-overlay${open ? " show" : ""}`}>
      <div className="modal-card" style={{ maxWidth: "750px" }}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <img
            src={logo}
            alt="Logo CONESESS"
            style={{ width: "55px", height: "55px", borderRadius: "50%", margin: "0 auto 0.4rem auto", border: "2px solid var(--accent-gold)" }}
          />
          <h3 style={{ color: "var(--primary-navy)", marginBottom: "0.4rem", fontSize: "1.25rem", fontWeight: 800, lineHeight: 1.35 }}>
            Vous représentez une coopérative, une mutuelle, un GIE, une entreprise sociale ou une organisation engagée dans
            l’Économie Sociale et Solidaire ?
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--primary-green)", margin: 0, fontWeight: 700 }}>
            Vous pouvez manifester votre intérêt pour rejoindre la dynamique nationale du CONESESS.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "0.85rem" }}>
            <div className="wizard-form-group">
              <label>Dénomination de l’organisation *</label>
              <input name="org_name" type="text" className="wizard-form-control" required placeholder="ex: Coopérative Agricole de Kayar" />
            </div>

            <div className="wizard-form-group">
              <label>Forme juridique *</label>
              <select name="legal_form" className="wizard-form-control" required value={legalForm} onChange={(e) => setLegalForm(e.target.value)}>
                <option>Coopérative</option>
                <option>Groupement d'Intérêt Économique (GIE)</option>
                <option>Mutuelle</option>
                <option>Entreprise sociale</option>
                <option value="autre">Autre (à préciser)</option>
              </select>
            </div>
          </div>

          {legalForm === "autre" && (
            <div className="wizard-form-group" style={{ marginBottom: "0.85rem" }}>
              <label style={{ color: "var(--primary-green)", fontWeight: 600 }}>Précisez la forme juridique *</label>
              <input
                type="text"
                className="wizard-form-control"
                placeholder="ex: Fondation, Association, Waqf..."
                required
                value={otherLegalForm}
                onChange={(e) => setOtherLegalForm(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "0.85rem" }}>
            <div className="wizard-form-group">
              <label>Région *</label>
              <select name="region" className="wizard-form-control" required defaultValue={REGIONS[0]}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="wizard-form-group">
              <label>Département / Commune *</label>
              <input name="commune" type="text" className="wizard-form-control" required placeholder="ex: Rufisque / Sangalkam" />
            </div>

            <div className="wizard-form-group">
              <label>Secteur d’activité *</label>
              <select name="sector" className="wizard-form-control" required defaultValue={SECTORS[0]}>
                {SECTORS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "0.85rem" }}>
            <div className="wizard-form-group">
              <label>Nombre de membres / salariés *</label>
              <input name="staff_count" type="number" className="wizard-form-control" required placeholder="ex: 120" />
            </div>

            <div className="wizard-form-group">
              <label>Nom et fonction du représentant légal *</label>
              <input name="contact_name" type="text" className="wizard-form-control" required placeholder="ex: Fatou Ndiaye, Présidente" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "0.85rem" }}>
            <div className="wizard-form-group">
              <label>Téléphone / WhatsApp *</label>
              <input name="phone" type="tel" className="wizard-form-control" required placeholder="+221 77 000 00 00" />
            </div>

            <div className="wizard-form-group">
              <label>Adresse électronique *</label>
              <input name="email" type="email" className="wizard-form-control" required placeholder="contact@organisation.sn" />
            </div>
          </div>

          <div className="wizard-form-group" style={{ marginBottom: "0.85rem" }}>
            <label>Présentation succincte de l’organisation *</label>
            <textarea
              className="wizard-form-control"
              rows={2}
              required
              placeholder="Présentez brièvement votre organisation, vos activités principales et votre ancrage territorial..."
            />
          </div>

          <div className="wizard-form-group" style={{ marginBottom: "1.15rem" }}>
            <label>Motivation pour rejoindre le CONESESS *</label>
            <textarea
              className="wizard-form-control"
              rows={2}
              required
              placeholder="Expliquez vos attentes et motivations pour rejoindre le réseau national CONESESS..."
            />
          </div>

          {errorMsg && (
            <p role="alert" style={{ color: "#DC2626", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.85rem",
              fontSize: "1rem",
              fontWeight: 700,
              background: "var(--primary-green)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "var(--radius-md)",
            }}
          >
            <i className="fas fa-paper-plane" /> {sending ? "Envoi en cours..." : "Transmettre ma manifestation d’intérêt"}
          </button>
        </form>
      </div>
    </div>
  )
}
