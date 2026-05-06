import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

const mode = process.argv.includes('--check') ? 'check' : 'sync';

function resolveSourcePath(...candidates) {
  for (const candidate of candidates) {
    const absolutePath = path.resolve(candidate);
    if (fsSync.existsSync(absolutePath)) {
      return absolutePath;
    }
  }

  return path.resolve(candidates[0]);
}

const files = [
  {
    source: resolveSourcePath(
      'node_modules/alpinejs/dist/cdn.min.js',
      '../node_modules/alpinejs/dist/cdn.min.js'
    ),
    target: path.resolve('public/vendor/alpine.min.js')
  },
  {
    source: resolveSourcePath(
      'node_modules/@alpinejs/collapse/dist/cdn.min.js',
      '../node_modules/@alpinejs/collapse/dist/cdn.min.js'
    ),
    target: path.resolve('public/vendor/alpine-collapse.min.js')
  }
];

async function readIfExists(filePath) {
  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

const mismatches = [];

for (const file of files) {
  const sourceBuffer = await readIfExists(file.source);
  if (!sourceBuffer) {
    throw new Error(`Missing vendor source file: ${path.relative(process.cwd(), file.source)}`);
  }

  const targetBuffer = await readIfExists(file.target);

  if (mode === 'sync') {
    await fs.mkdir(path.dirname(file.target), { recursive: true });
    if (!targetBuffer || !sourceBuffer.equals(targetBuffer)) {
      await fs.copyFile(file.source, file.target);
    }
    continue;
  }

  if (!targetBuffer || !sourceBuffer.equals(targetBuffer)) {
    mismatches.push(path.relative(process.cwd(), file.target));
  }
}

if (mode === 'check') {
  if (mismatches.length) {
    throw new Error(`Vendor assets are out of sync. Run \"npm run vendor:sync\".\n- ${mismatches.join('\n- ')}`);
  }

  console.log('Vendor asset check passed.');
} else {
  console.log('Vendor assets synced.');
}
