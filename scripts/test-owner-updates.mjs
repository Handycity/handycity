import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import yaml from 'js-yaml';

const ROOT = path.resolve('.');
const CONTENT_PATH = path.join(ROOT, 'src/data/content.yaml');

function runScript(scriptFile, env) {
  const result = spawnSync(process.execPath, [path.join(ROOT, scriptFile)], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    throw new Error(
      [
        `Script failed: ${scriptFile}`,
        `Exit code: ${result.status}`,
        result.stdout ? `stdout:\n${result.stdout}` : '',
        result.stderr ? `stderr:\n${result.stderr}` : ''
      ].filter(Boolean).join('\n')
    );
  }
}

async function readContent() {
  const raw = await fs.readFile(CONTENT_PATH, 'utf8');
  return yaml.load(raw);
}

function findPrice(prices, { brand, device, repair }) {
  return prices.find((item) => item.brand === brand && item.device === device && item.repair === repair);
}

function findFaq(items, question) {
  return items.find((item) => item.question === question);
}

function findOffer(offers, url) {
  return offers.find((item) => item.url === url);
}

const backup = await fs.readFile(CONTENT_PATH, 'utf8');

try {
  const priceKey = {
    brand: 'ZZ Owner Test',
    device: 'ZZ Device 1',
    repair: 'Display Reparatur'
  };

  runScript('scripts/update-price-entry.mjs', {
    ACTION: 'upsert',
    BRAND: priceKey.brand,
    DEVICE: priceKey.device,
    REPAIR: priceKey.repair,
    PRICE: 'ab €123'
  });

  let content = await readContent();
  let priceRow = findPrice(content.calculator.prices, priceKey);
  assert(priceRow, 'Price row was not created.');
  assert.equal(priceRow.price, 'ab €123', 'Price row value mismatch after add.');

  runScript('scripts/update-price-entry.mjs', {
    ACTION: 'upsert',
    BRAND: priceKey.brand,
    DEVICE: priceKey.device,
    REPAIR: priceKey.repair,
    PRICE: 'ab €129'
  });

  content = await readContent();
  priceRow = findPrice(content.calculator.prices, priceKey);
  assert(priceRow, 'Price row disappeared after update.');
  assert.equal(priceRow.price, 'ab €129', 'Price row value mismatch after update.');

  runScript('scripts/update-price-entry.mjs', {
    ACTION: 'remove',
    BRAND: priceKey.brand,
    DEVICE: priceKey.device,
    REPAIR: priceKey.repair
  });

  content = await readContent();
  priceRow = findPrice(content.calculator.prices, priceKey);
  assert.equal(priceRow, undefined, 'Price row still exists after remove.');

  runScript('scripts/update-offers.mjs', {
    WILLHABEN_HEADLINE: 'ZZ Test Headline'
  });

  content = await readContent();
  assert.equal(content.willhaben.headline, 'ZZ Test Headline', 'Willhaben section headline was not updated.');

  const offerUrl = 'https://www.willhaben.at/iad/kaufen-und-verkaufen/d/zz-owner-test-angebot-1234567890/';
  runScript('scripts/update-willhaben-offer.mjs', {
    ACTION: 'upsert',
    TITLE: 'ZZ Owner Test Angebot',
    PRICE: '€ 111',
    URL: offerUrl,
    IMAGE: 'https://cache.willhaben.at/mmo/0/test.jpg',
    IMAGE_ALT: 'ZZ Owner Test Angebot von Handycity auf willhaben',
    LISTED_AT: '01.01.2026',
    STORAGE: '128 GB',
    UNLOCKED: 'Ja',
    CONDITION: 'Neu',
    DELIVERY: 'Selbstabholung'
  });

  content = await readContent();
  let offer = findOffer(content.willhaben.offers, offerUrl);
  assert(offer, 'Willhaben offer was not created.');
  assert.equal(offer.price, '€ 111', 'Willhaben offer price mismatch after add.');

  runScript('scripts/update-willhaben-offer.mjs', {
    ACTION: 'upsert',
    URL: offerUrl,
    PRICE: '€ 119',
    DELIVERY: 'Selbstabholung, Versand',
    NOTE: 'Testnotiz'
  });

  content = await readContent();
  offer = findOffer(content.willhaben.offers, offerUrl);
  assert(offer, 'Willhaben offer disappeared after update.');
  assert.equal(offer.price, '€ 119', 'Willhaben offer price mismatch after update.');
  assert.equal(offer.delivery, 'Selbstabholung, Versand', 'Willhaben offer delivery mismatch after update.');
  assert.equal(offer.note, 'Testnotiz', 'Willhaben offer note mismatch after update.');

  runScript('scripts/update-willhaben-offer.mjs', {
    ACTION: 'remove',
    URL: offerUrl
  });

  content = await readContent();
  offer = findOffer(content.willhaben.offers, offerUrl);
  assert.equal(offer, undefined, 'Willhaben offer still exists after remove.');

  const faqQuestion = 'ZZ Owner Test FAQ?';
  runScript('scripts/update-faq-item.mjs', {
    ACTION: 'upsert',
    QUESTION: faqQuestion,
    ANSWER: 'Antwort 1'
  });

  content = await readContent();
  let faq = findFaq(content.faq.items, faqQuestion);
  assert(faq, 'FAQ item was not created.');
  assert.equal(faq.answer, 'Antwort 1', 'FAQ answer mismatch after add.');

  runScript('scripts/update-faq-item.mjs', {
    ACTION: 'upsert',
    QUESTION: faqQuestion,
    ANSWER: 'Antwort 2'
  });

  content = await readContent();
  faq = findFaq(content.faq.items, faqQuestion);
  assert(faq, 'FAQ item disappeared after update.');
  assert.equal(faq.answer, 'Antwort 2', 'FAQ answer mismatch after update.');

  runScript('scripts/update-faq-item.mjs', {
    ACTION: 'remove',
    QUESTION: faqQuestion
  });

  content = await readContent();
  faq = findFaq(content.faq.items, faqQuestion);
  assert.equal(faq, undefined, 'FAQ item still exists after remove.');

  const serviceName = 'ZZ Owner Test Service';
  runScript('scripts/update-service-item.mjs', {
    ACTION: 'upsert',
    NAME: serviceName,
    DESCRIPTION: 'Testbeschreibung',
    ICON: 'truck',
    PRICE: 'Preis auf Anfrage',
    HREF: '#kontakt',
    ACTION_TEXT: 'Anfragen'
  });

  content = await readContent();
  let service = content.services.items.find((item) => item.name === serviceName);
  assert(service, 'Service item was not created.');

  runScript('scripts/update-service-item.mjs', {
    ACTION: 'remove',
    NAME: serviceName
  });

  content = await readContent();
  service = content.services.items.find((item) => item.name === serviceName);
  assert.equal(service, undefined, 'Service item still exists after remove.');

  console.log('Owner update flow test completed successfully.');
} finally {
  await fs.writeFile(CONTENT_PATH, backup, 'utf8');
}
