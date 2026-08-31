import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Coins,
  Cpu,
  Handshake,
  Landmark,
  LineChart,
  Mail,
  MapPin,
  Phone,
  Scale,
  Sprout,
  Target,
  Users,
  Layers,
  ShieldCheck,
  Network,
  GraduationCap,
  Facebook,
  Linkedin,
  Youtube,
  Check,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import ecosystemeImg from "@/assets/ecosysteme.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CONESESS — Fédérer l'Économie Sociale et Solidaire du Sénégal" },
      {
        name: "description",
        content:
          "Le CONESESS est le cadre national fédérateur des entreprises de l'Économie Sociale et Solidaire du Sénégal : représentation, structuration, incubation et observatoire.",
      },
      { property: "og:title", content: "CONESESS — Conseil National des Entreprises de l'ESS du Sénégal" },
      {
        property: "og:description",
        content:
          "Représenter, fédérer, structurer et accélérer les coopératives, mutuelles, GIE et entreprises sociales du Sénégal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Accueil,
});

function Eyebrow({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "gold" }) {
  return (
    <span className={`eyebrow ${tone === "gold" ? "text-gold-foreground" : "text-primary"}`}>
      <span className={`h-px w-8 ${tone === "gold" ? "bg-gold" : "bg-primary"}`} />
      {children}
    </span>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-navy text-navy-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 85% 10%, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%), radial-gradient(50% 50% at 5% 90%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <span className="eyebrow text-gold">
            <span className="h-px w-8 bg-gold" />
            République du Sénégal
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            Le cadre national fédérateur des entreprises de l'Économie Sociale et Solidaire du Sénégal
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-foreground/85">
            Le CONESESS rassemble coopératives, mutuelles, GIE, associations économiques et entreprises
            sociales autour d'une voix commune. Il structure les filières, professionnalise les acteurs et
            porte le dialogue avec l'État et les partenaires techniques et financiers.
          </p>
          <p className="mt-6 font-display text-xl font-semibold text-gold">
            Représenter • Fédérer • Structurer • Accélérer
          </p>
          <div className="mt-8">
            <a
              href="#rejoindre"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-colors hover:bg-primary/90"
            >
              Rejoindre le CONESESS
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-6 backdrop-blur sm:p-8">
          <h2 className="font-display text-lg font-semibold text-navy-foreground">Le CONESESS en chiffres</h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8">
            {[
              ["14", "régions couvertes"],
              ["5", "hubs d'incubation"],
              ["4", "pôles sectoriels"],
              ["+70", "membres fondateurs"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="block font-display text-4xl font-bold text-gold">{n}</span>
                  <span className="mt-1 block text-sm text-navy-foreground/80">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 border-t border-navy-foreground/15 pt-5 text-sm text-navy-foreground/75">
            Une organisation nationale, ancrée dans les territoires, au service d'une économie utile,
            inclusive et durable.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Pourquoi -------------------------------- */

const DEFIS = [
  {
    icon: Network,
    titre: "Fragmentation des acteurs",
    texte:
      "Des milliers d'organisations dispersées, sans instance nationale capable de porter une position commune auprès des pouvoirs publics.",
  },
  {
    icon: Scale,
    titre: "Reconnaissance institutionnelle",
    texte:
      "Un cadre juridique et fiscal encore incomplet, qui limite l'accès des structures de l'ESS à la commande publique.",
  },
  {
    icon: Coins,
    titre: "Accès au financement",
    texte:
      "Des garanties inadaptées et une faible bancabilité des coopératives, malgré des modèles économiques éprouvés.",
  },
  {
    icon: GraduationCap,
    titre: "Professionnalisation",
    texte:
      "Un besoin massif de formation en gestion, gouvernance, normes qualité et transformation numérique.",
  },
];

function Pourquoi() {
  return (
    <section id="pourquoi" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Eyebrow>Diagnostic</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">Pourquoi le CONESESS</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              L'Économie Sociale et Solidaire représente une part déterminante de l'emploi et de la
              production au Sénégal, en particulier dans les zones rurales et périurbaines. Pourtant, sa
              contribution reste sous-évaluée, sa voix dispersée et son potentiel de croissance largement
              inexploité.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Le CONESESS naît de ce constat : doter le secteur d'un cadre national unique, légitime et
              opérationnel, capable de transformer une réalité sociale massive en puissance économique
              organisée.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {DEFIS.map((d, i) => (
              <article
                key={d.titre}
                className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <d.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-2xl font-bold text-border">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy">{d.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Vision --------------------------------- */

const PILIERS = [
  {
    icon: Users,
    titre: "Représenter",
    texte:
      "Porter la voix unifiée des entreprises de l'ESS dans les instances nationales, régionales et internationales.",
  },
  {
    icon: Layers,
    titre: "Structurer",
    texte:
      "Organiser les filières, formaliser les structures et harmoniser les pratiques de gouvernance coopérative.",
  },
  {
    icon: GraduationCap,
    titre: "Renforcer",
    texte:
      "Former les dirigeants et les équipes : gestion, comptabilité, normes, commercialisation et numérique.",
  },
  {
    icon: Handshake,
    titre: "Mutualiser",
    texte:
      "Partager équipements, logistique, achats groupés, garanties financières et accès aux marchés.",
  },
];

function Vision() {
  return (
    <section id="vision" className="section-pad bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="eyebrow text-gold">
            <span className="h-px w-8 bg-gold" />
            Vision
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Faire de l'ESS un moteur reconnu de souveraineté économique
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy-foreground/85">
            À l'horizon 2030, une économie sociale et solidaire structurée, compétitive et créatrice
            d'emplois décents dans chacune des 14 régions du pays — appuyée par quatre piliers d'action
            permanents.
          </p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-navy-foreground/15 bg-navy-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
          {PILIERS.map((p) => (
            <li key={p.titre} className="bg-navy p-7">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <p.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{p.titre}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-foreground/80">{p.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ Gouvernance ------------------------------ */

const ORGANES = [
  {
    titre: "Assemblée Générale",
    role: "Organe souverain",
    texte:
      "Réunit l'ensemble des membres. Elle définit les orientations stratégiques, adopte les statuts, approuve les comptes et élit le Conseil d'Administration.",
  },
  {
    titre: "Conseil d'Administration",
    role: "Organe d'orientation",
    texte:
      "Composé de représentants des pôles sectoriels et des territoires. Il pilote la mise en œuvre des décisions de l'Assemblée et contrôle l'action du Bureau.",
  },
  {
    titre: "Bureau Exécutif",
    role: "Organe de décision opérationnelle",
    texte:
      "Présidence, vice-présidences, trésorerie et commissions thématiques. Il assure la représentation permanente et le dialogue institutionnel.",
  },
  {
    titre: "Secrétariat Général",
    role: "Organe d'exécution",
    texte:
      "Administration permanente du CONESESS : coordination des programmes, gestion des hubs, animation de l'observatoire et suivi des partenariats.",
  },
];

function Gouvernance() {
  return (
    <section id="gouvernance" className="section-pad bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Eyebrow>Gouvernance</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
          Quatre organes, une chaîne de décision claire
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Une gouvernance démocratique, du mandat des membres jusqu'à l'exécution quotidienne.
        </p>

        <ol className="mt-12 space-y-0">
          {ORGANES.map((o, i) => (
            <li key={o.titre} className="relative grid grid-cols-[auto_1fr] gap-6 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-navy-foreground">
                  {i + 1}
                </span>
                {i < ORGANES.length - 1 && <span className="mt-2 w-px flex-1 bg-border" aria-hidden="true" />}
              </div>
              <div className="pt-1.5">
                <p className="text-[13px] font-bold uppercase tracking-widest text-primary">{o.role}</p>
                <h3 className="mt-1 text-xl font-bold text-navy">{o.titre}</h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">{o.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------- IAN-ESS -------------------------------- */

const HUBS = [
  {
    id: "agro",
    nom: "Hub agro-transformation",
    lieu: "Kaolack — bassin arachidier",
    desc: "Unités partagées de transformation, séchage et conditionnement pour les coopératives céréalières et maraîchères.",
    points: [
      "Ateliers mutualisés certifiés aux normes sanitaires",
      "Accompagnement à la labellisation et à l'export sous-régional",
      "Contrats d'approvisionnement avec la commande publique",
    ],
  },
  {
    id: "peche",
    nom: "Hub halieutique",
    lieu: "Saint-Louis — façade maritime nord",
    desc: "Valorisation des produits de la mer par les GIE de femmes transformatrices et les coopératives de pêche artisanale.",
    points: [
      "Chaîne du froid mutualisée",
      "Traçabilité et qualité sanitaire",
      "Accès aux marchés urbains et hôteliers",
    ],
  },
  {
    id: "artisanat",
    nom: "Hub artisanat & énergie",
    lieu: "Thiès — corridor industriel",
    desc: "Ateliers-écoles, design produit et solutions énergétiques décentralisées pour les métiers artisanaux.",
    points: [
      "Fablab et outillage partagé",
      "Formation aux énergies renouvelables",
      "Boutique collective et e-commerce",
    ],
  },
  {
    id: "numerique",
    nom: "Hub numérique",
    lieu: "Dakar — capitale économique",
    desc: "Incubation des entreprises sociales à composante technologique et digitalisation des membres du réseau.",
    points: [
      "Outils de gestion coopérative en ligne",
      "Programmes d'accélération de 9 mois",
      "Mise en relation avec les investisseurs à impact",
    ],
  },
  {
    id: "sud",
    nom: "Hub agroforesterie Sud",
    lieu: "Ziguinchor — Casamance",
    desc: "Filières fruitières, anacarde, apiculture et tourisme solidaire dans les zones à fort potentiel agroécologique.",
    points: [
      "Pépinières et gestion durable des ressources",
      "Coopératives de transformation fruitière",
      "Circuits courts et commerce équitable",
    ],
  },
];

function IanEss() {
  const [actif, setActif] = useState(HUBS[0].id);
  const hub = HUBS.find((h) => h.id === actif)!;

  return (
    <section id="ianess" className="section-pad" style={{ backgroundColor: "var(--sand)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-b pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>IAN-ESS</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
              L'Incubateur et Accélérateur National de l'ESS
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Cinq modèles de hubs territoriaux qui transforment les initiatives locales en entreprises
            solides, financées et connectées aux marchés.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <div role="tablist" aria-label="Modèles de hubs" className="flex gap-2 overflow-x-auto lg:flex-col">
            {HUBS.map((h) => (
              <button
                key={h.id}
                role="tab"
                type="button"
                aria-selected={h.id === actif}
                onClick={() => setActif(h.id)}
                className={`shrink-0 rounded-lg border px-5 py-4 text-left text-[15px] font-semibold transition-colors lg:w-full ${
                  h.id === actif
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-navy hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {h.nom}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)] sm:p-10">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <MapPin className="size-4" aria-hidden="true" />
              {hub.lieu}
            </p>
            <h3 className="mt-3 text-2xl font-bold text-navy">{hub.nom}</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{hub.desc}</p>
            <ul className="mt-6 space-y-3">
              {hub.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] text-foreground">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- ON-ESS --------------------------------- */

function Observatoire() {
  return (
    <section id="oness" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>ON-ESS</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
              L'Observatoire National de l'ESS
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Sans données fiables, pas de politique publique efficace. L'ON-ESS mesure, documente et
              publie la réalité économique du secteur.
            </p>
            <ul className="mt-8 divide-y border-y">
              {[
                ["Recensement permanent", "Cartographie des structures, des emplois et des filières."],
                ["Production statistique", "Indicateurs annuels de contribution au PIB et à l'emploi."],
                ["Veille juridique", "Suivi des textes, fiscalité et normes applicables à l'ESS."],
                ["Évaluation d'impact", "Mesure sociale et environnementale des programmes."],
                ["Publication & plaidoyer", "Rapport national annuel et notes de politique."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4 py-4">
                  <LineChart className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="text-base font-semibold text-navy">{t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-navy p-7 text-navy-foreground sm:p-10">
            <h3 className="font-display text-xl font-bold">Architecture territoriale</h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-foreground/80">
              Une collecte au plus près du terrain, consolidée à l'échelon national.
            </p>
            <ol className="mt-8 space-y-6">
              {[
                ["Cellules communales", "Points focaux formés à la collecte de données de base."],
                ["Antennes régionales", "14 antennes de vérification et d'animation du réseau."],
                ["Pôles territoriaux", "5 pôles d'analyse adossés aux hubs IAN-ESS."],
                ["Direction nationale", "Consolidation, publication et interface avec l'ANSD."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-gold font-display text-sm font-bold text-gold-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold">{t}</h4>
                    <p className="mt-1 text-sm text-navy-foreground/80">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Pôles --------------------------------- */

const POLES = [
  {
    icon: Sprout,
    titre: "Agriculture & agroalimentaire",
    texte:
      "Coopératives céréalières, maraîchères et d'élevage, unités de transformation et circuits de distribution locaux.",
  },
  {
    icon: Coins,
    titre: "Finance inclusive",
    texte:
      "Mutuelles d'épargne et de crédit, fonds de garantie solidaires et mécanismes de financement adaptés aux coopératives.",
  },
  {
    icon: Building2,
    titre: "Artisanat & énergie",
    texte:
      "Métiers d'art, BTP coopératif, mini-réseaux solaires et solutions énergétiques communautaires.",
  },
  {
    icon: Cpu,
    titre: "Numérique & innovation",
    texte:
      "Entreprises sociales technologiques, plateformes de mise en marché et digitalisation des services aux membres.",
  },
];

function Poles() {
  return (
    <section id="poles" className="section-pad bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="eyebrow text-gold">
            <span className="h-px w-8 bg-gold" />
            Organisation sectorielle
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Quatre pôles sectoriels</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {POLES.map((p) => (
            <article
              key={p.titre}
              className="flex gap-5 rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 p-7"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gold text-gold-foreground">
                <p.icon className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold">{p.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-foreground/80">{p.texte}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Chaîne de valeur --------------------------- */

const ETAPES = ["Production", "Collecte", "Transformation", "Qualité & normes", "Distribution", "Marchés"];
const LEVIERS = [
  "Achats groupés d'intrants",
  "Équipements mutualisés",
  "Certification et normes qualité",
  "Logistique et chaîne du froid",
  "Marque collective et labellisation",
  "Accès à la commande publique",
  "Financement et garanties solidaires",
  "Digitalisation de la gestion",
];

function ChaineValeur() {
  return (
    <section id="valeur" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <Eyebrow>Compétitivité</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
            Maîtriser la chaîne de valeur, de la production au marché
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {ETAPES.map((e, i) => (
            <div key={e} className="flex items-center gap-3">
              <span className="rounded-full border border-primary/30 bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
                {e}
              </span>
              {i < ETAPES.length - 1 && (
                <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <h3 className="mt-14 text-xl font-bold text-navy">Huit leviers de compétitivité</h3>
        <ol className="mt-6 grid gap-x-10 gap-y-1 sm:grid-cols-2">
          {LEVIERS.map((l, i) => (
            <li key={l} className="flex items-baseline gap-4 border-b py-4 text-[15px] text-foreground">
              <span className="font-display text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
              {l}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------- Écosystème ------------------------------ */

const PARTENAIRES = [
  "Ministères et agences publiques",
  "Collectivités territoriales",
  "Institutions financières et SFD",
  "Partenaires techniques et financiers",
  "Universités et centres de recherche",
  "Organisations de la société civile",
  "Secteur privé et grandes entreprises",
];

function Ecosysteme() {
  return (
    <section id="ecosysteme">
      <div className="relative">
        <img
          src={ecosystemeImg}
          alt="Membres d'une coopérative agricole sénégalaise triant des produits maraîchers"
          width={1920}
          height={900}
          loading="lazy"
          className="h-[380px] w-full object-cover sm:h-[460px]"
        />
        <div className="absolute inset-0 bg-navy/75" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl text-navy-foreground">
              <span className="eyebrow text-gold">
                <span className="h-px w-8 bg-gold" />
                Écosystème
              </span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Un réseau d'alliances au service des membres
              </h2>
              <p className="mt-5 text-base leading-relaxed text-navy-foreground/90">
                Le CONESESS construit des partenariats durables avec sept familles d'acteurs, pour
                sécuriser le financement, l'expertise et les débouchés commerciaux des entreprises de l'ESS.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background py-10">
        <ul className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6">
          {PARTENAIRES.map((p) => (
            <li
              key={p}
              className="rounded-full border bg-card px-5 py-2.5 text-sm font-medium text-navy"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------- Partenariat État --------------------------- */

const AXES = [
  ["Cadre juridique et fiscal", "Co-construction d'une loi-cadre de l'ESS et d'un régime fiscal incitatif."],
  ["Commande publique", "Quotas réservés et allotissement adapté aux coopératives et GIE."],
  ["Financement", "Fonds national de garantie et lignes de crédit dédiées via les SFD."],
  ["Formation & emploi", "Intégration de l'ESS dans les dispositifs de formation professionnelle."],
  ["Données & évaluation", "Convention avec les services statistiques nationaux pour l'ON-ESS."],
];

function Etat() {
  return (
    <section id="etat" className="section-pad" style={{ backgroundColor: "var(--sand)" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Landmark className="size-8 text-primary" aria-hidden="true" />
          <Eyebrow>Dialogue institutionnel</Eyebrow>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
          Cinq axes de partenariat avec l'État
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border">
          {AXES.map(([t, d], i) => (
            <div key={t} className="grid gap-2 bg-card p-6 sm:grid-cols-[220px_1fr] sm:gap-8">
              <h3 className="flex items-start gap-3 text-base font-bold text-navy">
                <span className="font-display text-sm text-primary">0{i + 1}</span>
                {t}
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- CTA ---------------------------------- */

function CtaFinal() {
  return (
    <section id="rejoindre" className="bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">Rejoignez le mouvement national de l'ESS</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/90">
          Coopérative, mutuelle, GIE, association économique ou entreprise sociale : adhérez au CONESESS et
          bénéficiez de la représentation, de l'accompagnement et des services mutualisés du réseau.
        </p>
        <div className="mt-8">
          <a
            href="mailto:contact@conesess.sn"
            className="inline-flex items-center gap-2 rounded-md bg-navy px-7 py-3.5 text-base font-bold text-navy-foreground shadow-[var(--shadow-lift)] transition-colors hover:bg-navy-soft"
          >
            Demander mon adhésion
            <ArrowRight className="size-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Footer --------------------------------- */

function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold">CONESESS</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-foreground/80">
            Conseil National des Entreprises de l'Économie Sociale et Solidaire du Sénégal.
            Représenter • Fédérer • Structurer • Accélérer.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Youtube, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#accueil"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-md border border-navy-foreground/20 transition-colors hover:bg-navy-foreground/10"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/85">
            <li className="flex gap-3">
              <MapPin className="size-4 shrink-0" aria-hidden="true" /> Dakar, Sénégal
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 shrink-0" aria-hidden="true" /> +221 33 000 00 00
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 shrink-0" aria-hidden="true" /> contact@conesess.sn
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/85">
            {[
              ["Pourquoi le CONESESS", "#pourquoi"],
              ["Gouvernance", "#gouvernance"],
              ["IAN-ESS", "#ianess"],
              ["Observatoire ON-ESS", "#oness"],
              ["Rejoindre", "#rejoindre"],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} className="transition-colors hover:text-gold">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-navy-foreground/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} CONESESS. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-5">
            {["Mentions légales", "Politique de confidentialité", "Statuts"].map((l) => (
              <li key={l}>
                <a href="#accueil" className="transition-colors hover:text-gold">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------- Page ---------------------------------- */

function Accueil() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Pourquoi />
        <Vision />
        <Gouvernance />
        <IanEss />
        <Observatoire />
        <Poles />
        <ChaineValeur />
        <Ecosysteme />
        <Etat />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}
