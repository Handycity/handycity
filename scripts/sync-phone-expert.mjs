#!/usr/bin/env node
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const defaultSource = path.resolve(ROOT, 'research', 'phone-experts-repair-data.json');
const outDir = path.resolve(ROOT, 'src', 'data', 'phone-expert');
const outFile = path.join(outDir, 'prices.json');

function normalizeItem(item) {
  if (!item) return null;
  const brand = item.brand || item.manufacturer || item.marke || item.vendor || item.make || '';
  const device = item.device || item.model || item.modell || item.phone || '';
  const repair = item.repair || item.repair_type || item.reparatur || item.service || item.repairName || '';
  let price = item.price ?? item.preis ?? item.amount ?? item.cost ?? item.price_eur ?? item.price_euro ?? item.price_eur_string ?? '';
  // Try to extract a numeric price from free-text fields when explicit price fields are missing
  const tryFields = [item.description, item.text, item.notes, item.body, item.price_text, item.detail, item.source_text].filter(Boolean).join('\n');
  if (!price && tryFields) {
    const m = tryFields.match(/([0-9]{1,3}(?:[.,][0-9]{1,2})?)(?=\s*(?:€|eur|eur\.|euro)?)/i);
    if (m) price = m[1];
  }
  if (typeof price === 'object') price = price.value || price.amount || '';
  price = String(price || '').trim();
  if (!brand && !device && !repair) return null;
  return { brand: String(brand).trim(), device: String(device).trim(), repair: String(repair).trim(), price };
}

async function loadSource(src) {
  try {
    if (/^https?:\/\//.test(src)) {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      return await res.json();
    }

    const p = path.resolve(ROOT, src);
    if (!existsSync(p)) throw new Error(`Source file not found: ${p}`);
    const raw = await fs.readFile(p, 'utf8');
    try { return JSON.parse(raw); } catch { return raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean); }
  } catch (err) {
    console.error('Failed to load source:', err.message);
    process.exitCode = 2;
    return null;
  }
}

async function run() {
  const src = process.env.PHONE_EXPERT_SOURCE || defaultSource;
  console.log('phone-expert: loading source', src);
  const input = await loadSource(src);
  if (!input) return;

  let items = [];
  if (Array.isArray(input)) {
    items = input.map(normalizeItem).filter(Boolean);
  } else if (typeof input === 'object') {
    // If it's an object with a list inside
    const candidates = input.items || input.data || input.repairs || input.entries || [];
    if (Array.isArray(candidates)) items = candidates.map(normalizeItem).filter(Boolean);
  }

  // Deduplicate, keep lowest numeric price when possible
  const map = new Map();
  for (const it of items) {
    const key = `${it.brand}||${it.device}||${it.repair}`;
    const existing = map.get(key);
    if (!existing) { map.set(key, it); continue; }
    const a = Number(String(existing.price).replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    const b = Number(String(it.price).replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    if (b < a) map.set(key, it);
  }

  const out = [...map.values()];
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(out, null, 2), 'utf8');
  console.log(`phone-expert: wrote ${out.length} entries to ${path.relative(ROOT, outFile)}`);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('sync-phone-expert.mjs')) {
  run().catch((err) => { console.error(err); process.exit(1); });
}
