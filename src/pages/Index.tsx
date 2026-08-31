import { useState } from "react"
import { SubmissionSuccessModal } from "@/components/SubmissionSuccessModal"
import { useToasts } from "@/components/Toast"
import { BannerVision } from "@/components/home/BannerVision"
import { ChainesDeValeur } from "@/components/home/ChainesDeValeur"
import { Contexte } from "@/components/home/Contexte"
import { Ecosysteme } from "@/components/home/Ecosysteme"
import { Gouvernance } from "@/components/home/Gouvernance"
import { Hero } from "@/components/home/Hero"
import { Incubateur } from "@/components/home/Incubateur"
import { MembershipModal } from "@/components/home/MembershipModal"
import { Observatoire } from "@/components/home/Observatoire"
import { Plaidoyer } from "@/components/home/Plaidoyer"
import { Poles } from "@/components/home/Poles"
import { Vision } from "@/components/home/Vision"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { useScrollToHashOnMount } from "@/lib/useSectionScroll"

export default function IndexPage() {
  useScrollToHashOnMount()
  const [membershipOpen, setMembershipOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successRef, setSuccessRef] = useState("")
  const { showToast, ToastContainer } = useToasts()

  const handleMembershipSuccess = (ref: string) => {
    setSuccessRef(ref)
    setSuccessOpen(true)
    showToast(`Votre demande a bien été transmise (${ref}).`)
  }

  return (
    <PublicLayout page="home">
      <Hero />
      <BannerVision />
      <Contexte />
      <Vision />
      <Gouvernance />
      <Incubateur />
      <Observatoire />
      <Poles />
      <ChainesDeValeur />
      <Ecosysteme />
      <Plaidoyer onOpenMembershipModal={() => setMembershipOpen(true)} />

      <MembershipModal open={membershipOpen} onClose={() => setMembershipOpen(false)} onSuccess={handleMembershipSuccess} />
      <SubmissionSuccessModal open={successOpen} refNum={successRef} onClose={() => setSuccessOpen(false)} />
      <ToastContainer />
    </PublicLayout>
  )
}
