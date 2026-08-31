import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import logo from "@/assets/images/logo.jpg"
import { useSameOriginHashClick } from "@/lib/useSectionScroll"

export type Page = "home" | "adhesion" | "candidature" | "contact"
type NavId = "accueil" | "gouvernance" | "poles" | "adhesion" | "candidature" | "contact"

interface SiteHeaderProps {
  page: Page
  onToggleMobileNav: () => void
}

const DEFAULT_ACTIVE: Record<Page, NavId> = {
  home: "accueil",
  adhesion: "adhesion",
  candidature: "candidature",
  contact: "contact",
}

/**
 * Reproduces `.main-header` / `.navbar` from every public page.
 * The four pages diverge slightly in the original markup (logo subtitle
 * text/casing, presence of the "Rejoindre" nav-link vs the CTA button,
 * which link carries `.active`) — each is reproduced literally rather
 * than "unified", per the 100% fidelity requirement.
 *
 * The original js/app.js toggles `.active` onto whichever `.nav-link` was
 * last clicked (not scroll-spy based) — reproduced here via `activeId`.
 */
export function SiteHeader({ page, onToggleMobileNav }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<NavId>(DEFAULT_ACTIVE[page])
  const onHashClick = useSameOriginHashClick()

  useEffect(() => {
    setActiveId(DEFAULT_ACTIVE[page])
  }, [page])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isHome = page === "home"
  // On the home page, section links are same-page "#hash" anchors (smooth
  // scroll). On every other page they are cross-page links back to "/#hash"
  // (instant jump on arrival, exactly like the original "index.html#hash").
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`)

  const NavLinkOrAnchor = ({
    hash,
    id,
    className,
    children,
  }: {
    hash: string
    id: NavId
    className: string
    children: React.ReactNode
  }) => {
    const cls = `${className}${activeId === id ? " active" : ""}`
    return isHome ? (
      <a
        href={hash}
        className={cls}
        onClick={(e) => {
          setActiveId(id)
          onHashClick(e, hash)
        }}
      >
        {children}
      </a>
    ) : (
      <Link to={sectionHref(hash)} className={cls} onClick={() => setActiveId(id)}>
        {children}
      </Link>
    )
  }

  return (
    <header className={`main-header${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <nav className="navbar">
          {isHome ? (
            <a href="#" className="logo-brand">
              <img src={logo} alt="Logo CONESESS" className="logo-img" />
              <div className="logo-text">
                <span className="logo-title">CONESESS</span>
                <span className="logo-subtitle">Cadre national fédérateur des entreprises de l’ESS</span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--accent-gold)",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    display: "block",
                    marginTop: "0.1rem",
                  }}
                >
                  Représenter • Fédérer • Structurer • Accélérer
                </span>
              </div>
            </a>
          ) : (
            <Link to="/" className="logo-brand">
              <img src={logo} alt="Logo CONESESS" className="logo-img" />
              <div className="logo-text">
                <span className="logo-title">CONESESS</span>
                <span className="logo-subtitle">CADRE NATIONAL FÉDÉRATEUR DES ENTREPRISES DE L'ESS DU SÉNÉGAL</span>
              </div>
            </Link>
          )}

          <ul className="nav-menu">
            <li>
              <NavLinkOrAnchor hash="#accueil" id="accueil" className="nav-link">
                Accueil
              </NavLinkOrAnchor>
            </li>

            {/* Dropdown 2: Gouvernance & Piliers */}
            <li className="nav-item-dropdown">
              <NavLinkOrAnchor hash="#gouvernance" id="gouvernance" className="nav-link dropdown-toggle">
                Gouvernance <i className="fas fa-chevron-down" />
              </NavLinkOrAnchor>
              <ul className="dropdown-menu">
                <li>
                  <a
                    href={sectionHref("#gouvernance")}
                    className="dropdown-item"
                    onClick={isHome ? (e) => onHashClick(e, "#gouvernance") : undefined}
                  >
                    <i className="fas fa-sitemap" /> Gouvernance Souveraine
                  </a>
                </li>
                <li>
                  <a
                    href={sectionHref("#incubateur")}
                    className="dropdown-item"
                    onClick={isHome ? (e) => onHashClick(e, "#incubateur") : undefined}
                  >
                    <i className="fas fa-rocket" /> Incubateur IAN-ESS
                  </a>
                </li>
                <li>
                  <a
                    href={sectionHref("#observatoire")}
                    className="dropdown-item"
                    onClick={isHome ? (e) => onHashClick(e, "#observatoire") : undefined}
                  >
                    <i className="fas fa-search" /> Observatoire ON-ESS
                  </a>
                </li>
              </ul>
            </li>

            {/* Dropdown 3: Pôles & Action */}
            <li className="nav-item-dropdown">
              <NavLinkOrAnchor hash="#poles" id="poles" className="nav-link dropdown-toggle">
                Pôles & Action <i className="fas fa-chevron-down" />
              </NavLinkOrAnchor>
              <ul className="dropdown-menu">
                <li>
                  <a
                    href={sectionHref("#poles")}
                    className="dropdown-item"
                    onClick={isHome ? (e) => onHashClick(e, "#poles") : undefined}
                  >
                    <i className="fas fa-th-large" /> 4 Pôles Métiers
                  </a>
                </li>
                <li>
                  <a
                    href={sectionHref("#chaines-de-valeur")}
                    className="dropdown-item"
                    onClick={isHome ? (e) => onHashClick(e, "#chaines-de-valeur") : undefined}
                  >
                    <i className="fas fa-link" /> Chaînes de Valeur
                  </a>
                </li>
                <li>
                  <a
                    href={sectionHref("#ecosysteme")}
                    className="dropdown-item"
                    onClick={isHome ? (e) => onHashClick(e, "#ecosysteme") : undefined}
                  >
                    <i className="fas fa-handshake" /> Écosystème & Partenariats
                  </a>
                </li>
                <li>
                  <a
                    href={sectionHref("#plaidoyer")}
                    className="dropdown-item"
                    onClick={isHome ? (e) => onHashClick(e, "#plaidoyer") : undefined}
                  >
                    <i className="fas fa-balance-scale" /> Plaidoyer avec l'État
                  </a>
                </li>
              </ul>
            </li>

            {page === "adhesion" && (
              <li>
                <Link to="/adhesion" className={`nav-link${activeId === "adhesion" ? " active" : ""}`} onClick={() => setActiveId("adhesion")}>
                  Rejoindre
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/candidature"
                className={`nav-link${activeId === "candidature" ? " active" : ""}`}
                onClick={() => setActiveId("candidature")}
              >
                Candidature Comité
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link${activeId === "contact" ? " active" : ""}`} onClick={() => setActiveId("contact")}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="nav-cta">
            {page !== "adhesion" && (
              <Link to="/adhesion" className="btn btn-primary btn-sm nav-cta-join desktop-only-btn">
                <i className="fas fa-id-card" /> Rejoindre
              </Link>
            )}
            <button className="mobile-toggle" aria-label="Toggle Menu" onClick={onToggleMobileNav}>
              <i className="fas fa-bars" />
              <span>Menu</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
