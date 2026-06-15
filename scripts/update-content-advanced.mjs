import { failOnValidationErrors, readContent, writeContent } from './lib/content-admin.mjs';

const ACTION = (process.env.ACTION || '').trim().toLowerCase();
const TARGET_PATH = (process.env.TARGET_PATH || '').trim();
const RAW_VALUE = process.env.VALUE_JSON;
const KEY_FIELDS_RAW = process.env.KEY_FIELDS || '';

const VALID_ACTIONS = new Set(['set', 'remove', 'list_upsert', 'list_remove']);

if (!VALID_ACTIONS.has(ACTION)) {
  throw new Error('ACTION must be one of: set, remove, list_upsert, list_remove.');
}

if (!TARGET_PATH) {
  throw new Error('TARGET_PATH is required.');
}

function parsePath(path) {
  const normalized = path.replace(/\[(\d+)\]/g, '.$1');
  const parts = normalized.split('.').filter(Boolean);
  if (!parts.length) {
    throw new Error('TARGET_PATH is invalid.');
  }

  return parts.map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

function parseJsonLike(raw, { allowPlainString = false } = {}) {
  if (raw === undefined) {
    return undefined;
  }

  const text = String(raw).trim();
  if (!text.length) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    if (allowPlainString) return text;
    throw new Error(`VALUE_JSON must be valid JSON. Received: ${text}`);
  }
}

function getAtPath(root, pathParts) {
  let current = root;
  for (const part of pathParts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

function resolveParent(root, pathParts, createMissing = false) {
  if (pathParts.length === 0) {
    throw new Error('TARGET_PATH must not be empty.');
  }

  let current = root;
  for (let i = 0; i < pathParts.length - 1; i += 1) {
    const key = pathParts[i];
    const nextKey = pathParts[i + 1];
    const nextShouldBeArray = typeof nextKey === 'number';

    if (current[key] === undefined) {
      if (!createMissing) {
        throw new Error(`Path does not exist at segment "${String(key)}".`);
      }
      current[key] = nextShouldBeArray ? [] : {};
    } else if (typeof current[key] !== 'object' || current[key] === null) {
      if (!createMissing) {
        throw new Error(`Path segment "${String(key)}" is not an object/array.`);
      }
      current[key] = nextShouldBeArray ? [] : {};
    }

    current = current[key];
  }

  return { parent: current, key: pathParts[pathParts.length - 1] };
}

function setAtPath(root, pathParts, value) {
  const { parent, key } = resolveParent(root, pathParts, true);
  if (typeof key === 'number') {
    if (!Array.isArray(parent)) {
      throw new Error('Cannot set numeric path on a non-array parent.');
    }
    parent[key] = value;
    return;
  }
  parent[key] = value;
}

function deleteAtPath(root, pathParts) {
  const { parent, key } = resolveParent(root, pathParts, false);
  if (typeof key === 'number') {
    if (!Array.isArray(parent)) {
      throw new Error('Cannot remove numeric path on a non-array parent.');
    }
    if (key < 0 || key >= parent.length) {
      return false;
    }
    parent.splice(key, 1);
    return true;
  }

  if (!(key in parent)) {
    return false;
  }

  delete parent[key];
  return true;
}

function normalizeComparable(value) {
  return String(value ?? '').trim().toLowerCase();
}

function resolveKeyFields(explicitFields, valueObject) {
  const fromInput = explicitFields
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (fromInput.length) return fromInput;

  const candidates = ['id', 'slug', 'name', 'title', 'question', 'brand', 'device', 'repair', 'day', 'step'];
  const inferred = candidates.filter((field) => Object.prototype.hasOwnProperty.call(valueObject, field));
  if (inferred.length) return inferred;

  throw new Error('KEY_FIELDS missing and no inferable key fields found in VALUE_JSON.');
}

const { content } = await readContent();
const pathParts = parsePath(TARGET_PATH);

if (ACTION === 'set') {
  const value = parseJsonLike(RAW_VALUE, { allowPlainString: true });
  if (value === undefined) {
    throw new Error('VALUE_JSON is required for ACTION=set.');
  }
  setAtPath(content, pathParts, value);
}

if (ACTION === 'remove') {
  deleteAtPath(content, pathParts);
}

if (ACTION === 'list_upsert') {
  const item = parseJsonLike(RAW_VALUE);
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error('VALUE_JSON must be a JSON object for ACTION=list_upsert.');
  }

  let list = getAtPath(content, pathParts);
  if (list === undefined) {
    setAtPath(content, pathParts, []);
    list = getAtPath(content, pathParts);
  }

  if (!Array.isArray(list)) {
    throw new Error(`TARGET_PATH "${TARGET_PATH}" is not an array.`);
  }

  const keyFields = resolveKeyFields(KEY_FIELDS_RAW, item);
  const index = list.findIndex((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    return keyFields.every((field) => normalizeComparable(entry[field]) === normalizeComparable(item[field]));
  });

  if (index === -1) {
    list.push(item);
  } else {
    list[index] = { ...list[index], ...item };
  }
}

if (ACTION === 'list_remove') {
  const matcher = parseJsonLike(RAW_VALUE);
  if (!matcher || typeof matcher !== 'object' || Array.isArray(matcher)) {
    throw new Error('VALUE_JSON must be a JSON object for ACTION=list_remove.');
  }

  const list = getAtPath(content, pathParts);
  if (!Array.isArray(list)) {
    throw new Error(`TARGET_PATH "${TARGET_PATH}" is not an array.`);
  }

  const keyFields = resolveKeyFields(KEY_FIELDS_RAW, matcher);
  const filtered = list.filter((entry) => {
    if (!entry || typeof entry !== 'object') return true;
    const isMatch = keyFields.every((field) => normalizeComparable(entry[field]) === normalizeComparable(matcher[field]));
    return !isMatch;
  });

  setAtPath(content, pathParts, filtered);
}

failOnValidationErrors(content);
await writeContent(content);
console.log(`Applied ACTION=${ACTION} on TARGET_PATH=${TARGET_PATH}.`);
