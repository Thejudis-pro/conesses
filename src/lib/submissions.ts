import { supabase } from "@/integrations/supabase/client"

export interface WebFormSubmission {
  reference: string
  form_type: string
  org_name?: string | null
  contact_name?: string | null
  email?: string | null
  phone?: string | null
  region?: string | null
  sector?: string | null
  legal_form?: string | null
  role_wanted?: string | null
  message?: string | null
  details?: Record<string, unknown>
}

const clean = (value: FormDataEntryValue | null, max = 2000) =>
  typeof value === "string" ? value.trim().slice(0, max) || null : null

/** Reads a form's named fields into a plain trimmed object. */
export function readForm(form: HTMLFormElement) {
  const data = new FormData(form)
  const out: Record<string, string | null> = {}
  for (const key of new Set(Array.from(data.keys()))) {
    out[key] = clean(data.get(key))
  }
  return out
}

/** Inserts a public submission into `web_forms`. Returns an error message or null. */
export async function submitWebForm(payload: WebFormSubmission): Promise<string | null> {
  if (!payload.reference || !payload.form_type) return "Formulaire incomplet."

  const { error } = await supabase.from("web_forms").insert({
    reference: payload.reference,
    form_type: payload.form_type,
    org_name: payload.org_name ?? null,
    contact_name: payload.contact_name ?? null,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    region: payload.region ?? null,
    sector: payload.sector ?? null,
    legal_form: payload.legal_form ?? null,
    role_wanted: payload.role_wanted ?? null,
    message: payload.message ?? null,
    details: (payload.details ?? {}) as never,
  })

  if (error) {
    console.error("Échec de l'enregistrement du formulaire", error.message)
    return "Une erreur est survenue lors de l'envoi. Merci de réessayer."
  }

  // Best-effort confirmation e-mail — never blocks or fails the submission
  // itself. See supabase/functions/send-submission-confirmation for setup.
  if (payload.email) {
    supabase.functions
      .invoke("send-submission-confirmation", {
        body: { email: payload.email, contact_name: payload.contact_name, reference: payload.reference, form_type: payload.form_type },
      })
      .catch((e) => console.error("Échec de l'envoi de l'e-mail de confirmation", e))
  }

  return null
}
