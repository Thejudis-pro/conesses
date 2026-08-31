import { Route, Routes } from "react-router-dom"
import AdhesionPage from "@/pages/Adhesion"
import AdminPage from "@/pages/Admin"
import CandidaturePage from "@/pages/Candidature"
import ContactPage from "@/pages/Contact"
import IndexPage from "@/pages/Index"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/adhesion" element={<AdhesionPage />} />
      <Route path="/candidature" element={<CandidaturePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
