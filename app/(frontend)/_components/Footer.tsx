import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 mt-32 pt-16 pb-6 px-4 sm:px-8 text-white/55">
      <div className="mx-auto max-w-[1320px] grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 pb-10 border-b border-white/8">
        <div className="col-span-2 md:col-span-1">
          <Image
            src="/images/logo-kinemedia-weddings.png"
            alt="Kinemedia Weddings"
            width={1983}
            height={288}
            className="h-9 w-auto"
          />
          <p className="text-[13px] leading-relaxed mt-4 max-w-[32ch]">
            Cinematische Hochzeitsfilme aus einer Hand. Hochzeitsvideograf für
            Sachsen-Anhalt und Mitteldeutschland.
          </p>
        </div>

        <FooterCol title="Studio">
          <Link href="/#leistungen">Pakete</Link>
          <Link href="/#faq">Häufige Fragen</Link>
        </FooterCol>

        <FooterCol title="Paare">
          <Link href="https://kunden.wedding-kinemedia.de" target="_blank">Film-Login ↗</Link>
          <Link href="/kontakt">Kontakt</Link>
        </FooterCol>

        <FooterCol title="Kontakt">
          <a href="tel:+4915209969485">+49 1520 9969485</a>
          <a href="mailto:kontakt@wedding-kinemedia.de">kontakt@wedding-kinemedia.de</a>
          <span>Bitterfeld-Wolfen</span>
        </FooterCol>
      </div>

      <div className="mx-auto max-w-[1320px] mt-6 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[10px] tracking-[0.18em] uppercase">
        <span>© {new Date().getFullYear()} Kinemedia Weddings</span>
        <div className="flex gap-6">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper mb-4">
        {title}
      </h5>
      <ul className="grid gap-2 text-[13px]">
        {Array.isArray(children) ? (
          children.map((child, i) => <li key={i}>{child}</li>)
        ) : (
          <li>{children}</li>
        )}
      </ul>
    </div>
  );
}
