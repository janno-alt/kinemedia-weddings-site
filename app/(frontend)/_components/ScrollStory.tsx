"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Erzählerischer Hintergrund — bewegt sich entlang des Tagesverlaufs:
 *   Twilight → Goldene Stunde → (Paper-Section überdeckt) → Abend → Nacht
 *
 * Drei animierte Layer + statische Basis + Noise-Textur. Layer-Opacities
 * sind an den globalen scrollYProgress (0..1) gekoppelt.
 *
 * Bei prefers-reduced-motion fallback auf den statischen Twilight-Look
 * (= identisch zum Original bg-layers).
 */
export function ScrollStory() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  // Layer 1 — Twilight (cool blue spotlights). Sehr stark am Anfang,
  // dimmt während Goldener Stunde, schimmert wieder am Schluss.
  const twilightOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.6, 1],
    [1, 0.55, 0.7, 1],
  );

  // Layer 2 — Goldene Stunde. Erscheint kurz vor Pakete-Section.
  const goldenOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.55],
    [0, 0.6, 1, 0],
  );

  // Layer 3 — Abendlichter (Lampions-Feel). Erscheint nach Paper-Section.
  const eveningOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.75, 0.95],
    [0, 0.85, 0.65],
  );

  // Subtle Camera-Drift — Spotlight-Positionen wandern langsam (Apple-Feel)
  const cameraX = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const cameraY = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);

  if (reduced) {
    return <div className="bg-layers" aria-hidden="true" />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Basis — sehr dunkles Marineblau, immer da */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a1626, #142544 50%, #0a1626)",
        }}
      />

      {/* Camera-Wrapper — sanftes Drift aller Spot-Layer */}
      <motion.div
        className="absolute inset-0"
        style={{ x: cameraX, y: cameraY }}
      >
        {/* Layer 1: Twilight (cool blue spotlights) */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: twilightOpacity,
            background: `
              radial-gradient(ellipse 1100px 800px at 18% 14%, rgba(120,165,220,0.55), transparent 55%),
              radial-gradient(ellipse 900px 700px at 82% 78%, rgba(60,100,170,0.45), transparent 55%),
              radial-gradient(ellipse 700px 500px at 50% 50%, rgba(140,180,230,0.28), transparent 55%)
            `,
          }}
        />

        {/* Layer 2: Golden hour warm overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: goldenOpacity,
            background: `
              radial-gradient(ellipse 1300px 900px at 30% 40%, rgba(216,193,145,0.22), transparent 60%),
              radial-gradient(ellipse 1000px 700px at 75% 65%, rgba(184,150,90,0.14), transparent 55%)
            `,
          }}
        />

        {/* Layer 3: Evening lampion lights — weiche goldene Kugeln */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: eveningOpacity,
            background: `
              radial-gradient(circle 220px at 18% 28%, rgba(216,193,145,0.45), transparent 70%),
              radial-gradient(circle 160px at 62% 48%, rgba(216,193,145,0.32), transparent 70%),
              radial-gradient(circle 190px at 82% 22%, rgba(216,193,145,0.38), transparent 70%),
              radial-gradient(circle 240px at 38% 78%, rgba(216,193,145,0.28), transparent 70%),
              radial-gradient(circle 180px at 90% 75%, rgba(184,150,90,0.30), transparent 70%)
            `,
            filter: "blur(2px)",
          }}
        />
      </motion.div>

      {/* Noise/Grain — gibt der Komposition Tiefe (immer da) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "screen",
          opacity: 0.45,
        }}
      />
    </div>
  );
}
