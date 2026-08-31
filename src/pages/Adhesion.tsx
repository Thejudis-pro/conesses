import { useState } from "react"
import { SubmissionSuccessModal } from "@/components/SubmissionSuccessModal"
import { useToasts } from "@/components/Toast"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { genAdhesionRef } from "@/lib/refs"

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

export default function AdhesionPage() {
  const [submitted, setSubmitted] = useState(false)
  const [legalForm, setLegalForm] = useState("Coopérative")
  const [refNum, setRefNum] = useState("CONESESS-2026-8942")
  const [successOpen, setSuccessOpen] = useState(false)
  const { showToast, ToastContainer } = useToasts()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO(Supabase): insert into `web_forms` (type: "Adhésion Membre") here
    // instead of the original localStorage + crudcrud.com + formsubmit.co relay.
    const ref = genAdhesionRef()
    setRefNum(ref)
    setSubmitted(true)
    setSuccessOpen(true)
    showToast(`Votre demande a bien été transmise (${ref}).`)
    document.getElementById("adhesion-card-container")?.scrollIntoView({ behavior: "smooth" })
  }

  const resetForm = () => {
    setLegalForm("Coopérative")
    setSubmitted(false)
  }

  return (
    <PublicLayout page="adhesion">
      {/* PAGE HERO HEADER */}
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
              <i className="fas fa-handshake" /> PROCÉDURE OFFICIELLE D'ADHÉSION CONFÉDÉRALE
            </div>
            <h1 style={{ fontSize: "2.5rem", color: "#FFFFFF", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.85rem" }}>
              Rejoindre le CONESESS Sénégal
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
              Coopérative, mutuelle, GIE, entreprise sociale ou association : complétez le formulaire officiel ci-dessous pour
              intégrer la dynamique nationale.
            </p>
          </div>
        </div>
      </section>

      {/* FORMULAIRE D'ADHÉSION */}
      <section id="adhesion" className="section" style={{ background: "var(--bg-surface)", padding: "3rem 0 3.5rem 0" }}>
        <div className="container">
          <div
            id="adhesion-card-container"
            style={{
              background: "#FFFFFF",
              padding: "2.5rem",
              borderRadius: "20px",
              boxShadow: "0 12px 35px rgba(10, 37, 64, 0.06)",
              border: "1px solid var(--border-light)",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            <div style={{ marginBottom: "2rem", borderBottom: "2px solid var(--accent-soft-green)", paddingBottom: "1.25rem" }}>
              <span className="badge badge-green mb-2" style={{ fontSize: "0.775rem", fontWeight: 700 }}>
                <i className="fas fa-edit" /> Formulaire Officiel d'Adhésion
              </span>
              <h2 style={{ fontSize: "1.65rem", color: "var(--primary-navy)", marginBottom: "0.4rem", fontWeight: 800, lineHeight: 1.35 }}>
                Manifester votre intérêt pour intégrer le CONESESS
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", margin: 0, lineHeight: 1.55 }}>
                Renseignez les données de votre organisation. Votre demande sera enregistrée et instruite par le Secrétariat
                Technique.
              </p>
            </div>

            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2.5rem 1.5rem",
                  background: "rgba(0, 104, 55, 0.04)",
                  borderRadius: "16px",
                  border: "1.5px solid rgba(0, 104, 55, 0.2)",
                }}
              >
                <div
                  style={{
                    width: "75px",
                    height: "75px",
                    borderRadius: "50%",
                    background: "#E8F5E9",
                    color: "#006837",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    margin: "0 auto 1.25rem auto",
                  }}
                >
                  <i className="fas fa-check-circle" />
                </div>
                <h3 style={{ color: "var(--primary-green)", fontSize: "1.7rem", marginBottom: "0.5rem", fontWeight: 800 }}>
                  Votre demande a bien été transmise.
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#B45309", fontWeight: 800, marginBottom: "1.25rem" }}>
                  Référence de suivi : <span>{refNum}</span>
                </p>
                <p style={{ color: "var(--primary-navy)", maxWidth: "650px", margin: "0 auto 1rem auto", fontSize: "0.975rem", lineHeight: 1.6, fontWeight: 600 }}>
                  Le Secrétariat technique du Comité d’initiative examinera les informations communiquées et prendra contact
                  avec votre organisation.
                </p>
                <p style={{ color: "var(--text-muted)", maxWidth: "650px", margin: "0 auto 1.75rem auto", fontSize: "0.875rem", lineHeight: 1.55 }}>
                  L’admission définitive comme membre du CONESESS s’effectuera conformément aux statuts et aux procédures
                  d’adhésion adoptés par les instances.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={resetForm}
                  style={{ border: "2px solid var(--primary-green)", color: "var(--primary-green)", fontWeight: 800, padding: "0.75rem 1.75rem", borderRadius: "30px" }}
                >
                  <i className="fas fa-plus-circle" /> Transmettre une autre manifestation d'intérêt
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1.75rem" }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--primary-navy)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "1rem",
                      borderLeft: "3px solid var(--primary-green)",
                      paddingLeft: "0.6rem",
                    }}
                  >
                    1. Identité & Forme Juridique
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "1rem" }}>
                    <div className="wizard-form-group">
                      <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                        <i className="fas fa-building" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Dénomination de
                        l’organisation *
                      </label>
                      <input
                        type="text" name="org_name"
                        className="wizard-form-control"
                        required
                        placeholder="ex: Coopérative Agricole de Kayar"
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                      />
                    </div>

                    <div className="wizard-form-group">
                      <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                        <i className="fas fa-file-contract" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Forme
                        juridique *
                      </label>
                      <select
                        className="wizard-form-control" name="legal_form"
                        required
                        value={legalForm}
                        onChange={(e) => setLegalForm(e.target.value)}
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)", fontWeight: 600 }}
                      >
                        <option>Coopérative</option>
                        <option>Mutuelle</option>
                        <option>Groupement d'Intérêt Économique (GIE)</option>
                        <option>Entreprise sociale</option>
                        <option value="autre">Autre (à préciser)</option>
                      </select>
                    </div>

                    <div className="wizard-form-group">
                      <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                        <i className="fas fa-users" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Nombre de membres /
                        salariés
                      </label>
                      <input
                        type="number" name="staff_count"
                        className="wizard-form-control"
                        placeholder="ex: 120"
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                      />
                    </div>
                  </div>

                  {legalForm === "autre" && (
                    <div className="wizard-form-group mb-2">
                      <label style={{ color: "var(--primary-green)", fontWeight: 700, fontSize: "0.825rem" }}>Précisez la forme juridique *</label>
                      <input
                        type="text" name="legal_form_other"
                        className="wizard-form-control"
                        required
                        placeholder="ex: Fondation, Association, Waqf..."
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px" }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--primary-navy)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "1rem",
                      borderLeft: "3px solid var(--primary-green)",
                      paddingLeft: "0.6rem",
                    }}
                  >
                    2. Ancrage Territorial & Secteur d'Activité
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                    <div className="wizard-form-group">
                      <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                        <i className="fas fa-map-marker-alt" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Région
                        d’Implantation *
                      </label>
                      <select
                        className="wizard-form-control" name="region"
                        required
                        defaultValue={REGIONS[0]}
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)", fontWeight: 700 }}
                      >
                        {REGIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="wizard-form-group">
                      <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                        <i className="fas fa-map-pin" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Département /
                        Commune
                      </label>
                      <input
                        type="text" name="commune"
                        className="wizard-form-control"
                        placeholder="ex: Rufisque / Sangalkam"
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                      />
                    </div>

                    <div className="wizard-form-group">
                      <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                        <i className="fas fa-industry" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Secteur
                        d’activité principal *
                      </label>
                      <select
                        className="wizard-form-control" name="sector"
                        required
                        defaultValue={SECTORS[0]}
                        style={{ height: "44px", fontSize: "0.85rem", borderRadius: "8px", border: "1.5px solid var(--border-light)", fontWeight: 600 }}
                      >
                        {SECTORS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--primary-navy)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "1rem",
                      borderLeft: "3px solid var(--primary-green)",
                      paddingLeft: "0.6rem",
                    }}
                  >
                    3. Représentation Légale & Contacts
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                    <div className="wizard-form-group">
                      <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                        <i className="fas fa-user-check" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Représentant
                        Légal (Nom & Fonction) *
                      </label>
                      <input
                        type="text" name="contact_name"
                        className="wizard-form-control"
                        required
                        placeholder="ex: Fatou Ndiaye, Présidente"
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                      />
                    </div>

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
                        <i className="fas fa-at" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Adresse électronique
                        Officielle *
                      </label>
                      <input
                        type="email" name="email"
                        className="wizard-form-control"
                        required
                        placeholder="contact@organisation.sn"
                        style={{ height: "44px", fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)" }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--primary-navy)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "1rem",
                      borderLeft: "3px solid var(--primary-green)",
                      paddingLeft: "0.6rem",
                    }}
                  >
                    4. Présentation & Motivations
                  </h4>

                  <div className="wizard-form-group mb-3">
                    <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                      <i className="fas fa-file-alt" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Présentation
                      succincte de l’organisation
                    </label>
                    <textarea name="presentation"
                      className="wizard-form-control"
                      rows={3}
                      placeholder="Présentez brièvement votre organisation, vos activités principales et votre ancrage territorial..."
                      style={{ fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)", padding: "0.75rem" }}
                    />
                  </div>

                  <div className="wizard-form-group mb-4">
                    <label style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "0.35rem", display: "block" }}>
                      <i className="fas fa-pen-nib" style={{ color: "var(--primary-green)", fontSize: "0.8rem", marginRight: "0.3rem" }} /> Motivation pour
                      rejoindre le CONESESS
                    </label>
                    <textarea name="message"
                      className="wizard-form-control"
                      rows={3}
                      placeholder="Expliquez vos attentes et motivations pour rejoindre le réseau national CONESESS..."
                      style={{ fontSize: "0.9rem", borderRadius: "8px", border: "1.5px solid var(--border-light)", padding: "0.75rem" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #008748 0%, #0A2540 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    boxShadow: "0 6px 20px rgba(0, 135, 72, 0.3)",
                  }}
                >
                  <i className="fas fa-paper-plane" style={{ fontSize: "1.15rem" }} /> Transmettre ma Manifestation d’Intérêt Officielle
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <SubmissionSuccessModal open={successOpen} refNum={refNum} onClose={() => setSuccessOpen(false)} />
      <ToastContainer />
    </PublicLayout>
  )
}
