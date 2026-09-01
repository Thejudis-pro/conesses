import { downloadSubmissionReceipt, type ReceiptField } from "@/lib/pdfReceipt"

interface SubmissionSuccessModalProps {
  open: boolean
  refNum: string
  onClose: () => void
  formType?: string
  fields?: ReceiptField[]
}

/** Reproduces `#modal-submission-success`, shared verbatim across all 4 forms in the original. */
export function SubmissionSuccessModal({ open, refNum, onClose, formType, fields }: SubmissionSuccessModalProps) {
  return (
    <div className={`modal-overlay${open ? " show" : ""}`} style={open ? { display: "flex", zIndex: 99999 } : undefined}>
      <div className="modal-card" style={{ maxWidth: "650px", textAlign: "center", padding: "2.5rem 1.75rem", borderRadius: "24px" }}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div
          style={{
            width: "75px",
            height: "75px",
            borderRadius: "50%",
            background: "#E8F5E9",
            color: "#006837",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            margin: "0 auto 1.25rem auto",
          }}
        >
          <i className="fas fa-check-circle" />
        </div>
        <h3 style={{ color: "#006837", fontSize: "1.6rem", marginBottom: "0.5rem", fontWeight: 800 }}>Votre demande a bien été transmise.</h3>
        <p style={{ fontSize: "0.9rem", color: "#B45309", fontWeight: 700, marginBottom: "1.25rem" }}>
          Référence de suivi : <span>{refNum}</span>
        </p>
        <p style={{ color: "#0A2540", maxWidth: "580px", margin: "0 auto 1rem auto", fontSize: "0.95rem", lineHeight: 1.6, fontWeight: 500 }}>
          Le Secrétariat technique du Comité d’initiative examinera les informations communiquées et prendra contact avec votre organisation.
        </p>
        <p style={{ color: "#555555", maxWidth: "580px", margin: "0 auto 1.75rem auto", fontSize: "0.875rem", lineHeight: 1.55 }}>
          L’admission définitive comme membre du CONESESS s’effectuera conformément aux statuts et aux procédures d’adhésion adoptés par les instances.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          {formType && fields && (
            <button
              className="btn btn-outline"
              onClick={() => downloadSubmissionReceipt({ formType, reference: refNum, fields })}
              style={{ border: "2px solid #006837", color: "#006837", padding: "0.75rem 1.75rem", borderRadius: "30px", fontWeight: 700, fontSize: "0.95rem" }}
            >
              <i className="fas fa-file-pdf" /> Télécharger le récapitulatif
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={onClose}
            style={{ background: "#006837", color: "#FFFFFF", padding: "0.75rem 2.25rem", borderRadius: "30px", fontWeight: 700, border: "none", fontSize: "0.95rem" }}
          >
            <i className="fas fa-check" /> Compris & Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
