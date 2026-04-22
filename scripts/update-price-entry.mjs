import { failOnValidationErrors, normalizeLookupKey, readContent, sortCalculatorPrices, writeContent } from './lib/content-admin.mjs';

const action = (process.env.ACTION || 'upsert').trim().toLowerCase();
const brand = (process.env.BRAND || '').trim();
const device = (process.env.DEVICE || '').trim();
const repair = (process.env.REPAIR || '').trim();
const price = (process.env.PRICE || '').trim();

if (!brand || !device || !repair) {
  throw new Error('BRAND, DEVICE, and REPAIR are required.');
}

if (action === 'upsert' && !price) {
  throw new Error('PRICE is required when ACTION=upsert.');
}

if (!['upsert', 'remove'].includes(action)) {
  throw new Error('ACTION must be either upsert or remove.');
}

const { content } = await readContent();
const entryKey = normalizeLookupKey(brand, device, repair);
const prices = Array.isArray(content.calculator.prices) ? [...content.calculator.prices] : [];
const index = prices.findIndex((item) => normalizeLookupKey(item.brand, item.device, item.repair) === entryKey);

if (action === 'remove') {
  if (index === -1) {
    console.log('No matching price entry found. Nothing changed.');
    process.exit(0);
  }

  prices.splice(index, 1);
} else if (index === -1) {
  prices.push({ brand, device, repair, price });
} else {
  prices[index] = { ...prices[index], brand, device, repair, price };
}

content.calculator.prices = sortCalculatorPrices(prices);
failOnValidationErrors(content);
await writeContent(content);
console.log(`${action === 'remove' ? 'Removed' : 'Upserted'} calculator price entry.`);
