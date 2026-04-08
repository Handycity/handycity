# Bilder bearbeiten

Die Website laeuft auf GitHub Pages. Bilder werden deshalb direkt im Repository gepflegt.

## Einfachste Methode

Bestehende Datei mit gleichem Namen ersetzen. Dann muss am Code nichts geaendert werden.

## Aktuell verwendete Bilddateien

- `handycity-logo.png` - Logo in Header und rechtlichen Seiten
- `store-image-in.jpg` - Hero-Hintergrund und Vertrauensbereich
- `display-reparatur.jpg` - Bild im Bereich "Warum Handycity"
- `kamera-reparatur.jpg` - Bild im Bereich "Warum Handycity"
- `willhaben.png` - Bild im Bereich "Handy kaufen & verkaufen"
- `hol-bring.png` - Bild im Bereich "Hol & Bring Service"

## So tauschen Sie ein Bild direkt in GitHub aus

1. Repository oeffnen
2. Zu `public/images/` wechseln
3. Gleiche Datei mit gleichem Namen hochladen und ersetzen
4. Aenderung committen
5. Nach dem Deploy erscheint das neue Bild live

## Wenn ein komplett neuer Dateiname verwendet werden soll

Dann muss auch der Verweis im Code angepasst werden. Relevante Dateien:

- `src/components/Hero.astro`
- `src/components/Trust.astro`
- `src/components/WillhabenShop.astro`
- `src/components/PickupService.astro`

Wenn Sie keinen Entwicklerzugriff wollen, ersetzen Sie Bilder immer mit dem vorhandenen Dateinamen.
