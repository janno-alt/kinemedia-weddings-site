import Link from "next/link";

/**
 * Top-Navigation. Die Menüpunkte (Leistungen, Portfolio, Über mich, Magazin)
 * sind vorerst ausgeblendet, bis die Subpages existieren — siehe navLinks.
 */
// const navLinks = [
//   { href: "/#leistungen", label: "Leistungen" },
//   { href: "/portfolio", label: "Portfolio" },
//   { href: "/ueber-mich", label: "Über mich" },
//   { href: "/magazin", label: "Magazin" },
// ];

export function TopNav() {
  return (
    <nav className="topnav-glass sticky top-0 z-50">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 py-4 sm:py-[18px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="brand-mark">k</div>
          <div className="font-serif text-[20px] sm:text-[22px] leading-none">
            Kinemedia
            <small className="block text-[9px] tracking-[0.3em] uppercase text-white/50 mt-0.5">
              Weddings
            </small>
          </div>
        </Link>

        <Link href="/kontakt" className="btn btn-glass shrink-0 text-[13px]">
          Termin anfragen →
        </Link>
      </div>
    </nav>
  );
}
