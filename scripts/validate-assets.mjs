import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const requiredAssets = [
  'public/images/handycity_logo_v1.png',
  'public/images/handycity_logo_transparent.png',
  'public/images/store-image-in.jpg',
  'public/images/store-image-in.webp',
  'public/images/display-reparatur.jpg',
  'public/images/kamera-reparatur.jpg',
  'public/images/willhaben.jpg',
  'public/images/shop-innen-left.avif',
  'public/images/shop-innen-right.avif',
  'public/vendor/alpine.min.js',
  'public/vendor/alpine-collapse.min.js'
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

const vendorCheck = spawnSync(process.execPath, ['scripts/sync-vendor-assets.mjs', '--check'], {
  cwd: path.resolve('.'),
  encoding: 'utf8'
});

if (vendorCheck.status !== 0) {
  throw new Error(vendorCheck.stderr || vendorCheck.stdout || 'Vendor asset check failed.');
}

console.log('Asset validation passed.');
