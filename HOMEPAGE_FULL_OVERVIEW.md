# Handycity Homepage: Full Overview

## 1) Was die Homepage aktuell abdeckt

Die Website ist eine vollständige Conversion- und Informationsseite für:
- Reparatur-Anfragen (inkl. Preisorientierung)
- Vertrauen/Social Proof (Google-Bewertungen)
- Geräte-Retter-Prämie Erklärung
- Kauf/Verkauf über Willhaben
- Kontakt, Standort, Öffnungszeiten
- FAQ und rechtliche Seiten

Der komplette Content wird zentral aus `src/data/content.yaml` geladen.

## 2) Seitenaufbau und Sektionen (in Reihenfolge)

Aus `src/pages/index.astro`:

1. Header
- Fixe Navigation mit Sprunglinks, Desktop/Mobile-Menü, Telefon-CTA.

2. Hero
- Hauptbotschaft, Primär-/Sekundär-CTA, Vertrauens-Badges, Schnellkontakt-Hinweis.

3. TrustBar (`#trustbar`)
- Google-Bewertungszusammenfassung + 4 USP-Karten.

4. Services Hub (`#services-hub`)
- Intent-Navigation in 3 Karten:
  - Reparieren -> `#preisrechner`
  - Handy kaufen -> `#handy-kaufen`
  - Extra-Service -> `#kontakt`

5. Preisrechner (`#preisrechner`)
- 3-stufiges Alpine-UI (Marke -> Modell -> Reparatur)
- Datenquelle: `calculator.prices` in YAML
- CTAs: Anruf + Reparaturanfrage
- Geräte-Retter-Hinweiskarte

6. Geräte-Retter-Prämie (`#geraete-retter-praemie`)
- Fördertext, Highlights, Schritte, externes Info-Linkziel.

7. Warum Handycity (`#ueber-uns`)
- Vertrauenselemente/Kompetenzkacheln.

8. Ablauf/Prozess
- Schritt-für-Schritt Reparaturprozess.

9. Handy kaufen (`#handy-kaufen`)
- Willhaben-Integration mit Angebotskarten aus YAML.

10. Hol & Bring Service (`#hol-bring-service`)
- Ablauf und Pauschalhinweis.

11. Google Reviews (`#bewertungen`)
- Bewertungs-Header + Carousel (Alpine).

12. FAQ (`#faq`)
- Akkordeon mit Alpine + Collapse.

13. Kontakt (`#kontakt`)
- Kontaktkarten + Formular (öffnet Mailprogramm via `mailto:`).

14. Standort (`#standort`)
- Google Maps Embed + Route/Maps-Links + Öffnungszeiten.

15. Markenleiste
- Unterstützte Marken.

16. Footer
- Navigationslinks, Rechtliches, Kontaktdaten.

## 3) Technische Architektur

- Framework: Astro (SSR/Static build)
- Styling: Tailwind CSS v4 Tokens in `src/styles/global.css`
- Interaktivität: Alpine.js + `@alpinejs/collapse`
- Datenhaltung: YAML (`src/data/content.yaml`) als Single Source of Truth
- Build: `npm run build` (Astro)
- Node-Version: >= 22.12.0

## 4) Integrierte Datenquellen und Funktionen

1. Google Reviews (live + Fallback)
- `src/lib/google-places-reviews.ts` wird in `src/pages/index.astro` serverseitig aufgerufen.
- Bei Fehlern fällt die Seite auf `content.yaml` Reviews zurück.
- Optional via Env: `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`.

2. Willhaben-Angebote
- Angebotsdaten in `content.yaml` unter `willhaben.offers`.
- Automatisierbar per Sync-Script (`scripts/sync-willhaben-offers.mjs`).

3. Google Maps
- Embed auf Basis von `company.geo`.
- Route- und Place-Link über `company.map.placeUrl`.

4. Strukturierte Daten (SEO)
- `LocalBusiness` + `FAQPage` JSON-LD in `src/layouts/Layout.astro`.

5. Kontaktprozess
- Formular erzeugt `mailto:` mit vorausgefüllten Daten.
- Kein externer Form-POST erforderlich.

## 5) GitHub Actions: Features und Nutzen

Workflows in `.github/workflows/`:

1. `deploy.yml` (Deploy to GitHub Pages)
- Trigger:
  - Push auf `main`
  - Manuell (`workflow_dispatch`)
  - Nach erfolgreichem Abschluss der Owner-Update-Workflows (`workflow_run`)
- Build mit Node 22, Upload `dist/`, Deploy über Pages Action.

2. `validate-site.yml` (Validate Site Content)
- Trigger: Pull Request + Push auf `main`
- Führt aus:
  - `npm run content:validate`
  - `npm run assets:validate`
  - `npm run build`

3. Owner-Update Workflows (manuell pflegbar ohne Code-Edit)
- `owner-update-business.yml`
- `owner-update-hours.yml`
- `owner-update-price-entry.yml`
- `owner-update-service-item.yml`
- `owner-update-offers.yml`

Diese Workflows:
- nehmen Eingaben im Action-Form entgegen
- aktualisieren YAML via Scripts
- validieren und bauen
- committen/pushen Änderungen automatisiert nach `main`

4. Sync-Workflows
- `owner-sync-willhaben.yml` (manuell + geplant alle 6h)
- `owner-sync-google-reviews.yml` (manuell + täglich)

## 6) Was der Betreiber aktiv tun kann

- Öffnungszeiten pflegen
- Business-Daten (Telefon, Adresse, Hero) ändern
- Preisrechner-Einträge hinzufügen/entfernen
- Services ändern
- Willhaben-Textbausteine und Pickup-Bereich ändern
- Willhaben-Angebote und Google-Reviews automatisiert synchronisieren
- Jede Änderung via CI validieren und automatisch deployen

## 7) Wichtige Ablageorte

- Inhalt: `src/data/content.yaml`
- Komponenten: `src/components/*.astro`
- Seite: `src/pages/index.astro`
- Layout/SEO: `src/layouts/Layout.astro`
- Owner-Skripte: `scripts/*.mjs`
- Automationen: `.github/workflows/*.yml`

