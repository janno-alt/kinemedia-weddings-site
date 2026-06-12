"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

/**
 * FAQ-Sektion mit Accordion + JSON-LD FAQPage Schema.
 *
 * Die FAQs zielen auf Informational-Intent-Keywords aus der Recherche:
 *   - "Was kostet ein Hochzeitsfilm"
 *   - "Hochzeitsfilm Lieferzeit"
 *   - "Hochzeitsvideograf finden"
 *
 * Das JSON-LD-Schema sorgt dafür, dass Google die FAQs als Rich Snippet
 * in der SERP anzeigen kann.
 */

type FaqItem = { q: string; a: string };

const faqs: FaqItem[] = [
  {
    q: "Was kostet ein Hochzeitsfilm?",
    a: "Meine drei Pakete starten bei 1.785 € brutto (1.500 € netto) für das Trauungs-Paket. Der Tagesfilm-Bestseller liegt bei 2.975 € brutto (2.500 € netto), die Full Day Reportage bei 4.641 € brutto (3.900 € netto). Alle Pakete enthalten den Highlight-Film, den 4K-Mitschnitt der Trauung und die dauerhafte Online-Galerie. Individuelle Anpassungen sind jederzeit möglich.",
  },
  {
    q: "Wie lange dauert die Lieferung?",
    a: "3 bis 4 Wochen ab Hochzeit. Das ist deutlich schneller als der Branchen-Standard von 8 bis 12 Wochen. Möglich, weil ich keine Edit-Warteschlangen habe und direkt nach der Hochzeit mit dem Schnitt starte.",
  },
  {
    q: "Filmst du auch außerhalb von Sachsen-Anhalt?",
    a: "Ja. Im Umkreis von ca. 2 Stunden Fahrtzeit von Bitterfeld-Wolfen fahre ich ohne Zuschlag. Das deckt Sachsen-Anhalt, Sachsen, Thüringen, Berlin und Brandenburg ab. Weitere Strecken auf Anfrage mit kleinem Reisepaket.",
  },
  {
    q: "Was ist im Highlight-Reel enthalten?",
    a: "Eine cinematische Kurzfassung eures Tages mit den emotionalsten Momenten, geschnitten zu Musik. Das ist der Film, den ihr Familie und Freunden zeigt. Die Länge stimmen wir individuell ab. Auf Wunsch zusätzlich: Long-Form-Schnitt mit kompletten Reden und der Trauung in voller Länge.",
  },
  {
    q: "Machst du auch Drohnenaufnahmen?",
    a: "Ja. Im Tagesfilm- und Full-Day-Paket sind Drohnenaufnahmen inklusive, sofern Wetter und Genehmigungen es zulassen. Drohnen-Lizenz und Versicherung sind selbstverständlich vorhanden.",
  },
  {
    q: "Was passiert bei technischen Pannen?",
    a: "Ich arbeite mit doppelter Absicherung: Aufnahmen laufen parallel auf mehreren Speichern und werden noch am Hochzeitstag an zwei Orten gesichert. Bei Krankheit habe ich ein Netzwerk befreundeter Filmer, die einspringen können.",
  },
  {
    q: "Wie weit im Voraus sollten wir buchen?",
    a: "Etwa 2 Monate vor der Hochzeit anzufragen ist ideal. Aber auch kurzfristige Anfragen sind oft möglich. Schreibt mir einfach, ich melde mich innerhalb von 48 Stunden zurück.",
  },
  {
    q: "Bekommen wir auch das Roh-Material?",
    a: "Auf Wunsch ja. Gegen einen kleinen Aufpreis bekommt ihr alle Original-Aufnahmen auf einer externen Festplatte. Wird aber selten genutzt. Highlight-Reel und Long-Form decken meist alles ab, was Brautpaare später wirklich schauen.",
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const reduced = useReducedMotion();

  // Schema.org FAQPage JSON-LD für Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-8 mt-24 sm:mt-32"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10 sm:mb-14"
      >
        <span className="eyebrow">Häufige Fragen</span>
        <h2 className="font-serif font-light text-[clamp(34px,5vw,60px)] leading-[1.05] tracking-tight mt-5">
          Vor der <em className="italic-accent">Buchung</em> klären.
        </h2>
      </motion.div>

      <div className="grid gap-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="glass overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full text-left px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 transition hover:bg-white/5"
              >
                <span className="font-serif text-[18px] sm:text-[22px] text-paper leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-full border border-white/20 grid place-items-center text-white/70 transition-transform duration-300 ${
                    isOpen ? "rotate-45 bg-[var(--color-accent)]/20 border-[var(--color-accent-soft)]/40 text-[var(--color-accent-soft)]" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-8 pb-6 sm:pb-7">
                      <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/75 max-w-[68ch]">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
