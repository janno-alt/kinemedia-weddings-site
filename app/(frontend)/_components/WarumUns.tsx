"use client";

import { motion, useReducedMotion } from "framer-motion";

const generic1 = {
  title: "Großes Filmteam",
  points: [
    "Wechselnde Filmer",
    "Standardisierter Look",
    "Hohe Tagespauschale",
    "8–12 Wochen Lieferzeit",
    "Wenig persönlicher Bezug",
  ],
};

const us = {
  title: ["Solo-Filmer.", "Ein Stil, ein Versprechen."],
  points: [
    "Ein Filmer, eine klare Bildsprache",
    "Cinematisch dokumentarisch",
    "3–4 Wochen Lieferzeit",
    "Eigenes Highlight-Reel",
    "4K-Mitschnitt der Trauung",
    "Drohnenaufnahmen optional",
    "Online-Film dauerhaft verfügbar",
    "Backup auf 2 Standorten · versichert",
  ],
};

const generic2 = {
  title: "Hobby-Filmer",
  points: [
    "Keine Erfahrung mit Drucksituation",
    "Unklare Ergebnisse",
    "Kein Backup-Equipment",
    "Keine Berufshaftpflicht",
    "„Ich hatte ein Smartphone …“",
  ],
};

const ease = [0.16, 1, 0.3, 1] as const;

export function WarumUns() {
  const reduced = useReducedMotion();

  return (
    <section className="relative z-10 mx-auto max-w-[1320px] px-4 sm:px-8 mt-24 sm:mt-32">
      <motion.h2
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease }}
        className="text-center font-serif font-light text-[clamp(36px,5vw,56px)] tracking-tight mb-12"
      >
        Warum <em className="italic-accent">Solo?</em>
      </motion.h2>

      <div className="stage-grid">
        {/* Links — slidet von links */}
        <motion.aside
          initial={reduced ? false : { opacity: 0, x: -60 }}
          whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="glass p-7 sm:p-8 opacity-85 order-2 lg:order-1"
        >
          <h4 className="font-serif italic text-[22px] text-white/80 mb-4">
            {generic1.title}
          </h4>
          <ul className="grid gap-2 text-[13px] text-white/55">
            {generic1.points.map((p) => (
              <li key={p} className="before:content-['—_'] before:text-[var(--color-accent-soft)]">
                {p}
              </li>
            ))}
          </ul>
        </motion.aside>

        {/* Mitte — kommt zuletzt, von unten + leichter Scale + Gold-Pulse */}
        <motion.article
          initial={reduced ? false : { opacity: 0, y: 40, scale: 0.96 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, delay: 0.45, ease }}
          className="glass stage-center p-7 sm:p-9 order-1 lg:order-2"
        >
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              initial={reduced ? false : { boxShadow: "0 0 0 rgba(216,193,145,0)" }}
              whileInView={
                reduced
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0 rgba(216,193,145,0)",
                        "0 0 32px rgba(216,193,145,0.7)",
                        "0 0 12px rgba(216,193,145,0.3)",
                      ],
                    }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.6, delay: 0.8 }}
              className="w-9 h-9 rounded-full grid place-items-center font-serif italic text-paper"
              style={{ background: "var(--color-accent)" }}
            >
              k
            </motion.div>
            <div className="font-mono text-[12px] tracking-[0.2em] uppercase text-paper">
              Kinemedia · Weddings
            </div>
          </div>
          <h4 className="font-serif text-[26px] sm:text-[28px] font-normal mb-5 leading-tight">
            {us.title[0]}<br />{us.title[1]}
          </h4>
          <ul className="grid gap-2.5 text-[14px] text-white/85">
            {us.points.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <span
                  className="w-[18px] h-[18px] grid place-items-center rounded-full text-[10px] font-semibold text-[var(--color-accent-soft)] shrink-0"
                  style={{ border: "1px solid rgba(216,193,145,0.4)" }}
                >
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
        </motion.article>

        {/* Rechts — slidet von rechts */}
        <motion.aside
          initial={reduced ? false : { opacity: 0, x: 60 }}
          whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="glass p-7 sm:p-8 opacity-85 order-3"
        >
          <h4 className="font-serif italic text-[22px] text-white/80 mb-4">
            {generic2.title}
          </h4>
          <ul className="grid gap-2 text-[13px] text-white/55">
            {generic2.points.map((p) => (
              <li key={p} className="before:content-['—_'] before:text-[var(--color-accent-soft)]">
                {p}
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}
