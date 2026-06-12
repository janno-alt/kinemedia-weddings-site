"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

type Chapter = {
  eyebrow: string;
  headline: React.ReactNode;
  sub: string;
  from: number; // 0..1 Scroll-Position
  to: number;
};

// Hero-Overlay ist über die ersten ~15% Scroll-Strecke aktiv.
// Danach (0.15..1.0) scrubbt das Video durch die 4 Akte.
const HERO_FADE_START = 0.05;
const HERO_FADE_END = 0.15;

// 4 Akte verteilt über die restlichen 85% (= 0.85 / 4 ≈ 0.21 pro Akt)
const ACT_OFFSET = HERO_FADE_END;
const ACT_LENGTH = (1 - HERO_FADE_END) / 4;

// Frame-Sequenz für Mobile-Scrubbing (Apple-Methode: Canvas statt Video,
// weil iOS Safari currentTime-Seeks während des Touch-Scrolls verschluckt).
const FRAME_COUNT = 121;
const frameSrc = (i: number) =>
  `/frames/frame-${String(i + 1).padStart(3, "0")}.webp`;

const chapters: Chapter[] = [
  {
    eyebrow: "Hochzeitsfilm",
    headline: (
      <>
        Ein Filmer. <em className="italic-accent">Eure Geschichte.</em>
      </>
    ),
    sub: "Hochzeitsvideograf für Sachsen-Anhalt und Mitteldeutschland. Von der Trauung bis zum letzten Tanz.",
    from: ACT_OFFSET,
    to: ACT_OFFSET + ACT_LENGTH,
  },
  {
    eyebrow: "Stil",
    headline: (
      <>
        Cinematisch <em className="italic-accent">dokumentarisch.</em>
      </>
    ),
    sub: "Editorial-Bildsprache mit Kino-Look. Ich filme, was passiert. Keine Posen nach Schema F.",
    from: ACT_OFFSET + ACT_LENGTH,
    to: ACT_OFFSET + 2 * ACT_LENGTH,
  },
  {
    eyebrow: "Lieferung",
    headline: (
      <>
        Euer Film in <em className="italic-accent">3–4 Wochen.</em>
      </>
    ),
    sub: "Highlight-Reel · 4K-Trauungsmitschnitt · Drohnenaufnahmen. Schneller als der Branchen-Standard.",
    from: ACT_OFFSET + 2 * ACT_LENGTH,
    to: ACT_OFFSET + 3 * ACT_LENGTH,
  },
  {
    eyebrow: "Online ansehen",
    headline: (
      <>
        Dauerhaft <em className="italic-accent">online.</em> Überall teilen.
      </>
    ),
    sub: "Euer Film in privater Online-Galerie. Familie und Freunde streamen direkt vom Handy oder Smart-TV.",
    from: ACT_OFFSET + 3 * ACT_LENGTH,
    to: 1,
  },
];

/**
 * Hero + 4-Akt-Scroll-Story in einer pinned Section.
 *
 * Desktop: <video> mit currentTime-Scrubbing (All-Keyframe-Encoding).
 * Mobile/Touch: <canvas> mit JPEG/WebP-Frame-Sequenz — iOS Safari führt
 *   Video-Seeks während Touch-Scroll unzuverlässig aus; Bilder zeichnen
 *   funktioniert deterministisch auf jedem Gerät (auch im Stromsparmodus).
 * prefers-reduced-motion: Video läuft als normales Autoplay-Loop.
 */
export function ScrollVideoStory({
  src = "/videos/hintergrund-wedding.mp4",
  poster = "/videos/poster-wedding.jpg",
}: {
  src?: string;
  poster?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Mobile/Touch-Detection. null = noch nicht ermittelt (SSR).
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Hero-Text Overlay — explizite Funktionen statt Array-Range,
  // damit der Wert garantiert 0 ist sobald progress > HERO_FADE_END
  const heroOpacity = useTransform(scrollYProgress, (v) => {
    if (v <= HERO_FADE_START) return 1;
    if (v >= HERO_FADE_END) return 0;
    return 1 - (v - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START);
  });
  const heroY = useTransform(scrollYProgress, (v) => {
    if (v <= 0) return 0;
    if (v >= HERO_FADE_END) return -40;
    return (v / HERO_FADE_END) * -40;
  });

  // Pointer-Events + Visibility nur aktiv solange das Overlay sichtbar ist.
  useEffect(() => {
    if (reduced) return;
    const el = heroOverlayRef.current;
    if (!el) return;
    const unsub = heroOpacity.on("change", (v) => {
      const hidden = v < 0.02;
      el.style.pointerEvents = hidden ? "none" : "auto";
      el.style.visibility = hidden ? "hidden" : "visible";
      if (hidden) {
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("aria-hidden");
      }
    });
    return unsub;
  }, [heroOpacity, reduced]);

  // Scroll-Progress → Video-/Frame-Progress (0..1), startet bei HERO_FADE_START
  const computeProgress = (section: HTMLElement) => {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    const scrolled = Math.max(0, Math.min(scrollable, -rect.top));
    const raw = scrolled / scrollable;
    return Math.max(0, Math.min(1, (raw - HERO_FADE_START) / (1 - HERO_FADE_START)));
  };

  // ── DESKTOP: Video-Scrubbing ────────────────────────────────────────────
  useEffect(() => {
    if (reduced || isMobile !== false) return;
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let rafId = 0;
    let targetTime = 0;
    let cachedDuration = 0;

    const updateTarget = () => {
      targetTime = computeProgress(section) * (cachedDuration || video.duration || 0);
    };

    const tick = () => {
      const current = video.currentTime;
      const delta = targetTime - current;
      if (Math.abs(delta) > 0.001) {
        video.currentTime = current + delta * 0.18;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMeta = () => {
      cachedDuration = video.duration;
      updateTarget();
    };

    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    updateTarget();
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [reduced, isMobile]);

  // ── MOBILE: Canvas-Frame-Sequenz ────────────────────────────────────────
  useEffect(() => {
    if (reduced || isMobile !== true) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
    let disposed = false;
    let lastDrawnIndex = -1;

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!disposed) frames[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(i);
      });

    // Bestmöglichen geladenen Frame ≤ index finden (sonst nächstgrößeren)
    const bestFrame = (index: number): HTMLImageElement | null => {
      for (let i = index; i >= 0; i--) if (frames[i]) return frames[i];
      for (let i = index + 1; i < FRAME_COUNT; i++) if (frames[i]) return frames[i];
      return null;
    };

    const draw = (force = false) => {
      const progress = computeProgress(section);
      const index = Math.min(
        FRAME_COUNT - 1,
        Math.round(progress * (FRAME_COUNT - 1)),
      );
      if (!force && index === lastDrawnIndex) return;
      const img = bestFrame(index);
      if (!img) return;
      lastDrawnIndex = index;

      // cover-crop: Canvas füllen, zentriert beschneiden
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    let rafId = 0;
    let drawQueued = false;
    const requestDraw = (force = false) => {
      if (drawQueued) return;
      drawQueued = true;
      rafId = requestAnimationFrame(() => {
        drawQueued = false;
        draw(force);
      });
    };
    const onScroll = () => requestDraw();

    // Canvas auf Viewport-Größe (devicePixelRatio, gedeckelt für GPU-Schonung)
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      requestDraw(true);
    };

    // Frames laden: erst grobes Raster (jeder 6.), dann der Rest —
    // so ist früh über die ganze Strecke etwas Sinnvolles zeichenbar.
    const coarse: number[] = [];
    const fine: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      (i % 6 === 0 ? coarse : fine).push(i);
    }
    (async () => {
      await Promise.all(coarse.map(loadFrame));
      requestDraw(true);
      await Promise.all(fine.map(loadFrame));
      requestDraw(true);
    })();

    resize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, isMobile]);

  // Bei reduced-motion: Video normal abspielen lassen (kein Scrubbing).
  useEffect(() => {
    if (!reduced) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      /* Autoplay verweigert: Poster bleibt sichtbar */
    });
  }, [reduced]);

  const playsNormally = reduced ?? false;
  // Video rendern auf Desktop + reduced; Canvas nur auf Mobile ohne reduced.
  const useCanvas = isMobile === true && !playsNormally;

  return (
    <section
      ref={sectionRef}
      // Auf Mobile kürzere Pin-Strecke: weniger Daumen-Scrollen pro Akt
      className="relative h-[350vh] md:h-[500vh]"
    >
      <div
        className="sticky top-0 screen-h overflow-hidden"
        style={{ backgroundColor: "#0a1626" }}
      >
        {/* Poster als unterste Schicht — sofort sichtbar, bevor
            Video/Frames geladen sind */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {useCanvas ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="auto"
            autoPlay={playsNormally}
            loop={playsNormally}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Base-Tint: leichter Marineblau-Schleier über dem ganzen Video */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10,22,38,0.18)" }}
        />

        {/* Top Reading Band — verstärkt Lesbarkeit der Hero-/Eyebrow-Texte */}
        <div
          className="absolute inset-x-0 top-0 h-[65vh] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,22,38,0.78) 0%, rgba(10,22,38,0.55) 30%, rgba(10,22,38,0.2) 70%, transparent 100%)",
          }}
        />

        {/* Bottom Reading Band — verstärkt Lesbarkeit der Kapitel-Texte */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55vh] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(10,22,38,0.45) 35%, rgba(10,22,38,0.85) 70%, rgba(10,22,38,0.95) 100%)",
          }}
        />

        {/* HERO-OVERLAY — sofort sichtbar beim Page-Load, fadet zügig aus */}
        <motion.div
          ref={heroOverlayRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-8 text-center"
          style={reduced ? undefined : { opacity: heroOpacity, y: heroY }}
        >
          <span
            className="eyebrow eyebrow-chip"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Hochzeitsfilm · Sachsen-Anhalt &amp; Mitteldeutschland
          </span>
          <h1
            className="font-serif font-light text-[clamp(48px,8vw,128px)] leading-[0.98] tracking-tight mt-6 sm:mt-8"
            style={{ textShadow: "0 4px 32px rgba(0,0,0,0.6)" }}
          >
            Cinematische <em className="italic-accent">Hochzeitsfilme.</em>
            <br />
            Aus Sachsen-Anhalt.
          </h1>
          <p
            className="max-w-[580px] mx-auto mt-6 sm:mt-10 text-[16px] sm:text-[17px] leading-relaxed text-white"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
          >
            In 3 bis 4 Wochen geliefert. Highlight-Film, 4K-Trauungsmitschnitt
            und Drohnenaufnahmen inklusive.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/kontakt" className="btn btn-light">
              Termin anfragen →
            </Link>
            <Link href="#leistungen" className="btn btn-glass">
              Pakete ansehen
            </Link>
          </div>
        </motion.div>

        {/* KAPITEL-OVERLAY — erscheinen ab Akt 1, synchron zum Scroll.
            Mobile: deutlich höher platziert (pb-36), Desktop wie gehabt. */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-36 sm:pb-24 px-4 sm:px-8 pointer-events-none">
          <div className="relative h-[230px] sm:h-[260px] max-w-[860px] mx-auto w-full text-center">
            {chapters.map((c, i) => (
              <ChapterText
                key={i}
                chapter={c}
                progress={scrollYProgress}
                reduced={reduced ?? false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChapterText({
  chapter,
  progress,
  reduced,
}: {
  chapter: Chapter;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const fadeIn = 0.05;
  const fadeOut = 0.05;

  // Explizite Funktionen — garantiert 0 außerhalb des Akt-Ranges
  const opacity = useTransform(progress, (v) => {
    if (v < chapter.from || v > chapter.to) return 0;
    if (v < chapter.from + fadeIn) {
      return (v - chapter.from) / fadeIn;
    }
    if (v > chapter.to - fadeOut) {
      return Math.max(0, (chapter.to - v) / fadeOut);
    }
    return 1;
  });
  const y = useTransform(progress, (v) => {
    if (v <= chapter.from) return 24;
    if (v >= chapter.from + fadeIn) return 0;
    return 24 - ((v - chapter.from) / fadeIn) * 24;
  });

  if (reduced) {
    return (
      <div className="mb-6">
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/70 mb-2">
          {chapter.eyebrow}
        </div>
        <h2 className="font-serif font-light text-[clamp(20px,3vw,32px)] text-paper leading-tight mb-2">
          {chapter.headline}
        </h2>
        <p className="text-[13px] text-white/80 max-w-[60ch] mx-auto">
          {chapter.sub}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-end gap-3 sm:gap-4 text-center"
    >
      <div
        className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[var(--color-accent-soft)]"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
      >
        {chapter.eyebrow}
      </div>
      <h2
        className="font-serif font-light text-[clamp(30px,5vw,64px)] leading-[1.05] tracking-tight text-paper max-w-[18ch]"
        style={{ textShadow: "0 3px 28px rgba(0,0,0,0.75)" }}
      >
        {chapter.headline}
      </h2>
      <p
        className="text-[14px] sm:text-[16px] leading-relaxed text-white max-w-[52ch]"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.75)" }}
      >
        {chapter.sub}
      </p>
    </motion.div>
  );
}
