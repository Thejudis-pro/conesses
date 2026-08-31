import { useState } from "react"
import logo from "@/assets/images/logo.jpg"
import { useToasts } from "@/components/Toast"
import "@/styles/admin-legacy.css"

type TabId =
  | "tab-dashboard"
  | "tab-web-forms"
  | "tab-adhesions"
  | "tab-steering"
  | "tab-members"
  | "tab-badges"
  | "tab-checkin"
  | "tab-admins"
  | "tab-settings"

interface Member {
  ref: string
  name: string
  type: string
  region: string
  phone: string
  badgeRole: string
}

interface AdminUser {
  name: string
  email: string
  org: string
  role: string
}

// Matches INITIAL_ADMIN_USERS in the original js/admin.js exactly.
const INITIAL_ADMIN_USERS: AdminUser[] = [
  { name: "Madior", email: "madior1991@gmail.com", org: "Présidence & Secrétariat Général Confédéral", role: "Super Administrateur Confédéral" },
  { name: "Secrétariat Général CONESESS", email: "admin@conesess.sn", org: "Secrétariat Général Confédéral", role: "Administrateur Général" },
]

const REGIONS = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Fatick", "Kaolack", "Kaffrine", "Louga",
  "Matam", "Kolda", "Kédougou", "Sédhiou", "Tambacounda", "Ziguinchor",
]

const ACCESS_LEVELS = [
  { value: "VIP / Bureau Exécutif", label: "🥇 VIP / Bureau Exécutif (Doré)", color: "#D97706" },
  { value: "Membre Titulaire", label: "🌿 Membre Titulaire (Vert Émeraude)", color: "#006837" },
  { value: "Comité de Pilotage", label: "🏛️ Comité de Pilotage (Bleu Roi)", color: "#0A2540" },
  { value: "Invité d'Honneur", label: "🟣 Invité d'Honneur (Violet Impérial)", color: "#7C3AED" },
  { value: "Presse / Média", label: "🔴 Presse / Média (Rouge Cramoisi)", color: "#DC2626" },
]

const NAV_ITEMS: { id: TabId; icon: string; label: string }[] = [
  { id: "tab-dashboard", icon: "fas fa-chart-line", label: "Tableau de Bord" },
  { id: "tab-web-forms", icon: "fas fa-inbox", label: "Réception Formulaires" },
  { id: "tab-adhesions", icon: "fas fa-id-card", label: "Adhésions Membres" },
  { id: "tab-steering", icon: "fas fa-users-cog", label: "Comité de Pilotage" },
  { id: "tab-members", icon: "fas fa-building", label: "Entreprises ESS" },
  { id: "tab-badges", icon: "fas fa-id-badge", label: "Confection Badges CR80" },
  { id: "tab-checkin", icon: "fas fa-qrcode", label: "Scanner Émargement" },
  { id: "tab-admins", icon: "fas fa-user-shield", label: "Comptes Administrateurs" },
  { id: "tab-settings", icon: "fas fa-cloud", label: "Relais Cloud & API" },
]

const EmptyRow = ({ colSpan, children }: { colSpan: number; children: React.ReactNode }) => (
  <tr>
    <td colSpan={colSpan} style={{ textAlign: "center", color: "var(--admin-text-muted)", padding: "2rem" }}>
      {children}
    </td>
  </tr>
)

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("tab-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { showToast, ToastContainer } = useToasts()

  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addAdminOpen, setAddAdminOpen] = useState(false)

  // TODO(Supabase): these three lists should come from `web_forms` /
  // `organizations` / `admin_users` tables. They start empty/seeded here
  // exactly like the original did on a fresh `localStorage` (see
  // `initAdminData()` in the old js/admin.js), since the public forms no
  // longer write to a fake localStorage "database" (see the TODOs in
  // Adhesion.tsx / Candidature.tsx).
  const [webForms] = useState<unknown[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS)

  const [badgeName, setBadgeName] = useState("")
  const [badgeOrg, setBadgeOrg] = useState("")
  const [badgeAccessLevel, setBadgeAccessLevel] = useState(ACCESS_LEVELS[1])

  const [checkinCode, setCheckinCode] = useState("")
  const [checkinResult, setCheckinResult] = useState<"valid" | "invalid" | null>(null)
  const [checkinMatch, setCheckinMatch] = useState<Member | null>(null)

  const switchTab = (id: TabId) => {
    setActiveTab(id)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem("manual-name") as HTMLInputElement).value.trim()
    const type = (form.elements.namedItem("manual-type") as HTMLSelectElement).value
    const region = (form.elements.namedItem("manual-region") as HTMLSelectElement).value
    const phone = (form.elements.namedItem("manual-phone") as HTMLInputElement).value.trim()
    if (!name || !phone) return

    // TODO(Supabase): insert into `organizations` instead of local state.
    setMembers((prev) => [...prev, { ref: `CONESESS-2026-${Math.floor(1000 + Math.random() * 9000)}`, name, type, region, phone, badgeRole: "Membre Titulaire" }])
    setAddMemberOpen(false)
    showToast(`Membre ${name} ajouté au registre !`)
  }

  const handleAddAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem("new-admin-name") as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem("new-admin-email") as HTMLInputElement).value.trim().toLowerCase()
    const role = (form.elements.namedItem("new-admin-role") as HTMLSelectElement).value

    // TODO(Supabase): insert into an `admin_users` table (with proper auth)
    // instead of local state.
    setAdminUsers((prev) => [...prev, { name, email, org: "CONESESS Sénégal", role }])
    setAddAdminOpen(false)
    showToast(`Compte administrateur créé pour ${name} !`)
  }

  const handleCheckin = () => {
    const code = checkinCode.trim()
    if (!code) return
    // TODO(Supabase): look up the code against `organizations` / `web_forms`.
    const match = members.find((m) => m.ref === code) ?? null
    setCheckinMatch(match)
    setCheckinResult(match ? "valid" : "invalid")
  }

  return (
    <div className={`admin-app-body`} data-admin-theme={theme}>
      <div className="admin-app-wrapper">
        {sidebarOpen && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1040 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR RAIL */}
        <aside className={`admin-sidebar${sidebarOpen ? " active" : ""}`}>
          <div className="admin-brand-header">
            <img src={logo} alt="Logo CONESESS" className="admin-brand-logo" />
            <div>
              <strong style={{ fontSize: "0.95rem", display: "block", color: "#FFFFFF" }}>CONESESS SÉNÉGAL</strong>
              <small style={{ color: "var(--admin-gold-bright)", fontSize: "0.725rem", fontWeight: 700 }}>Espace Administrateur</small>
            </div>
          </div>

          <nav className="admin-nav-menu">
            <div className="admin-nav-section-title">SUPERVISION CENTRALISÉE</div>
            {NAV_ITEMS.slice(0, 2).map((item) => (
              <a key={item.id} className={`admin-nav-item${activeTab === item.id ? " active" : ""}`} onClick={() => switchTab(item.id)}>
                <i className={item.icon} /> <span>{item.label}</span>
              </a>
            ))}

            <div className="admin-nav-section-title">REGISTRES & DOSSIERS</div>
            {NAV_ITEMS.slice(2, 5).map((item) => (
              <a key={item.id} className={`admin-nav-item${activeTab === item.id ? " active" : ""}`} onClick={() => switchTab(item.id)}>
                <i className={item.icon} /> <span>{item.label}</span>
              </a>
            ))}

            <div className="admin-nav-section-title">STUDIO BADGES & ÉMARGEMENT</div>
            {NAV_ITEMS.slice(5, 7).map((item) => (
              <a key={item.id} className={`admin-nav-item${activeTab === item.id ? " active" : ""}`} onClick={() => switchTab(item.id)}>
                <i className={item.icon} /> <span>{item.label}</span>
              </a>
            ))}

            <div className="admin-nav-section-title">PARAMÈTRES & ACCÈS</div>
            {NAV_ITEMS.slice(7, 9).map((item) => (
              <a key={item.id} className={`admin-nav-item${activeTab === item.id ? " active" : ""}`} onClick={() => switchTab(item.id)}>
                <i className={item.icon} /> <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button
              onClick={() => {
                if (window.confirm("⚠️ Confirmez-vous la réinitialisation complète de la mémoire de l'Espace Admin ?\n\nCette action effacera le cache et remettra la plateforme à neuf pour recevoir les vraies données.")) {
                  setMembers([])
                  setAdminUsers(INITIAL_ADMIN_USERS)
                  showToast("Mémoire administrateur réinitialisée avec succès !")
                }
              }}
              className="action-btn-pill"
              style={{ width: "100%", justifyContent: "center", background: "rgba(220, 38, 38, 0.2)", color: "#FCA5A5", border: "1px solid #DC2626", fontSize: "0.75rem" }}
            >
              <i className="fas fa-trash-alt" /> Effacer Mémoire Admin
            </button>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="admin-viewport">
          <header className="admin-top-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button className="mobile-admin-toggle" onClick={() => setSidebarOpen((v) => !v)}>
                <i className="fas fa-bars" />
              </button>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.35rem", color: "var(--admin-text-main)", fontWeight: 800 }}>Espace Administrateur CONESESS</h1>
                <small style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>Vision Sénégal 2050 | Formulaires Web Synchronisés</small>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
              <button onClick={() => setLoginModalOpen(true)} className="action-btn-primary" style={{ background: "var(--admin-navy)", color: "#FFFFFF", fontSize: "0.8rem", border: "none", padding: "0.55rem 0.9rem" }}>
                <i className="fas fa-user-lock" /> Session (Madior)
              </button>
              <button
                onClick={() => showToast("Flux d'administration réactualisé !")}
                className="action-btn-primary"
                style={{ background: "var(--admin-green)", color: "#FFFFFF", fontSize: "0.8rem", border: "none", padding: "0.55rem 0.9rem" }}
              >
                <i className="fas fa-sync-alt" /> Actualiser Flux
              </button>
              <button
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                className="action-btn-pill"
                style={{ fontSize: "0.8rem", border: "1px solid var(--admin-border-light)" }}
              >
                <i className="fas fa-adjust" /> Thème
              </button>
            </div>
          </header>

          {/* TAB 1: DASHBOARD */}
          {activeTab === "tab-dashboard" && (
            <section className="admin-tab-content">
              <div className="metrics-grid-4">
                <div className="metric-card-pro">
                  <div className="metric-header">
                    <span className="metric-subtext">Total Soumissions Web</span>
                    <div className="metric-icon-wrap" style={{ background: "var(--admin-soft-green)", color: "var(--admin-green)" }}>
                      <i className="fas fa-inbox" />
                    </div>
                  </div>
                  <div className="metric-value-huge">{webForms.length}</div>
                  <small style={{ color: "var(--admin-green)", fontWeight: 700 }}>
                    <i className="fas fa-arrow-up" /> En direct du site web
                  </small>
                </div>

                <div className="metric-card-pro">
                  <div className="metric-header">
                    <span className="metric-subtext">Adhésions Confirmées</span>
                    <div className="metric-icon-wrap" style={{ background: "var(--admin-soft-gold)", color: "var(--admin-gold)" }}>
                      <i className="fas fa-building" />
                    </div>
                  </div>
                  <div className="metric-value-huge">{members.length}</div>
                  <small style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>Entreprises ESS enregistrées</small>
                </div>

                <div className="metric-card-pro">
                  <div className="metric-header">
                    <span className="metric-subtext">Candidatures Comité</span>
                    <div className="metric-icon-wrap" style={{ background: "rgba(10, 37, 64, 0.1)", color: "var(--admin-navy)" }}>
                      <i className="fas fa-users-cog" />
                    </div>
                  </div>
                  <div className="metric-value-huge">0</div>
                  <small style={{ color: "var(--admin-navy)", fontWeight: 700 }}>Comité de Pilotage FES-ESS</small>
                </div>

                <div className="metric-card-pro">
                  <div className="metric-header">
                    <span className="metric-subtext">Régions Représentées</span>
                    <div className="metric-icon-wrap" style={{ background: "rgba(37, 211, 102, 0.15)", color: "#25D366" }}>
                      <i className="fas fa-map-marked-alt" />
                    </div>
                  </div>
                  <div className="metric-value-huge">{new Set(members.map((m) => m.region)).size} / 14</div>
                  <small style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>Couverture Nationale Sénégal</small>
                </div>
              </div>

              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-stream" style={{ color: "var(--admin-green)" }} /> Flux des Soumissions en Temps Réel
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Formulaires transmis en direct depuis le site web public.
                    </p>
                  </div>
                  <button onClick={() => switchTab("tab-web-forms")} className="action-btn-pill" style={{ fontSize: "0.8rem" }}>
                    Voir Tous les Dossiers
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Réf / Date</th>
                        <th>Type Formulaire</th>
                        <th>Nom / Structure</th>
                        <th>Contact Direct</th>
                        <th>Statut</th>
                        <th style={{ minWidth: "320px" }}>Actions & Traitement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <EmptyRow colSpan={6}>Aucune nouvelle soumission enregistrée pour le moment.</EmptyRow>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: WEB FORMS RECEPTION */}
          {activeTab === "tab-web-forms" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-inbox" style={{ color: "var(--admin-green)" }} /> Réception Globale des Formulaires Web
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Traitement complet : validation, rejet, suppression, export PDF, e-mail & WhatsApp.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => showToast("TODO(Supabase) : export CSV à brancher sur les données réelles.")}
                      className="action-btn-primary"
                      style={{ fontSize: "0.8rem", background: "var(--admin-navy)" }}
                    >
                      <i className="fas fa-file-excel" /> Exporter CSV
                    </button>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Référence</th>
                        <th>Date</th>
                        <th>Formulaire</th>
                        <th>Nom / Organisation</th>
                        <th>Téléphone / Email</th>
                        <th>Statut</th>
                        <th style={{ minWidth: "360px" }}>Actions Complètes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <EmptyRow colSpan={7}>Aucune donnée de formulaire disponible.</EmptyRow>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: ADHESIONS MEMBRES */}
          {activeTab === "tab-adhesions" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-id-card" style={{ color: "var(--admin-green)" }} /> Registre des Adhésions Membres
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Liste des organisations ayant validé leur adhésion au CONESESS.
                    </p>
                  </div>
                  <button onClick={() => setAddMemberOpen(true)} className="action-btn-primary" style={{ fontSize: "0.8rem", background: "var(--admin-green)" }}>
                    <i className="fas fa-plus" /> Ajouter Manuellement
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>N° Réf</th>
                        <th>Organisation</th>
                        <th>Forme Juridique</th>
                        <th>Région</th>
                        <th>Représentant Légal</th>
                        <th>Niveau Badge</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length === 0 ? (
                        <EmptyRow colSpan={7}>Aucun membre enregistré dans le registre.</EmptyRow>
                      ) : (
                        members.map((m) => (
                          <tr key={m.ref}>
                            <td>
                              <strong style={{ color: "var(--admin-green)" }}>{m.ref}</strong>
                            </td>
                            <td>
                              <strong>{m.name}</strong>
                            </td>
                            <td>{m.type}</td>
                            <td>{m.region}</td>
                            <td>{m.name}</td>
                            <td>
                              <span className="badge badge-green">{m.badgeRole}</span>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setBadgeName(m.name)
                                  setBadgeOrg(m.type)
                                  switchTab("tab-badges")
                                }}
                                className="btn-act btn-act-view"
                              >
                                <i className="fas fa-id-badge" /> Badge CR80
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: COMITÉ DE PILOTAGE */}
          {activeTab === "tab-steering" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-users-cog" style={{ color: "var(--admin-green)" }} /> Candidatures Comité de Pilotage
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Candidats inscrits pour le Comité de Pilotage du FES-ESS 2026.
                    </p>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Candidat</th>
                        <th>Organisation</th>
                        <th>Pôle Souhaité</th>
                        <th>Région</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <EmptyRow colSpan={7}>Aucune candidature pour le comité de pilotage.</EmptyRow>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 5: REGISTRE ENTREPRISES ESS */}
          {activeTab === "tab-members" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-building" style={{ color: "var(--admin-green)" }} /> Annuaire Général des Entreprises ESS
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Base consolidée des coopératives, mutuelles et entreprises de l'ESS au Sénégal.
                    </p>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Matricule</th>
                        <th>Structure</th>
                        <th>Type</th>
                        <th>Département</th>
                        <th>Téléphone</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length === 0 ? (
                        <EmptyRow colSpan={6}>Aucune structure enregistrée dans l'annuaire.</EmptyRow>
                      ) : (
                        members.map((m) => (
                          <tr key={m.ref}>
                            <td>
                              <strong>{m.ref}</strong>
                            </td>
                            <td>
                              <strong>{m.name}</strong>
                            </td>
                            <td>{m.type}</td>
                            <td>{m.region}</td>
                            <td>{m.phone}</td>
                            <td>
                              <span className="badge badge-green">Actif</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: CR80 BADGE STUDIO */}
          {activeTab === "tab-badges" && (
            <section className="admin-tab-content">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
                <div className="admin-table-card" style={{ margin: 0 }}>
                  <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                    <i className="fas fa-id-badge" style={{ color: "var(--admin-green)" }} /> Confection de Badge CR80
                  </h3>

                  <div className="wizard-form-group mb-3">
                    <label style={{ fontWeight: 600, fontSize: "0.825rem" }}>Sélectionner un Participant *</label>
                    <select
                      className="wizard-form-control"
                      onChange={(e) => {
                        const m = members.find((mm) => mm.ref === e.target.value)
                        if (m) {
                          setBadgeName(m.name)
                          setBadgeOrg(m.type)
                        }
                      }}
                    >
                      <option value="">-- Choisir dans la liste des membres --</option>
                      {members.map((m) => (
                        <option key={m.ref} value={m.ref}>
                          {m.name} ({m.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="wizard-form-group mb-3">
                    <label style={{ fontWeight: 600, fontSize: "0.825rem" }}>Nom & Prénom / Titulaire *</label>
                    <input type="text" className="wizard-form-control" placeholder="ex: Ousmane Sow" value={badgeName} onChange={(e) => setBadgeName(e.target.value)} />
                  </div>

                  <div className="wizard-form-group mb-3">
                    <label style={{ fontWeight: 600, fontSize: "0.825rem" }}>Organisation / Structure *</label>
                    <input
                      type="text"
                      className="wizard-form-control"
                      placeholder="ex: Coopérative Agricole de Saint-Louis"
                      value={badgeOrg}
                      onChange={(e) => setBadgeOrg(e.target.value)}
                    />
                  </div>

                  <div className="wizard-form-group mb-4">
                    <label style={{ fontWeight: 600, fontSize: "0.825rem" }}>Niveau d'Accès & Badge *</label>
                    <select
                      className="wizard-form-control"
                      value={badgeAccessLevel.value}
                      onChange={(e) => setBadgeAccessLevel(ACCESS_LEVELS.find((l) => l.value === e.target.value) ?? ACCESS_LEVELS[1])}
                    >
                      {ACCESS_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button onClick={() => window.print()} className="action-btn-primary" style={{ width: "100%", justifyContent: "center", background: "var(--admin-green)", padding: "0.75rem" }}>
                    <i className="fas fa-print" /> Imprimer / Télécharger Badge CR80
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div className="cr80-badge-preview">
                    <div className="badge-access-band" style={{ background: badgeAccessLevel.color }} />

                    <img src={logo} alt="Logo CONESESS" style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid #E9C46A", marginTop: "1rem", marginBottom: "0.5rem" }} />
                    <h4 style={{ margin: 0, fontSize: "0.9rem", letterSpacing: "0.05em" }}>CONESESS SÉNÉGAL</h4>
                    <small style={{ fontSize: "0.675rem", color: "#E9C46A", fontWeight: 700, textTransform: "uppercase" }}>FORA'ESS 2026 - DAKAR</small>

                    <div
                      style={{
                        margin: "1.5rem 0 1rem 0",
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        border: "3px solid #FFFFFF",
                        overflow: "hidden",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fas fa-user" style={{ fontSize: "3rem", color: "#64748B" }} />
                    </div>

                    <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF" }}>{badgeName || "Nom du Titulaire"}</h3>
                    <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.85)" }}>{badgeOrg || "Organisation / Structure"}</p>

                    <div
                      style={{
                        background: badgeAccessLevel.color,
                        padding: "0.4rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "1rem",
                      }}
                    >
                      {badgeAccessLevel.value}
                    </div>

                    <div style={{ background: "#FFFFFF", padding: "0.35rem", borderRadius: "8px" }}>
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=CONESESS-DEMO"
                        alt="QR Code"
                        style={{ width: "70px", height: "70px", display: "block" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 7: SCANNER ÉMARGEMENT */}
          {activeTab === "tab-checkin" && (
            <section className="admin-tab-content">
              <div className="admin-table-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem", color: "var(--admin-text-main)", textAlign: "center" }}>
                  <i className="fas fa-qrcode" style={{ color: "var(--admin-green)" }} /> Contrôle & Émargement des Badges
                </h3>
                <p style={{ textAlign: "center", fontSize: "0.825rem", color: "var(--admin-text-muted)" }} className="mb-4">
                  Saisissez ou scannez la référence du badge participant pour valider son accès.
                </p>

                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <input
                    type="text"
                    className="wizard-form-control"
                    placeholder="ex: CONESESS-2026-1001"
                    style={{ height: "44px", fontSize: "0.95rem" }}
                    value={checkinCode}
                    onChange={(e) => setCheckinCode(e.target.value)}
                  />
                  <button onClick={handleCheckin} className="action-btn-primary" style={{ background: "var(--admin-green)", fontSize: "0.9rem", padding: "0 1.25rem" }}>
                    <i className="fas fa-check-circle" /> Vérifier
                  </button>
                </div>

                {checkinResult && (
                  <div
                    style={{
                      padding: "1.25rem",
                      borderRadius: "12px",
                      textAlign: "center",
                      background: checkinResult === "valid" ? "#F0FDF4" : "#FEF2F2",
                      border: checkinResult === "valid" ? "2px solid #006837" : "2px solid #DC2626",
                      color: checkinResult === "valid" ? "#006837" : "#DC2626",
                    }}
                  >
                    {checkinResult === "valid" && checkinMatch ? (
                      <>
                        <i className="fas fa-check-circle" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }} />
                        <h3 style={{ margin: 0 }}>Badge Valide - Accès Autorisé</h3>
                        <p style={{ margin: "0.25rem 0 0 0" }}>
                          <strong>{checkinMatch.name}</strong> ({checkinMatch.type})
                        </p>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times-circle" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }} />
                        <h3 style={{ margin: 0 }}>Badge Non Reconnu</h3>
                        <p style={{ margin: "0.25rem 0 0 0" }}>Référence {checkinCode} introuvable dans le registre.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TAB 8: COMPTES ADMINS */}
          {activeTab === "tab-admins" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-user-shield" style={{ color: "var(--admin-green)" }} /> Gestion des Administrateurs
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Comptes d'accès habilités sur la plateforme d'administration.
                    </p>
                  </div>
                  <button onClick={() => setAddAdminOpen(true)} className="action-btn-primary" style={{ fontSize: "0.8rem", background: "var(--admin-navy)" }}>
                    <i className="fas fa-user-plus" /> Créer Compte Admin
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nom & Titulaire</th>
                        <th>Identifiant / E-mail</th>
                        <th>Mot de Passe</th>
                        <th>Service / Antenne</th>
                        <th>Rôle</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((a) => (
                        <tr key={a.email}>
                          <td>
                            <strong>{a.name}</strong>
                          </td>
                          <td>{a.email}</td>
                          <td>
                            <span style={{ fontFamily: "monospace" }}>••••••••</span>
                          </td>
                          <td>{a.org}</td>
                          <td>
                            <span className="badge badge-navy">{a.role}</span>
                          </td>
                          <td>
                            <span className="badge badge-green">Actif</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 9: SETTINGS & RELAIS CLOUD */}
          {activeTab === "tab-settings" && (
            <section className="admin-tab-content">
              <div className="admin-table-card" style={{ maxWidth: "650px" }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                  <i className="fas fa-cloud" style={{ color: "var(--admin-green)" }} /> Configuration Relais Cloud Inter-Appareils
                </h3>
                <p style={{ fontSize: "0.825rem", color: "var(--admin-text-muted)" }} className="mb-4">
                  {/* TODO(Supabase): this whole panel (a raw crudcrud.com relay key)
                      should be removed once Supabase is wired up as the real backend. */}
                  Clé d'API relais utilisée pour la synchronisation automatique en temps réel entre votre téléphone et votre
                  ordinateur.
                </p>

                <div className="wizard-form-group mb-3">
                  <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Endpoint Relais Cloud Actif *</label>
                  <input
                    type="text"
                    className="wizard-form-control"
                    defaultValue="https://crudcrud.com/api/8484295837b1490394750b39c131212e/submissions"
                    style={{ height: "38px", fontSize: "0.825rem" }}
                  />
                </div>

                <button
                  onClick={() => showToast("Endpoint de synchronisation cloud mis à jour !")}
                  className="action-btn-primary"
                  style={{ background: "var(--admin-navy)", fontSize: "0.825rem" }}
                >
                  <i className="fas fa-key" /> Enregistrer Clé API
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODAL: CONNEXION & GESTION DE SESSION ADMIN */}
      {loginModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1060, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "var(--admin-card-bg-light)", borderRadius: "20px", padding: "2rem", maxWidth: "440px", width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <img src={logo} alt="Logo CONESESS" style={{ width: "60px", height: "60px", borderRadius: "50%", border: "3px solid var(--admin-green)", marginBottom: "0.5rem" }} />
              <h3 style={{ margin: 0, color: "var(--admin-text-main)", fontSize: "1.3rem" }}>Session Administrateur</h3>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Authentification Super Admin Confédéral</p>
            </div>

            <div style={{ background: "var(--admin-soft-green)", border: "1px solid var(--admin-green)", padding: "1rem", borderRadius: "12px", marginBottom: "1.25rem" }}>
              <small style={{ color: "var(--admin-green)", fontWeight: 800, display: "block", textTransform: "uppercase" }}>Session Active</small>
              <strong style={{ color: "var(--admin-text-main)", fontSize: "0.95rem", display: "block" }}>Madior (Super Administrateur)</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>madior1991@gmail.com</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                // TODO(Supabase): real auth check against Supabase Auth.
                showToast("Session Madior (Super Administrateur) confirmée !")
                setLoginModalOpen(false)
              }}
            >
              <div className="wizard-form-group mb-3">
                <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>E-mail Administrateur</label>
                <input type="email" className="wizard-form-control" defaultValue="madior1991@gmail.com" required style={{ height: "38px" }} />
              </div>
              <div className="wizard-form-group mb-4">
                <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Mot de Passe</label>
                <input type="password" className="wizard-form-control" defaultValue="admin" required style={{ height: "38px" }} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="action-btn-primary" style={{ flex: 1, justifyContent: "center", background: "var(--admin-green)" }}>
                  Connexion
                </button>
                <button type="button" onClick={() => setLoginModalOpen(false)} className="action-btn-pill">
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUALLY ADD MEMBER */}
      {addMemberOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1060, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--admin-card-bg-light)", borderRadius: "20px", padding: "2rem", maxWidth: "500px", width: "90%" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "var(--admin-text-main)" }}>Ajouter un Membre Manuellement</h3>
            <form onSubmit={handleAddMember}>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Nom de la Structure *</label>
                <input type="text" name="manual-name" className="wizard-form-control" required placeholder="ex: GIE Fass Diom" />
              </div>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Forme Juridique *</label>
                <select name="manual-type" className="wizard-form-control" required defaultValue="Coopérative">
                  <option>Coopérative</option>
                  <option>Association</option>
                  <option>GIE</option>
                  <option>Entreprise Sociale</option>
                  <option>Mutuelle</option>
                </select>
              </div>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Région *</label>
                <select name="manual-region" className="wizard-form-control" required defaultValue={REGIONS[0]}>
                  {REGIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="wizard-form-group mb-3">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Téléphone *</label>
                <input type="tel" name="manual-phone" className="wizard-form-control" required placeholder="+221 77 000 00 00" />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="action-btn-primary" style={{ flex: 1, justifyContent: "center", background: "var(--admin-green)" }}>
                  Enregistrer
                </button>
                <button type="button" onClick={() => setAddMemberOpen(false)} className="action-btn-pill">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN ACCOUNT */}
      {addAdminOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1060, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--admin-card-bg-light)", borderRadius: "20px", padding: "2rem", maxWidth: "480px", width: "90%" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "var(--admin-text-main)" }}>Créer un Compte Administrateur</h3>
            <form onSubmit={handleAddAdmin}>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Nom & Prénom *</label>
                <input type="text" name="new-admin-name" className="wizard-form-control" required placeholder="ex: Fatou Diop" />
              </div>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>E-mail *</label>
                <input type="email" name="new-admin-email" className="wizard-form-control" required placeholder="fatou@conesess.sn" />
              </div>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Mot de Passe *</label>
                <input type="password" name="new-admin-pass" className="wizard-form-control" required defaultValue="admin123" />
              </div>
              <div className="wizard-form-group mb-3">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Rôle & Accès *</label>
                <select name="new-admin-role" className="wizard-form-control" required defaultValue="Super Administrateur Confédéral">
                  <option>Super Administrateur Confédéral</option>
                  <option>Administrateur Général</option>
                  <option>Opérateur Studio Badges & Émargement</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="action-btn-primary" style={{ flex: 1, justifyContent: "center", background: "var(--admin-navy)" }}>
                  Créer Compte
                </button>
                <button type="button" onClick={() => setAddAdminOpen(false)} className="action-btn-pill">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}
