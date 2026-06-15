# Handycity.at — Website

Moderne, statische Website für Handycity Klagenfurt. Gebaut mit Astro + Tailwind CSS.

## Setup

```sh
npm install
npm run dev      # Dev-Server auf http://localhost:4321
npm run build    # Produktions-Build in dist/
npm run preview  # Build-Preview starten
```

> Hinweis: `repo_push/` ist ein lokales, nicht in Git eingechecktes Artefakt und wurde entfernt. Build-Ausgabe `dist/`, `.astro/` und `node_modules/` sind ebenfalls ausgeschlossen und werden nicht als Hosting-Quellcode geliefert.

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
Siehe [OWNER_INTERACTION_RUNBOOK.md](OWNER_INTERACTION_RUNBOOK.md) für den professionellen End-to-End-Betriebsablauf (Add/Edit/Delete/Publish/Rollback).
Siehe [HOMEPAGE_FULL_OVERVIEW.md](HOMEPAGE_FULL_OVERVIEW.md) für die vollständige Leistungs- und Integrationsübersicht.
Siehe [CUSTOMER_OVERVIEW.md](CUSTOMER_OVERVIEW.md) für die kundenfreundliche Übergabe-Zusammenfassung.

## Recherche-Dateien

Für die aktuelle Konkurrenz-/Förder-Recherche wurden folgende Dateien erzeugt:

- `research/geraete-retter-relevante-geraete.md`
- `research/phone-experts-repair-data.csv`
- `research/phone-experts-repair-data.json`
- `research/phone-experts-repair-data-summary.md`

## Owner Quick Start

Fuer den Betreiber gibt es jetzt GitHub-native Pflegewege ohne externes CMS:

- `Actions -> Owner Update Business Info`
- `Actions -> Owner Update Opening Hours`
- `Actions -> Owner Update Price Entry`
- `Actions -> Owner Update Service Item`
- `Actions -> Owner Update Offers`
- `Actions -> Owner Update FAQ Item`
- `Actions -> Owner Update Willhaben Offer`
- `Actions -> Owner Update Content Advanced` (voller Zugriff auf beliebige `content.yaml`-Felder inkl. Add/Edit/Delete)

Diese Workflows schreiben die geprueften Aenderungen direkt nach `main` und loesen danach automatisch Build und Deploy aus.

Bilder werden direkt ueber `public/images/` gepflegt. Details stehen in `public/images/README.md`.

## Deployment

Push auf `main` → GitHub Actions baut und deployed automatisch auf GitHub Pages.

## Owner-Flow Test

Zur lokalen Verifikation aller Owner-Add/Edit/Delete-Mechanismen (Preisrechner, Willhaben, FAQ, Services):

```sh
npm run owner:test:updates
```

Der Test stellt `src/data/content/*.yaml` danach automatisch wieder auf den Ausgangszustand zurueck.

## Architektur-Entscheidungen

Siehe [DECISIONS.md](DECISIONS.md).
