import { failOnValidationErrors, normalizeLookupKey, readContent, writeContent } from './lib/content-admin.mjs';

const action = (process.env.ACTION || 'upsert').trim().toLowerCase();
const name = (process.env.NAME || '').trim();
const description = (process.env.DESCRIPTION || '').trim();
const icon = (process.env.ICON || '').trim();
const price = process.env.PRICE === undefined ? undefined : String(process.env.PRICE).trim();

if (!name) {
  throw new Error('NAME is required.');
}

if (action === 'upsert' && (!description || !icon)) {
  throw new Error('DESCRIPTION and ICON are required when ACTION=upsert.');
}

if (!['upsert', 'remove'].includes(action)) {
  throw new Error('ACTION must be either upsert or remove.');
}

const { content } = await readContent();
const items = Array.isArray(content.services.items) ? [...content.services.items] : [];
const lookupKey = normalizeLookupKey(name);
const index = items.findIndex((item) => normalizeLookupKey(item.name) === lookupKey);

if (action === 'remove') {
  if (index === -1) {
    console.log('No matching service found. Nothing changed.');
    process.exit(0);
  }

  items.splice(index, 1);
} else if (index === -1) {
  items.push({
    name,
    description,
    icon,
    price: price ?? ''
  });
} else {
  items[index] = {
    ...items[index],
    name,
    description,
    icon,
    price: price ?? items[index].price
  };
}

content.services.items = items;
failOnValidationErrors(content);
await writeContent(content);
console.log(`${action === 'remove' ? 'Removed' : 'Upserted'} service item.`);
