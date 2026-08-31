import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

const MESSAGES = [
  "2026 : Année de l'ESS au Sénégal",
  "Appel à adhésion ouvert aux coopératives, mutuelles et GIE",
  "Lancement des 5 hubs IAN-ESS dans les pôles territoriaux",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-navy text-navy-foreground">
      <div
        className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center"
        aria-live="polite"
      >
        <Megaphone className="size-4 shrink-0 text-gold" aria-hidden="true" />
        <p key={index} className="animate-in fade-in text-sm font-medium duration-500">
          {MESSAGES[index]}
        </p>
      </div>
    </div>
  );
}
