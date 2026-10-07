import { useState, type CSSProperties } from "react"

interface NewsImageProps {
  src: string
  alt: string
  /** Fixed box height (cards, thumbnails). Omit to let the image keep its natural ratio (detail page). */
  height?: string
  maxHeight?: string
  radius?: string
  style?: CSSProperties
  /** When provided, the photo becomes a button (zoom cursor) that opens the full view. */
  onClick?: () => void
}

/** Photos at or above this width/height ratio fill the box; only square or portrait images (logos, posters) are shown whole. */
const COVER_MIN_RATIO = 1.2

/**
 * Smart crop: wide photos fill the frame, while logos, posters and portrait pictures
 * are shown in full on a clean white background so nothing important gets cut.
 */
export function NewsImage({ src, alt, height, maxHeight, radius, style, onClick }: NewsImageProps) {
  const [ratio, setRatio] = useState<number | null>(null)
  const fill = ratio !== null && ratio >= COVER_MIN_RATIO

  const frame: CSSProperties = {
    width: "100%",
    height,
    overflow: "hidden",
    background: height && !fill ? "#FFFFFF" : "var(--bg-alt)",
    borderRadius: radius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  }

  const image = (inButton: boolean) => (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={(e) => setRatio(e.currentTarget.naturalWidth / (e.currentTarget.naturalHeight || 1))}
      style={{
        display: "block",
        maxWidth: "100%",
        width: height ? "100%" : "auto",
        height: height ? "100%" : "auto",
        maxHeight,
        objectFit: fill ? "cover" : "contain",
        padding: height && !fill ? "0.75rem" : 0,
        boxSizing: "border-box",
        opacity: ratio === null ? 0 : 1,
        transition: inButton ? "opacity 0.2s ease, transform 0.2s ease" : "opacity 0.2s ease",
      }}
    />
  )

  if (onClick) {
    return (
      <div style={frame}>
        <button
          type="button"
          onClick={onClick}
          aria-label={`Agrandir : ${alt}`}
          style={{
            all: "unset",
            cursor: "zoom-in",
            display: "block",
            width: "100%",
            height: "100%",
            lineHeight: 0,
          }}
        >
          {image(true)}
        </button>
      </div>
    )
  }

  return <div style={frame}>{image(false)}</div>
}
