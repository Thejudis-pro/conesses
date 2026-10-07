import { useCallback, useEffect } from "react"

interface LightboxProps {
  images: string[]
  alt: string
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Full-screen photo viewer: backdrop click or Escape closes, arrows / keys navigate. */
export function Lightbox({ images, alt, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null && index >= 0 && index < images.length

  const goPrev = useCallback(() => {
    if (index === null) return
    onNavigate((index - 1 + images.length) % images.length)
  }, [index, images.length, onNavigate])

  const goNext = useCallback(() => {
    if (index === null) return
    onNavigate((index + 1) % images.length)
  }, [index, images.length, onNavigate])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose, goPrev, goNext])

  if (!open || index === null) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 22, 40, 0.94)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0.5rem, 3vw, 2.5rem)",
      }}
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "max(0.75rem, env(safe-area-inset-top))",
          right: "max(0.75rem, env(safe-area-inset-right))",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.12)",
          color: "#FFFFFF",
          fontSize: "1.1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i className="fas fa-times" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            style={{
              position: "absolute",
              left: "max(0.5rem, env(safe-area-inset-left))",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.12)",
              color: "#FFFFFF",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fas fa-chevron-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            style={{
              position: "absolute",
              right: "max(0.5rem, env(safe-area-inset-right))",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.12)",
              color: "#FFFFFF",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fas fa-chevron-right" aria-hidden="true" />
          </button>
        </>
      )}

      <figure
        onClick={(e) => e.stopPropagation()}
        style={{ margin: 0, maxWidth: "min(96vw, 1200px)", maxHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
      >
        <img
          src={images[index]}
          alt={alt}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "calc(100vh - 6rem)",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
          }}
        />
        {images.length > 1 && (
          <figcaption style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", fontWeight: 600 }}>
            {index + 1} / {images.length}
          </figcaption>
        )}
      </figure>
    </div>
  )
}
