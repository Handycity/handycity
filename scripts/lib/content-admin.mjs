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

function pushIfMissing(errors, value, fieldPath) {
  if (!isNonEmptyString(value)) {
    errors.push(`${fieldPath} must be a non-empty string.`);
  }
}

function validateUrlish(errors, value, fieldPath) {
  if (!isNonEmptyString(value)) {
    errors.push(`${fieldPath} must be a non-empty string.`);
    return;
  }

  if (!/^(https?:\/\/|mailto:|tel:|#)/.test(value.trim())) {
    errors.push(`${fieldPath} must start with https://, http://, mailto:, tel:, or #.`);
  }
}

export function validateContent(content) {
  const errors = [];

  if (!content.site || typeof content.site !== 'object') {
    errors.push('site section is missing.');
  } else {
    pushIfMissing(errors, content.site.title, 'site.title');
    pushIfMissing(errors, content.site.description, 'site.description');
    validateUrlish(errors, content.site.url, 'site.url');
  }

  if (!content.company || typeof content.company !== 'object') {
    errors.push('company section is missing.');
  } else {
    pushIfMissing(errors, content.company.name, 'company.name');
    pushIfMissing(errors, content.company.legalName, 'company.legalName');
    pushIfMissing(errors, content.company.phone, 'company.phone');
    pushIfMissing(errors, content.company.phoneDisplay, 'company.phoneDisplay');
    pushIfMissing(errors, content.company.email, 'company.email');
    pushIfMissing(errors, content.company?.address?.street, 'company.address.street');
    pushIfMissing(errors, content.company?.address?.city, 'company.address.city');
    pushIfMissing(errors, content.company?.address?.zip, 'company.address.zip');
    validateUrlish(errors, content.company?.map?.placeUrl, 'company.map.placeUrl');
  }

  if (!Array.isArray(content.hours) || content.hours.length === 0) {
    errors.push('hours must contain at least one day.');
  } else {
    for (const [index, item] of content.hours.entries()) {
      pushIfMissing(errors, item?.day, `hours[${index}].day`);
      pushIfMissing(errors, item?.time, `hours[${index}].time`);
      pushIfMissing(errors, item?.shortDay, `hours[${index}].shortDay`);
    }
  }

  if (!content.hero || typeof content.hero !== 'object') {
    errors.push('hero section is missing.');
  } else {
    pushIfMissing(errors, content.hero.kicker, 'hero.kicker');
    pushIfMissing(errors, content.hero.headline, 'hero.headline');
    pushIfMissing(errors, content.hero.subheadline, 'hero.subheadline');
    validateUrlish(errors, content.hero?.ctaPrimary?.href, 'hero.ctaPrimary.href');
    validateUrlish(errors, content.hero?.ctaSecondary?.href, 'hero.ctaSecondary.href');
  }

  const serviceNames = new Set();
  if (!Array.isArray(content.services?.items) || content.services.items.length === 0) {
    errors.push('services.items must contain at least one service.');
  } else {
    for (const [index, item] of content.services.items.entries()) {
      pushIfMissing(errors, item?.name, `services.items[${index}].name`);
      pushIfMissing(errors, item?.description, `services.items[${index}].description`);
      pushIfMissing(errors, item?.icon, `services.items[${index}].icon`);

      const normalizedName = item?.name?.trim().toLowerCase();
      if (normalizedName) {
        if (serviceNames.has(normalizedName)) {
          errors.push(`Duplicate service name found: ${item.name}`);
        }
        serviceNames.add(normalizedName);
      }
    }
  }

  if (!Array.isArray(content.calculator?.prices) || content.calculator.prices.length === 0) {
    errors.push('calculator.prices must contain at least one entry.');
  } else {
    const priceKeys = new Set();
    for (const [index, item] of content.calculator.prices.entries()) {
      pushIfMissing(errors, item?.brand, `calculator.prices[${index}].brand`);
      pushIfMissing(errors, item?.device, `calculator.prices[${index}].device`);
      pushIfMissing(errors, item?.repair, `calculator.prices[${index}].repair`);
      pushIfMissing(errors, item?.price, `calculator.prices[${index}].price`);

      const key = [item?.brand, item?.device, item?.repair].map((value) => String(value || '').trim().toLowerCase()).join('::');
      if (priceKeys.has(key)) {
        errors.push(`Duplicate calculator price entry found: ${item.brand} / ${item.device} / ${item.repair}`);
      }
      priceKeys.add(key);
    }
  }

  if (!Array.isArray(content.reviews?.items)) {
    errors.push('reviews.items must be an array.');
  } else {
    for (const [index, item] of content.reviews.items.entries()) {
      pushIfMissing(errors, item?.name, `reviews.items[${index}].name`);
      pushIfMissing(errors, item?.text, `reviews.items[${index}].text`);
      if (!Number.isFinite(Number(item?.rating))) {
        errors.push(`reviews.items[${index}].rating must be numeric.`);
      }
      pushIfMissing(errors, item?.date, `reviews.items[${index}].date`);
    }
  }

  validateUrlish(errors, content.reviews?.googleUrl, 'reviews.googleUrl');
  validateUrlish(errors, content.willhaben?.url, 'willhaben.url');

  if (!Array.isArray(content.faq?.items)) {
    errors.push('faq.items must be an array.');
  }

  if (!Array.isArray(content.willhaben?.highlights) || content.willhaben.highlights.length === 0) {
    errors.push('willhaben.highlights must contain at least one highlight.');
  }

  if (!Array.isArray(content.willhaben?.offers)) {
    errors.push('willhaben.offers must be an array.');
  } else {
    for (const [index, item] of content.willhaben.offers.entries()) {
      pushIfMissing(errors, item?.title, `willhaben.offers[${index}].title`);
      pushIfMissing(errors, item?.price, `willhaben.offers[${index}].price`);
      pushIfMissing(errors, item?.imageAlt, `willhaben.offers[${index}].imageAlt`);
      pushIfMissing(errors, item?.listedAt, `willhaben.offers[${index}].listedAt`);
      pushIfMissing(errors, item?.storage, `willhaben.offers[${index}].storage`);
      pushIfMissing(errors, item?.unlocked, `willhaben.offers[${index}].unlocked`);
      pushIfMissing(errors, item?.condition, `willhaben.offers[${index}].condition`);
      pushIfMissing(errors, item?.delivery, `willhaben.offers[${index}].delivery`);
      validateUrlish(errors, item?.url, `willhaben.offers[${index}].url`);
      validateUrlish(errors, item?.image, `willhaben.offers[${index}].image`);
    }
  }

  return errors;
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
