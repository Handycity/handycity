#!/usr/bin/env node
/**
 * Folds the phone-expert import into calculator.prices and canonicalises the
 * whole table.
 *
 * Previously the import was merged in the page at render time, which meant
 * those entries never passed content validation and reached customers with
 * duplicated devices, bare prices and typos. Merging here makes
 * calculator.yaml the single validated source.
 *
 * Idempotent: running it twice produces no further changes.
 *
 *   npm run prices:normalize            # write
 *   npm run prices:normalize -- --check # report only, non-zero if work pending
 */
import fs from 'node:fs';
import path from 'node:path';
import { failOnValidationErrors, readContent, writeContent } from './lib/content-admin.mjs';
import { entryKey, normalizePriceList } from './lib/normalize-prices.mjs';

const checkOnly = process.argv.includes('--check');
const IMPORT_PATH = path.resolve('src/data/phone-expert/prices.json');

function loadImportedPrices() {
  if (!fs.existsSync(IMPORT_PATH)) return [];

  const parsed = JSON.parse(fs.readFileSync(IMPORT_PATH, 'utf8'));
  if (!Array.isArray(parsed)) {
    throw new Error(`${IMPORT_PATH} must contain an array of price entries.`);
  }

  return parsed;
}

const { content } = await readContent();
const current = Array.isArray(content.calculator?.prices) ? content.calculator.prices : [];
const imported = loadImportedPrices();

// Curated entries first: on a collision normalizePriceList keeps the
// currency-formatted side, and these are the owner-maintained ones.
const { entries, stats } = normalizePriceList([...current, ...imported]);

const before = JSON.stringify(current);
const after = JSON.stringify(entries);
const unchanged = before === after;

console.log(
  [
    `curated entries   : ${current.length}`,
    `imported entries  : ${imported.length}`,
    `normalised output : ${stats.output}`,
    `  fields rewritten: ${stats.changed}`,
    `  duplicates merged: ${stats.deduped}`,
    `  dropped (no price): ${stats.droppedNoPrice}`
  ].join('\n')
);

if (unchanged) {
  console.log('\nCalculator prices are already normalised.');
  process.exit(0);
}

if (checkOnly) {
  const currentKeys = new Set(current.map(entryKey));
  const added = entries.filter((entry) => !currentKeys.has(entryKey(entry)));
  console.error(`\nCalculator prices need normalising (${added.length} entries would be added).`);
  console.error('Run "npm run prices:normalize".');
  process.exit(1);
}

content.calculator.prices = entries;
failOnValidationErrors(content);
await writeContent(content);

console.log('\nCalculator prices normalised and written to the content store.');
