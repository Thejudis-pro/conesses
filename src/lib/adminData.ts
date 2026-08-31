import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"

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

export function webFormsToCSV(rows: WebForm[]): string {
  const header = "Reference,Date,Type,Nom,Structure,Telephone,Email,Statut"
  const lines = rows.map((r) =>
    [r.reference, r.created_at, r.form_type, r.contact_name ?? "", r.org_name ?? "", r.phone ?? "", r.email ?? "", r.status]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  )
  return [header, ...lines].join("\n")
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
