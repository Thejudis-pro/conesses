// Sends the standard "votre demande a bien été transmise" confirmation e-mail
// to a form submitter via Resend, right after a public web_forms submission.
//
// Setup needed before this works (Lovable/deploy step):
//   1. Create a Resend API key (resend.com) and set it as the Supabase secret
//      RESEND_API_KEY for this project.
//   2. Optionally set CONFIRMATION_FROM_EMAIL (defaults below) — must be a
//      sender address/domain verified in Resend.
//   3. Deploy this function (`supabase functions deploy send-submission-confirmation`
//      or via Lovable's sync). No further code changes needed.
//
// Called from the client in src/lib/submissions.ts right after a successful
// insert into web_forms — fire-and-forget, never blocks or fails the
// submission itself if the e-mail can't be sent.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const FROM_EMAIL = Deno.env.get("CONFIRMATION_FROM_EMAIL") ?? "CONESESS Sénégal <contact@conesess.sn>"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface ConfirmationRequest {
  email: string
  contact_name?: string | null
  reference: string
  form_type: string
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, contact_name, reference, form_type } = (await req.json()) as ConfirmationRequest

    if (!email || !reference || !form_type) {
      return new Response(JSON.stringify({ error: "email, reference et form_type sont requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY n'est pas configurée sur ce projet Supabase" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const greeting = contact_name ? `Bonjour ${contact_name},` : "Bonjour,"
    const html = `
      <p>${greeting}</p>
      <p><strong>Votre demande a bien été transmise.</strong></p>
      <p>Référence de suivi : <strong>${reference}</strong> (${form_type})</p>
      <p>Le Secrétariat technique du Comité d'initiative examinera les informations communiquées et prendra contact avec votre organisation.</p>
      <p>L'admission définitive comme membre du CONESESS s'effectuera conformément aux statuts et aux procédures d'adhésion adoptés par les instances.</p>
      <p>Cordialement,<br/>CONESESS Sénégal</p>
    `.trim()

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `CONESESS - Confirmation de votre demande (${reference})`,
        html,
      }),
    })

    if (!resendResponse.ok) {
      const detail = await resendResponse.text()
      return new Response(JSON.stringify({ error: "Échec de l'envoi via Resend", detail }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
