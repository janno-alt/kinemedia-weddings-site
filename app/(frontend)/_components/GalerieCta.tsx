"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export function GalerieCta() {
  const [code, setCode] = useState("");
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 50%"],
  });

  // Glass-Card kommt von unten mit Scale-up
  const cardY = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = code
      .trim()
      .toLowerCase()
      .replace(/[äöü]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue" })[c] ?? c)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug) return;
    window.location.href = `https://kunden.wedding-kinemedia.de/g/${slug}`;
  }

  return (
    <section
      ref={ref}
      className="relative z-10 mx-auto max-w-[1320px] px-4 sm:px-8 mt-24 sm:mt-28"
    >
      <motion.div
        style={
          reduced
            ? undefined
            : { y: cardY, scale: cardScale, opacity: cardOpacity, transformOrigin: "center bottom" }
        }
        className="glass p-8 sm:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center"
      >
        <div>
          <h2 className="font-serif font-light text-[clamp(36px,4.5vw,64px)] leading-[1] tracking-tight text-paper">
            Schon <em className="italic-accent">verheiratet?</em>
            <br />
            Hier zum Film.
          </h2>
          <p className="mt-5 text-white/70 leading-relaxed max-w-[38ch]">
            Loggt euch mit eurem Film-Code aus der E-Mail ein. Dauerhafter Online-Zugriff,
            streamt direkt vom Handy oder Smart-TV.
          </p>
          <a href="https://kunden.wedding-kinemedia.de" className="btn btn-light mt-7 inline-flex">
            Zum Film →
          </a>
        </div>
        <form onSubmit={onSubmit} className="login-form">
          <label htmlFor="galerie-code">Film-Code</label>
          <input
            id="galerie-code"
            type="text"
            placeholder="z. B. ANNA-TOM-2025"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className="btn btn-light btn-block mt-5"
          >
            Galerie öffnen ↗
          </button>
        </form>
      </motion.div>
    </section>
  );
}
