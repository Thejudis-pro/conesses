import { useState } from "react"
import { ContactTopBar } from "./ContactTopBar"
import { HomeFooter } from "./HomeFooter"
import { MobileNavDrawer } from "./MobileNavDrawer"
import type { Page } from "./SiteHeader"
import { SiteHeader } from "./SiteHeader"
import { SubFooter } from "./SubFooter"

interface PublicLayoutProps {
  page: Page
  children: React.ReactNode
}

/** Shared page chrome (top bar, header, mobile drawer, footer) for the 4 public pages. */
export function PublicLayout({ page, children }: PublicLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <>
      {page !== "home" && <ContactTopBar />}
      <SiteHeader page={page} onToggleMobileNav={() => setMobileNavOpen(true)} />
      <MobileNavDrawer page={page} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {children}
      {page === "home" ? <HomeFooter /> : <SubFooter page={page} />}
    </>
  )
}
