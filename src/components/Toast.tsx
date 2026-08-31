import { useCallback, useState } from "react"

interface ToastItem {
  id: number
  message: string
  fading: boolean
}

/** Reproduces `#toast-container` + `showToast()` from the original js/app.js. */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, fading: false }])

    window.setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, fading: true } : t)))
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 4500)
  }, [])

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast" style={{ opacity: t.fading ? 0 : undefined }}>
          <i className="fas fa-check-circle" style={{ color: "#F4A261" }} /> <span>{t.message}</span>
        </div>
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}
