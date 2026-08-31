# Conesses

Crée un site vitrine institutionnel one-page en français pour le CONESESS 

(Conseil National des Entreprises de l'Économie Sociale et Solidaire du Sénégal).

IDENTITÉ

- Palette : bleu marine (#0B2A4A-ish), vert forêt (#008748-ish), accent or/jaune

- Ton : institutionnel, professionnel, engagé — pas corporate froid

- Slogan : "Représenter • Fédérer • Structurer • Accélérer"

- Logo : cercle vert avec icône communauté (placeholder rond)

STRUCTURE (dans l'ordre)

1. Bandeau d'annonce fin en haut : UN SEUL message rotatif (pas 3 en simultané) 

   — ex "2026 : Année de l'ESS au Sénégal"

2. Header sticky : logo + nav (Accueil, Présentation ▾, Gouvernance ▾, Pôles & Action ▾, 

   Rejoindre) + BOUTON plein vert "Rejoindre" bien visible à droite (pas un simple lien)

3. Hero : titre H1 fort "Le cadre national fédérateur des entreprises de l'Économie 

   Sociale et Solidaire du Sénégal" + paragraphe + CTA "Rejoindre le CONESESS" 

   + carte stats à droite (14 régions, 5 hubs, 4 pôles, +70 membres fondateurs)

4. Section "Pourquoi le CONESESS" : diagnostic + 4 défis prioritaires en grille de cartes

5. Section Vision & 4 piliers d'action (Représenter, Structurer, Renforcer, Mutualiser)

6. Section Gouvernance : 4 organes (Assemblée Générale, Conseil d'Administration, 

   Bureau Exécutif, Secrétariat Général) — présenter en TIMELINE verticale, pas en cartes

7. Section IAN-ESS (incubateur) : 5 modèles de hubs en onglets interactifs

8. Section Observatoire ON-ESS : missions + architecture territoriale

9. Section 4 pôles sectoriels (Agriculture, Finance inclusive, Artisanat/Énergie, 

   Numérique/Innovation)

10. Section chaîne de valeur + 8 leviers de compétitivité

11. Section écosystème & partenariats (7 types de partenaires)

12. Section partenariat avec l'État (5 axes)

13. CTA final + Footer complet (contact, réseaux sociaux, liens légaux)

RÈGLES DE DESIGN À RESPECTER

- Varier les layouts entre sections (pas le même gabarit "badge + titre + grille de cartes" 

  partout — alterner avec timelines, listes, images pleine largeur)

- Hiérarchie de titres propre : H1 puis H2 puis H3, jamais de saut de niveau

- Texte lisible : jamais en dessous de 14px, contraste AA minimum partout

- PAS de scroll-behavior smooth global (juste sur les ancres de nav)

- Un seul bouton CTA "hero" par section max, bien contrasté

- Responsive mobile-first avec menu hamburger

STACK : React + Tailwind + shadcn/ui, contenu 100% en français

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e838a24a-9f2c-4d94-a9ae-2256b0980e52).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
