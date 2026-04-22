import fs from 'node:fs/promises';
import path from 'node:path';

const requiredAssets = [
  'public/images/handycity-logo.png',
  'public/images/store-image-in.jpg',
  'public/images/display-reparatur.jpg',
  'public/images/kamera-reparatur.jpg',
  'public/images/willhaben.png',
  'public/images/hol-bring.png'
];

const missing = [];

for (const relativePath of requiredAssets) {
  try {
    await fs.access(path.resolve(relativePath));
  } catch {
    missing.push(relativePath);
  }
}

if (missing.length) {
  throw new Error(`Missing required asset files:\n- ${missing.join('\n- ')}`);
}

console.log('Asset validation passed.');
