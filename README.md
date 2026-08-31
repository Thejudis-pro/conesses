# CONESESS Sénégal

Site officiel du Conseil National des Entreprises de l'Économie Sociale et Solidaire du Sénégal (CONESESS) — migré depuis le site HTML/CSS/JS vanilla original vers Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui.

## Stack

- **Vite** + **React 18** + **TypeScript** (strict)
- **Tailwind CSS**, configuré avec la palette exacte de l'original en design tokens
- **shadcn/ui** pour les nouveaux composants de formulaire
- **react-router-dom** pour le routing entre pages
- Le fichier `src/styles/legacy-styles.css` reprend le CSS custom original quasiment tel quel, pour une fidélité visuelle maximale par rapport au site d'origine.

## Pages

- `/` — Page d'accueil (13 sections)
- `/adhesion` — Formulaire d'adhésion
- `/candidature` — Candidature au Comité de Pilotage
- `/contact` — Coordonnées de contact
- `/admin` — Console d'administration

## À faire (TODO)

Les 3 formulaires publics et la console d'administration contiennent des commentaires `TODO(Supabase)` aux endroits où la logique backend (soumission, authentification, listing des dossiers) doit être branchée sur Supabase — voir les fichiers dans `src/pages/`.

## Développement

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
```
