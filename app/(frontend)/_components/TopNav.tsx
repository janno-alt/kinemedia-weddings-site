import Link from "next/link";

const navLinks = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/ueber-mich", label: "Über mich" },
  { href: "/magazin", label: "Magazin" },
];

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

        <div className="hidden md:flex items-center gap-8 lg:gap-9 text-[14px] text-white/75">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-paper transition">
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/kontakt" className="btn btn-glass shrink-0 text-[13px] hidden sm:inline-flex">
          Termin anfragen →
        </Link>

        <Link
          href="/kontakt"
          aria-label="Termin anfragen"
          className="sm:hidden btn btn-glass shrink-0 px-3 py-2"
        >
          →
        </Link>
      </div>
    </nav>
  );
}
