import fs from 'node:fs/promises';
import path from 'node:path';
import {
  CONTENT_FILE_DEFINITIONS,
  clearContentCache,
  getContentFiles,
  isContentDirectory,
  loadContent,
  resolveContentSource,
  serializeContentFile,
  splitContentByFile
} from '../../src/lib/content-store.mjs';
import { collectContentErrors } from '../../src/lib/content-schema.mjs';

const LEGACY_CONTENT_FILE = 'src/data/content.yaml';

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getContentPath(customPath = process.env.CONTENT_PATH || 'src/data/content') {
  return resolveContentSource(customPath);
}

export async function readContent(customPath) {
  const contentPath = getContentPath(customPath);
  clearContentCache();
  const content = await loadContent(contentPath);
  return { contentPath, content };
}

export function serializeContent(content) {
  const grouped = splitContentByFile(content);
  return [...grouped.entries()].map(([fileName, entry]) => ({
    fileName,
    body: serializeContentFile(fileName, entry.label, entry.content)
  }));
}

export async function writeContent(content, customPath) {
  const contentPath = getContentPath(customPath);
  const groupedFiles = serializeContent(content);

  if (isContentDirectory(contentPath) || !path.extname(contentPath)) {
    await fs.mkdir(contentPath, { recursive: true });

    const existingYamlFiles = new Set(
      (await fs.readdir(contentPath))
        .filter((file) => file.endsWith('.yaml'))
    );

    for (const { fileName, body } of groupedFiles) {
      await fs.writeFile(path.join(contentPath, fileName), body, 'utf8');
      existingYamlFiles.delete(fileName);
    }

    for (const fileName of existingYamlFiles) {
      await fs.unlink(path.join(contentPath, fileName));
    }

    const legacyPath = path.resolve(LEGACY_CONTENT_FILE);
    await fs.rm(legacyPath, { force: true });
  } else {
    throw new Error('Writing to a single combined content file is no longer supported. Use a content directory.');
  }

  clearContentCache();
}

/**
 * Validates the whole content tree against src/lib/content-schema.mjs.
 *
 * Previously this was ~120 lines of hand-written checks that covered only part
 * of the tree, which is how fields with no consumer and consumers with no field
 * drifted apart. The schema is now the single description of valid content.
 *
 * @returns {string[]} empty when valid.
 */
export function validateContent(content) {
  return collectContentErrors(content);
}

export function failOnValidationErrors(content) {
  const errors = validateContent(content);
  if (errors.length) {
    throw new Error(`Content validation failed:\n- ${errors.join('\n- ')}`);
  }
}

export function applyIfSet(target, key, value) {
  if (isNonEmptyString(value)) {
    target[key] = value.trim();
  }
}

export function parseListInput(value) {
  if (!isNonEmptyString(value)) return [];
  return value
    .split(/\r?\n|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeLookupKey(...parts) {
  return parts.map((part) => String(part || '').trim().toLowerCase()).join('::');
}

export function sortCalculatorPrices(prices) {
  return prices.sort((left, right) => {
    return normalizeLookupKey(left.brand, left.device, left.repair).localeCompare(
      normalizeLookupKey(right.brand, right.device, right.repair),
      'de'
    );
  });
}

export { CONTENT_FILE_DEFINITIONS, getContentFiles, isContentDirectory };
