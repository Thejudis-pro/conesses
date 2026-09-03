import { jsPDF } from "jspdf"

export interface ReceiptField {
  label: string
  value: string
}

/** Generates and downloads a simple PDF recap of a submitted form. */
export function downloadSubmissionReceipt(options: { formType: string; reference: string; fields: ReceiptField[] }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const marginX = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - marginX * 2
  let y = 22

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(10, 37, 64)
  doc.text("CONESESS SÉNÉGAL", marginX, y)
  y += 6

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text("Confédération Nationale des Entreprises de l'Économie Sociale et Solidaire", marginX, y)
  y += 10

  doc.setDrawColor(0, 104, 55)
  doc.setLineWidth(0.6)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 10

  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text(`Récapitulatif : ${options.formType}`, marginX, y)
  y += 7

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(0, 104, 55)
  doc.text(`Référence de suivi : ${options.reference}`, marginX, y)
  y += 6
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 116, 139)
  doc.text(`Date de soumission : ${new Date().toLocaleString("fr-FR")}`, marginX, y)
  y += 10

  for (const field of options.fields) {
    if (!field.value) continue
    if (y > 270) {
      doc.addPage()
      y = 22
    }
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9.5)
    doc.setTextColor(15, 23, 42)
    doc.text(field.label, marginX, y)
    y += 5

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(30, 41, 59)
    const lines = doc.splitTextToSize(field.value, contentWidth)
    doc.text(lines, marginX, y)
    y += lines.length * 5 + 4
  }

  if (y > 260) {
    doc.addPage()
    y = 22
  }
  y += 6
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 8
  doc.setFont("helvetica", "italic")
  doc.setFontSize(8.5)
  doc.setTextColor(100, 116, 139)
  const notice = doc.splitTextToSize(
    "Ce document est un récapitulatif de votre soumission et ne constitue pas une confirmation d'admission. Le Secrétariat technique du Comité d'initiative examinera les informations communiquées et prendra contact avec votre organisation.",
    contentWidth,
  )
  doc.text(notice, marginX, y)

  doc.save(`CONESESS_${options.reference}.pdf`)
}
