import { failOnValidationErrors, normalizeLookupKey, readContent, writeContent } from './lib/content-admin.mjs';

const action = (process.env.ACTION || 'upsert').trim().toLowerCase();
const question = (process.env.QUESTION || '').trim();
const answer = (process.env.ANSWER || '').trim();

if (!question) {
  throw new Error('QUESTION is required.');
}

if (!['upsert', 'remove'].includes(action)) {
  throw new Error('ACTION must be either upsert or remove.');
}

if (action === 'upsert' && !answer) {
  throw new Error('ANSWER is required when ACTION=upsert.');
}

const { content } = await readContent();
const items = Array.isArray(content.faq?.items) ? [...content.faq.items] : [];
const lookupKey = normalizeLookupKey(question);
const index = items.findIndex((item) => normalizeLookupKey(item.question) === lookupKey);

if (action === 'remove') {
  if (index === -1) {
    console.log('No matching FAQ item found. Nothing changed.');
    process.exit(0);
  }
  items.splice(index, 1);
} else if (index === -1) {
  items.push({ question, answer });
} else {
  items[index] = { ...items[index], question, answer };
}

content.faq.items = items;
failOnValidationErrors(content);
await writeContent(content);
console.log(`${action === 'remove' ? 'Removed' : 'Upserted'} FAQ item.`);
