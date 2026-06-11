import type { Metadata } from "next";
import { KontaktForm } from "./KontaktForm";

export const metadata: Metadata = {
  title: "Kontakt · Anfrage für euren Hochzeitsfilm",
  description:
    "Schreib mir die Eckdaten zu eurer Hochzeit. Ich melde mich innerhalb von 48 Stunden mit einer kurzen Erstberatung und einem unverbindlichen Angebot.",
};

export default function KontaktPage() {
  return (
    <section className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-8 pt-20 sm:pt-28 pb-24">
      <div className="text-center mb-12 sm:mb-16">
        <span className="eyebrow eyebrow-chip">Kontakt</span>
        <h1 className="font-serif font-light text-[clamp(44px,7vw,96px)] leading-[1] tracking-tight mt-6 sm:mt-8">
          Lass uns <em className="italic-accent">reden.</em>
        </h1>
        <p className="max-w-[560px] mx-auto mt-6 text-[16px] sm:text-[17px] leading-relaxed text-white/75">
          Schick mir die Eckdaten zu eurer Hochzeit. Ich melde mich innerhalb von 48
          Stunden mit einer kurzen Erstberatung und einem unverbindlichen Angebot.
        </p>
      </div>

      <KontaktForm />

      <div className="mt-16 text-center text-white/60 text-[14px] leading-relaxed">
        Oder direkt per E-Mail oder Telefon:
        <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:gap-8 justify-center font-mono text-[13px] tracking-wide text-paper">
          <a href="mailto:kontakt@wedding-kinemedia.de" className="hover:text-[var(--color-accent-soft)] transition">
            kontakt@wedding-kinemedia.de
          </a>
          <a href="tel:+4915209969485" className="hover:text-[var(--color-accent-soft)] transition">
            +49 1520 9969485
          </a>
        </div>
      </div>
    </section>
  );
}
