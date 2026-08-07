/**
 * Canonicalisation for repair-price entries.
 *
 * The price table is assembled from two sources with different conventions:
 * the curated entries in calculator.yaml ("€70", iPads filed under Apple) and
 * the phone-expert import ("70", a made-up "iPad" brand, a handful of typos).
 * Left alone they produce visibly duplicated devices and mixed price formats
 * in the calculator, so everything is funnelled through here before it is
 * written to content.
 */

// The scrape files iPads under their own "brand"; the curated data has always
// filed them under Apple, which is also what the brand logo map expects.
const BRAND_ALIASES = new Map([
  ['ipad', 'Apple']
]);

// Casing slips in the source data. Applied as whole-word replacements so
// "Apple Iphone 11" and "Apple iPhone 11" stop being two different devices.
const DEVICE_WORD_FIXES = [
  [/\bIphone\b/g, 'iPhone'],
  [/\bIPhone\b/g, 'iPhone'],
  [/\bIpad\b/g, 'iPad'],
  [/\bIPad\b/g, 'iPad'],
  [/\bIpod\b/g, 'iPod']
];

// Typos and spelling variants observed in the imported data. Keys are compared
// case-insensitively after whitespace collapsing.
const REPAIR_ALIASES = new Map([
  ['kameragals', 'Kameraglas'],
  ['laut/leiste taste', 'Laut/Leise Taste'],
  ['ein ausschaltknopf/blitz', 'Ein/Ausschaltknopf/Blitz'],
  ['ein/ausschaltknopf/blitz', 'Ein/Ausschaltknopf/Blitz'],
  ['lcd außen', 'LCD Außen'],
  ['lcd innen', 'LCD Innen']
]);

// Prices the owner writes by hand that must survive untouched.
const PASSTHROUGH_PRICE = /^(?:ab\s+)?€\s?\d+(?:[.,]\d{1,2})?$|^Preis auf Anfrage$/i;

function collapse(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function normalizeBrand(brand) {
  const cleaned = collapse(brand);
  return BRAND_ALIASES.get(cleaned.toLowerCase()) ?? cleaned;
}

export function normalizeDevice(device) {
  let cleaned = collapse(device);
  for (const [pattern, replacement] of DEVICE_WORD_FIXES) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned;
}

export function normalizeRepair(repair) {
  const cleaned = collapse(repair);
  return REPAIR_ALIASES.get(cleaned.toLowerCase()) ?? cleaned;
}

/**
 * Returns the canonical price string, or '' when the entry carries no usable
 * price. Bare numbers from the import get the € the rest of the table uses.
 */
export function normalizePrice(price) {
  const cleaned = collapse(price).replace(/^EUR\s*/i, '€');
  if (!cleaned) return '';
  if (PASSTHROUGH_PRICE.test(cleaned)) return cleaned.replace(/€\s+/, '€');
  if (/^\d+(?:[.,]\d{1,2})?$/.test(cleaned)) return `€${cleaned}`;
  return cleaned;
}

export function entryKey(entry) {
  return [entry.brand, entry.device, entry.repair]
    .map((part) => String(part ?? '').trim().toLowerCase())
    .join('::');
}

function hasCurrency(entry) {
  return /€/.test(String(entry?.price ?? ''));
}

/**
 * Normalises every entry, drops those without a price, and collapses
 * duplicates. Where two entries collide the one that already carries a
 * currency-formatted price wins, because that is the owner-curated side.
 *
 * @returns {{ entries: object[], stats: object }}
 */
export function normalizePriceList(entries) {
  const stats = { input: 0, droppedNoPrice: 0, deduped: 0, changed: 0 };
  const byKey = new Map();

  for (const raw of Array.isArray(entries) ? entries : []) {
    stats.input += 1;

    const normalized = {
      brand: normalizeBrand(raw?.brand),
      device: normalizeDevice(raw?.device),
      repair: normalizeRepair(raw?.repair),
      price: normalizePrice(raw?.price)
    };

    if (!normalized.brand || !normalized.device || !normalized.repair || !normalized.price) {
      stats.droppedNoPrice += 1;
      continue;
    }

    if (
      normalized.brand !== collapse(raw?.brand) ||
      normalized.device !== collapse(raw?.device) ||
      normalized.repair !== collapse(raw?.repair) ||
      normalized.price !== collapse(raw?.price)
    ) {
      stats.changed += 1;
    }

    const key = entryKey(normalized);
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, normalized);
      continue;
    }

    stats.deduped += 1;
    if (!hasCurrency(existing) && hasCurrency(normalized)) {
      byKey.set(key, normalized);
    }
  }

  const entriesOut = [...byKey.values()].sort((left, right) =>
    entryKey(left).localeCompare(entryKey(right), 'de')
  );

  stats.output = entriesOut.length;
  return { entries: entriesOut, stats };
}
