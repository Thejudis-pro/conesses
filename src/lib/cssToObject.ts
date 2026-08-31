import type { CSSProperties } from "react"

/**
 * Converts a raw CSS declaration string (exactly as it appeared in the
 * original site's `style="..."` attributes) into a React style object,
 * without retyping any values by hand. This is what lets the migration
 * preserve every inline style 1:1 instead of manually re-transcribing
 * thousands of property/value pairs (a major source of visual drift risk).
 */
export function cssStringToObject(css: string | undefined | null): CSSProperties {
  const style: Record<string, string> = {}
  if (!css) return style as CSSProperties

  for (const rawDecl of css.split(";")) {
    const decl = rawDecl.trim()
    if (!decl) continue
    const idx = decl.indexOf(":")
    if (idx === -1) continue

    const prop = decl.slice(0, idx).trim()
    const value = decl.slice(idx + 1).trim()
    if (!prop || !value) continue

    // CSS custom properties (--foo) are passed through unchanged.
    if (prop.startsWith("--")) {
      style[prop] = value
      continue
    }

    // kebab-case -> camelCase (vendor prefixes like -webkit-x become WebkitX,
    // matching React's own convention).
    const camel = prop.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
    style[camel] = value
  }

  return style as CSSProperties
}
