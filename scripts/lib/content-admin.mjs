import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const HEADER = `# ============================================================
# Handycity.at - Content Data File
# ============================================================
# This is the SINGLE source of truth for all editable content.
# Edit this file to update the website. See EDITING.md for instructions.
# ============================================================`;

const SECTION_ORDER = [
  ['site', 'Site Metadata'],
  ['company', 'Company Info'],
  ['hours', 'Opening Hours'],
  ['hero', 'Hero Section'],
  ['trustBar', 'Trust Bar'],
  ['services', 'Services'],
  ['geraeteRetterPraemie', 'Geraete-Retter-Praemie'],
  ['brands', 'Brands'],
  ['trust', 'Why Us / Trust'],
  ['process', 'Process (How it works)'],
  ['reviews', 'Reviews / Google Bewertungen'],
  ['calculator', 'Repair Price Calculator'],
  ['pickup', 'Hol & Bring Service'],
  ['willhaben', 'Willhaben / Handy kaufen'],
  ['faq', 'FAQ'],
  ['contact', 'Contact Form'],
  ['impressum', 'Impressum'],
  ['datenschutz', 'Datenschutz'],
  ['social', 'Social Links']
];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function yamlBlockForKey(key, value) {
  return yaml.dump({ [key]: value }, {
    noRefs: true,
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: false,
    sortKeys: false
  }).trimEnd();
}

export function getContentPath(customPath = process.env.CONTENT_PATH || 'src/data/content.yaml') {
  return path.resolve(customPath);
}

export async function readContent(customPath) {
  const contentPath = getContentPath(customPath);
  const raw = await fs.readFile(contentPath, 'utf8');
  const content = yaml.load(raw);
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new Error('content.yaml does not contain a valid top-level object.');
  }

  return { contentPath, content };
}

export function serializeContent(content) {
  const blocks = [HEADER];

  for (const [key, label] of SECTION_ORDER) {
    if (!(key in content)) continue;
    blocks.push(`# ------ ${label} ------`);
    blocks.push(yamlBlockForKey(key, content[key]));
  }

  for (const key of Object.keys(content)) {
    if (SECTION_ORDER.some(([knownKey]) => knownKey === key)) continue;
    blocks.push(`# ------ ${key} ------`);
    blocks.push(yamlBlockForKey(key, content[key]));
  }

  return `${blocks.join('\n\n')}\n`;
}

export async function writeContent(content, customPath) {
  const contentPath = getContentPath(customPath);
  await fs.writeFile(contentPath, serializeContent(content), 'utf8');
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

  if (!Array.isArray(content.pickup?.steps) || content.pickup.steps.length === 0) {
    errors.push('pickup.steps must contain at least one step.');
  }

  if (!Array.isArray(content.willhaben?.highlights) || content.willhaben.highlights.length === 0) {
    errors.push('willhaben.highlights must contain at least one highlight.');
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
