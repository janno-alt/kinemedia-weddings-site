import { ScrollVideoStory } from "./_components/ScrollVideoStory";
import { WarumUns } from "./_components/WarumUns";
import { Pakete } from "./_components/Pakete";
import { UeberMich } from "./_components/UeberMich";
import { FAQ } from "./_components/FAQ";
import { GalerieCta } from "./_components/GalerieCta";

export default function HomePage() {
  return (
    <>
      {/* HERO + 4-AKT-SCROLL-STORY in einer pinned Section */}
      <ScrollVideoStory />

      {/* WARUM SOLO — Vergleich Filmteam vs. Solo-Filmer vs. Hobbyfilmer */}
      <WarumUns />

      {/* PAPER SECTION — nur Pakete, weicher Übergang oben + unten */}
      <div className="paper-section">
        <Pakete />
      </div>

      {/* ÜBER MICH — Solo-Filmer, Werbefilm-Background, Werdegang */}
      <UeberMich />

      {/* FAQ — typische Fragen vor der Buchung + JSON-LD Schema */}
      <FAQ />

      {/* GALERIE-CTA — Film-Login für bestehende Paare */}
      <GalerieCta />
    </>
  );
}
