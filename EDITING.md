# EDITING.md — Anleitung für Inhaltspflege

> Diese Anleitung erklärt, wie Sie die Inhalte Ihrer Website selbst ändern können — ohne Programmierkenntnisse.

---

## Übersicht

Alle Inhalte der Website werden in einer einzigen Datei gespeichert:

📄 **`src/data/content.yaml`**

Wenn Sie diese Datei ändern und speichern, wird die Website automatisch neu gebaut und veröffentlicht (dauert ca. 1 Minute).

---

## Schritt für Schritt

### 1. Datei öffnen

1. Gehen Sie zu Ihrem GitHub-Repository
2. Navigieren Sie zu `src` → `data` → `content.yaml`
3. Klicken Sie auf das **Stift-Symbol** (✏️) oben rechts → "Edit this file"

### 2. Inhalt ändern

Die Datei ist in Bereiche aufgeteilt. Jeder Bereich hat einen Kommentar, der erklärt, was er enthält.

**Wichtige Regeln:**
- Text in Anführungszeichen lassen: `"Ihr Text hier"`
- Einrückung (Leerzeichen am Anfang) nicht verändern
- Keine Tabs verwenden — nur Leerzeichen

### 3. Speichern

1. Scrollen Sie nach unten
2. Schreiben Sie eine kurze Beschreibung (z.B. "Öffnungszeiten aktualisiert")
3. Klicken Sie auf **"Commit changes"**
4. Die Website wird automatisch aktualisiert (~1 Minute)

---

## Was kann ich ändern?

### Hero-Bereich (Startseite oben)
```yaml
hero:
  headline: "Handy & Tablet Reparatur in Klagenfurt"
  subheadline: "Schnell. Zuverlässig. Leistbar."
```

### Öffnungszeiten
```yaml
hours:
  - day: "Montag"
    time: "9:00–18:00"
```

### Telefon & E-Mail
```yaml
company:
  phone: "+43 463 918559"
  email: "office@handycityarkaden.at"
```

### Services (Reparaturen)
```yaml
services:
  items:
    - name: "Display Reparatur"
      description: "Beschreibung hier"
      price: "ab €49"  # oder "Preis auf Anfrage"
```
Sie können Services hinzufügen, ändern oder entfernen.

### Kundenbewertungen
Bewertungen werden automatisch direkt von Google geladen (kein manuelles Eintragen in `content.yaml` mehr).
Damit das funktioniert, müssen in GitHub unter **Settings → Secrets and variables → Actions** diese Secrets gesetzt sein:
- `GOOGLE_PLACES_API_KEY`
- optional: `GOOGLE_PLACE_ID` (falls Sie eine feste Place ID erzwingen möchten)

Die folgenden Felder in `content.yaml` sind nur Fallback:
```yaml
reviews:
  headline: "Das sagen unsere Kunden"
  googleUrl: "https://www.google.com/maps/place/Handycity+Klagenfurt/"
```

### FAQ
```yaml
faq:
  items:
    - question: "Ihre Frage?"
      answer: "Ihre Antwort."
```

### Kontaktformular

Um das Formular zu aktivieren, benötigen Sie einen kostenlosen Schlüssel von https://web3forms.com:
```yaml
contact:
  accessKey: "IHREN_SCHLÜSSEL_HIER_EINSETZEN"
```

---

## Bilder ändern

Bilder können direkt über GitHub hochgeladen werden:

1. Navigieren Sie zu `public/images/`
2. Klicken Sie auf "Add file" → "Upload files"
3. Laden Sie Ihr neues Bild hoch
4. Aktualisieren Sie den Dateinamen in `content.yaml`, falls nötig

---

## Hilfe

Bei Fragen zur Bearbeitung: Erstellen Sie ein "Issue" im GitHub-Repository oder kontaktieren Sie Ihren Webentwickler.
