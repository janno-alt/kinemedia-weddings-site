"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const cv = [
  "Seit 2017 als Foto- und Videograf tätig",
  "B.A. Marketing & Digitale Medien",
  "Hauptberuf: Werbefilm und Imagefilm",
  "Sitz in Bitterfeld-Wolfen. Filmt in ganz Mitteldeutschland",
];

export function UeberMich() {
  const reduced = useReducedMotion();

  return (
    <section
      id="ueber-mich"
      className="relative z-10 mx-auto max-w-[1320px] px-4 sm:px-8 mt-24 sm:mt-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.3fr] gap-10 lg:gap-16 items-start">
        {/* Portrait */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: -40 }}
          whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
        >
          <Image
            src="/images/portrait-janno.jpg"
            alt="Janno Fleischer, Hochzeitsvideograf aus Sachsen-Anhalt"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          <span className="eyebrow">Über mich</span>
          <h2 className="font-serif font-light text-[clamp(34px,5vw,60px)] leading-[1.05] tracking-tight mt-5">
            Werbefilm im Alltag.
            <br />
            <em className="italic-accent">Hochzeitsfilm</em> aus Leidenschaft.
          </h2>

          <p className="mt-6 text-white/80 leading-relaxed max-w-[58ch]">
            Mein Name ist Janno. Im Hauptberuf drehe und schneide ich Werbefilme. Alles ist
            geplant. Alles ist getaktet. Wenig Raum für echte Momente.
          </p>
          <p className="mt-4 text-white/80 leading-relaxed max-w-[58ch]">
            Hochzeitsfilme sind mein Gegenpol. Hier gibt es kein Drehbuch. Nur einen Tag,
            der seine eigenen Geschichten schreibt. Mein Job ist, dabei zu sein, ohne zu
            stören. Und die Momente zu filmen, die zwischen den großen Augenblicken
            passieren.
          </p>

          <div className="mt-8">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55 mb-3">
              Werdegang
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[14px]">
              {cv.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-white/80">
                  <span className="text-[var(--color-accent-soft)] shrink-0 mt-1 text-[10px]">
                    ●
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
