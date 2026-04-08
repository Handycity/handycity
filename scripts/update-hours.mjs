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

const { content } = await readContent();

content.hours = content.hours.map((entry) => {
  const nextValue = dayValues[entry.shortDay];
  if (typeof nextValue === 'string' && nextValue.trim()) {
    return {
      ...entry,
      time: nextValue.trim()
    };
  }

  return entry;
});

failOnValidationErrors(content);
await writeContent(content);
console.log('Updated opening hours.');
