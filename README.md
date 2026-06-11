# Kinemedia Weddings — Website

Marketing-Website für das Hochzeitsfotografie-/Videografie-Studio Kinemedia Weddings.

- **Stack:** Next.js 15 (App Router) + Payload CMS v3 (self-hosted, SQLite)
- **Design:** Dark-Glass mit Cormorant Garamond / Inter / JetBrains Mono — gleiche Sprache wie die Galerie-App
- **Hosting:** Mittwald mStudio (Node.js App)
- **Domain:** wedding-kinemedia.de (geplant)

> Die Kundengalerien laufen separat unter [kunden.wedding-kinemedia.de](https://kunden.wedding-kinemedia.de) (siehe Repo `kinemedia-galerien`).

---

## Quickstart (lokal)

```bash
# 1. Dependencies
npm install

# 2. .env anlegen
cp .env.example .env
# → PAYLOAD_SECRET einsetzen: openssl rand -hex 32

# 3. Dev-Server starten
npm run dev

# 4. Im Browser:
#    - Frontend:  http://localhost:3000
#    - Admin UI:  http://localhost:3000/admin
#                 (erster Aufruf legt den Admin-User an)
```

---

## Struktur

```
kinemedia-weddings-site/
├── app/
│   ├── (frontend)/          # Marketing-Seiten (öffentlich)
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Home
│   │   ├── globals.css      # Design-Tokens
│   │   └── _components/     # TopNav, Footer, …
│   └── (payload)/           # Payload CMS Admin + API
│       ├── admin/[[...segments]]/page.tsx
│       └── api/[...slug]/route.ts
├── collections/             # Payload-Schemas (CMS)
│   ├── Users.ts
│   └── Media.ts
├── payload.config.ts        # Payload-Konfig
├── next.config.ts           # withPayload Wrapper
└── data/                    # SQLite-DB (gitignored)
```

---

## Phasen-Plan

- **✓ Phase 1** — Skeleton: Repo, Payload-Setup, Design-Tokens, TopNav + Footer, Home-Stub
- **Phase 2** — Home-Page-Inhalt: Warum uns, 3 Pakete, Testimonial, Galerie-CTA
- **Phase 3** — Subpages: Über mich, Pakete-Detail, Portfolio, Kontakt (mit Formular), Impressum, Datenschutz
- **Phase 4** — Payload-Collections: Pakete, Testimonials, Portfolio, BlogPosts, Settings
- **Phase 5** — Blog: Liste + Detail-Seiten mit Rich-Text, SEO-Meta, Sitemap
- **Phase 6** — SEO: Sitemap, Robots, Open Graph, Schema.org (LocalBusiness, Article)
- **Phase 7** — Mittwald-Deploy + Galerie-Umzug nach `kunden.wedding-kinemedia.de`

---

## CMS

Payload-Admin unter `/admin`. Erster Aufruf legt einen Admin-User an. Danach kannst du dort:

- Eigene User verwalten
- Bilder/Videos hochladen (Media-Collection)
- *(Coming Phase 4)* Pakete, Testimonials, Portfolio, Blog-Posts pflegen

---

## Deployment

Wird in Phase 7 ausgearbeitet — kurz: separate Node.js-App im mStudio analog zur Galerie-App.
