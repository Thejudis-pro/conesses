import { useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"

const HEADER_OFFSET = 80

/**
 * Reproduces the original js/app.js behaviour exactly:
 *  - a same-page `#hash` link click gets a smooth, header-offset scroll
 *    (see original `document.querySelectorAll('a[href^="#"]')` handler).
 *  - a cross-page link like `index.html#contexte` was a full page navigation
 *    followed by the browser's native (instant, non-smooth) hash jump.
 *    With client-side routing we reproduce that instant jump on route
 *    entry via `useScrollToHashOnMount`.
 */
export function scrollToHashSmooth(hash: string) {
  const target = document.querySelector(hash)
  if (!target) return
  const elementPosition = target.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET
  window.scrollTo({ top: offsetPosition, behavior: "smooth" })
}

/** Click handler for same-page `#hash` nav links (mirrors the original inline behaviour). */
export function useSameOriginHashClick() {
  return useCallback((e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (hash === "#") return
    e.preventDefault()
    scrollToHashSmooth(hash)
  }, [])
}

/** Instantly jumps to `location.hash` on mount/route change (original cross-page behaviour). */
export function useScrollToHashOnMount() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash
    // wait a tick so the section has rendered
    const t = window.setTimeout(() => {
      document.querySelector(id)?.scrollIntoView()
    }, 0)
    return () => window.clearTimeout(t)
  }, [location.hash])
}
