"use client";

import { motion, useReducedMotion } from "framer-motion";

type Package = {
  num: string;
  name: string;
  hours: string;
  features: string[];
  /** Netto-Preis in Euro (ohne MwSt) */
  netPrice: number;
  featured?: boolean;
};

const packages: Package[] = [
  {
    num: "Paket 01",
    name: "Trauung",
    hours: "3 Stunden Coverage",
    features: [
      "Trauung und erste Stunde Empfang",
      "Cinematic Highlight-Film",
      "4K-Mitschnitt der Trauung",
      "Online-Galerie dauerhaft verfügbar",
    ],
    netPrice: 1500,
  },
  {
    num: "Paket 02 · Bestseller",
    name: "Tagesfilm",
    hours: "8 Stunden Coverage",
    features: [
      "Von Getting Ready bis erster Tanz",
      "Cinematic Highlight-Film",
      "4K-Mitschnitt der Trauung",
      "Drohnenaufnahmen inklusive",
      "Online-Galerie dauerhaft verfügbar",
    ],
    netPrice: 2500,
    featured: true,
  },
  {
    num: "Paket 03",
    name: "Full Day",
    hours: "12 Stunden Coverage",
    features: [
      "Komplette Hochzeit dokumentiert",
      "Cinematic Highlight-Film",
      "Zusätzlicher Long-Form-Schnitt",
      "4K-Mitschnitt und Drohnenaufnahmen",
      "Same-Day-Edit optional",
    ],
    netPrice: 3900,
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

/** Formatiert einen Brutto-Preis im deutschen Format (1.785). */
function formatGrossPrice(net: number): string {
  const gross = Math.round(net * 1.19);
  return gross.toLocaleString("de-DE");
}

export function Pakete() {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-[1320px] px-4 sm:px-8" id="leistungen">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-12 items-end"
      >
        <h2 className="font-serif font-light text-[clamp(40px,5vw,76px)] leading-[0.98] tracking-tight">
          Drei <em className="italic-accent">Hochzeitsfilm-</em>
          <br />
          Pakete.
        </h2>
        <p className="text-[15px] leading-relaxed max-w-[44ch] text-[rgba(20,30,55,0.7)]">
          Von der intimen Trauung bis zur ganztägigen Reportage. Alle Pakete inkl.
          4K-Mitschnitt und privater Online-Galerie. Film-Längen und Schnitt-Umfang
          stimmen wir individuell auf eure Hochzeit ab.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.num}
            initial={reduced ? false : { opacity: 0, y: 60 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.9,
              delay: i * 0.12,
              ease,
            }}
          >
            <PackageCard pkg={pkg} />
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-center font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[rgba(40,55,90,0.5)]">
        Alle Preise inkl. 19 % MwSt. · Reisekosten ab 100 km auf Anfrage
      </p>
    </section>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article
      className={`paper-card ${pkg.featured ? "featured" : ""} p-8 flex flex-col gap-5 h-full`}
    >
      <div className="space-y-2">
        <div
          className={`font-mono text-[11px] tracking-[0.22em] uppercase ${
            pkg.featured ? "text-white/55" : "text-[rgba(40,55,90,0.55)]"
          }`}
        >
          {pkg.num}
        </div>
        <h3
          className={`font-serif font-medium text-[36px] leading-none ${
            pkg.featured ? "text-paper" : "text-[#0a1626]"
          }`}
        >
          {pkg.name}
        </h3>
        <div
          className={`text-[13px] font-medium ${
            pkg.featured ? "text-[var(--color-accent-soft)]" : "text-[#2d4a78]"
          }`}
        >
          {pkg.hours}
        </div>
      </div>

      <ul
        className={`grid gap-2.5 text-[14px] leading-snug ${
          pkg.featured ? "text-white/85" : "text-[rgba(20,30,55,0.8)]"
        }`}
      >
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span
              className={`shrink-0 mt-1.5 text-[10px] ${
                pkg.featured ? "text-[var(--color-accent-soft)]" : "text-[#2d4a78]"
              }`}
            >
              ●
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div
        className={`mt-auto pt-5 border-t ${
          pkg.featured ? "border-white/15" : "border-[rgba(20,40,80,0.1)]"
        }`}
      >
        <div
          className={`font-serif text-[26px] ${
            pkg.featured ? "text-paper" : "text-[#0a1626]"
          }`}
        >
          ab{" "}
          <em
            className={`not-italic font-serif italic ${
              pkg.featured ? "text-[var(--color-accent-soft)]" : "text-[#2d4a78]"
            }`}
          >
            {formatGrossPrice(pkg.netPrice)}
          </em>{" "}
          €
        </div>
        <div
          className={`text-[11px] mt-1 ${
            pkg.featured ? "text-white/55" : "text-[rgba(40,55,90,0.55)]"
          }`}
        >
          inkl. 19 % MwSt. ({pkg.netPrice.toLocaleString("de-DE")} € netto)
        </div>
      </div>
    </article>
  );
}
