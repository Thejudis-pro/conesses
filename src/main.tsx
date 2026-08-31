import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

// Tailwind + shadcn/ui tokens (used only by the new shadcn form primitives)
import "./index.css"
// The ORIGINAL site's stylesheet, imported as-is for 1:1 visual fidelity.
import "./styles/legacy-styles.css"

import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
