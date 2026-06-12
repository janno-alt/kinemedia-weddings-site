import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "./_components/TopNav";
import { Footer } from "./_components/Footer";
import { ScrollStory } from "./_components/ScrollStory";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"),
  title: {
    default:
      "Hochzeitsvideograf Sachsen-Anhalt · Euer Hochzeitsfilm | Kinemedia",
    template: "%s · Kinemedia Weddings",
  },
  description:
    "Hochzeitsfilme für Sachsen-Anhalt und Mitteldeutschland. Highlight-Film, 4K-Trauungsmitschnitt, Drohnenaufnahmen. Lieferung in 3 bis 4 Wochen.",
  keywords: [
    "Hochzeitsvideograf Sachsen-Anhalt",
    "Hochzeitsfilm",
    "Hochzeitsvideo",
    "Hochzeitsfilmer Bitterfeld",
    "Hochzeitsvideograf Halle",
    "Hochzeitsfilmer Leipzig",
    "Hochzeitsfilm Sachsen-Anhalt",
    "Highlight-Film Hochzeit",
    "4K Mitschnitt Trauung",
    "Drohnenaufnahmen Hochzeit",
  ],
  authors: [{ name: "Janno Fleischer" }],
  creator: "Kinemedia Weddings",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Kinemedia Weddings",
    title: "Hochzeitsvideograf Sachsen-Anhalt · Euer Hochzeitsfilm",
    description:
      "Hochzeitsfilme für Sachsen-Anhalt und Mitteldeutschland. Highlight-Film, 4K-Trauung, 3 bis 4 Wochen Lieferzeit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hochzeitsvideograf Sachsen-Anhalt | Kinemedia Weddings",
    description:
      "Hochzeitsfilme für Sachsen-Anhalt und Mitteldeutschland. Highlight-Film, 4K-Trauung, 3 bis 4 Wochen Lieferzeit.",
  },
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-theme="kinemedia" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Inter:wght@200;300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <ScrollStory />
        <TopNav />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
