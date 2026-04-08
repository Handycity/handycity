# Handycity.at — Website

Moderne, statische Website für Handycity Klagenfurt. Gebaut mit Astro + Tailwind CSS.

## Setup

```sh
npm install
npm run dev      # Dev-Server auf http://localhost:4321
npm run build    # Produktions-Build in dist/
npm run preview  # Build-Preview starten
```

## Projektstruktur

```
src/
├── components/     # Astro-Komponenten (Header, Hero, Services, etc.)
├── data/
│   └── content.yaml  # ← ALLE editierbaren Inhalte
├── layouts/
│   └── Layout.astro  # Basis-Layout mit SEO + Schema.org
├── pages/
│   └── index.astro   # Hauptseite
└── styles/
    └── global.css     # Tailwind + Design-Tokens
public/
├── CNAME             # Custom Domain
├── robots.txt
├── sitemap.xml
└── images/
```

## Inhalte bearbeiten

Siehe [EDITING.md](EDITING.md) für die Anleitung.
Siehe [OWNER_GUIDE.md](OWNER_GUIDE.md) für die vollständige Betreiber-Dokumentation mit Schritt-für-Schritt-Beispielen.

## Owner Quick Start

Fuer den Betreiber gibt es jetzt GitHub-native Pflegewege ohne externes CMS:

- `Actions -> Owner Update Business Info`
- `Actions -> Owner Update Opening Hours`
- `Actions -> Owner Update Price Entry`
- `Actions -> Owner Update Service Item`
- `Actions -> Owner Update Offers and Pickup`

Diese Workflows schreiben die geprueften Aenderungen direkt nach `main` und loesen danach automatisch Build und Deploy aus.

Bilder werden direkt ueber `public/images/` gepflegt. Details stehen in `public/images/README.md`.

## Deployment

Push auf `main` → GitHub Actions baut und deployed automatisch auf GitHub Pages.

## Architektur-Entscheidungen

Siehe [DECISIONS.md](DECISIONS.md).
