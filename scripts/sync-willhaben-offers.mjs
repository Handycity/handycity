import { failOnValidationErrors, readContent, writeContent } from './lib/content-admin.mjs';

const DEFAULT_SHOP_URL = 'https://www.willhaben.at/iad/shop/handycity-ak-gmbh';
const SHOP_URL = process.env.WILLHABEN_SHOP_URL || DEFAULT_SHOP_URL;
const MAX_OFFERS = Number(process.env.WILLHABEN_MAX_OFFERS || '12');

const REQUEST_HEADERS = {
  'accept-language': 'de-AT,de;q=0.9,en;q=0.8',
  'user-agent': 'Mozilla/5.0 (compatible; HandycityWebsiteBot/1.0; +https://handycity.at)'
};

function decodeHtml(value = '') {
  return String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

function cleanText(value = '') {
  return decodeHtml(
    String(value)
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function absoluteWillhabenUrl(value) {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/')) return `https://www.willhaben.at${value}`;
  return `https://www.willhaben.at/${value.replace(/^\/+/, '')}`;
}

function extractCodeFromUrl(url = '') {
  const match = String(url).match(/-(\d+)\/?$/);
  return match ? match[1] : '';
}

function extractJsonLdObjects(html) {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)];
  const objects = [];

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        objects.push(...parsed);
      } else if (parsed && typeof parsed === 'object') {
        objects.push(parsed);
      }
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }

  return objects;
}

function extractShopOfferUrls(html) {
  const jsonLd = extractJsonLdObjects(html);
  const itemList = jsonLd.find((item) => item?.['@type'] === 'ItemList' && Array.isArray(item?.itemListElement));

  if (itemList) {
    return unique(
      itemList.itemListElement
        .map((item) => absoluteWillhabenUrl(item?.url || item?.item?.url || item?.item?.['@id']))
        .slice(0, MAX_OFFERS)
    );
  }

  return unique(
    [...html.matchAll(/\/iad\/kaufen-und-verkaufen\/d\/[^"' <]+/g)]
      .map((match) => absoluteWillhabenUrl(match[0]))
      .slice(0, MAX_OFFERS)
  );
}

function extractMetaContent(html, propertyName) {
  const regex = new RegExp(`<meta[^>]+(?:property|name)="${propertyName}"[^>]+content="([^"]+)"`, 'i');
  const match = html.match(regex);
  return match ? decodeHtml(match[1]) : '';
}

function extractCanonicalHref(html) {
  const match = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  return match ? decodeHtml(match[1]) : '';
}

function extractAttributeMap(html) {
  const attributes = new Map();
  const pattern = /data-testid="attribute-item"[\s\S]*?data-testid="attribute-title"[\s\S]*?<span[^>]*>(.*?)<\/span>[\s\S]*?data-testid="attribute-value"[^>]*>(.*?)<\/div>/g;

  for (const match of html.matchAll(pattern)) {
    const label = cleanText(match[1]);
    const value = cleanText(match[2]);
    if (label && value) {
      attributes.set(label, value);
    }
  }

  return attributes;
}

function extractUpdatedDate(html) {
  const match = html.match(/data-testid="ad-detail-ad-edit-date-top">Zuletzt ge\u00e4ndert:\s*(?:<!-- -->)?([^,<]+),/u);
  return match ? cleanText(match[1]) : '';
}

function extractPriceText(html, fallbackPrice = '') {
  const stickyMatch = html.match(/data-testid="sticky-header-price">([^<]+)</);
  if (stickyMatch) return cleanText(stickyMatch[1]);

  const numeric = Number(fallbackPrice);
  if (!Number.isFinite(numeric)) return '';

  const minimumFractionDigits = String(fallbackPrice).includes('.') ? 2 : 0;
  const formatted = new Intl.NumberFormat('de-AT', {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits
  }).format(numeric);

  return `€ ${formatted}`;
}

function extractDescriptionNote(html, title) {
  const start = html.indexOf('data-testid="ad-description"');
  if (start < 0) return '';

  const tail = html.slice(start);
  const endCandidates = ['Rechtlicher Hinweis', 'Anbieterdetails', 'Anbieter kontaktieren'];
  const indexes = endCandidates
    .map((candidate) => tail.indexOf(candidate))
    .filter((index) => index > 0);
  const end = indexes.length ? Math.min(...indexes) : Math.min(tail.length, 4000);
  const text = cleanText(tail.slice(0, end));

  if (!text) return '';

  const normalizedTitle = cleanText(title);
  let remainder = text;

  if (normalizedTitle && remainder.startsWith(normalizedTitle)) {
    remainder = remainder.slice(normalizedTitle.length).trim();
  }

  remainder = remainder.replace(/^[-:.,;\s]+/, '').trim();
  if (!remainder || remainder.length > 120) return '';

  return remainder;
}

function mapCondition(rawCondition = '', productCondition = '') {
  if (rawCondition) return rawCondition;
  if (/NewCondition/i.test(productCondition)) return 'Neu';
  if (/UsedCondition/i.test(productCondition)) return 'Gebraucht';
  return '';
}

function formatVerifiedOn() {
  return new Intl.DateTimeFormat('de-AT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Vienna'
  }).format(new Date());
}

async function fetchText(url) {
  const response = await fetch(url, { headers: REQUEST_HEADERS });
  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function parseOffer(url, existingOffersByCode) {
  const html = await fetchText(url);
  const jsonLd = extractJsonLdObjects(html);
  const product = jsonLd.find((item) => item?.['@type'] === 'Product');

  if (!product) {
    throw new Error(`No Product JSON-LD found for ${url}`);
  }

  const attributes = extractAttributeMap(html);
  const canonicalUrl = extractCanonicalHref(html)
    || absoluteWillhabenUrl(product.url)
    || url;
  const code = product.sku || extractCodeFromUrl(canonicalUrl);
  const existing = existingOffersByCode.get(code) || {};
  const title = cleanText(product.name || extractMetaContent(html, 'og:title'));
  const note = extractDescriptionNote(html, title) || existing.note || '';

  return {
    title,
    price: extractPriceText(html, product?.offers?.price || ''),
    url: canonicalUrl,
    image: Array.isArray(product.image) ? product.image[0] : (product.image || extractMetaContent(html, 'og:image')),
    imageAlt: `${title} von Handycity auf willhaben`,
    listedAt: extractUpdatedDate(html) || existing.listedAt || '',
    storage: attributes.get('Speicherkapazität') || existing.storage || '',
    unlocked: attributes.get('Entsperrt') || existing.unlocked || '',
    condition: mapCondition(attributes.get('Zustand') || '', product?.offers?.itemCondition || '') || existing.condition || '',
    delivery: attributes.get('\u00dcbergabe') || existing.delivery || '',
    ...(note ? { note } : {})
  };
}

const { content } = await readContent();
const shopHtml = await fetchText(SHOP_URL);
const offerUrls = extractShopOfferUrls(shopHtml);

if (!offerUrls.length) {
  throw new Error(`No offer URLs found on ${SHOP_URL}`);
}

const existingOffersByCode = new Map(
  (Array.isArray(content.willhaben?.offers) ? content.willhaben.offers : [])
    .map((offer) => [extractCodeFromUrl(offer?.url), offer])
    .filter(([code]) => code)
);

const offers = [];
for (const url of offerUrls) {
  offers.push(await parseOffer(url, existingOffersByCode));
}

content.willhaben.url = SHOP_URL;
content.willhaben.verifiedOn = formatVerifiedOn();
content.willhaben.offers = offers;

if (content.social?.willhaben) {
  content.social.willhaben = SHOP_URL;
}

failOnValidationErrors(content);
await writeContent(content);

console.log(`Synced ${offers.length} willhaben offer(s) from ${SHOP_URL}`);
