# EDITING.md - Eigentuemer-Anleitung fuer Handycity.at

Diese Datei ist die praktische Anleitung fuer den Betreiber der Website. Sie erklaert, welche Inhalte selbst gepflegt werden koennen, welche Dateien dafuer relevant sind, und wann besser ein Entwickler eingreifen sollte.

Die Website ist so aufgebaut, dass fast alle Inhalte ueber eine zentrale Datei gepflegt werden:

- `src/data/content.yaml`

Solange es nur um Texte, Preise, Kontaktdaten, Bilder, FAQ, Bewertungen oder Angebote geht, muss in der Regel nur diese Datei angepasst werden.

Der empfohlene Weg fuer den Betreiber ist jetzt aber nicht mehr das direkte YAML-Editieren, sondern die vorbereiteten GitHub-Actions-Workflows. Diese schreiben gepruefte Aenderungen direkt nach `main` und sind sicherer als freies Bearbeiten der Datei.

--------------------------------------------------
## 1. Was kann der Inhaber selbst aendern?
--------------------------------------------------

Ohne Entwickler koennen Sie normalerweise selbst aendern:

- alle Texte auf der Website
- Oeffnungszeiten
- Telefonnummer, E-Mail, Adresse
- Hero-Text auf der Startseite
- Service-Liste
- Reparaturpreise im Preisrechner
- FAQ
- Hol- & Bring-Service-Texte
- Willhaben-Texte und Link
- Bewertungen im Backup
- Impressum
- Datenschutzerklaerung
- Bilder im Ordner `public/images/`
- Social-/Externe Links

Ein Entwickler wird meist nur dann gebraucht, wenn Sie etwas an Layout, Design oder Funktionsweise aendern wollen, zum Beispiel:

- neue Sektion mit komplett anderem Aufbau
- anderes Kontaktformular-System
- neue Animationen oder Interaktionen
- neue Unterseiten mit eigenem Layout
- strukturelle Aenderung der Navigation
- Aenderung am Deployment oder an GitHub Pages

--------------------------------------------------
## 2. Empfohlener Weg: GitHub Actions fuer den Betreiber
--------------------------------------------------

Fuer die haeufigsten Aenderungen gibt es vorbereitete Workflows unter `Actions`.

### Verfuegbare Owner-Workflows

- `Owner Update Business Info`
- `Owner Update Opening Hours`
- `Owner Update Price Entry`
- `Owner Update Service Item`
- `Owner Update Offers and Pickup`

### So gehen Sie vor

1. Repository auf GitHub oeffnen
2. In den Tab `Actions` wechseln
3. Den passenden Workflow auswaehlen
4. Auf `Run workflow` klicken
5. Felder ausfuellen
6. Workflow starten

Danach passiert der Rest automatisch:

- die Inhalte werden aktualisiert
- die Website wird validiert und gebaut
- die Aenderung wird direkt nach `main` geschrieben
- GitHub Pages deployt die neue Version

### Wo pruefen?

- Repository -> `Actions`
- danach den Workflow-Run und den Deploy pruefen

--------------------------------------------------
## 3. Direkter Weg: Inhalte direkt in GitHub aendern
--------------------------------------------------

Wenn Sie etwas aendern wollen, das nicht ueber einen Workflow abgedeckt ist, koennen Sie weiterhin direkt in GitHub bearbeiten.

### So gehen Sie vor

1. Datei `src/data/content.yaml` oeffnen
2. Auf das Stift-Symbol klicken
3. Text anpassen
4. `Commit changes` klicken

Wenn der Build fehlschlaegt, wurde meist:

- eine Einrueckung in YAML beschaedigt
- ein Doppelpunkt falsch gesetzt
- ein Anfuehrungszeichen vergessen

--------------------------------------------------
## 4. Wichtige Dateien im Projekt
--------------------------------------------------

### Hauptdatei fuer Inhalte

- `src/data/content.yaml`

Das ist die zentrale Inhaltsdatei. Hier stehen fast alle Texte und Daten.

### Bilder

- `public/images/`

Hier liegen die Bilder, die auf der Website verwendet werden.

Fuer Bilder gibt es eine eigene Kurzanleitung:

- `public/images/README.md`

Aktuell wichtige Dateien:

- `public/images/handycity-logo.png` -> Logo
- `public/images/store-image-in.jpg` -> Hero-Hintergrund / Innenansicht
- `public/images/display-reparatur.jpg` -> Bild im Vertrauens-/Info-Bereich
- `public/images/kamera-reparatur.jpg` -> Bild im Vertrauens-/Info-Bereich
- `public/images/willhaben.png` -> Bild fuer Willhaben-Sektion
- `public/images/hol-bring.png` -> Bild fuer Hol- & Bring-Service

### Seiten

- `src/pages/index.astro` -> Startseite
- `src/pages/impressum.astro` -> Impressum-Seite
- `src/pages/datenschutz.astro` -> Datenschutz-Seite

### Komponenten

Diese Dateien bestimmen das Layout einzelner Sektionen:

- `src/components/Hero.astro`
- `src/components/TrustBar.astro`
- `src/components/Services.astro`
- `src/components/PriceCalculator.astro`
- `src/components/PickupService.astro`
- `src/components/GoogleReviews.astro`
- `src/components/WillhabenShop.astro`
- `src/components/Footer.astro`

Diese Dateien sollten nur geaendert werden, wenn sich Design oder Struktur aendern sollen.

--------------------------------------------------
## 5. Regeln fuer `content.yaml`
--------------------------------------------------

Die Datei `content.yaml` ist empfindlich. Kleine Formatfehler koennen den Build stoppen.

### Unbedingt beachten

- nur Leerzeichen verwenden, keine Tabs
- Einrueckung beibehalten
- Texte immer in Anfuehrungszeichen lassen, wenn sie schon in Anfuehrungszeichen stehen
- bei Listen immer mit `-` arbeiten
- Doppelpunkte nicht loeschen

### Richtiges Beispiel

```yaml
hero:
  headline: "Handy & Tablet Reparatur in Klagenfurt"
  subheadline: "Schnell. Zuverlaessig. Leistbar."
```

### Falsches Beispiel

```yaml
hero:
headline: Handy & Tablet Reparatur in Klagenfurt
subheadline Schnell. Zuverlaessig. Leistbar.
```

Wenn Sie unsicher sind:

- nur den Text zwischen den Anfuehrungszeichen aendern
- keine Strukturzeilen veraendern

--------------------------------------------------
## 6. Inhalte gezielt aendern - Bereich fuer Bereich
--------------------------------------------------

### 5.1 Seitentitel und SEO

Pfad in `content.yaml`:

```yaml
site:
  title: "..."
  description: "..."
  url: "https://handycity.at"
```

Hier aendern Sie:

- Browser-Titel
- Google-Snippet-Text
- Basis-URL der Website

Hinweis:

- `url` nur aendern, wenn sich die Hauptdomain aendert

### 5.2 Firmendaten

Pfad:

```yaml
company:
  name: "Handycity"
  legalName: "Handycity A.K. GmbH"
  phone: "+43 463 918559"
  phoneDisplay: "+43 463 918 559"
  email: "office@handycityarkaden.at"
```

Hier aendern Sie:

- Firmenname
- Rechtsform
- Telefonnummer
- sichtbare Darstellung der Telefonnummer
- E-Mail-Adresse

### 5.3 Adresse und Kartenlink

Pfad:

```yaml
company:
  address:
    street: "Kardinalplatz 6"
    city: "Klagenfurt am Woerthersee"
    zip: "9020"
    country: "AT"
  geo:
    lat: 46.6237671
    lng: 14.3123385
  map:
    placeUrl: "https://www.google.com/maps/place/..."
```

Wichtig:

- `address` steuert sichtbare Adressdaten
- `geo.lat` und `geo.lng` steuern Kartenposition und Schema-Daten
- `map.placeUrl` ist der direkte Google-Maps-Link

Wenn sich der Standort aendert, muessen alle drei Stellen angepasst werden:

1. Adresse
2. Koordinaten
3. Google-Maps-Link

### 5.4 Oeffnungszeiten

Pfad:

```yaml
hours:
  - day: "Montag"
    time: "9:00-18:00"
    shortDay: "Mo"
```

Hier koennen Sie jeden Tag einzeln aendern.

Fuer geschlossen:

```yaml
time: "Geschlossen"
```

Die Oeffnungszeiten werden mehrfach verwendet:

- im Hero
- im Standortbereich
- in strukturierten Daten fuer Suchmaschinen

### 5.5 Hero-Bereich

Pfad:

```yaml
hero:
  kicker: "Klagenfurt am Woerthersee - Kardinalplatz 6"
  headline: "Handy & Tablet Reparatur in Klagenfurt"
  subheadline: "Schnell. Zuverlaessig. Leistbar. ..."
  ctaPrimary:
    text: "Jetzt anrufen"
    href: "tel:+43463918559"
  ctaSecondary:
    text: "Reparatur anfragen"
    href: "#kontakt"
```

Hier aendern Sie:

- kleine Zeile ueber der Hauptueberschrift
- Hauptueberschrift
- Unterzeile
- Buttontexte
- Ziel der Buttons

Typische Linkziele:

- `tel:+43...` -> direkt anrufen
- `mailto:...` -> E-Mail
- `#kontakt` -> zu Kontaktbereich scrollen
- `#preisrechner` -> zu Preisrechner scrollen

### 5.6 Trust Badges im Hero

Pfad:

```yaml
hero:
  trustBadges:
    - text: "Geraete-Retter-Praemie Partner"
    - text: "Erfahrene Techniker"
    - text: "Faire Preise"
```

Hier koennen Sie die kleinen Vertrauenshinweise unter den Buttons aendern oder erweitern.

### 5.7 Trust Bar nach dem Hero

Pfad:

```yaml
trustBar:
  googleLabel: "Google Bewertungen"
  googleHint: "..."
  items:
    - title: "Schnell"
      text: "..."
      icon: "zap"
```

Sie koennen:

- Titel aendern
- Beschreibung aendern
- weitere Trust-Punkte hinzufuegen

Icons sollten nur geaendert werden, wenn ein Entwickler weiss, welche Namen im Icon-System vorhanden sind.

### 5.8 Services

Pfad:

```yaml
services:
  headline: "Unsere Services"
  subheadline: "..."
  items:
    - name: "Display Reparatur"
      description: "..."
      icon: "smartphone"
      price: "Preis auf Anfrage"
```

Hier koennen Sie:

- Services umbenennen
- Beschreibung aendern
- Preise aendern
- Services hinzufuegen oder entfernen

### Neuen Service hinzufuegen

Einfach einen bestehenden Block kopieren:

```yaml
    - name: "Wasserschaden Diagnose"
      description: "Wir pruefen das Geraet und besprechen die sinnvollsten naechsten Schritte."
      icon: "droplets"
      price: "Preis auf Anfrage"
```

Hinweis:

- bei neuen `icon`-Werten besser nur bestehende Namen verwenden
- wenn ein neues Icon noetig ist, Entwickler einbeziehen

### 5.9 Geraete-Retter-Praemie

Pfad:

```yaml
geraeteRetterPraemie:
  headline: "..."
  subheadline: "..."
  description: "..."
  highlights:
    - "..."
  ctaText: "Mehr erfahren"
  ctaHref: "https://..."
```

Hier koennen Sie:

- Texte aktualisieren
- Liste der Vorteile aendern
- Link zum Foerderprogramm anpassen

### 5.10 Marken

Pfad:

```yaml
brands:
  headline: "Wir reparieren alle Marken"
  items:
    - "Apple"
    - "Samsung"
```

Hier koennen Sie Marken hinzufuegen oder entfernen.

### 5.11 Warum Handycity

Pfad:

```yaml
trust:
  headline: "Warum Handycity?"
  items:
    - title: "Erfahrene Techniker"
      description: "..."
      icon: "award"
```

Hier pflegen Sie die Argumente, warum Kunden zu Handycity kommen sollen.

### 5.12 Ablauf / So funktioniert's

Pfad:

```yaml
process:
  headline: "So einfach funktioniert's"
  steps:
    - step: "1"
      title: "Kontakt aufnehmen"
      description: "..."
```

Hier koennen Sie die Schritte des Reparaturprozesses anpassen.

### 5.13 Bewertungen

Pfad:

```yaml
reviews:
  headline: "Das sagen unsere Kunden"
  googleUrl: "https://www.google.com/maps/place/..."
  averageRating: 4.6
  totalReviews: 171
  items:
    - name: "Mario"
      text: "..."
      rating: 5
      date: "vor einem Monat"
```

Diese Daten sind aktuell das sichtbare Backup.

Sie koennen hier:

- Rating
- Anzahl der Bewertungen
- ausgewaehlte Rezensionen
- Google-Link

manuell pflegen.

### Wichtiger Unterschied: Backup vs. Live-Daten

Die Website kann Google-Bewertungen auf zwei Arten nutzen:

1. `content.yaml` als manuelles/statisches Backup
2. Google Places API als Live-Datenquelle

Wenn kein API-Key gesetzt ist, wird das Backup aus `content.yaml` verwendet.

Wenn ein API-Key gesetzt ist, koennen Live-Daten die Backup-Daten auf der Startseite ersetzen.

### Google-Bewertungen einmalig ins Backup schreiben

Voraussetzung:

- `GOOGLE_PLACES_API_KEY`
- optional `GOOGLE_PLACE_ID`
- optional `GOOGLE_PLACE_QUERY`

Dann lokal ausfuehren:

```sh
npm run reviews:backup
```

Die Logik dazu steckt in:

- `scripts/save-google-reviews-backup.mjs`

### 5.14 Preisrechner

Pfad:

```yaml
calculator:
  headline: "Reparatur-Check"
  subheadline: "..."
  helper: "..."
  resultTitle: "Richtpreis"
  prices:
    - brand: "Apple"
      device: "iPhone 15"
      repair: "Display Reparatur"
      price: "ab EUR149"
```

Das ist einer der wichtigsten Bereiche fuer die Pflege.

Hier koennen Sie:

- Marken erweitern
- Modelle ergaenzen
- Reparaturarten anpassen
- Richtpreise aendern

### Neue Preiszeile hinzufuegen

Beispiel:

```yaml
    - brand: "Apple"
      device: "iPhone 16"
      repair: "Display Reparatur"
      price: "ab EUR159"
```

Wichtig:

- `brand`, `device`, `repair` muessen sauber geschrieben sein
- gleiche Schreibweise bei aehnlichen Modellen beibehalten
- keine Duplikate anlegen

### Gute Pflege fuer den Preisrechner

- pro Marke dieselbe Schreibweise verwenden
- gleiche Reparaturbezeichnungen nicht abwechselnd anders schreiben
- lieber wenige, saubere Preiszeilen als viele uneinheitliche

Beispiel gut:

- `Display Reparatur`
- `Akku Tausch`
- `Kamera Reparatur`

Beispiel schlecht:

- `Display`
- `Displaytausch`
- `Display Reparatur`

wenn alles dasselbe meint

### 5.15 Hol- & Bring-Service

Pfad:

```yaml
pickup:
  headline: "Hol & Bring Service"
  description: "..."
  badge: "10 EUR Pauschale innerhalb Klagenfurt"
  ctaText: "Abholung anfragen"
```

Hier pflegen Sie:

- Titel
- Beschreibung
- Preis-/Hinweis-Badge
- CTA-Text
- 3 Service-Schritte

### 5.16 Willhaben / Ankauf / Verkauf

Pfad:

```yaml
willhaben:
  headline: "Handy kaufen & verkaufen"
  description: "..."
  highlights:
    - "Gepruefte Geraete mit persoenlicher Beratung"
  url: "https://www.willhaben.at/..."
  ctaText: "Auf Willhaben ansehen"
```

Hier aendern Sie:

- Titel
- Text
- Vorteile
- Willhaben-Link
- Button-Text

### 5.17 FAQ

Pfad:

```yaml
faq:
  headline: "Haeufig gestellte Fragen"
  items:
    - question: "Wie lange dauert eine Reparatur?"
      answer: "..."
```

Hier koennen Sie beliebig Fragen ergaenzen.

Einfach einen Block kopieren und anpassen.

### 5.18 Kontaktformular

Pfad:

```yaml
contact:
  headline: "Kontaktieren Sie uns"
  subheadline: "..."
  formAction: "https://formspree.io/f/YOUR_FORM_ID"
```

Aktuell ist das Formular fuer Formspree vorbereitet.

Wichtig:

- ohne gueltige `formAction` funktioniert das Formular nicht
- fuer echten Betrieb muss dort eine echte Formspree-URL eingetragen sein

Beispiel:

```yaml
formAction: "https://formspree.io/f/abcxyzde"
```

Sie koennen auch Felder aendern:

```yaml
  fields:
    - name: "device"
      label: "Geraet & Modell"
      type: "text"
      required: false
```

### 5.19 Impressum

Pfad:

```yaml
impressum:
  headline: "Impressum"
  content: |
    ...
```

Das `|` bedeutet: der folgende Block wird mehrzeilig gespeichert.

Hier duerfen Sie den Text frei aendern, muessen aber den mehrzeiligen Block sauber eingerueckt lassen.

### 5.20 Datenschutz

Pfad:

```yaml
datenschutz:
  headline: "Datenschutzerklaerung"
  content: |
    ...
```

Auch hier handelt es sich um einen mehrzeiligen Textblock.

Wenn rechtliche Inhalte geaendert werden, sollte das fachlich geprueft werden.

### 5.21 Social / externe Links

Pfad:

```yaml
social:
  willhaben: "https://www.willhaben.at/..."
```

Hier koennen weitere Links eingetragen werden, z. B.:

```yaml
social:
  willhaben: "https://..."
  instagram: "https://instagram.com/..."
  facebook: "https://facebook.com/..."
```

Wenn neue Netzwerke zwar in `content.yaml` stehen, aber im Footer nicht sichtbar sind, muss ein Entwickler die Komponente erweitern.

--------------------------------------------------
## 7. Bilder austauschen oder neue Bilder einfuegen
--------------------------------------------------

### Bestehendes Bild ersetzen

Einfach im Ordner `public/images/` eine Datei mit gleichem Namen ersetzen.

Beispiel:

- neues Hero-Bild als `store-image-in.jpg` hochladen

Dann bleibt der Code unveraendert und das neue Bild erscheint automatisch.

### Neues Bild mit neuem Dateinamen verwenden

Dann braucht es zwei Schritte:

1. Bild in `public/images/` hochladen
2. Dateinamen an der passenden Stelle im Code anpassen

Beispiel:

- `src/components/Hero.astro`
- `src/components/WillhabenShop.astro`
- `src/components/PickupService.astro`

Wenn Sie nur Inhalte pflegen wollen, ist es besser, bestehende Dateinamen zu ersetzen statt neue Dateinamen einzufuehren.

### Empfehlung fuer Bilder

- breite Bilder fuer Hero und Querformate
- moeglichst scharf, aber weboptimiert
- Dateigroesse nicht unnoetig riesig
- lieber `.jpg` oder `.png`

--------------------------------------------------
## 8. Lokal auf dem eigenen Rechner arbeiten
--------------------------------------------------

Nur relevant, wenn Sie lokal statt direkt auf GitHub arbeiten wollen.

### Voraussetzungen

- Node.js 22 oder hoeher
- Terminal

### Einmalig installieren

```sh
npm install
```

### Entwicklungsserver starten

```sh
npm run dev
```

Dann oeffnen:

- `http://localhost:4321/`

### Produktions-Build pruefen

```sh
npm run build
```

Wenn das fehlerfrei durchlaeuft, ist die YAML-Struktur normalerweise in Ordnung.

--------------------------------------------------
## 9. Deployment / Veroeffentlichung
--------------------------------------------------

Die Live-Seite wird ueber GitHub Actions und GitHub Pages veroeffentlicht.

### Standardablauf

- Aenderung committen
- nach `main` pushen
- GitHub Actions baut die Seite
- GitHub Pages stellt sie online

### Wo pruefen?

- GitHub -> `Actions`
- dort auf den letzten Workflow klicken

Wenn alles korrekt war, steht dort:

- Build erfolgreich
- Pages-Deployment erfolgreich

--------------------------------------------------
## 10. Wann reicht `content.yaml` nicht mehr?
--------------------------------------------------

`content.yaml` reicht aus fuer Inhalte.

Ein Entwickler sollte ran, wenn Sie Folgendes wollen:

- neue Sektion mit komplett neuem Layout
- andere Farben oder neues Branding
- neue Animationen
- neue Navigationseintraege
- neuer Karusselltyp oder neuer Preisrechner
- neue API-Anbindung
- Tracking, Consent, Formsystem, Mehrsprachigkeit

Dann muessen meist diese Bereiche geaendert werden:

- `src/components/`
- `src/pages/`
- `src/layouts/`
- eventuell `src/styles/global.css`

--------------------------------------------------
## 11. Fehlerbehebung
--------------------------------------------------

### Problem: Website baut nicht mehr

Ursache meist:

- YAML falsch eingerueckt
- `:` vergessen
- Liste kaputt gemacht

Loesung:

- letzte Aenderung kontrollieren
- notfalls letzte funktionierende Version in GitHub wiederherstellen

### Problem: Aenderung ist nicht live

Pruefen:

1. Wurde wirklich `main` aktualisiert?
2. Ist der GitHub-Action-Workflow gruen?
3. Browser-Cache neu laden?

### Problem: Formular sendet nicht

Pruefen:

- ist in `contact.formAction` eine echte Formspree-URL hinterlegt?

### Problem: Bewertungen passen nicht

Pruefen:

- `reviews` in `content.yaml`
- ob Live-Google-Daten aktiv sind
- ob ein API-Key in GitHub Actions hinterlegt ist

--------------------------------------------------
## 12. Empfohlener Pflegeprozess fuer den Betreiber
--------------------------------------------------

Fuer normale Inhaltsaenderungen:

1. `src/data/content.yaml` in GitHub oeffnen
2. nur den noetigen Text anpassen
3. committen
4. GitHub Actions pruefen
5. Website live kontrollieren

Fuer Bilder:

1. Datei in `public/images/` ersetzen
2. committen
3. live kontrollieren

Fuer groessere Aenderungen:

1. Wunsch schriftlich festhalten
2. pruefen, ob `content.yaml` reicht
3. wenn nein: Entwickler hinzuziehen

--------------------------------------------------
## 13. Kurze Merkhilfe
--------------------------------------------------

- Inhalte -> `src/data/content.yaml`
- Bilder -> `public/images/`
- Design/Layout -> `src/components/`
- Seiten -> `src/pages/`
- automatisch live nach Push auf `main`

Wenn Sie nur Texte, Preise oder Kontaktdaten pflegen, bleiben Sie fast immer in:

- `src/data/content.yaml`
