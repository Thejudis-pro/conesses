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

const htmlEscape = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

const webFormDetail = (row: WebForm, key: string) => {
  const v = (row.details as Record<string, unknown> | null)?.[key]
  return typeof v === "string" || typeof v === "number" ? String(v) : ""
}

/** A native Word document, built as HTML wrapped for Word (same technique as
 * the Excel export above, for the same reason: no third-party docx library
 * needed for a simple write-only export like this). One section per form,
 * covering every field visible in the "Voir" detail modal. */
export function downloadWebFormsWord(rows: WebForm[], title: string, filename: string) {
  const fieldRow = (label: string, value: string) =>
    value
      ? `<tr><td style="font-weight:bold;padding:5px 12px;border:1px solid #CBD5E1;width:230px;background:#F8FAFC;">${htmlEscape(label)}</td><td style="padding:5px 12px;border:1px solid #CBD5E1;">${htmlEscape(value)}</td></tr>`
      : ""

  const sections = rows
    .map((r, i) => {
      const fields = [
        fieldRow("Référence", r.reference),
        fieldRow("Date de réception", new Date(r.created_at).toLocaleString("fr-FR")),
        fieldRow("Nom du Contact", r.contact_name ?? ""),
        fieldRow("Organisation", r.org_name ?? ""),
        fieldRow("E-mail", r.email ?? ""),
        fieldRow("Téléphone", r.phone ?? ""),
        fieldRow("Région", r.region ?? ""),
        fieldRow("Département / Commune", webFormDetail(r, "commune")),
        fieldRow("Secteur d'activité", r.sector ?? ""),
        fieldRow("Forme Juridique", r.legal_form ?? ""),
        fieldRow("Poste Souhaité", r.role_wanted ?? ""),
        fieldRow("Nombre de Membres / Salariés", webFormDetail(r, "staff_count")),
        fieldRow("Statut", r.status),
      ].join("")

      const presentation = webFormDetail(r, "presentation")
      const message = r.message ?? ""

      return `
        <h2 style="color:#0A2540;border-bottom:2px solid #006837;padding-bottom:6px;margin-top:36px;">${i + 1}. ${htmlEscape(r.contact_name || r.org_name || r.reference)}</h2>
        <table style="border-collapse:collapse;width:100%;margin-bottom:12px;">${fields}</table>
        ${presentation ? `<p><strong>Présentation de l'organisation :</strong><br/>${htmlEscape(presentation).replace(/\n/g, "<br/>")}</p>` : ""}
        ${message ? `<p><strong>Message / Motivation :</strong><br/>${htmlEscape(message).replace(/\n/g, "<br/>")}</p>` : ""}
      `
    })
    .join("<div style='page-break-after:always;'></div>")

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<title>${htmlEscape(title)}</title>
<style>body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1A1A1A; } h1 { color: #0A2540; }</style>
</head>
<body>
  <h1>${htmlEscape(title)}</h1>
  <p>Généré le ${new Date().toLocaleString("fr-FR")} — ${rows.length} dossier(s)</p>
  ${sections}
</body>
</html>`

  const blob = new Blob(["﻿", html], { type: "application/msword;charset=utf-8;" })
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

