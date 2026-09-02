import { supabase } from "@/integrations/supabase/client"
import type { Enums, Tables } from "@/integrations/supabase/types"

/** The three roles grantable through the admin UI (excludes legacy 'moderator'/'user'). */
export type StaffRole = Extract<Enums<"app_role">, "admin" | "super_admin" | "checkin_agent">

export type WebForm = Tables<"web_forms">

export const ADHESION_TYPES = ["Adhésion Membre", "Manifestation d'intérêt"]
export const CANDIDATURE_TYPE = "Candidature Comité de Pilotage"

export async function fetchWebForms(): Promise<{ data: WebForm[]; error: string | null }> {
  const { data, error } = await supabase.from("web_forms").select("*").order("created_at", { ascending: false })
  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}

export async function updateWebFormStatus(id: string, status: string): Promise<string | null> {
  const { error } = await supabase.from("web_forms").update({ status }).eq("id", id)
  return error?.message ?? null
}

export async function deleteWebForm(id: string): Promise<string | null> {
  const { error } = await supabase.from("web_forms").delete().eq("id", id)
  return error?.message ?? null
}

const xmlEscape = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

/** A native Excel worksheet (SpreadsheetML), built as plain text — no third-party
 * library needed (the popular `xlsx` package carries an unpatched high-severity
 * vulnerability, unnecessary for a simple write-only export like this). */
export function downloadWebFormsExcel(rows: WebForm[], filename: string) {
  const headers = ["Référence", "Date", "Type", "Nom du Contact", "Organisation", "Téléphone", "Email", "Région", "Statut"]
  const headerCells = headers.map((h) => `<Cell><Data ss:Type="String">${xmlEscape(h)}</Data></Cell>`).join("")

  const bodyRows = rows
    .map((r) => {
      const cells = [
        r.reference,
        new Date(r.created_at).toLocaleString("fr-FR"),
        r.form_type,
        r.contact_name ?? "",
        r.org_name ?? "",
        r.phone ?? "",
        r.email ?? "",
        r.region ?? "",
        r.status,
      ]
        .map((v) => `<Cell><Data ss:Type="String">${xmlEscape(v)}</Data></Cell>`)
        .join("")
      return `<Row>${cells}</Row>`
    })
    .join("")

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Formulaires">
    <Table>
      <Row>${headerCells}</Row>
      ${bodyRows}
    </Table>
  </Worksheet>
</Workbook>`

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export interface PendingAdminAccount {
  id: string
  email: string
  created_at: string
  email_confirmed: boolean
}

export async function fetchPendingAdminAccounts(): Promise<{ data: PendingAdminAccount[]; error: string | null }> {
  const { data, error } = await supabase.rpc("list_pending_admin_accounts")
  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}

export interface AdminAccount {
  id: string
  email: string
  role: StaffRole
  granted_at: string
}

/** Super-admin only: every account currently holding a staff role. */
export async function fetchAllAdminAccounts(): Promise<{ data: AdminAccount[]; error: string | null }> {
  const { data, error } = await supabase.rpc("list_all_admin_accounts")
  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as AdminAccount[], error: null }
}

/** Super-admin only: grants a role (admin / super_admin / checkin_agent) to an account. */
export async function grantRole(targetUserId: string, role: StaffRole): Promise<string | null> {
  const { error } = await supabase.rpc("grant_role", { target_user_id: targetUserId, new_role: role })
  return error?.message ?? null
}

/** Super-admin only: removes a specific role from an account. */
export async function revokeRole(targetUserId: string, role: StaffRole): Promise<string | null> {
  const { error } = await supabase.rpc("revoke_role", { target_user_id: targetUserId, target_role: role })
  return error?.message ?? null
}

