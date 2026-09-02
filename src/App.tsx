import { Route, Routes } from "react-router-dom"
import ActualiteDetailPage from "@/pages/ActualiteDetail"
import ActualitesPage from "@/pages/Actualites"
import AdhesionPage from "@/pages/Adhesion"
import AdminPage from "@/pages/Admin"
import CandidaturePage from "@/pages/Candidature"
import ContactPage from "@/pages/Contact"
import GouvernancePage from "@/pages/Gouvernance"
import IndexPage from "@/pages/Index"
import PolesActionPage from "@/pages/PolesAction"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/actualites" element={<ActualitesPage />} />
      <Route path="/actualites/:id" element={<ActualiteDetailPage />} />
      <Route path="/gouvernance" element={<GouvernancePage />} />
      <Route path="/poles-action" element={<PolesActionPage />} />
      <Route path="/adhesion" element={<AdhesionPage />} />
      <Route path="/candidature" element={<CandidaturePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
