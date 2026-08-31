import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Users } from "lucide-react";

const NAV: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
  { label: "Accueil", href: "#accueil" },
  {
    label: "Présentation",
    href: "#pourquoi",
    children: [
      { label: "Pourquoi le CONESESS", href: "#pourquoi" },
      { label: "Vision & piliers", href: "#vision" },
    ],
  },
  {
    label: "Gouvernance",
    href: "#gouvernance",
    children: [
      { label: "Les 4 organes", href: "#gouvernance" },
      { label: "Partenariat avec l'État", href: "#etat" },
    ],
  },
  {
    label: "Pôles & Action",
    href: "#poles",
    children: [
      { label: "Incubateur IAN-ESS", href: "#ianess" },
      { label: "Observatoire ON-ESS", href: "#oness" },
      { label: "Pôles sectoriels", href: "#poles" },
      { label: "Chaîne de valeur", href: "#valeur" },
    ],
  },
  { label: "Rejoindre", href: "#rejoindre" },
];

function scrollToAnchor(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToAnchor(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[var(--shadow-soft)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#accueil" onClick={(e) => go(e, "#accueil")} className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Users className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-navy">CONESESS</span>
            <span className="block text-[13px] text-muted-foreground">Économie Sociale et Solidaire</span>
          </span>
        </a>

        <nav aria-label="Navigation principale" className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.slice(0, 4).map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold text-navy transition-colors hover:bg-secondary"
              >
                {item.label}
                {item.children && <ChevronDown className="size-4" aria-hidden="true" />}
              </a>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-64 translate-y-1 rounded-lg border bg-popover p-2 opacity-0 shadow-[var(--shadow-lift)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((c) => (
                    <a
                      key={c.href}
                      href={c.href}
                      onClick={(e) => go(e, c.href)}
                      className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="#rejoindre"
            onClick={(e) => go(e, "#rejoindre")}
            className="ml-3 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-[15px] font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-colors hover:bg-primary/90"
          >
            Rejoindre
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <a
            href="#rejoindre"
            onClick={(e) => go(e, "#rejoindre")}
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground sm:inline-flex"
          >
            Rejoindre
          </a>
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-md border text-navy"
          >
            {open ? <Menu className="size-5 hidden" /> : null}
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Navigation mobile" className="border-t bg-background px-4 pb-6 pt-2 lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b py-2 last:border-0">
              <a
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="block py-2 text-[15px] font-semibold text-navy"
              >
                {item.label}
              </a>
              {item.children?.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  onClick={(e) => go(e, c.href)}
                  className="block py-1.5 pl-4 text-sm text-muted-foreground"
                >
                  {c.label}
                </a>
              ))}
            </div>
          ))}
          <a
            href="#rejoindre"
            onClick={(e) => go(e, "#rejoindre")}
            className="mt-4 block rounded-md bg-primary px-5 py-3 text-center text-[15px] font-bold text-primary-foreground"
          >
            Rejoindre le CONESESS
          </a>
        </nav>
      )}
    </header>
  );
}
