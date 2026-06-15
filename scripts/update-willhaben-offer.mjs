import { applyIfSet, failOnValidationErrors, normalizeLookupKey, readContent, writeContent } from './lib/content-admin.mjs';

const action = (process.env.ACTION || 'upsert').trim().toLowerCase();

const title = (process.env.TITLE || '').trim();
const price = (process.env.PRICE || '').trim();
const url = (process.env.URL || '').trim();
const image = (process.env.IMAGE || '').trim();
const imageAlt = (process.env.IMAGE_ALT || '').trim();
const listedAt = (process.env.LISTED_AT || '').trim();
const storage = (process.env.STORAGE || '').trim();
const unlocked = (process.env.UNLOCKED || '').trim();
const condition = (process.env.CONDITION || '').trim();
const delivery = (process.env.DELIVERY || '').trim();
const note = process.env.NOTE === undefined ? undefined : String(process.env.NOTE).trim();

if (!['upsert', 'remove'].includes(action)) {
  throw new Error('ACTION must be either upsert or remove.');
}

if (!url && !title) {
  throw new Error('URL or TITLE is required to identify a Willhaben offer.');
}

const { content } = await readContent();
const offers = Array.isArray(content.willhaben?.offers) ? [...content.willhaben.offers] : [];

const lookupByUrl = url ? normalizeLookupKey(url) : '';
const lookupByTitle = title ? normalizeLookupKey(title) : '';

const index = offers.findIndex((offer) => {
  const urlMatch = lookupByUrl && normalizeLookupKey(offer.url) === lookupByUrl;
  const titleMatch = lookupByTitle && normalizeLookupKey(offer.title) === lookupByTitle;
  return Boolean(urlMatch || titleMatch);
});

if (action === 'remove') {
  if (index === -1) {
    console.log('No matching Willhaben offer found. Nothing changed.');
    process.exit(0);
  }
  offers.splice(index, 1);
} else if (index === -1) {
  const required = {
    TITLE: title,
    PRICE: price,
    URL: url,
    IMAGE: image,
    IMAGE_ALT: imageAlt,
    LISTED_AT: listedAt,
    STORAGE: storage,
    UNLOCKED: unlocked,
    CONDITION: condition,
    DELIVERY: delivery
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing required fields for new offer: ${missing.join(', ')}`);
  }

  const nextOffer = {
    title,
    price,
    url,
    image,
    imageAlt,
    listedAt,
    storage,
    unlocked,
    condition,
    delivery
  };

  if (typeof note === 'string' && note.length) {
    nextOffer.note = note;
  }

  offers.push(nextOffer);
} else {
  const nextOffer = { ...offers[index] };
  applyIfSet(nextOffer, 'title', title);
  applyIfSet(nextOffer, 'price', price);
  applyIfSet(nextOffer, 'url', url);
  applyIfSet(nextOffer, 'image', image);
  applyIfSet(nextOffer, 'imageAlt', imageAlt);
  applyIfSet(nextOffer, 'listedAt', listedAt);
  applyIfSet(nextOffer, 'storage', storage);
  applyIfSet(nextOffer, 'unlocked', unlocked);
  applyIfSet(nextOffer, 'condition', condition);
  applyIfSet(nextOffer, 'delivery', delivery);

  if (note !== undefined) {
    if (note.length) {
      nextOffer.note = note;
    } else {
      delete nextOffer.note;
    }
  }

  offers[index] = nextOffer;
}

content.willhaben.offers = offers;
failOnValidationErrors(content);
await writeContent(content);
console.log(`${action === 'remove' ? 'Removed' : 'Upserted'} Willhaben offer.`);
