# Handycity.at — Website

Moderne, statische Website für Handycity Klagenfurt. Gebaut mit Astro + Tailwind CSS.

## Setup

```sh
npm install
npm run dev      # Dev-Server auf http://localhost:4321
npm run build    # Produktions-Build in dist/
npm run preview  # Build-Preview starten
```

Note on Node.js: This project requires Node >= 22.12.0 (Astro 6). If your local `node -v` shows an older version, use `nvm` and the provided `.nvmrc`:

```sh
nvm install
nvm use
node -v  # should be >= v22.12.0
```


## Projektstruktur

```
src/
├── components/          # Astro-Komponenten (Header, Hero, Services, etc.)
├── data/
│   ├── content/         # ← ALLE editierbaren Inhalte (eine YAML je Bereich)
│   └── phone-expert/    # importierte Preisdaten (siehe docs/CODE_REVIEW.md)
├── layouts/             # Layout.astro (SEO + Schema.org), LegalLayout.astro
├── lib/
│   ├── content-store.mjs    # liest + schreibt den Content-Store
│   ├── content-schema.mjs   # Zod-Schema: definiert gueltigen Content
│   ├── content-types.ts     # TypeScript-Typen, aus dem Schema abgeleitet
│   ├── hours.mjs            # Oeffnungszeiten-Formatierung
│   └── brands.mjs           # Marken-Logos und -Emojis
├── pages/               # index.astro, impressum.astro, datenschutz.astro
└── styles/
    └── global.css       # Tailwind + Design-Tokens
public/
├── CNAME                # Custom Domain
├── robots.txt           # verweist auf die generierte sitemap-index.xml
├── brands/ images/ vendor/
scripts/                 # Owner-Actions, Sync-Jobs, Validierung
docs/                    # Review + archivierte Dokumente
```

Die Sitemap wird beim Build von `@astrojs/sitemap` erzeugt und liegt nicht im
Repository.

## Inhalte bearbeiten

- [EDITING.md](EDITING.md) — Inhalte direkt in `src/data/content/` bearbeiten
- [OWNER_GUIDE.md](OWNER_GUIDE.md) — Betreiber-Dokumentation mit Schritt-für-Schritt-Beispielen
- [docs/](docs/README.md) — Dokumentationsindex, Engineering-Review, archivierte Dokumente

## Validierung

```sh
npm run content:validate    # Content gegen src/lib/content-schema.mjs pruefen
npm run workflows:validate  # Deploy-Kette: jeder pushende Workflow ist verdrahtet
npm run check               # TypeScript/Astro-Typen
npm run prices:check        # Preis-Import in den Content-Store uebernommen?
npm run build
npm run assets:validate     # laeuft nach dem Build gegen die echten Referenzen
```

Dieselben Schritte laufen in `.github/workflows/validate-site.yml` bei jedem
Push und Pull Request.

## Owner Quick Start

Fuer den Betreiber gibt es jetzt GitHub-native Pflegewege ohne externes CMS:

- `Actions -> Owner Update Business Info`
- `Actions -> Owner Update Opening Hours`
- `Actions -> Owner Update Price Entry`
- `Actions -> Owner Update Service Item`
- `Actions -> Owner Update Offers`
- `Actions -> Owner Update FAQ Item`
- `Actions -> Owner Update Willhaben Offer`
- `Actions -> Owner Update Content Advanced` (voller Zugriff auf beliebige Felder im Content-Store inkl. Add/Edit/Delete)

Diese Workflows schreiben die geprueften Aenderungen direkt nach `main` und loesen danach automatisch Build und Deploy aus.

Bilder werden direkt ueber `public/images/` gepflegt.

## Deployment

Push auf `main` → GitHub Actions baut und deployed automatisch auf GitHub Pages.

## Owner-Flow Test

Zur lokalen Verifikation aller Owner-Add/Edit/Delete-Mechanismen (Preisrechner, Willhaben, FAQ, Services):

```sh
npm run owner:test:updates
```

Der Test stellt `src/data/content/*.yaml` danach automatisch wieder auf den Ausgangszustand zurueck.

## Phone-Expert Sync (automated)

This repository includes a sync that ingests price data from phone-experts into
`src/data/phone-expert/prices.json`. `npm run prices:normalize` then folds that
file into `calculator.prices`, so the content store stays the single validated
source — the page does not merge it at render time.

> **The scheduled run is currently suspended** and the provenance of this
> dataset is an open question. See `docs/CODE_REVIEW.md` section 2.1 before
> re-enabling it.

- Run locally:

```sh
# use Node version from .nvmrc
nvm install
nvm use

# produce/update the phone-expert data file
npm run sync:phone-expert

# validate generated content
npm run content:validate
```

- CI / GitHub Actions: `.github/workflows/owner-sync-phone-expert.yml` is
  manual-only for now (`workflow_dispatch`); the monthly schedule is commented
  out pending the decision above.

## Architektur-Entscheidungen

Siehe [DECISIONS.md](DECISIONS.md).
