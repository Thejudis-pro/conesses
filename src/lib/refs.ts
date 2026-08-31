/** Reference-number generators, matching the exact original patterns byte-for-byte. */
export const genAdhesionRef = () => `CONESESS-2026-${Math.floor(1000 + Math.random() * 9000)}`
export const genContactRef = () => `CNT-2026-${Math.floor(1000 + Math.random() * 9000)}`
export const genCandidatureRef = () => `CP-2026-${Math.floor(1000 + Math.random() * 9000)}`
