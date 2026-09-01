/** Builds a Gmail web-compose URL so email links open reliably even without a configured desktop mail client. */
export function buildGmailComposeUrl(options: { to: string; subject?: string; body?: string }): string {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: options.to })
  if (options.subject) params.set("su", options.subject)
  if (options.body) params.set("body", options.body)
  return `https://mail.google.com/mail/?${params.toString()}`
}
