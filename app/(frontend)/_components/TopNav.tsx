import Image from "next/image";
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
        <Link href="/" className="shrink-0" aria-label="Kinemedia Weddings — Startseite">
          <Image
            src="/images/logo-kinemedia-weddings.png"
            alt="Kinemedia Weddings"
            width={1983}
            height={288}
            priority
            className="h-8 sm:h-10 w-auto"
          />
        </Link>

        <Link href="/kontakt" className="btn btn-glass shrink-0 text-[13px]">
          Termin anfragen →
        </Link>
      </div>
    </nav>
  );
}
