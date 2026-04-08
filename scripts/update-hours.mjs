import { failOnValidationErrors, readContent, writeContent } from './lib/content-admin.mjs';

const dayValues = {
  Mo: process.env.HOURS_MO,
  Di: process.env.HOURS_DI,
  Mi: process.env.HOURS_MI,
  Do: process.env.HOURS_DO,
  Fr: process.env.HOURS_FR,
  Sa: process.env.HOURS_SA,
  So: process.env.HOURS_SO
};

function normalizeHours(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return trimmed;
  if (trimmed.toLowerCase() === 'geschlossen') return 'Geschlossen';
  return trimmed.replace(/\s*[-–]\s*/g, '–');
}

const { content } = await readContent();

content.hours = content.hours.map((entry) => {
  const nextValue = dayValues[entry.shortDay];
  if (typeof nextValue === 'string' && nextValue.trim()) {
    return {
      ...entry,
      time: normalizeHours(nextValue)
    };
  }

  return entry;
});

failOnValidationErrors(content);
await writeContent(content);
console.log('Updated opening hours.');
