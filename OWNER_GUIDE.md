# OWNER_GUIDE.md - Vollstaendige Betreiber-Dokumentation

Diese Datei ist die ausfuehrliche, reproduzierbare Anleitung fuer den Betreiber von Handycity.at.

Sie erklaert:

- welche Inhalte selbst gepflegt werden koennen
- welcher Weg fuer welche Aenderung gedacht ist
- welche GitHub-Actions-Workflows es gibt
- wie Preise, Modelle, Services, Angebote, Bilder und Texte angepasst werden
- wie man Aenderungen prueft und veroefentlicht
- welche Beispiele fuer typische Aenderungen verwendet werden koennen

Die Website bleibt auf GitHub Pages. Es gibt daher kein separates Admin-System auf der Website selbst. Die sichere Bearbeitung erfolgt ueber GitHub:

- entweder ueber vorbereitete `Actions`
- oder direkt ueber Dateien im Repository

Fuer den operativen End-to-End-Ablauf (inkl. Publish und Rollback) siehe zusaetzlich:

- `OWNER_INTERACTION_RUNBOOK.md`

--------------------------------------------------
## 1. Grundprinzip
--------------------------------------------------

Es gibt drei Ebenen der Pflege:

1. GitHub Actions
   - fuer die haeufigsten Betreiber-Aenderungen
   - sicherster Weg fuer Nicht-Techniker
   - schreibt gepruefte Aenderungen direkt nach `main`

2. Direkte Inhaltsbearbeitung
   - fuer Inhalte, die nicht ueber einen Workflow abgedeckt sind
   - Hauptdatei: `src/data/content/*.yaml`

3. Bildaustausch
   - ueber `public/images/`
   - am einfachsten durch Ersetzen vorhandener Dateien mit gleichem Namen

Wenn moeglich, immer zuerst `Actions` verwenden.

--------------------------------------------------
## 2. Wichtige Dateien
--------------------------------------------------

### Zentrale Inhaltsdatei

- `src/data/content/*.yaml`

Hier liegen fast alle bearbeitbaren Inhalte:

- Firmendaten
- Hero-Texte
- Oeffnungszeiten
- Services
- Preisrechner
- Bewertungen
- Hol- & Bring-Service
- Willhaben / Ankauf / Verkauf
- FAQ
- Kontakt
- Impressum
- Datenschutz
- Social Links

### Bilder

- `public/images/`

Aktuell verwendete Bilder:

- `public/images/handycity-logo.png`
- `public/images/store-image-in.jpg`
- `public/images/display-reparatur.jpg`
- `public/images/kamera-reparatur.jpg`
- `public/images/willhaben.png`
- `public/images/hol-bring.png`

### Dokumentation

- `EDITING.md` -> kuerzere Bearbeitungsanleitung
- `public/images/README.md` -> Bilder-Anleitung
- `OWNER_GUIDE.md` -> diese vollstaendige Betreiber-Dokumentation

### GitHub Actions

Die wichtigsten Workflows liegen in:

- `.github/workflows/owner-update-business.yml`
- `.github/workflows/owner-update-hours.yml`
- `.github/workflows/owner-update-price-entry.yml`
- `.github/workflows/owner-update-service-item.yml`
- `.github/workflows/owner-update-offers.yml`
- `.github/workflows/owner-update-faq-item.yml`
- `.github/workflows/owner-update-willhaben-offer.yml`
- `.github/workflows/owner-update-content-advanced.yml`
- `.github/workflows/owner-sync-willhaben.yml`
- `.github/workflows/owner-sync-google-reviews.yml`
- `.github/workflows/validate-site.yml`

--------------------------------------------------
## 3. Sicherer Standardablauf fuer den Betreiber
--------------------------------------------------

### Empfohlener Ablauf

1. Repository auf GitHub oeffnen
2. `Actions` aufrufen
3. passenden Workflow auswaehlen
4. `Run workflow` klicken
5. Felder ausfuellen
6. Workflow starten
7. auf das automatische Commit nach `main` warten
8. den Deploy-Status pruefen

### Warum dieser Weg?

Vorteile:

- keine direkte Aenderung an Code notwendig
- GitHub prueft die Aenderung automatisch
- Aenderung bleibt trotzdem ueber Git-Historie nachvollziehbar
- Fehler werden vor dem Livegang eher erkannt

--------------------------------------------------
## 4. Was kann der Betreiber selbst aendern?
--------------------------------------------------

Ohne Entwickler koennen gepflegt werden:

- Hero-Text
- Telefonnummer
- E-Mail
- Adresse
- Google-Maps-Link
- Oeffnungszeiten
- Marken / Modelle / Reparaturen / Preise
- Service-Karten
- Willhaben-Bereich
- Ankauf / Verkauf / Angebote
- Hol- & Bring-Service-Texte
- FAQ
- Bewertungen-Backup
- Impressum
- Datenschutz
- Bilder

Ein Entwickler wird typischerweise nur gebraucht fuer:

- neues Layout
- neue Designsprache
- neue Komponenten
- neue Unterseiten
- neue Interaktionen
- neue APIs
- Aenderungen am Deploy-/GitHub-Setup

--------------------------------------------------
## 5. GitHub Actions - Vollstaendige Anleitung
--------------------------------------------------

### 5.1 Owner Update Business Info

Workflow:

- `Actions -> Owner Update Business Info`

Damit aenderbar:

- Hero-Kicker
- Hero-Headline
- Hero-Subheadline
- Telefon
- sichtbare Telefonnummer
- E-Mail
- Strasse
- Postleitzahl
- Ort
- Google-Maps-Link
- SEO-Basisfelder

### Schritt fuer Schritt

1. `Actions` oeffnen
2. `Owner Update Business Info` auswaehlen
3. `Run workflow` klicken
4. nur die Felder ausfuellen, die geaendert werden sollen
5. starten
6. danach den Workflow-Run und den Deploy pruefen

### Beispiel 1 - Hero Headline aendern

Eingaben:

- `hero_headline`: `Handy Reparatur in Klagenfurt`
- `hero_subheadline`: `Schnell. Fair. Zuverlaessig. Ihr Geraet ist bei uns in guten Haenden.`

### Beispiel 2 - E-Mail aendern

Eingabe:

- `company_email`: `office@handycityarkaden.at`

### Beispiel 3 - Adresse und Map aktualisieren

Eingaben:

- `company_street`: `Kardinalplatz 6`
- `company_zip`: `9020`
- `company_city`: `Klagenfurt am Woerthersee`
- `company_map_url`: `https://www.google.com/maps/place/...`

Wichtig:

Wenn sich der Standort aendert, immer Adresse und Map-Link gemeinsam aktualisieren.

--------------------------------------------------
### 5.2 Owner Update Opening Hours
--------------------------------------------------

Workflow:

- `Actions -> Owner Update Opening Hours`

Damit aenderbar:

- alle Oeffnungszeiten pro Wochentag

### Schritt fuer Schritt

1. Workflow `Owner Update Opening Hours` oeffnen
2. alle Tagesfelder ausfuellen
3. Workflow starten
4. Workflow-Run pruefen
5. auf Deploy warten

### Erlaubte Eingaben

Beispiele:

- `9:00-18:00`
- `10:00-14:00`
- `Geschlossen`

### Beispiel fuer eine komplette Woche

- `hours_mo`: `9:00-18:00`
- `hours_di`: `9:00-18:00`
- `hours_mi`: `9:00-18:00`
- `hours_do`: `9:00-18:00`
- `hours_fr`: `9:00-18:00`
- `hours_sa`: `9:00-13:00`
- `hours_so`: `Geschlossen`

### Beispiel fuer Ferienzeiten

- `hours_mo`: `10:00-17:00`
- `hours_di`: `10:00-17:00`
- `hours_mi`: `10:00-17:00`
- `hours_do`: `10:00-17:00`
- `hours_fr`: `10:00-17:00`
- `hours_sa`: `Geschlossen`
- `hours_so`: `Geschlossen`

--------------------------------------------------
### 5.3 Owner Update Price Entry
--------------------------------------------------

Workflow:

- `Actions -> Owner Update Price Entry`

Damit aenderbar:

- neue Modelle
- neue Reparaturarten
- neue Preise
- bestehende Preiszeilen
- Entfernen einzelner Preiszeilen

Wichtig:

Der Workflow bearbeitet immer genau eine Preiszeile pro Durchlauf.

### Felder

- `action` -> `upsert` oder `remove`
- `brand`
- `device`
- `repair`
- `price`

### Bedeutung

- `upsert` = neu anlegen oder bestehenden Eintrag aktualisieren
- `remove` = vorhandenen Eintrag loeschen

### Beispiel 1 - neues Modell hinzufuegen

Sie wollen `iPhone 16` ergaenzen:

Durchlauf 1:

- `action`: `upsert`
- `brand`: `Apple`
- `device`: `iPhone 16`
- `repair`: `Display Reparatur`
- `price`: `ab EUR159`

Durchlauf 2:

- `action`: `upsert`
- `brand`: `Apple`
- `device`: `iPhone 16`
- `repair`: `Akku Tausch`
- `price`: `ab EUR79`

Durchlauf 3:

- `action`: `upsert`
- `brand`: `Apple`
- `device`: `iPhone 16`
- `repair`: `Kamera Reparatur`
- `price`: `ab EUR99`

### Beispiel 2 - Preis anpassen

Vorhandener Eintrag:

- Samsung / Galaxy S24 / Display Reparatur

Neuer Preis:

- `action`: `upsert`
- `brand`: `Samsung`
- `device`: `Galaxy S24`
- `repair`: `Display Reparatur`
- `price`: `ab EUR169`

### Beispiel 3 - Eintrag entfernen

- `action`: `remove`
- `brand`: `Apple`
- `device`: `iPhone SE`
- `repair`: `Akku Tausch`

### Wichtige Regeln

- Schreibweise immer konsistent halten
- keine Duplikate fuer dieselbe Kombination aus Marke + Modell + Reparatur
- gleiche Reparaturarten gleich schreiben

Empfohlene Reparaturbezeichnungen:

- `Display Reparatur`
- `Akku Tausch`
- `Kamera Reparatur`
- `Ladekonnektor`
- `Lautsprecher & Mikrofon`

--------------------------------------------------
### 5.4 Owner Update Service Item
--------------------------------------------------

Workflow:

- `Actions -> Owner Update Service Item`

Damit aenderbar:

- Servicekarten hinzufuegen
- Servicekarten bearbeiten
- Servicekarten entfernen

### Felder

- `action`
- `name`
- `description`
- `icon`
- `price`
- `href` (optional)
- `action_text` (optional)

### Beispiel 1 - neuen Service hinzufuegen

- `action`: `upsert`
- `name`: `Wasserschaden Diagnose`
- `description`: `Wir pruefen das Geraet und besprechen die sinnvollsten naechsten Schritte.`
- `icon`: `droplets`
- `price`: `Preis auf Anfrage`

### Beispiel 2 - Servicebeschreibung aendern

- `action`: `upsert`
- `name`: `Datentransfer`
- `description`: `Wir uebertragen Ihre Daten sicher auf ein neues Smartphone.`
- `icon`: `repeat`
- `price`: `Preis auf Anfrage`

### Beispiel 3 - Service entfernen

- `action`: `remove`
- `name`: `Datentransfer`

### Hinweis zu Icons

Wenn moeglich, bestehende Icon-Namen weiterverwenden. Nicht willkuerlich neue Icon-Namen erfinden, wenn nicht klar ist, ob sie im Frontend unterstuetzt werden.

--------------------------------------------------
### 5.5 Owner Update Offers and Pickup
--------------------------------------------------

Workflow:

- `Actions -> Owner Update Offers and Pickup`

Damit aenderbar:

- Willhaben-Sektion
- Ankauf / Verkauf / Angebots-Texte
- Hol- & Bring-Service

### Felder fuer Willhaben

- `willhaben_headline`
- `willhaben_description`
- `willhaben_url`
- `willhaben_cta_text`
- `willhaben_highlights`

### Felder fuer Pickup

- `pickup_headline`
- `pickup_description`
- `pickup_badge`
- `pickup_cta_text`
- `pickup_steps`

### Beispiel 1 - Willhaben-Headline aendern

- `willhaben_headline`: `Handy kaufen, verkaufen und eintauschen`

### Beispiel 2 - Willhaben-Highlights setzen

Eingabe in `willhaben_highlights`:

```text
Gepruefte Geraete mit persoenlicher Beratung
Ankauf direkt im Geschaeft
Datenuebernahme auf Wunsch
Zubehoer und Angebote vor Ort
```

Alternativ mit `|`:

```text
Gepruefte Geraete mit persoenlicher Beratung | Ankauf direkt im Geschaeft | Datenuebernahme auf Wunsch
```

### Beispiel 3 - Hol- & Bring-Schritte setzen

Format:

- `Titel :: Text`

Beispiel fuer `pickup_steps`:

```text
Abholung anfragen :: Kurz telefonisch oder ueber das Kontaktformular melden.
Reparatur im Shop :: Wir pruefen das Geraet, nennen den Preis und reparieren es fachgerecht.
Zurueckgebracht :: Ihr Geraet kommt repariert und einsatzbereit wieder zu Ihnen.
```

--------------------------------------------------
### 5.6 Owner Update FAQ Item
--------------------------------------------------

Workflow:

- `Actions -> Owner Update FAQ Item`

Damit aenderbar:

- FAQ-Eintrag anlegen
- FAQ-Eintrag aktualisieren
- FAQ-Eintrag entfernen

Felder:

- `action`: `upsert` oder `remove`
- `question`
- `answer` (bei `upsert` erforderlich)

Beispiele:

- Neu/Update:
  - `action`: `upsert`
  - `question`: `Bietet ihr Express-Service?`
  - `answer`: `Ja, je nach Ersatzteil oft am selben Tag.`

- Entfernen:
  - `action`: `remove`
  - `question`: `Bietet ihr Express-Service?`

--------------------------------------------------
### 5.7 Owner Update Willhaben Offer
--------------------------------------------------

Workflow:

- `Actions -> Owner Update Willhaben Offer`

Damit aenderbar:

- Einzelnes Angebot anlegen
- Einzelnes Angebot aktualisieren
- Einzelnes Angebot entfernen

Felder:

- `action`: `upsert` oder `remove`
- `url` (empfohlener Schluessel) oder `title`
- bei neuem `upsert`: Titel, Preis, Bilddaten und Meta-Felder

Beispiele:

- Neu:
  - `action`: `upsert`
  - `title`: `iPhone 14 128GB Black Neu/Haendler`
  - `price`: `EUR 499`
  - `url`: `https://www.willhaben.at/iad/kaufen-und-verkaufen/d/...`
  - `image`: `https://cache.willhaben.at/...`
  - `image_alt`: `iPhone 14 Black von Handycity auf willhaben`
  - `listed_at`: `05.05.2026`
  - `storage`: `128 GB`
  - `unlocked`: `Ja`
  - `condition`: `Neu`
  - `delivery`: `Selbstabholung, Versand`

- Entfernen:
  - `action`: `remove`
  - `url`: `https://www.willhaben.at/iad/kaufen-und-verkaufen/d/...`

--------------------------------------------------
### 5.8 Sync Willhaben Offers
--------------------------------------------------

Workflow:

- `Actions -> Sync Willhaben Offers`

Damit aenderbar:

- Live-Angebote aus dem Willhaben-Shop automatisch nach `content.yaml` uebernehmen
- `verifiedOn` automatisch auf den aktuellen Tag setzen
- Trigger-basiert: manuell ueber `Run workflow` oder regelmaessig per Zeitplan

### Felder

- `shop_url` (optional)
- `max_offers` (optional)

### Typische Nutzung

- Manuell starten, wenn neue Anzeigen sofort auf der Website sichtbar sein sollen
- Zeitplan laufen lassen, damit die Sektion automatisch aktuell bleibt

--------------------------------------------------
### 5.9 Sync Google Reviews Backup
--------------------------------------------------

Workflow:

- `Actions -> Sync Google Reviews Backup`

Damit aenderbar:

- Google-Bewertungen als Backup in `content.yaml` aktualisieren
- Durchschnittsbewertung und Gesamtanzahl uebernehmen
- Trigger-basiert: manuell ueber `Run workflow` oder regelmaessig per Zeitplan

### Voraussetzung

- Repository Secret `GOOGLE_PLACES_API_KEY`

### Felder

- `place_id` (optional)
- `place_query` (optional)
- `language` (optional)
- `max_items` (optional)

--------------------------------------------------
### 5.10 Owner Update Content Advanced
--------------------------------------------------

Workflow:

- `Actions -> Owner Update Content Advanced`

Damit aenderbar:

- beliebige Felder in `src/data/content/*.yaml`
- Listen-Eintraege hinzufuegen/aktualisieren (`list_upsert`)
- Listen-Eintraege loeschen (`list_remove`)
- beliebige Felder entfernen (`remove`)

Felder:

- `action`: `set` | `remove` | `list_upsert` | `list_remove`
- `target_path`: Pfad in `content.yaml`, z. B. `faq.items` oder `company.address.street`
- `value_json`: JSON-Wert fuer die Aktion
- `key_fields`: Schluesselfelder fuer Listenabgleich, z. B. `brand,device,repair`

Beispiele:

1. FAQ-Eintrag hinzufuegen:
- `action`: `list_upsert`
- `target_path`: `faq.items`
- `key_fields`: `question`
- `value_json`: `{"question":"Bietet ihr Express-Service?","answer":"Ja, je nach Ersatzteil oft am selben Tag."}`

2. Rechtstext aendern:
- `action`: `set`
- `target_path`: `impressum.content`
- `value_json`: `"Neuer Impressumstext ..."`

3. Preiszeile loeschen:
- `action`: `list_remove`
- `target_path`: `calculator.prices`
- `key_fields`: `brand,device,repair`
- `value_json`: `{"brand":"Apple","device":"iPhone 15","repair":"Akku Tausch"}`

--------------------------------------------------
## 6. Direkte Bearbeitung in `content.yaml`
--------------------------------------------------

Wenn Sie keinen Action-Workflow verwenden moechten, erfolgt die Pflege direkt ueber:

- `src/data/content/*.yaml`

### Wichtigste Regeln

- nur Leerzeichen verwenden, keine Tabs
- Einrueckung nicht kaputt machen
- bei Unsicherheit nur Texte austauschen, nicht die Struktur
- bestehende Bloecke kopieren statt neue frei erfinden

### Grundmuster

```yaml
bereich:
  feld: "Text"
```

### Listenmuster

```yaml
items:
  - name: "Eintrag 1"
    text: "Beschreibung"
  - name: "Eintrag 2"
    text: "Beschreibung"
```

--------------------------------------------------
### 6.1 Site / SEO
--------------------------------------------------

Bereich:

```yaml
site:
  title: "..."
  description: "..."
  url: "https://handycity.at"
```

Anwendungsfaelle:

- Seitentitel fuer Google
- Seitenbeschreibung
- Hauptdomain

Beispiel:

```yaml
site:
  title: "Handy Reparatur Klagenfurt | Handycity"
  description: "Handy- und Tablet-Reparatur in Klagenfurt. Schnell, fair und zuverlaessig."
  url: "https://handycity.at"
```

--------------------------------------------------
### 6.2 Company / Kontakt / Adresse
--------------------------------------------------

Bereich:

```yaml
company:
  name: "Handycity"
  legalName: "Handycity A.K. GmbH"
  phone: "+43 463 918559"
  phoneDisplay: "+43 463 918 559"
  email: "office@handycityarkaden.at"
```

Hier koennen geaendert werden:

- Name
- Rechtsform
- Telefon
- sichtbare Telefonnummer
- E-Mail

--------------------------------------------------
### 6.3 Hero
--------------------------------------------------

Bereich:

```yaml
hero:
  kicker: "Klagenfurt am Woerthersee - Kardinalplatz 6"
  headline: "Handy & Tablet Reparatur in Klagenfurt"
  subheadline: "Schnell. Zuverlaessig. Leistbar."
```

Beispiel:

```yaml
hero:
  kicker: "Klagenfurt - zentral am Kardinalplatz"
  headline: "Handy Reparatur in Klagenfurt"
  subheadline: "Schnell. Fair. Verlaesslich. Ihr Geraet in guten Haenden."
```

--------------------------------------------------
### 6.4 Services
--------------------------------------------------

Bereich:

```yaml
services:
  items:
    - name: "Display Reparatur"
      description: "..."
      icon: "smartphone"
      price: "Preis auf Anfrage"
```

Beispiel fuer neuen Service:

```yaml
    - name: "Tablet Reparatur"
      description: "Display, Akku und Anschluesse fuer viele gaengige Tablets."
      icon: "tablet"
      price: "Preis auf Anfrage"
```

--------------------------------------------------
### 6.5 Bewertungen
--------------------------------------------------

Bereich:

```yaml
reviews:
  averageRating: 4.6
  totalReviews: 171
  items:
    - name: "Mario"
      text: "..."
      rating: 5
      date: "vor einem Monat"
```

Hier kann das Backup gepflegt werden.

Beispiel:

```yaml
    - name: "Max Mustermann"
      text: "Schnelle Reparatur und gute Beratung."
      rating: 5
      date: "vor 2 Wochen"
```

--------------------------------------------------
### 6.6 Preisrechner direkt in YAML
--------------------------------------------------

Bereich:

```yaml
calculator:
  prices:
    - brand: "Apple"
      device: "iPhone 15"
      repair: "Display Reparatur"
      price: "ab EUR149"
```

Beispiel:

```yaml
    - brand: "Apple"
      device: "iPhone 16"
      repair: "Display Reparatur"
      price: "ab EUR159"
    - brand: "Apple"
      device: "iPhone 16"
      repair: "Akku Tausch"
      price: "ab EUR79"
```

--------------------------------------------------
### 6.7 Willhaben / Ankauf / Verkauf
--------------------------------------------------

Bereich:

```yaml
willhaben:
  headline: "Handy kaufen & verkaufen"
  description: "..."
  verifiedOn: "17. April 2026"
  url: "https://www.willhaben.at/..."
  ctaText: "Zum Willhaben-Shop"
  contactCtaText: "Geraet anfragen"
  highlights:
    - "..."
  offers:
    - title: "iPhone 12 64GB White Neu/Haendler"
      price: "EUR 369,90"
      url: "https://www.willhaben.at/..."
      image: "https://cache.willhaben.at/..."
      imageAlt: "iPhone 12 White von Handycity auf willhaben"
      listedAt: "18.11.2025"
      storage: "64 GB"
      unlocked: "Ja"
      condition: "Neu"
      delivery: "Selbstabholung, Versand"
      note: "Optional"
```

Beispiel:

```yaml
willhaben:
  headline: "Handy kaufen, verkaufen und eintauschen"
  description: "Diese Angebote sind aktuell live im Handycity-Shop auf willhaben."
  verifiedOn: "17. April 2026"
  url: "https://www.willhaben.at/iad/shop/handycity-ak-gmbh"
  ctaText: "Zum Willhaben-Shop"
  contactCtaText: "Geraet anfragen"
  highlights:
    - "Gepruefte Geraete mit persoenlicher Beratung"
    - "Ankauf direkt im Geschaeft"
    - "Datenuebernahme auf Wunsch"
  offers:
    - title: "Samsung S23 128GB Green Neu/Haendler"
      price: "EUR 469"
      url: "https://www.willhaben.at/iad/kaufen-und-verkaufen/d/..."
      image: "https://cache.willhaben.at/mmo/..."
      imageAlt: "Samsung S23 Green von Handycity auf willhaben"
      listedAt: "14.11.2025"
      storage: "128 GB"
      unlocked: "Ja"
      condition: "Neu"
      delivery: "Selbstabholung, Versand"
```

Bearbeitung in GitHub:

- Abschnittstexte, CTA-Texte und der Shop-Link sind direkt im `willhaben:`-Block editierbar.
- Ein einzelnes Angebot ist jeweils ein kompletter Block unter `offers:`.
- Neues Angebot: bestehenden Angebotsblock kopieren, einfuegen und anpassen.
- Angebot entfernen: gesamten Block loeschen.
- Reihenfolge aendern: Angebotsbloecke innerhalb von `offers:` verschieben.
- Bild aendern: `image` austauschen.
- Fuer Barrierefreiheit `imageAlt` immer passend zum Geraet pflegen.

--------------------------------------------------
### 6.8 Hol- & Bring-Service
--------------------------------------------------

Bereich:

```yaml
pickup:
  headline: "Hol & Bring Service"
  description: "..."
  badge: "10 EUR Pauschale innerhalb Klagenfurt"
```

Beispiel:

```yaml
pickup:
  headline: "Hol & Bring Service in Klagenfurt"
  description: "Wir holen Ihr Geraet in Klagenfurt ab, reparieren es und bringen es wieder zurueck."
  badge: "10 EUR Pauschale innerhalb Klagenfurt"
```

--------------------------------------------------
### 6.9 FAQ
--------------------------------------------------

Bereich:

```yaml
faq:
  items:
    - question: "Wie lange dauert eine Reparatur?"
      answer: "..."
```

Beispiel fuer neue Frage:

```yaml
    - question: "Repariert ihr auch Tablets?"
      answer: "Ja, wir reparieren Smartphones und Tablets vieler gaengiger Marken."
```

--------------------------------------------------
### 6.10 Impressum / Datenschutz
--------------------------------------------------

Bereiche:

- `impressum.content`
- `datenschutz.content`

Das sind mehrzeilige Textbloecke mit `|`.

Hier nur den Text aendern, nicht die Einrueckung zerstoeren.

--------------------------------------------------
## 7. Bilder austauschen
--------------------------------------------------

Der einfachste und sicherste Weg ist:

- bestehende Bilddatei mit gleichem Namen ersetzen

### Aktuelle Bilddateien

- `public/images/handycity-logo.png`
- `public/images/store-image-in.jpg`
- `public/images/display-reparatur.jpg`
- `public/images/kamera-reparatur.jpg`
- `public/images/willhaben.png`
- `public/images/hol-bring.png`

### Beispiel 1 - Hero-Bild ersetzen

Neue Datei hochladen als:

- `public/images/store-image-in.jpg`

Dann wird das neue Bild automatisch im Hero genutzt.

### Beispiel 2 - Hol- & Bring-Bild ersetzen

Neue Datei hochladen als:

- `public/images/hol-bring.png`

### Beispiel 3 - Willhaben-Bild ersetzen

Neue Datei hochladen als:

- `public/images/willhaben.png`

### Wichtiger Hinweis

Wenn ein neuer Dateiname verwendet wird, muss ein Entwickler ggf. die Komponente anpassen. Fuer Betreiber ist das Ersetzen mit gleichem Namen der richtige Weg.

--------------------------------------------------
## 8. Bewertungen aus Google
--------------------------------------------------

Die Website kann Bewertungen auf zwei Arten anzeigen:

1. Backup-Daten aus `content.yaml`
2. Live-Daten ueber die Google Places API

Wenn kein API-Key hinterlegt ist, wird das Backup verwendet.

### Backup manuell pflegen

Bereich:

- `reviews` in `src/data/content/*.yaml`

### Backup einmalig automatisch aktualisieren

Lokal moeglich mit:

```sh
npm run reviews:backup
```

Dafuer werden benoetigt:

- `GOOGLE_PLACES_API_KEY`
- optional `GOOGLE_PLACE_ID`
- optional `GOOGLE_PLACE_QUERY`

--------------------------------------------------
## 9. Wie Aenderungen geprueft werden
--------------------------------------------------

Vor dem Deploy pruefen die automatischen Validierungen:

- ob `content.yaml` gueltig ist
- ob benoetigte Bilder vorhanden sind
- ob der Astro-Build erfolgreich laeuft

Workflow:

- `.github/workflows/validate-site.yml`

--------------------------------------------------
## 10. Was nach einer Aenderung passiert
--------------------------------------------------

### Bei Nutzung eines Owner-Workflows

1. Workflow laeuft
2. Inhalte werden aktualisiert
3. Validierung und Build laufen
4. Aenderung wird direkt nach `main` geschrieben
5. GitHub Pages deployt neu

### Bei direkter Datei-Aenderung

1. Datei wird geaendert
2. Commit auf `main` oder in einen eigenen Branch
3. Validierung und Deploy laufen
4. Aenderung wird live

--------------------------------------------------
## 11. Fehlerbehebung
--------------------------------------------------

### Problem: Workflow schreibt keine Aenderung

Pruefen:

- wurde wirklich `Run workflow` ausgefuehrt?
- war ueberhaupt eine echte Aenderung enthalten?
- ist der Workflow rot statt gruen?

### Problem: Build faellt um

Haeufige Ursachen:

- YAML falsch eingerueckt
- Pflichtfeld leer
- Bilddatei fehlt

### Problem: Preis erscheint nicht

Pruefen:

- stimmt die Schreibweise von `brand`?
- stimmt die Schreibweise von `device`?
- stimmt die Schreibweise von `repair`?
- gibt es einen doppelten Eintrag?

### Problem: Bild aendert sich nicht

Pruefen:

- wurde die Datei wirklich mit demselben Namen ersetzt?
- ist der Deploy durchgelaufen?
- Browser-Cache neu laden

--------------------------------------------------
## 12. Schnellreferenz - Ich will X aendern
--------------------------------------------------

### Ich will Telefonnummer oder E-Mail aendern

- `Actions -> Owner Update Business Info`

### Ich will die Oeffnungszeiten aendern

- `Actions -> Owner Update Opening Hours`

### Ich will ein neues Modell oder einen neuen Preis hinzufuegen

- `Actions -> Owner Update Price Entry`

### Ich will einen Service hinzufuegen oder loeschen

- `Actions -> Owner Update Service Item`

### Ich will Willhaben, Ankauf, Verkauf oder Hol- & Bring-Texte aendern

- `Actions -> Owner Update Offers and Pickup`

### Ich will Willhaben-Angebote automatisch aktualisieren

- `Actions -> Sync Willhaben Offers`

### Ich will FAQ aendern

- `Actions -> Owner Update FAQ Item`

### Ich will ein einzelnes Willhaben-Angebot anlegen, aendern oder loeschen

- `Actions -> Owner Update Willhaben Offer`

### Ich will Bewertungen aendern

- `Actions -> Sync Google Reviews Backup`

### Ich will ein Bild austauschen

- `public/images/`

### Ich will Impressum oder Datenschutz aendern

- `src/data/content/*.yaml`

--------------------------------------------------
## 13. Empfehlung fuer den Betreiber
--------------------------------------------------

Verwenden Sie fuer Standardaenderungen immer zuerst die vorbereiteten GitHub Actions.

Reihenfolge:

1. Actions nutzen
2. falls nicht abgedeckt: `src/data/content/*.yaml`
3. Bilder nur mit gleichem Dateinamen ersetzen
4. Action-Ergebnis pruefen
5. mergen

Damit bleibt die Seite auch auf GitHub Pages pflegbar, ohne ein unsicheres separates Admin-System bauen zu muessen.
