import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

export const DEFAULT_CONTENT_SOURCE = 'src/data/content';

export const CONTENT_FILE_DEFINITIONS = [
  { file: 'site.yaml', label: 'Site and Company', sections: ['site', 'company', 'hours', 'social'] },
  { file: 'homepage.yaml', label: 'Homepage Sections', sections: ['hero', 'trustBar', 'services', 'brands', 'trust', 'process', 'contact'] },
  { file: 'reviews.yaml', label: 'Reviews', sections: ['reviews'] },
  { file: 'calculator.yaml', label: 'Calculator and Bonus', sections: ['calculator', 'geraeteRetterPraemie'] },
  { file: 'sales.yaml', label: 'Willhaben and Sales', sections: ['willhaben'] },
  { file: 'faq.yaml', label: 'FAQ', sections: ['faq'] },
  { file: 'legal.yaml', label: 'Legal Pages', sections: ['impressum', 'datenschutz'] },
  { file: 'pickup.yaml', label: 'Pickup Service', sections: ['pickup'] }
];

const YAML_DUMP_OPTIONS = {
  noRefs: true,
  lineWidth: -1,
  quotingType: '"',
  forceQuotes: false,
  sortKeys: false
};

let syncCache = null;
let asyncCache = null;

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseYamlObject(raw, sourceLabel) {
  const parsed = yaml.load(raw);
  if (!isPlainObject(parsed)) {
    throw new Error(`${sourceLabel} does not contain a valid top-level object.`);
  }
  return parsed;
}

function mergeSections(target, parsed, sourceLabel) {
  for (const [key, value] of Object.entries(parsed)) {
    if (key in target) {
      throw new Error(`Duplicate content key "${key}" found while reading ${sourceLabel}.`);
    }
    target[key] = value;
  }
}

export function resolveContentSource(customPath = process.env.CONTENT_PATH || DEFAULT_CONTENT_SOURCE) {
  return path.resolve(customPath);
}

export function isContentDirectory(sourcePath) {
  return fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory();
}

export function getContentFiles(sourcePath = resolveContentSource()) {
  if (!isContentDirectory(sourcePath)) {
    return [sourcePath];
  }

  const yamlFiles = fs.readdirSync(sourcePath).filter((file) => file.endsWith('.yaml'));
  if (yamlFiles.length === 0) {
    const legacyPath = `${sourcePath}.yaml`;
    if (fs.existsSync(legacyPath)) {
      return [legacyPath];
    }
  }

  const fileNames = new Set(yamlFiles);
  const ordered = [];

  for (const definition of CONTENT_FILE_DEFINITIONS) {
    if (fileNames.has(definition.file)) {
      ordered.push(path.join(sourcePath, definition.file));
      fileNames.delete(definition.file);
    }
  }

  for (const fileName of [...fileNames].sort()) {
    ordered.push(path.join(sourcePath, fileName));
  }

  return ordered;
}

export function loadContentSync(customPath) {
  const sourcePath = resolveContentSource(customPath);
  if (syncCache?.sourcePath === sourcePath) {
    return syncCache.content;
  }

  const content = {};
  for (const filePath of getContentFiles(sourcePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = parseYamlObject(raw, path.relative(process.cwd(), filePath));
    mergeSections(content, parsed, filePath);
  }

  syncCache = { sourcePath, content };
  return content;
}

export async function loadContent(customPath) {
  const sourcePath = resolveContentSource(customPath);
  if (asyncCache?.sourcePath === sourcePath) {
    return asyncCache.content;
  }

  const content = {};
  for (const filePath of getContentFiles(sourcePath)) {
    const raw = await fsp.readFile(filePath, 'utf8');
    const parsed = parseYamlObject(raw, path.relative(process.cwd(), filePath));
    mergeSections(content, parsed, filePath);
  }

  asyncCache = { sourcePath, content };
  return content;
}

export function clearContentCache() {
  syncCache = null;
  asyncCache = null;
}

export function yamlBlockForObject(value) {
  return yaml.dump(value, YAML_DUMP_OPTIONS).trimEnd();
}

export function splitContentByFile(content) {
  const grouped = new Map();
  const assignedKeys = new Set();

  for (const definition of CONTENT_FILE_DEFINITIONS) {
    const fileContent = {};
    for (const key of definition.sections) {
      if (key in content) {
        fileContent[key] = content[key];
        assignedKeys.add(key);
      }
    }

    if (Object.keys(fileContent).length > 0) {
      grouped.set(definition.file, {
        label: definition.label,
        content: fileContent
      });
    }
  }

  const remaining = {};
  for (const [key, value] of Object.entries(content)) {
    if (!assignedKeys.has(key)) {
      remaining[key] = value;
    }
  }

  if (Object.keys(remaining).length > 0) {
    grouped.set('extras.yaml', {
      label: 'Additional Content',
      content: remaining
    });
  }

  return grouped;
}

export function serializeContentFile(fileName, label, content) {
  const header = [
    '# ============================================================',
    '# Handycity.at - Content Segment',
    '# ============================================================',
    `# File: ${fileName}`,
    `# Scope: ${label}`,
    '# ============================================================'
  ].join('\n');

  return `${header}\n\n${yamlBlockForObject(content)}\n`;
}
