import fs from 'node:fs/promises';
import path from 'node:path';
import { failOnValidationErrors, readContent } from './lib/content-admin.mjs';

const COMPONENT_DIR = 'src/components';

// Business data belongs in the content store, where the owner can change it
// through the Actions UI. A literal in a component silently outlives every
// such edit, so treat one as a build failure rather than a style nit.
const FORBIDDEN_LITERALS = [
  {
    pattern: /tel:\+?\d[\d\s/-]{6,}/,
    label: 'hard-coded phone number',
    hint: 'derive it from company.phone'
  },
  {
    pattern: /https?:\/\/(?:www\.)?willhaben\.at\//,
    label: 'hard-coded willhaben URL',
    hint: 'read willhaben.url from content'
  },
  {
    pattern: /\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}/,
    label: 'hard-coded opening hours',
    hint: 'derive them from the hours list'
  }
];

async function findHardCodedBusinessData() {
  const errors = [];
  const files = (await fs.readdir(COMPONENT_DIR)).filter((file) => file.endsWith('.astro'));

  for (const file of files) {
    const filePath = path.join(COMPONENT_DIR, file);
    const source = await fs.readFile(filePath, 'utf8');

    for (const { pattern, label, hint } of FORBIDDEN_LITERALS) {
      const match = source.match(pattern);
      if (!match) continue;

      const line = source.slice(0, match.index).split('\n').length;
      errors.push(`${filePath}:${line} contains a ${label} ("${match[0].trim()}") — ${hint}.`);
    }
  }

  return errors;
}

const { content } = await readContent();
failOnValidationErrors(content);

const hardCoded = await findHardCodedBusinessData();
if (hardCoded.length) {
  throw new Error(`Business data must live in the content store:\n- ${hardCoded.join('\n- ')}`);
}

console.log('Content validation passed.');
