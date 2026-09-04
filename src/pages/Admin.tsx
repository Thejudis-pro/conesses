import jsQR from "jsqr"
import { useEffect, useRef, useState } from "react"
import logo from "@/assets/images/logo.jpg"
import { useToasts } from "@/components/Toast"
import {
  ADHESION_TYPES,
  CANDIDATURE_TYPE,
  deleteWebForm,
  downloadWebFormsExcel,
  downloadWebFormsWord,
  fetchAllAdminAccounts,
  fetchPendingAdminAccounts,
  fetchWebForms,
  grantRole,
  revokeRole,
  updateWebFormStatus,
  type AdminAccount,
  type PendingAdminAccount,
  type StaffRole,
} from "@/lib/adminData"
import {
  createBadgeAccessLevel,
  deleteBadgeAccessLevel,
  fetchBadgeAccessLevels,
  tierIcon,
  TIER_LABELS,
  updateBadgeAccessLevel,
  type BadgeAccessLevel,
  type BadgeAccessTier,
} from "@/lib/badgeAccessLevels"
import { buildGmailComposeUrl } from "@/lib/gmail"
import { createNewsPost, deleteNewsPost, fetchAllNewsAdmin, setNewsPostPublished, updateNewsPost, uploadNewsImages, type NewsPost } from "@/lib/news"
import { downloadSubmissionReceipt } from "@/lib/pdfReceipt"
import { useAdminAuth } from "@/lib/useAdminAuth"
import type { Tables } from "@/integrations/supabase/types"
import "@/styles/admin-legacy.css"

type WebForm = Tables<"web_forms">

type TabId =
  | "tab-dashboard"
  | "tab-web-forms"
  | "tab-adhesions"
  | "tab-steering"
  | "tab-members"
  | "tab-news"
  | "tab-badges"
  | "tab-checkin"
  | "tab-admins"
  | "tab-access-levels"

interface Member {
  ref: string
  name: string
  type: string
  region: string
  phone: string
  badgeRole: string
}

const REGIONS = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Fatick", "Kaolack", "Kaffrine", "Louga",
  "Matam", "Kolda", "Kédougou", "Sédhiou", "Tambacounda", "Ziguinchor",
]

interface NavItem {
  id: TabId
  icon: string
  label: string
  /** Visible to checkin_agent-only accounts (who see nothing else). */
  checkinAgentVisible?: boolean
  /** Visible only to super_admin, regardless of general admin access. */
  superAdminOnly?: boolean
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "SUPERVISION CENTRALISÉE",
    items: [
      { id: "tab-dashboard", icon: "fas fa-chart-line", label: "Tableau de Bord" },
      { id: "tab-web-forms", icon: "fas fa-inbox", label: "Réception Formulaires" },
    ],
  },
  {
    title: "REGISTRES & DOSSIERS",
    items: [
      { id: "tab-adhesions", icon: "fas fa-id-card", label: "Adhésions Membres" },
      { id: "tab-steering", icon: "fas fa-users-cog", label: "Comité de Pilotage" },
      { id: "tab-members", icon: "fas fa-database", label: "Base de Données CONESESS" },
      { id: "tab-news", icon: "fas fa-newspaper", label: "Actualités" },
    ],
  },
  {
    title: "STUDIO BADGES & ÉMARGEMENT",
    items: [
      { id: "tab-badges", icon: "fas fa-id-badge", label: "Confection Badges CR80", checkinAgentVisible: true },
      { id: "tab-checkin", icon: "fas fa-qrcode", label: "Scanner Émargement", checkinAgentVisible: true },
    ],
  },
  {
    title: "PARAMÈTRES & ACCÈS",
    items: [
      { id: "tab-admins", icon: "fas fa-user-shield", label: "Comptes Administrateurs", superAdminOnly: true },
      { id: "tab-access-levels", icon: "fas fa-key", label: "Niveaux d'Accès Badges", superAdminOnly: true },
    ],
  },
]

const STAFF_ROLES: StaffRole[] = ["admin", "checkin_agent", "super_admin"]

const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin Général",
  checkin_agent: "Agent Check-in",
  super_admin: "Super Admin",
}

const EmptyRow = ({ colSpan, children }: { colSpan: number; children: React.ReactNode }) => (
  <tr>
    <td colSpan={colSpan} style={{ textAlign: "center", color: "var(--admin-text-muted)", padding: "2rem" }}>
      {children}
    </td>
  </tr>
)

const STATUS_BADGE_CLASS = (status: string) => (status === "Approuvé" ? "badge-green" : status === "Rejeté" ? "badge-navy" : "badge-gold")

const webFormDetailText = (row: WebForm, key: string) => {
  const v = (row.details as Record<string, unknown> | null)?.[key]
  return typeof v === "string" || typeof v === "number" ? String(v) : ""
}

const handleDownloadWebForm = (row: WebForm) => {
  downloadSubmissionReceipt({
    formType: row.form_type,
    reference: row.reference,
    fields: [
      { label: "Nom du Contact", value: row.contact_name ?? "" },
      { label: "Organisation", value: row.org_name ?? "" },
      { label: "E-mail", value: row.email ?? "" },
      { label: "Téléphone", value: row.phone ?? "" },
      { label: "Région", value: row.region ?? "" },
      { label: "Département / Commune", value: webFormDetailText(row, "commune") },
      { label: "Secteur d'activité", value: row.sector ?? "" },
      { label: "Forme Juridique", value: row.legal_form ?? "" },
      { label: "Poste Souhaité", value: row.role_wanted ?? "" },
      { label: "Nombre de Membres / Salariés", value: webFormDetailText(row, "staff_count") },
      { label: "Présentation de l'Organisation", value: webFormDetailText(row, "presentation") },
      { label: "Message / Motivation", value: row.message ?? "" },
      { label: "Statut", value: row.status },
    ],
  })
}

function ActionButtons({
  row,
  onView,
  onApprove,
  onReject,
  onDelete,
}: {
  row: WebForm
  onView?: () => void
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
}) {
  return (
    <div className="btn-group-actions">
      {onView && (
        <button onClick={onView} className="btn-act btn-act-view" title="Voir le Formulaire Complet">
          <i className="fas fa-eye" /> Voir
        </button>
      )}
      <button onClick={() => handleDownloadWebForm(row)} className="btn-act btn-act-pdf" title="Télécharger le Formulaire (PDF)">
        <i className="fas fa-file-pdf" /> Télécharger
      </button>
      <button onClick={onApprove} className="btn-act btn-act-approve" title="Accepter et Valider">
        <i className="fas fa-check" /> Accepter
      </button>
      <button onClick={onReject} className="btn-act btn-act-reject" title="Rejeter la Demande">
        <i className="fas fa-times" /> Rejeter
      </button>
      {row.email && (
        <a
          className="btn-act btn-act-email"
          title="Envoyer un E-mail"
          target="_blank"
          rel="noopener noreferrer"
          href={buildGmailComposeUrl({
            to: row.email,
            subject: `CONESESS - Suivi de votre Dossier ${row.reference}`,
            body: `Bonjour ${row.contact_name ?? ""},\n\nNous avons bien reçu votre formulaire pour "${row.org_name ?? row.contact_name ?? ""}". Votre dossier (Réf: ${row.reference}) est en cours de traitement par le Secrétariat Général Confédéral.\n\nCordialement,\nLe CONESESS Sénégal`,
          })}
        >
          <i className="fas fa-envelope" /> Mail
        </a>
      )}
      {row.phone && (
        <a
          className="btn-act btn-act-wa"
          title="Envoyer sur WhatsApp"
          href={`https://wa.me/${row.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
            `Bonjour ${row.contact_name ?? ""}, le CONESESS a bien reçu votre dossier (${row.reference}) pour "${row.org_name ?? row.contact_name ?? ""}".`,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-whatsapp" /> WhatsApp
        </a>
      )}
      <button onClick={onDelete} className="btn-act btn-act-delete" title="Supprimer Définitivement">
        <i className="fas fa-trash-alt" /> Supprimer
      </button>
    </div>
  )
}

const DetailField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ marginBottom: "1rem" }}>
    <span style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--admin-text-muted)", marginBottom: "0.2rem" }}>
      {label}
    </span>
    <span style={{ fontSize: "0.9rem", color: "var(--admin-text-body)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{value || "—"}</span>
  </div>
)

function WebFormDetailModal({
  row,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: {
  row: WebForm
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
}) {
  const detailText = (key: string) => webFormDetailText(row, key)

  return (
    <div className="modal-overlay show">
      <div className="modal-card" style={{ maxWidth: "720px" }}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem", paddingRight: "2rem" }}>
          <div>
            <span className={`badge ${row.form_type === CANDIDATURE_TYPE ? "badge-gold" : "badge-green"}`} style={{ marginBottom: "0.5rem" }}>
              {row.form_type}
            </span>
            <h3 style={{ margin: "0.4rem 0 0 0", color: "var(--admin-text-main)", fontSize: "1.3rem", fontWeight: 700 }}>{row.reference}</h3>
            <small style={{ color: "var(--admin-text-muted)" }}>Reçu le {new Date(row.created_at).toLocaleString("fr-FR")}</small>
          </div>
          <span className={`badge ${STATUS_BADGE_CLASS(row.status)}`}>{row.status}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0 1.5rem" }}>
          <DetailField label="Nom du Contact" value={row.contact_name} />
          <DetailField label="Organisation" value={row.org_name} />
          <DetailField label="E-mail" value={row.email} />
          <DetailField label="Téléphone" value={row.phone} />
          <DetailField label="Région" value={row.region} />
          <DetailField label="Département / Commune" value={detailText("commune")} />
          <DetailField label="Secteur d'activité" value={row.sector} />
          <DetailField label="Forme Juridique" value={row.legal_form} />
          {row.role_wanted && <DetailField label="Poste Souhaité" value={row.role_wanted} />}
          {detailText("staff_count") && <DetailField label="Nombre de Membres / Salariés" value={detailText("staff_count")} />}
        </div>

        {detailText("presentation") && <DetailField label="Présentation de l'Organisation" value={detailText("presentation")} />}
        {row.message && <DetailField label="Message / Motivation" value={row.message} />}

        <div style={{ borderTop: "1px solid var(--admin-border-light)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
          <ActionButtons
            row={row}
            onApprove={() => {
              onApprove()
              onClose()
            }}
            onReject={() => {
              onReject()
              onClose()
            }}
            onDelete={() => {
              onDelete()
              onClose()
            }}
          />
        </div>
      </div>
    </div>
  )
}

function AdminLoginGate({
  authError,
  onSignIn,
  onSignUp,
  loading,
}: {
  authError: string | null
  onSignIn: (email: string, password: string) => void
  onSignUp: (email: string, password: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>
  loading: boolean
}) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signUpDone, setSignUpDone] = useState(false)

  const switchMode = (next: "login" | "register") => {
    setMode(next)
    setSignUpError(null)
    setSignUpDone(false)
    setPassword("")
    setConfirmPassword("")
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSignUpError(null)
    if (password !== confirmPassword) {
      setSignUpError("Les mots de passe ne correspondent pas.")
      return
    }
    if (password.length < 6) {
      setSignUpError("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }
    const { error } = await onSignUp(email, password)
    if (error) {
      setSignUpError(error)
      return
    }
    setSignUpDone(true)
  }

  return (
    <div className="admin-app-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1rem" }}>
      <div style={{ background: "var(--admin-card-bg-light)", borderRadius: "20px", padding: "2.5rem", maxWidth: "440px", width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img src={logo} alt="Logo CONESESS" style={{ width: "60px", height: "60px", borderRadius: "50%", border: "3px solid var(--admin-green)", marginBottom: "0.75rem" }} />
          <h3 style={{ margin: 0, color: "var(--admin-text-main)", fontSize: "1.3rem" }}>Espace Administrateur</h3>
          <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
            {mode === "login" ? "Connexion réservée aux comptes habilités" : "Demander la création d'un compte"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.4rem", background: "var(--admin-bg-light)", borderRadius: "999px", padding: "0.25rem", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={() => switchMode("login")}
            style={{
              flex: 1, border: "none", borderRadius: "999px", padding: "0.5rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              background: mode === "login" ? "var(--admin-card-bg-light)" : "transparent",
              color: mode === "login" ? "var(--admin-text-main)" : "var(--admin-text-muted)",
              boxShadow: mode === "login" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            style={{
              flex: 1, border: "none", borderRadius: "999px", padding: "0.5rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              background: mode === "register" ? "var(--admin-card-bg-light)" : "transparent",
              color: mode === "register" ? "var(--admin-text-main)" : "var(--admin-text-muted)",
              boxShadow: mode === "register" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Créer un compte
          </button>
        </div>

        {mode === "login" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSignIn(email, password)
            }}
          >
            <div className="wizard-form-group mb-3">
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>E-mail Administrateur</label>
              <input type="email" className="wizard-form-control" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ height: "42px" }} />
            </div>
            <div className="wizard-form-group mb-3">
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Mot de Passe</label>
              <input type="password" className="wizard-form-control" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ height: "42px" }} />
            </div>

            {authError && (
              <p style={{ color: "#DC2626", fontSize: "0.825rem", fontWeight: 600, marginBottom: "1rem" }}>
                {authError === "not-admin" ? "Ce compte n'a pas le rôle administrateur." : "Identifiants invalides."}
              </p>
            )}

            <button type="submit" disabled={loading} className="action-btn-primary" style={{ width: "100%", justifyContent: "center", background: "var(--admin-green)", padding: "0.75rem" }}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        ) : signUpDone ? (
          <div style={{ textAlign: "center" }}>
            <i className="fas fa-envelope-circle-check" style={{ fontSize: "2rem", color: "var(--admin-green)", marginBottom: "0.75rem", display: "block" }} />
            <p style={{ fontSize: "0.875rem", color: "var(--admin-text-body)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Compte créé pour <strong>{email}</strong>. Confirmez votre adresse via le lien reçu par e-mail, puis demandez à un
              administrateur existant de vous attribuer le rôle administrateur.
            </p>
            <button type="button" onClick={() => switchMode("login")} className="action-btn-pill" style={{ width: "100%", justifyContent: "center" }}>
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignUp}>
            <div className="wizard-form-group mb-3">
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>E-mail</label>
              <input type="email" className="wizard-form-control" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ height: "42px" }} />
            </div>
            <div className="wizard-form-group mb-3">
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Mot de Passe</label>
              <input type="password" className="wizard-form-control" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} style={{ height: "42px" }} />
            </div>
            <div className="wizard-form-group mb-3">
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Confirmer le Mot de Passe</label>
              <input type="password" className="wizard-form-control" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ height: "42px" }} />
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
              Après confirmation de l'e-mail, le rôle administrateur doit encore être attribué manuellement par un administrateur
              existant — créer un compte ne donne pas accès au tableau de bord.
            </p>

            {signUpError && <p style={{ color: "#DC2626", fontSize: "0.825rem", fontWeight: 600, marginBottom: "1rem" }}>{signUpError}</p>}

            <button type="submit" disabled={loading} className="action-btn-primary" style={{ width: "100%", justifyContent: "center", background: "var(--admin-navy)", padding: "0.75rem" }}>
              {loading ? "Création..." : "Créer le compte"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { loading: authLoading, session, isAdmin, isSuperAdmin, isCheckinAgent, authError: rawAuthError, signIn, signUp, signOut } = useAdminAuth()
  const checkinOnly = isCheckinAgent && !isAdmin
  const [loginError, setLoginError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<TabId>("tab-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { showToast, ToastContainer } = useToasts()

  const [addMemberOpen, setAddMemberOpen] = useState(false)

  const [webForms, setWebForms] = useState<WebForm[]>([])
  const [webFormsLoading, setWebFormsLoading] = useState(false)
  const [webFormsError, setWebFormsError] = useState<string | null>(null)
  const [viewingForm, setViewingForm] = useState<WebForm | null>(null)

  const [pendingAccounts, setPendingAccounts] = useState<PendingAdminAccount[]>([])
  const [pendingAccountsLoading, setPendingAccountsLoading] = useState(false)
  const [pendingAccountsError, setPendingAccountsError] = useState<string | null>(null)
  const [grantingId, setGrantingId] = useState<string | null>(null)
  const [pendingRoleChoice, setPendingRoleChoice] = useState<Record<string, StaffRole>>({})

  const [allAdmins, setAllAdmins] = useState<AdminAccount[]>([])
  const [allAdminsLoading, setAllAdminsLoading] = useState(false)
  const [allAdminsError, setAllAdminsError] = useState<string | null>(null)
  const [revokingKey, setRevokingKey] = useState<string | null>(null)

  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [newsModalOpen, setNewsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null)
  const [newsSaving, setNewsSaving] = useState(false)
  const [newsImages, setNewsImages] = useState<string[]>([])
  const [newsImagesUploading, setNewsImagesUploading] = useState(false)

  // TODO(Supabase): manual additions to "Base de Données CONESESS" (badge
  // studio / check-in too) still use this local-only list — no
  // `organizations` table exists yet. Accepted "Adhésion Membre" web_forms
  // rows are read directly from `webForms` instead (see `approvedMembers`).
  const [members, setMembers] = useState<Member[]>([])

  const [badgeName, setBadgeName] = useState("")
  const [badgeOrg, setBadgeOrg] = useState("")
  const [badgeAccessLevels, setBadgeAccessLevels] = useState<BadgeAccessLevel[]>([])
  const [badgeLevelsError, setBadgeLevelsError] = useState<string | null>(null)
  const [badgeAccessLevelId, setBadgeAccessLevelId] = useState<string>("")
  const badgeAccessLevel = badgeAccessLevels.find((l) => l.id === badgeAccessLevelId) ?? badgeAccessLevels[0] ?? null
  const previewColor = badgeAccessLevel?.color ?? "#006837"
  const previewIcon = badgeAccessLevel ? tierIcon(badgeAccessLevel.access_tier) : "fa-id-badge"
  const previewLabel = badgeAccessLevel?.label ?? "Aucune catégorie configurée"
  const [badgeRef, setBadgeRef] = useState("")

  // New-category form, shared between the "Niveaux d'Accès Badges" settings
  // tab and the inline "+ Nouvelle catégorie" shortcut in the Badge Studio.
  const [newLevelLabel, setNewLevelLabel] = useState("")
  const [newLevelTier, setNewLevelTier] = useState<BadgeAccessTier>("total")
  const [newLevelColor, setNewLevelColor] = useState("#006837")
  const [levelActionError, setLevelActionError] = useState<string | null>(null)
  const [showAddLevelForm, setShowAddLevelForm] = useState(false)

  const [checkinCode, setCheckinCode] = useState("")
  const [checkinResult, setCheckinResult] = useState<"valid" | "invalid" | null>(null)
  const [checkinMatch, setCheckinMatch] = useState<Member | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const loadWebForms = async () => {
    setWebFormsLoading(true)
    const { data, error } = await fetchWebForms()
    setWebFormsLoading(false)
    if (error) {
      setWebFormsError(error)
      return
    }
    setWebFormsError(null)
    setWebForms(data)
  }

  const loadPendingAccounts = async () => {
    setPendingAccountsLoading(true)
    const { data, error } = await fetchPendingAdminAccounts()
    setPendingAccountsLoading(false)
    if (error) {
      setPendingAccountsError(error)
      return
    }
    setPendingAccountsError(null)
    setPendingAccounts(data)
  }

  const loadAllAdmins = async () => {
    setAllAdminsLoading(true)
    const { data, error } = await fetchAllAdminAccounts()
    setAllAdminsLoading(false)
    if (error) {
      setAllAdminsError(error)
      return
    }
    setAllAdminsError(null)
    setAllAdmins(data)
  }

  const loadNews = async () => {
    setNewsLoading(true)
    const { data, error } = await fetchAllNewsAdmin()
    setNewsLoading(false)
    if (error) {
      setNewsError(error)
      return
    }
    setNewsError(null)
    setNewsPosts(data)
  }

  const loadBadgeAccessLevels = async () => {
    const { data, error } = await fetchBadgeAccessLevels()
    if (error) {
      setBadgeLevelsError(error)
      return
    }
    setBadgeLevelsError(null)
    setBadgeAccessLevels(data)
  }

  useEffect(() => {
    if (session && isAdmin) {
      loadWebForms()
      loadNews()
    }
    if (session && isSuperAdmin) {
      loadPendingAccounts()
      loadAllAdmins()
    }
    // Badge studio is also reachable by checkin-only agents, who need the
    // category list to hand out free/comp badges on event day.
    if (session && (isAdmin || isCheckinAgent)) {
      loadBadgeAccessLevels()
    }
  }, [session, isAdmin, isSuperAdmin, isCheckinAgent])

  // Checkin-only agents have nothing to see on the dashboard — land them
  // straight on the badge studio instead.
  useEffect(() => {
    if (checkinOnly) setActiveTab("tab-badges")
  }, [checkinOnly])

  const handleGrantRole = async (account: PendingAdminAccount) => {
    const role = pendingRoleChoice[account.id] ?? "admin"
    setGrantingId(account.id)
    const err = await grantRole(account.id, role)
    setGrantingId(null)
    if (err) return showToast(`Erreur : ${err}`)
    showToast(`✅ Rôle « ${ROLE_LABELS[role]} » accordé à ${account.email}.`)
    loadPendingAccounts()
    loadAllAdmins()
  }

  const handleRevokeRole = async (account: AdminAccount) => {
    if (!window.confirm(`Retirer le rôle « ${ROLE_LABELS[account.role]} » à ${account.email} ?`)) return
    setRevokingKey(`${account.id}:${account.role}`)
    const err = await revokeRole(account.id, account.role)
    setRevokingKey(null)
    if (err) return showToast(`Erreur : ${err}`)
    showToast(`Rôle retiré à ${account.email}.`)
    loadAllAdmins()
  }

  const handleAddBadgeLevel = async () => {
    if (!newLevelLabel.trim()) return setLevelActionError("Le nom de la catégorie est requis.")
    const { id, error: err } = await createBadgeAccessLevel({
      label: newLevelLabel.trim(),
      access_tier: newLevelTier,
      color: newLevelColor,
      sort_order: badgeAccessLevels.length,
    })
    if (err) return setLevelActionError(err)
    setLevelActionError(null)
    setNewLevelLabel("")
    setNewLevelTier("total")
    setNewLevelColor("#006837")
    await loadBadgeAccessLevels()
    if (id) setBadgeAccessLevelId(id)
    setShowAddLevelForm(false)
  }

  const handleUpdateBadgeLevel = async (id: string, input: Partial<{ label: string; access_tier: BadgeAccessTier; color: string }>) => {
    const err = await updateBadgeAccessLevel(id, input)
    if (err) return showToast(`Erreur : ${err}`)
    loadBadgeAccessLevels()
  }

  const handleDeleteBadgeLevel = async (level: BadgeAccessLevel) => {
    if (!window.confirm(`Supprimer la catégorie « ${level.label} » ?`)) return
    const err = await deleteBadgeAccessLevel(level.id)
    if (err) return showToast(`Erreur : ${err}`)
    showToast(`Catégorie « ${level.label} » supprimée.`)
    loadBadgeAccessLevels()
  }

  const openCreatePost = () => {
    setEditingPost(null)
    setNewsImages([])
    setNewsModalOpen(true)
  }

  const openEditPost = (post: NewsPost) => {
    setEditingPost(post)
    setNewsImages(post.image_urls ?? [])
    setNewsModalOpen(true)
  }

  const handleAddNewsImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setNewsImagesUploading(true)
    const { urls, error } = await uploadNewsImages(Array.from(files))
    setNewsImagesUploading(false)
    if (error) return showToast(`Erreur d'envoi de l'image : ${error}`)
    setNewsImages((prev) => [...prev, ...urls])
  }

  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim()
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value.trim()
    const published = (form.elements.namedItem("published") as HTMLInputElement).checked
    if (!title || !content) return

    setNewsSaving(true)
    const input = { title, content, image_urls: newsImages, published }
    const err = editingPost ? await updateNewsPost(editingPost.id, input) : await createNewsPost(input)
    setNewsSaving(false)

    if (err) return showToast(`Erreur : ${err}`)
    showToast(editingPost ? "✏️ Publication mise à jour." : "✅ Publication créée.")
    setNewsModalOpen(false)
    loadNews()
  }

  const handleTogglePublished = async (post: NewsPost) => {
    const err = await setNewsPostPublished(post.id, !post.published)
    if (err) return showToast(`Erreur : ${err}`)
    showToast(post.published ? "Publication dépubliée." : "✅ Publication mise en ligne.")
    loadNews()
  }

  const handleDeleteNews = async (post: NewsPost) => {
    if (!window.confirm(`Supprimer définitivement la publication « ${post.title} » ?`)) return
    const err = await deleteNewsPost(post.id)
    if (err) return showToast(`Erreur : ${err}`)
    showToast("🗑️ Publication supprimée.")
    loadNews()
  }

  const handleSignIn = async (email: string, password: string) => {
    setLoginError(null)
    const err = await signIn(email, password)
    if (err) setLoginError(err)
  }

  const handleApprove = async (row: WebForm) => {
    const err = await updateWebFormStatus(row.id, "Approuvé")
    if (err) return showToast(`Erreur : ${err}`)
    showToast(`✅ Dossier ${row.contact_name ?? row.reference} accepté.`)
    loadWebForms()
  }

  const handleReject = async (row: WebForm) => {
    const err = await updateWebFormStatus(row.id, "Rejeté")
    if (err) return showToast(`Erreur : ${err}`)
    showToast(`❌ Dossier ${row.contact_name ?? row.reference} rejeté.`)
    loadWebForms()
  }

  const handleDelete = async (row: WebForm) => {
    if (!window.confirm("⚠️ Souhaitez-vous supprimer définitivement ce formulaire de la base de données ?")) return
    const err = await deleteWebForm(row.id)
    if (err) return showToast(`Erreur : ${err}`)
    showToast("🗑️ Soumission supprimée de la plateforme.")
    loadWebForms()
  }

  const handleExportExcel = () => {
    downloadWebFormsExcel(webForms, `CONESESS_Formulaires_Web_${new Date().toISOString().slice(0, 10)}.xls`)
  }

  const handleExportAdhesionsWord = () => {
    downloadWebFormsWord(adhesionForms, "Registre des Adhésions Membres — CONESESS", `CONESESS_Adhesions_${new Date().toISOString().slice(0, 10)}.doc`)
  }

  const handleExportSteeringWord = () => {
    downloadWebFormsWord(steeringForms, "Candidatures Comité de Pilotage — CONESESS", `CONESESS_Candidatures_Comite_Pilotage_${new Date().toISOString().slice(0, 10)}.doc`)
  }

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
    setMembers((prev) => [...prev, { ref: `CONESESS-2026-${Math.floor(1000 + Math.random() * 9000)}`, name, type, region, phone, badgeRole: "Membre Titulaire" }])
    setAddMemberOpen(false)
    showToast(`Membre ${name} ajouté au registre !`)
  }

  const handleCheckin = (codeOverride?: string) => {
    const code = (codeOverride ?? checkinCode).trim()
    if (!code) return
    const match = members.find((m) => m.ref === code) ?? null
    setCheckinMatch(match)
    setCheckinResult(match ? "valid" : "invalid")
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  const startCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOn(true)
    } catch {
      setCameraError("Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur.")
    }
  }

  // Live QR scanning while the camera is on: each frame is drawn to an
  // off-screen canvas and decoded with jsQR (pure JS, works in every
  // browser) — the native BarcodeDetector API was tried first but has poor
  // desktop support (undefined outside ChromeOS/Android in practice).
  useEffect(() => {
    if (!cameraOn) return
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    let stopped = false
    let raf = 0
    const scan = () => {
      if (stopped) return
      const video = videoRef.current
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code?.data) {
          setCheckinCode(code.data)
          handleCheckin(code.data)
          stopCamera()
          return
        }
      }
      raf = requestAnimationFrame(scan)
    }
    raf = requestAnimationFrame(scan)
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOn])

  useEffect(() => {
    if (activeTab !== "tab-checkin") stopCamera()
  }, [activeTab])

  useEffect(() => stopCamera, [])

  // --- Auth gate ---
  if (authLoading) {
    return (
      <div className="admin-app-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "var(--admin-text-muted)" }}>Chargement...</p>
      </div>
    )
  }

  if (!session) {
    return <AdminLoginGate authError={loginError} loading={authLoading} onSignIn={handleSignIn} onSignUp={signUp} />
  }

  if (!isAdmin && !isCheckinAgent) {
    return (
      <div className="admin-app-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1rem", padding: "1rem" }}>
        <i className="fas fa-lock" style={{ fontSize: "2.5rem", color: "var(--admin-red)" }} />
        <p style={{ color: "var(--admin-text-main)", fontWeight: 600 }}>Ce compte n'a pas de rôle administrateur.</p>
        <button onClick={signOut} className="action-btn-pill">
          Se déconnecter
        </button>
      </div>
    )
  }

  const adhesionForms = webForms.filter((w) => ADHESION_TYPES.includes(w.form_type))
  const steeringForms = webForms.filter((w) => w.form_type === CANDIDATURE_TYPE)
  const regionsCount = new Set(webForms.map((w) => w.region).filter(Boolean)).size
  // A "Adhésion Membre" submission becomes part of the members database once accepted.
  const approvedMembers = webForms.filter((w) => w.form_type === "Adhésion Membre" && w.status === "Approuvé")

  return (
    <div className="admin-app-body" data-admin-theme={theme}>
      <div className="admin-app-wrapper">
        {sidebarOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1040 }} onClick={() => setSidebarOpen(false)} />}

        <aside className={`admin-sidebar${sidebarOpen ? " active" : ""}`}>
          <div className="admin-brand-header">
            <img src={logo} alt="Logo CONESESS" className="admin-brand-logo" />
            <div>
              <strong style={{ fontSize: "0.95rem", display: "block", color: "#FFFFFF" }}>CONESESS SÉNÉGAL</strong>
              <small style={{ color: "var(--admin-gold-bright)", fontSize: "0.725rem", fontWeight: 600 }}>Espace Administrateur</small>
            </div>
          </div>

          <nav className="admin-nav-menu">
            {NAV_GROUPS.map((group) => {
              const items = group.items.filter((item) => {
                if (checkinOnly) return item.checkinAgentVisible
                if (item.superAdminOnly) return isSuperAdmin
                return true
              })
              if (items.length === 0) return null
              return (
                <div key={group.title}>
                  <div className="admin-nav-section-title">{group.title}</div>
                  {items.map((item) => (
                    <a key={item.id} className={`admin-nav-item${activeTab === item.id ? " active" : ""}`} onClick={() => switchTab(item.id)}>
                      <i className={item.icon} /> <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              )
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <button
              onClick={signOut}
              className="action-btn-pill"
              style={{ width: "100%", justifyContent: "center", background: "rgba(220, 38, 38, 0.2)", color: "#FCA5A5", border: "1px solid #DC2626", fontSize: "0.75rem" }}
            >
              <i className="fas fa-sign-out-alt" /> Se déconnecter
            </button>
          </div>
        </aside>

        <main className="admin-viewport">
          <header className="admin-top-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button className="mobile-admin-toggle" onClick={() => setSidebarOpen((v) => !v)}>
                <i className="fas fa-bars" />
              </button>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.25rem", color: "var(--admin-text-main)", fontWeight: 700 }}>Espace Administrateur CONESESS</h1>
                <small style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>Connecté : {session.user.email}</small>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
              {!checkinOnly && (
                <button onClick={loadWebForms} className="action-btn-primary" style={{ background: "var(--admin-green)", color: "#FFFFFF", fontSize: "0.8rem", border: "none", padding: "0.55rem 0.9rem" }}>
                  <i className="fas fa-sync-alt" /> Actualiser Flux
                </button>
              )}
              <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} className="action-btn-pill" style={{ fontSize: "0.8rem", border: "1px solid var(--admin-border-light)" }}>
                <i className="fas fa-adjust" /> Thème
              </button>
            </div>
          </header>

          {webFormsError && !checkinOnly && (
            <div style={{ background: "var(--admin-soft-red)", border: "1px solid var(--admin-red)", color: "var(--admin-red)", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
              Erreur de chargement des formulaires : {webFormsError}
            </div>
          )}

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
                  <small style={{ color: "var(--admin-green)", fontWeight: 600 }}>
                    <i className="fas fa-arrow-up" /> En direct de Supabase
                  </small>
                </div>

                <div className="metric-card-pro">
                  <div className="metric-header">
                    <span className="metric-subtext">Adhésions Reçues</span>
                    <div className="metric-icon-wrap" style={{ background: "var(--admin-soft-gold)", color: "var(--admin-gold)" }}>
                      <i className="fas fa-building" />
                    </div>
                  </div>
                  <div className="metric-value-huge">{adhesionForms.length}</div>
                  <small style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>Formulaires d'adhésion / intérêt</small>
                </div>

                <div className="metric-card-pro">
                  <div className="metric-header">
                    <span className="metric-subtext">Candidatures Comité</span>
                    <div className="metric-icon-wrap" style={{ background: "rgba(10, 37, 64, 0.1)", color: "var(--admin-navy)" }}>
                      <i className="fas fa-users-cog" />
                    </div>
                  </div>
                  <div className="metric-value-huge">{steeringForms.length}</div>
                  <small style={{ color: "var(--admin-navy)", fontWeight: 600 }}>Comité de Pilotage FES-ESS</small>
                </div>

                <div className="metric-card-pro">
                  <div className="metric-header">
                    <span className="metric-subtext">Régions Représentées</span>
                    <div className="metric-icon-wrap" style={{ background: "rgba(37, 211, 102, 0.15)", color: "#25D366" }}>
                      <i className="fas fa-map-marked-alt" />
                    </div>
                  </div>
                  <div className="metric-value-huge">{regionsCount} / 14</div>
                  <small style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>Couverture Nationale Sénégal</small>
                </div>
              </div>

              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-stream" style={{ color: "var(--admin-green)" }} /> Flux des Soumissions en Temps Réel
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Formulaires transmis en direct depuis le site web public.</p>
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
                      {webFormsLoading ? (
                        <EmptyRow colSpan={6}>Chargement...</EmptyRow>
                      ) : webForms.length === 0 ? (
                        <EmptyRow colSpan={6}>Aucune nouvelle soumission enregistrée pour le moment.</EmptyRow>
                      ) : (
                        webForms.slice(0, 8).map((wf) => (
                          <tr key={wf.id}>
                            <td>
                              <strong style={{ color: "var(--admin-green)", display: "block" }}>{wf.reference}</strong>
                              <small style={{ color: "var(--admin-text-muted)" }}>{new Date(wf.created_at).toLocaleDateString("fr-FR")}</small>
                            </td>
                            <td>
                              <span className={`badge ${wf.form_type === CANDIDATURE_TYPE ? "badge-gold" : "badge-green"}`}>{wf.form_type}</span>
                            </td>
                            <td>
                              <strong>{wf.contact_name}</strong>
                              <br />
                              <small style={{ color: "var(--admin-text-muted)" }}>{wf.org_name ?? "Entreprise ESS"}</small>
                            </td>
                            <td>
                              {wf.phone}
                              <br />
                              <small style={{ color: "var(--admin-text-muted)" }}>{wf.email ?? ""}</small>
                            </td>
                            <td>
                              <span className={`badge ${STATUS_BADGE_CLASS(wf.status)}`}>{wf.status}</span>
                            </td>
                            <td>
                              <ActionButtons
                                row={wf}
                                onView={() => setViewingForm(wf)}
                                onApprove={() => handleApprove(wf)}
                                onReject={() => handleReject(wf)}
                                onDelete={() => handleDelete(wf)}
                              />
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

          {/* TAB 2: WEB FORMS RECEPTION */}
          {activeTab === "tab-web-forms" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-inbox" style={{ color: "var(--admin-green)" }} /> Réception Globale des Formulaires Web
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Traitement complet : validation, rejet, suppression, export CSV, e-mail & WhatsApp.</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={handleExportExcel} className="action-btn-primary" style={{ fontSize: "0.8rem", background: "var(--admin-navy)" }}>
                      <i className="fas fa-file-excel" /> Exporter Excel
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
                      {webFormsLoading ? (
                        <EmptyRow colSpan={7}>Chargement...</EmptyRow>
                      ) : webForms.length === 0 ? (
                        <EmptyRow colSpan={7}>Aucune donnée de formulaire disponible.</EmptyRow>
                      ) : (
                        webForms.map((wf) => (
                          <tr key={wf.id}>
                            <td>
                              <strong>{wf.reference}</strong>
                            </td>
                            <td>{new Date(wf.created_at).toLocaleString("fr-FR")}</td>
                            <td>
                              <span className="badge badge-navy">{wf.form_type}</span>
                            </td>
                            <td>
                              <strong>{wf.contact_name}</strong> ({wf.org_name ?? "Structure ESS"})
                            </td>
                            <td>
                              {wf.phone}
                              <br />
                              <small style={{ color: "var(--admin-text-muted)" }}>{wf.email ?? ""}</small>
                            </td>
                            <td>
                              <span className={`badge ${STATUS_BADGE_CLASS(wf.status)}`}>{wf.status}</span>
                            </td>
                            <td>
                              <ActionButtons
                                row={wf}
                                onView={() => setViewingForm(wf)}
                                onApprove={() => handleApprove(wf)}
                                onReject={() => handleReject(wf)}
                                onDelete={() => handleDelete(wf)}
                              />
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

          {/* TAB 3: ADHESIONS MEMBRES */}
          {activeTab === "tab-adhesions" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-id-card" style={{ color: "var(--admin-green)" }} /> Registre des Adhésions Membres
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Demandes d'adhésion et manifestations d'intérêt reçues via le site web.</p>
                  </div>
                  <button onClick={handleExportAdhesionsWord} className="action-btn-primary" style={{ fontSize: "0.8rem", background: "var(--admin-navy)" }}>
                    <i className="fas fa-file-word" /> Exporter Word
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
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webFormsLoading ? (
                        <EmptyRow colSpan={7}>Chargement...</EmptyRow>
                      ) : adhesionForms.length === 0 ? (
                        <EmptyRow colSpan={7}>Aucune demande d'adhésion enregistrée.</EmptyRow>
                      ) : (
                        adhesionForms.map((wf) => (
                          <tr key={wf.id}>
                            <td>
                              <strong style={{ color: "var(--admin-green)" }}>{wf.reference}</strong>
                            </td>
                            <td>
                              <strong>{wf.org_name}</strong>
                            </td>
                            <td>{wf.legal_form}</td>
                            <td>{wf.region}</td>
                            <td>{wf.contact_name}</td>
                            <td>
                              <span className={`badge ${STATUS_BADGE_CLASS(wf.status)}`}>{wf.status}</span>
                            </td>
                            <td>
                              <ActionButtons
                                row={wf}
                                onView={() => setViewingForm(wf)}
                                onApprove={() => handleApprove(wf)}
                                onReject={() => handleReject(wf)}
                                onDelete={() => handleDelete(wf)}
                              />
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
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Candidats inscrits pour le Comité de Pilotage du FES-ESS 2026.</p>
                  </div>
                  <button onClick={handleExportSteeringWord} className="action-btn-primary" style={{ fontSize: "0.8rem", background: "var(--admin-navy)" }}>
                    <i className="fas fa-file-word" /> Exporter Word
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Candidat</th>
                        <th>Organisation</th>
                        <th>Poste Souhaité</th>
                        <th>Région</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webFormsLoading ? (
                        <EmptyRow colSpan={7}>Chargement...</EmptyRow>
                      ) : steeringForms.length === 0 ? (
                        <EmptyRow colSpan={7}>Aucune candidature pour le comité de pilotage.</EmptyRow>
                      ) : (
                        steeringForms.map((wf) => (
                          <tr key={wf.id}>
                            <td>{new Date(wf.created_at).toLocaleDateString("fr-FR")}</td>
                            <td>
                              <strong>{wf.contact_name}</strong>
                            </td>
                            <td>{wf.org_name}</td>
                            <td>
                              <span className="badge badge-gold">{wf.role_wanted}</span>
                            </td>
                            <td>{wf.region}</td>
                            <td>
                              <span className={`badge ${STATUS_BADGE_CLASS(wf.status)}`}>{wf.status}</span>
                            </td>
                            <td>
                              <ActionButtons
                                row={wf}
                                onView={() => setViewingForm(wf)}
                                onApprove={() => handleApprove(wf)}
                                onReject={() => handleReject(wf)}
                                onDelete={() => handleDelete(wf)}
                              />
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

          {/* TAB 5: BASE DE DONNÉES CONESESS */}
          {activeTab === "tab-members" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-database" style={{ color: "var(--admin-green)" }} /> Base de Données CONESESS
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Structures membres : adhésions acceptées depuis « Réception Formulaires », plus les ajouts manuels.
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
                        <th>Réf / Matricule</th>
                        <th>Structure</th>
                        <th>Nom du Contact</th>
                        <th>Forme Juridique</th>
                        <th>Région</th>
                        <th>Téléphone</th>
                        <th>Origine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedMembers.length === 0 && members.length === 0 ? (
                        <EmptyRow colSpan={7}>Aucune structure enregistrée. Les adhésions acceptées apparaîtront ici.</EmptyRow>
                      ) : (
                        <>
                          {approvedMembers.map((wf) => (
                            <tr key={wf.id}>
                              <td>
                                <strong style={{ color: "var(--admin-green)" }}>{wf.reference}</strong>
                              </td>
                              <td>
                                <strong>{wf.org_name}</strong>
                              </td>
                              <td>{wf.contact_name}</td>
                              <td>{wf.legal_form}</td>
                              <td>{wf.region}</td>
                              <td>{wf.phone}</td>
                              <td>
                                <span className="badge badge-green">Adhésion Acceptée</span>
                              </td>
                            </tr>
                          ))}
                          {members.map((m) => (
                            <tr key={m.ref}>
                              <td>
                                <strong>{m.ref}</strong>
                              </td>
                              <td>
                                <strong>{m.name}</strong>
                              </td>
                              <td>—</td>
                              <td>{m.type}</td>
                              <td>{m.region}</td>
                              <td>{m.phone}</td>
                              <td>
                                <span className="badge badge-navy">Ajout Manuel</span>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB: ACTUALITÉS (BLOG) */}
          {activeTab === "tab-news" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-newspaper" style={{ color: "var(--admin-green)" }} /> Actualités
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Publications affichées sur la page publique « Actualités » et en aperçu sur l'accueil, une fois publiées.
                    </p>
                  </div>
                  <button onClick={openCreatePost} className="action-btn-primary" style={{ fontSize: "0.8rem", background: "var(--admin-green)" }}>
                    <i className="fas fa-plus" /> Nouvelle Publication
                  </button>
                </div>

                {newsError && (
                  <div style={{ background: "var(--admin-soft-red)", border: "1px solid var(--admin-red)", color: "var(--admin-red)", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.25rem" }}>
                    Erreur de chargement des actualités : {newsError}
                  </div>
                )}

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Titre</th>
                        <th>Créé le</th>
                        <th>Statut</th>
                        <th style={{ minWidth: "260px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsLoading ? (
                        <EmptyRow colSpan={4}>Chargement...</EmptyRow>
                      ) : newsPosts.length === 0 ? (
                        <EmptyRow colSpan={4}>Aucune publication. Créez la première actualité.</EmptyRow>
                      ) : (
                        newsPosts.map((post) => (
                          <tr key={post.id}>
                            <td>
                              <strong>{post.title}</strong>
                            </td>
                            <td>{new Date(post.created_at).toLocaleDateString("fr-FR")}</td>
                            <td>
                              <span className={`badge ${post.published ? "badge-green" : "badge-gold"}`}>
                                {post.published ? "Publiée" : "Brouillon"}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group-actions">
                                <button onClick={() => openEditPost(post)} className="btn-act btn-act-view" title="Modifier">
                                  <i className="fas fa-pen" /> Modifier
                                </button>
                                <button
                                  onClick={() => handleTogglePublished(post)}
                                  className={`btn-act ${post.published ? "btn-act-reject" : "btn-act-approve"}`}
                                  title={post.published ? "Dépublier" : "Publier"}
                                >
                                  <i className={`fas ${post.published ? "fa-eye-slash" : "fa-eye"}`} /> {post.published ? "Dépublier" : "Publier"}
                                </button>
                                <button onClick={() => handleDeleteNews(post)} className="btn-act btn-act-delete" title="Supprimer">
                                  <i className="fas fa-trash-alt" /> Supprimer
                                </button>
                              </div>
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
                <div className="admin-table-card no-print" style={{ margin: 0 }}>
                  <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                    <i className="fas fa-id-badge" style={{ color: "var(--admin-green)" }} /> Confection de Badge CR80
                  </h3>

                  {badgeLevelsError && (
                    <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1rem" }}>
                      Catégories de badge indisponibles : {badgeLevelsError}
                      {badgeLevelsError.toLowerCase().includes("does not exist") && " — la migration badge_access_levels doit être exécutée."}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setBadgeName("")
                      setBadgeOrg("")
                      const free = badgeAccessLevels.find((l) => l.label.toLowerCase().includes("gratuit")) ?? badgeAccessLevels[badgeAccessLevels.length - 1]
                      if (free) setBadgeAccessLevelId(free.id)
                      setBadgeRef("LIBRE")
                    }}
                    className="action-btn-pill"
                    style={{ width: "100%", justifyContent: "center", marginBottom: "1.25rem" }}
                    disabled={badgeAccessLevels.length === 0}
                  >
                    <i className="fas fa-ticket-alt" /> Créer un Badge Gratuit
                  </button>

                  <div className="wizard-form-group mb-3">
                    <label style={{ fontWeight: 600, fontSize: "0.825rem" }}>Sélectionner un Participant *</label>
                    <select
                      className="wizard-form-control"
                      onChange={(e) => {
                        const m = members.find((mm) => mm.ref === e.target.value)
                        if (m) {
                          setBadgeName(m.name)
                          setBadgeOrg(m.type)
                          setBadgeRef(m.ref)
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
                    <input type="text" className="wizard-form-control" placeholder="ex: Coopérative Agricole de Saint-Louis" value={badgeOrg} onChange={(e) => setBadgeOrg(e.target.value)} />
                  </div>

                  <div className="wizard-form-group mb-4">
                    <label style={{ fontWeight: 600, fontSize: "0.825rem" }}>Niveau d'Accès & Badge *</label>
                    <select
                      className="wizard-form-control"
                      value={badgeAccessLevel?.id ?? ""}
                      onChange={(e) => setBadgeAccessLevelId(e.target.value)}
                      disabled={badgeAccessLevels.length === 0}
                    >
                      {badgeAccessLevels.length === 0 && <option value="">-- Aucune catégorie configurée --</option>}
                      {badgeAccessLevels.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.label} ({TIER_LABELS[l.access_tier as BadgeAccessTier]})
                        </option>
                      ))}
                    </select>

                    {isAdmin && !showAddLevelForm && (
                      <button
                        type="button"
                        onClick={() => setShowAddLevelForm(true)}
                        style={{ background: "none", border: "none", color: "var(--admin-green)", fontSize: "0.78rem", fontWeight: 700, padding: "0.5rem 0 0 0", cursor: "pointer" }}
                      >
                        <i className="fas fa-plus" /> Nouvelle catégorie (ex: AG Constitutive, Participant...)
                      </button>
                    )}

                    {isAdmin && showAddLevelForm && (
                      <div style={{ marginTop: "0.75rem", padding: "0.85rem", border: "1px dashed var(--admin-border-light)", borderRadius: "10px" }}>
                        {levelActionError && <p style={{ color: "var(--admin-red)", fontSize: "0.78rem", margin: "0 0 0.5rem 0" }}>{levelActionError}</p>}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                          <input
                            type="text"
                            className="wizard-form-control"
                            placeholder="ex: AG Constitutive"
                            style={{ flex: "1 1 160px" }}
                            value={newLevelLabel}
                            onChange={(e) => setNewLevelLabel(e.target.value)}
                            autoFocus
                          />
                          <select className="wizard-form-control" style={{ flex: "0 0 170px" }} value={newLevelTier} onChange={(e) => setNewLevelTier(e.target.value as BadgeAccessTier)}>
                            <option value="total">{TIER_LABELS.total}</option>
                            <option value="limite">{TIER_LABELS.limite}</option>
                          </select>
                          <input
                            type="color"
                            value={newLevelColor}
                            onChange={(e) => setNewLevelColor(e.target.value)}
                            title="Couleur du badge"
                            style={{ width: "38px", height: "38px", padding: 0, border: "1px solid var(--admin-border-light)", borderRadius: "8px", cursor: "pointer" }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
                          <button type="button" onClick={handleAddBadgeLevel} className="action-btn-pill" style={{ fontSize: "0.78rem" }}>
                            <i className="fas fa-check" /> Créer la catégorie
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddLevelForm(false)
                              setLevelActionError(null)
                            }}
                            style={{ background: "none", border: "none", color: "var(--admin-text-muted)", fontSize: "0.78rem", cursor: "pointer" }}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={() => window.print()} className="action-btn-primary" style={{ width: "100%", justifyContent: "center", background: "var(--admin-green)", padding: "0.75rem" }}>
                    <i className="fas fa-print" /> Imprimer / Télécharger Badge CR80
                  </button>
                </div>

                <div className="badge-print-area" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div className="cr80-badge-preview" style={{ padding: 0, overflow: "hidden" }}>
                    {/* Header: logo on a plain field, event-style diagonal ribbon on the right */}
                    <div style={{ position: "relative", width: "100%", boxSizing: "border-box", height: "88px", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 0 0 1.1rem", borderBottom: "1px solid var(--admin-border-light)" }}>
                      <img
                        src={logo}
                        alt="Logo CONESESS"
                        style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid #E9C46A", background: "#FFFFFF", position: "relative", zIndex: 1 }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: "70%",
                          background: `linear-gradient(120deg, #0A2540 0%, ${previewColor} 100%)`,
                          clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0% 100%)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          padding: "0 1.1rem 0 0",
                        }}
                      >
                        <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.04em" }}>CONESESS</span>
                        <span style={{ color: "#E9C46A", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.1em" }}>SÉNÉGAL</span>
                      </div>
                    </div>

                    <div style={{ width: "100%", boxSizing: "border-box", padding: "1.1rem 1.25rem 0 1.25rem", textAlign: "center" }}>
                      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, letterSpacing: "0.03em", color: "#006837" }}>CONFÉDÉRATION NATIONALE</h3>
                      <p style={{ margin: "0.15rem 0 0.75rem 0", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.04em", color: "#0A2540" }}>DES ENTREPRISES DE L'ESS</p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", fontSize: "0.7rem", fontWeight: 700, color: "#64748B", marginBottom: "1rem" }}>
                        <i className="fas fa-map-marker-alt" style={{ color: previewColor }} /> DAKAR · SÉNÉGAL
                      </div>

                      <div style={{ height: "1px", background: "var(--admin-border-light)", marginBottom: "1rem" }} />

                      <h2 style={{ margin: "0 0 0.2rem 0", fontSize: "1.25rem", fontWeight: 800, color: "#0A2540", textTransform: "uppercase" }}>
                        {badgeName || "Nom & Prénom"}
                      </h2>
                      <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "#64748B" }}>{badgeOrg || "Organisation"}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        width: "100%",
                        boxSizing: "border-box",
                        background: previewColor,
                        color: "#FFFFFF",
                        padding: "0.55rem 1rem",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        margin: "1.1rem 0",
                        boxShadow: `0 4px 10px ${previewColor}44`,
                      }}
                    >
                      <i className={`fas ${previewIcon}`} /> {previewLabel}
                    </div>

                    <div style={{ width: "100%", boxSizing: "border-box", textAlign: "center" }}>
                      <div style={{ background: "#FFFFFF", border: "1px solid var(--admin-border-light)", padding: "0.5rem", borderRadius: "10px", width: "fit-content", margin: "0 auto", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=CONESESS-DEMO" alt="QR Code" style={{ width: "84px", height: "84px", display: "block" }} />
                      </div>
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", color: "#94A3B8", textTransform: "uppercase" }}>
                        {badgeRef || "LIBRE"} · Scan à l'entrée
                      </p>
                    </div>

                    {/* Decorative footer, pushed to the card's bottom edge by the flex
                        column's auto margin regardless of how tall the content above is */}
                    <div
                      style={{
                        marginTop: "auto",
                        width: "100%",
                        boxSizing: "border-box",
                        background: "#006837",
                        color: "rgba(255,255,255,0.4)",
                        padding: "0.6rem 0",
                        display: "flex",
                        justifyContent: "space-evenly",
                        fontSize: "1.1rem",
                      }}
                    >
                      <i className="fas fa-tree" />
                      <i className="fas fa-seedling" />
                      <i className="fas fa-leaf" />
                      <i className="fas fa-seedling" />
                      <i className="fas fa-tree" />
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

                <div style={{ marginBottom: "1.5rem" }}>
                  <button
                    onClick={cameraOn ? stopCamera : startCamera}
                    className="action-btn-primary"
                    style={{ width: "100%", justifyContent: "center", background: cameraOn ? "var(--admin-red)" : "var(--admin-navy)", marginBottom: "0.75rem" }}
                  >
                    <i className={`fas ${cameraOn ? "fa-video-slash" : "fa-camera"}`} /> {cameraOn ? "Arrêter la caméra" : "Activer la caméra"}
                  </button>

                  {cameraOn && (
                    <video
                      ref={videoRef}
                      muted
                      playsInline
                      style={{ width: "100%", borderRadius: "12px", background: "#000000", marginBottom: "0.75rem" }}
                    />
                  )}

                  {cameraError && (
                    <p style={{ color: "var(--admin-red)", fontSize: "0.8rem", textAlign: "center", marginBottom: "0.75rem" }}>{cameraError}</p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <input
                    type="text"
                    className="wizard-form-control"
                    placeholder="ex: CONESESS-2026-1001"
                    style={{ height: "44px", fontSize: "0.95rem" }}
                    value={checkinCode}
                    onChange={(e) => setCheckinCode(e.target.value)}
                  />
                  <button onClick={() => handleCheckin()} className="action-btn-primary" style={{ background: "var(--admin-green)", fontSize: "0.9rem", padding: "0 1.25rem" }}>
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
                      <i className="fas fa-user-shield" style={{ color: "var(--admin-green)" }} /> Comptes en Attente de Validation
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Comptes créés via « Créer un compte » sur la page de connexion, qui n'ont encore aucun rôle. Session active :{" "}
                      <strong>{session.user.email}</strong>.
                    </p>
                  </div>
                  <button onClick={loadPendingAccounts} className="action-btn-pill" style={{ fontSize: "0.8rem" }}>
                    <i className="fas fa-sync-alt" /> Actualiser
                  </button>
                </div>

                {pendingAccountsError && (
                  <div style={{ background: "var(--admin-soft-red)", border: "1px solid var(--admin-red)", color: "var(--admin-red)", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.25rem" }}>
                    Erreur de chargement des comptes : {pendingAccountsError}
                  </div>
                )}

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>E-mail</th>
                        <th>Créé le</th>
                        <th>E-mail Confirmé</th>
                        <th style={{ minWidth: "300px" }}>Attribuer un rôle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAccountsLoading ? (
                        <EmptyRow colSpan={4}>Chargement...</EmptyRow>
                      ) : pendingAccounts.length === 0 ? (
                        <EmptyRow colSpan={4}>Aucun compte en attente de validation.</EmptyRow>
                      ) : (
                        pendingAccounts.map((acc) => (
                          <tr key={acc.id}>
                            <td>
                              <strong>{acc.email}</strong>
                            </td>
                            <td>{new Date(acc.created_at).toLocaleString("fr-FR")}</td>
                            <td>
                              <span className={`badge ${acc.email_confirmed ? "badge-green" : "badge-gold"}`}>
                                {acc.email_confirmed ? "Confirmé" : "En attente"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.4rem" }}>
                                <select
                                  className="wizard-form-control"
                                  style={{ height: "36px", fontSize: "0.8rem", minWidth: "150px" }}
                                  value={pendingRoleChoice[acc.id] ?? "admin"}
                                  onChange={(e) => setPendingRoleChoice((prev) => ({ ...prev, [acc.id]: e.target.value as StaffRole }))}
                                >
                                  {STAFF_ROLES.map((r) => (
                                    <option key={r} value={r}>
                                      {ROLE_LABELS[r]}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleGrantRole(acc)}
                                  disabled={grantingId === acc.id}
                                  className="btn-act btn-act-approve"
                                  title="Attribuer ce rôle"
                                >
                                  <i className="fas fa-user-check" /> {grantingId === acc.id ? "..." : "Attribuer"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-users-cog" style={{ color: "var(--admin-green)" }} /> Tous les Administrateurs
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Comptes avec accès à l'espace administrateur, tous rôles confondus.
                    </p>
                  </div>
                  <button onClick={loadAllAdmins} className="action-btn-pill" style={{ fontSize: "0.8rem" }}>
                    <i className="fas fa-sync-alt" /> Actualiser
                  </button>
                </div>

                {allAdminsError && (
                  <div style={{ background: "var(--admin-soft-red)", border: "1px solid var(--admin-red)", color: "var(--admin-red)", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.25rem" }}>
                    Erreur de chargement : {allAdminsError}
                  </div>
                )}

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>E-mail</th>
                        <th>Rôle</th>
                        <th>Attribué le</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAdminsLoading ? (
                        <EmptyRow colSpan={4}>Chargement...</EmptyRow>
                      ) : allAdmins.length === 0 ? (
                        <EmptyRow colSpan={4}>Aucun administrateur enregistré.</EmptyRow>
                      ) : (
                        allAdmins.map((acc) => (
                          <tr key={`${acc.id}:${acc.role}`}>
                            <td>
                              <strong>{acc.email}</strong>
                            </td>
                            <td>
                              <span className={`badge ${acc.role === "super_admin" ? "badge-gold" : acc.role === "checkin_agent" ? "badge-navy" : "badge-green"}`}>
                                {ROLE_LABELS[acc.role]}
                              </span>
                            </td>
                            <td>{new Date(acc.granted_at).toLocaleDateString("fr-FR")}</td>
                            <td>
                              <button
                                onClick={() => handleRevokeRole(acc)}
                                disabled={revokingKey === `${acc.id}:${acc.role}` || (acc.role === "super_admin" && acc.email === session.user.email)}
                                className="btn-act btn-act-delete"
                                title={acc.role === "super_admin" && acc.email === session.user.email ? "Vous ne pouvez pas retirer votre propre rôle Super Admin" : "Retirer ce rôle"}
                              >
                                <i className="fas fa-user-slash" /> {revokingKey === `${acc.id}:${acc.role}` ? "..." : "Retirer"}
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

          {/* TAB: NIVEAUX D'ACCÈS BADGES */}
          {activeTab === "tab-access-levels" && (
            <section className="admin-tab-content">
              <div className="admin-table-card">
                <div className="table-header-toolbar">
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--admin-text-main)" }}>
                      <i className="fas fa-key" style={{ color: "var(--admin-green)" }} /> Niveaux d'Accès Badges
                    </h3>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      Chaque catégorie de badge a un niveau d'accès affiché sur le badge : Accès Total ou Accès Limité.
                    </p>
                  </div>
                  <button onClick={loadBadgeAccessLevels} className="action-btn-pill" style={{ fontSize: "0.8rem" }}>
                    <i className="fas fa-sync-alt" /> Actualiser
                  </button>
                </div>

                {badgeLevelsError && (
                  <div style={{ background: "var(--admin-soft-red)", border: "1px solid var(--admin-red)", color: "var(--admin-red)", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.25rem" }}>
                    Erreur de chargement : {badgeLevelsError}
                    {badgeLevelsError.toLowerCase().includes("does not exist") && " — exécutez la migration badge_access_levels dans Supabase."}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {badgeAccessLevels.length === 0 && !badgeLevelsError && (
                    <p style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>Aucune catégorie pour le moment.</p>
                  )}
                  {badgeAccessLevels.map((level) => (
                    <div
                      key={level.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                        border: "1px solid var(--admin-border-light)",
                        borderRadius: "14px",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: level.color, flexShrink: 0 }} />
                      <input
                        type="text"
                        className="wizard-form-control"
                        defaultValue={level.label}
                        style={{ flex: "1 1 200px" }}
                        onBlur={(e) => {
                          if (e.target.value.trim() && e.target.value !== level.label) handleUpdateBadgeLevel(level.id, { label: e.target.value.trim() })
                        }}
                      />
                      <select
                        className="wizard-form-control"
                        style={{ flex: "0 0 190px" }}
                        value={level.access_tier}
                        onChange={(e) => handleUpdateBadgeLevel(level.id, { access_tier: e.target.value as BadgeAccessTier })}
                      >
                        <option value="total">{TIER_LABELS.total}</option>
                        <option value="limite">{TIER_LABELS.limite}</option>
                      </select>
                      <input
                        type="color"
                        value={level.color}
                        onChange={(e) => handleUpdateBadgeLevel(level.id, { color: e.target.value })}
                        title="Couleur du badge"
                        style={{ width: "38px", height: "38px", padding: 0, border: "1px solid var(--admin-border-light)", borderRadius: "8px", cursor: "pointer" }}
                      />
                      <button onClick={() => handleDeleteBadgeLevel(level)} className="btn-act btn-act-delete" title="Supprimer cette catégorie">
                        <i className="fas fa-trash-alt" />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ height: "1px", background: "var(--admin-border-light)", margin: "0 0 1.25rem 0" }} />

                {levelActionError && (
                  <div style={{ background: "var(--admin-soft-red)", border: "1px solid var(--admin-red)", color: "var(--admin-red)", padding: "0.75rem 1rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.85rem" }}>
                    {levelActionError}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    className="wizard-form-control"
                    placeholder="Nom de la nouvelle catégorie (ex: Partenaire)"
                    style={{ flex: "1 1 200px" }}
                    value={newLevelLabel}
                    onChange={(e) => setNewLevelLabel(e.target.value)}
                  />
                  <select className="wizard-form-control" style={{ flex: "0 0 190px" }} value={newLevelTier} onChange={(e) => setNewLevelTier(e.target.value as BadgeAccessTier)}>
                    <option value="total">{TIER_LABELS.total}</option>
                    <option value="limite">{TIER_LABELS.limite}</option>
                  </select>
                  <input
                    type="color"
                    value={newLevelColor}
                    onChange={(e) => setNewLevelColor(e.target.value)}
                    title="Couleur du badge"
                    style={{ width: "38px", height: "38px", padding: 0, border: "1px solid var(--admin-border-light)", borderRadius: "8px", cursor: "pointer" }}
                  />
                  <button onClick={handleAddBadgeLevel} className="action-btn-pill">
                    <i className="fas fa-plus" /> Ajouter une catégorie
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODAL: FULL WEB FORM DETAIL */}
      {viewingForm && (
        <WebFormDetailModal
          row={viewingForm}
          onClose={() => setViewingForm(null)}
          onApprove={() => handleApprove(viewingForm)}
          onReject={() => handleReject(viewingForm)}
          onDelete={() => handleDelete(viewingForm)}
        />
      )}

      {/* MODAL: CREATE / EDIT NEWS POST */}
      {newsModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1060, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "var(--admin-card-bg-light)", borderRadius: "20px", padding: "2rem", maxWidth: "560px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "var(--admin-text-main)" }}>
              {editingPost ? "Modifier la Publication" : "Nouvelle Publication"}
            </h3>
            <form onSubmit={handleSaveNews}>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Titre *</label>
                <input type="text" name="title" className="wizard-form-control" required defaultValue={editingPost?.title ?? ""} placeholder="ex: Lancement du FORA'ESS 2026" />
              </div>
              <div className="wizard-form-group mb-2">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Contenu *</label>
                <textarea name="content" className="wizard-form-control" rows={6} required defaultValue={editingPost?.content ?? ""} placeholder="Texte de l'actualité..." />
              </div>
              <div className="wizard-form-group mb-3">
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Images (optionnel, plusieurs possibles)</label>

                {newsImages.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}>
                    {newsImages.map((url) => (
                      <div key={url} style={{ position: "relative" }}>
                        <img src={url} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", display: "block", border: "1px solid var(--admin-border-light)" }} />
                        <button
                          type="button"
                          onClick={() => setNewsImages((prev) => prev.filter((u) => u !== url))}
                          title="Retirer cette image"
                          style={{
                            position: "absolute", top: "-6px", right: "-6px", width: "20px", height: "20px", borderRadius: "50%",
                            background: "var(--admin-red)", color: "#FFFFFF", border: "2px solid var(--admin-card-bg-light)",
                            fontSize: "0.7rem", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="wizard-form-control"
                  style={{ padding: "0.5rem" }}
                  disabled={newsImagesUploading}
                  onChange={(e) => {
                    handleAddNewsImages(e.target.files)
                    e.target.value = ""
                  }}
                />
                {newsImagesUploading && <small style={{ color: "var(--admin-text-muted)" }}>Envoi en cours...</small>}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", cursor: "pointer" }}>
                <input type="checkbox" name="published" defaultChecked={editingPost?.published ?? false} style={{ width: "auto" }} />
                Publier immédiatement (visible sur le site public)
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" disabled={newsSaving || newsImagesUploading} className="action-btn-primary" style={{ flex: 1, justifyContent: "center", background: "var(--admin-green)" }}>
                  {newsSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button type="button" onClick={() => setNewsModalOpen(false)} className="action-btn-pill">
                  Annuler
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

      <ToastContainer />
    </div>
  )
}
