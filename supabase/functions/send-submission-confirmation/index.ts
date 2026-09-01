// Sends the standard "votre demande a bien été transmise" confirmation e-mail
// to a form submitter via Resend, right after a public web_forms submission.
//
// This function routes calls through the Lovable connector gateway using the
// linked Resend connection. Required env vars: LOVABLE_API_KEY, RESEND_API_KEY.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('CONFIRMATION_FROM_EMAIL') ?? 'CONESESS Sénégal <contact@conesess.sn>'

interface ConfirmationRequest {
  email: string
  contact_name?: string | null
  reference: string
  form_type: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, contact_name, reference, form_type } = (await req.json()) as ConfirmationRequest

    if (!email || !reference || !form_type) {
      return new Response(JSON.stringify({ error: 'email, reference et form_type sont requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY ou RESEND_API_KEY non configurée' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const greeting = contact_name ? `Bonjour ${contact_name},` : 'Bonjour,'
    const html = `
      <p>${greeting}</p>
      <p><strong>Votre demande a bien été transmise.</strong></p>
      <p>Référence de suivi : <strong>${reference}</strong> (${form_type})</p>
      <p>Le Secrétariat technique du Comité d'initiative examinera les informations communiquées et prendra contact avec votre organisation.</p>
      <p>L'admission définitive comme membre du CONESESS s'effectuera conformément aux statuts et aux procédures d'adhésion adoptés par les instances.</p>
      <p>Cordialement,<br/>CONESESS Sénégal</p>
    `.trim()

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `CONESESS - Confirmation de votre demande (${reference})`,
        html,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error(`Resend gateway error [${response.status}]: ${detail}`)
      return new Response(
        JSON.stringify({ error: 'Échec de l\'envoi via Resend', status: response.status, detail }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const data = await response.json().catch(() => ({}))
    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('send-submission-confirmation error:', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
