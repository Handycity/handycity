import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DIST_DIR = 'dist';
const ASSET_PREFIXES = ['images', 'brands', 'vendor'];

// Matches local asset references in the built HTML: src="/images/x.jpg",
// href="/favicon.svg", and the srcset/preload variants Astro emits.
const ASSET_REFERENCE = new RegExp(
  `(?:src|href)="(/(?:${ASSET_PREFIXES.join('|')})/[^"]+|/favicon\\.[a-z]+)"`,
  'g'
);

async function collectHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(entryPath)));
    } else if (entry.name.endsWith('.html')) {
      files.push(entryPath);
    }
  }

  return files;
}

if (!fsSync.existsSync(DIST_DIR)) {
  throw new Error(`${DIST_DIR}/ not found. Run "npm run build" before validating assets.`);
}

const htmlFiles = await collectHtmlFiles(DIST_DIR);
if (!htmlFiles.length) {
  throw new Error(`No HTML files found in ${DIST_DIR}/. The build produced nothing to validate.`);
}

// Derived from the build output rather than a hand-kept list, so an asset that
// gets renamed or removed fails here instead of 404-ing in production.
const referenced = new Map();
for (const htmlFile of htmlFiles) {
  const html = await fs.readFile(htmlFile, 'utf8');
  for (const match of html.matchAll(ASSET_REFERENCE)) {
    const assetPath = match[1];
    if (!referenced.has(assetPath)) {
      referenced.set(assetPath, htmlFile);
    }
  }
}

if (!referenced.size) {
  throw new Error('No local asset references found in the build output — the matcher is probably stale.');
}

const missing = [];
for (const [assetPath, sourceFile] of referenced) {
  if (!fsSync.existsSync(path.join(DIST_DIR, assetPath))) {
    missing.push(`${assetPath} (referenced by ${sourceFile})`);
  }
}

if (missing.length) {
  throw new Error(`Referenced assets are missing from the build:\n- ${missing.join('\n- ')}`);
}

const vendorCheck = spawnSync(process.execPath, ['scripts/sync-vendor-assets.mjs', '--check'], {
  cwd: path.resolve('.'),
  encoding: 'utf8'
});

if (vendorCheck.status !== 0) {
  throw new Error(vendorCheck.stderr || vendorCheck.stdout || 'Vendor asset check failed.');
}

console.log(`Asset validation passed (${referenced.size} referenced assets resolved).`);
