import { applyIfSet, failOnValidationErrors, parseListInput, readContent, writeContent } from './lib/content-admin.mjs';

const { content } = await readContent();

applyIfSet(content.willhaben, 'headline', process.env.WILLHABEN_HEADLINE);
applyIfSet(content.willhaben, 'description', process.env.WILLHABEN_DESCRIPTION);
applyIfSet(content.willhaben, 'url', process.env.WILLHABEN_URL);
applyIfSet(content.willhaben, 'ctaText', process.env.WILLHABEN_CTA_TEXT);

const willhabenHighlights = parseListInput(process.env.WILLHABEN_HIGHLIGHTS);
if (willhabenHighlights.length) {
  content.willhaben.highlights = willhabenHighlights;
}

applyIfSet(content.pickup, 'headline', process.env.PICKUP_HEADLINE);
applyIfSet(content.pickup, 'description', process.env.PICKUP_DESCRIPTION);
applyIfSet(content.pickup, 'badge', process.env.PICKUP_BADGE);
applyIfSet(content.pickup, 'ctaText', process.env.PICKUP_CTA_TEXT);

const pickupStepsInput = parseListInput(process.env.PICKUP_STEPS);
if (pickupStepsInput.length) {
  const pickupSteps = pickupStepsInput.map((line) => {
    const [title, text] = line.split(/\s*::\s*/, 2);
    return {
      title: title?.trim() || '',
      text: text?.trim() || ''
    };
  });

  if (!pickupSteps.every((step) => step.title && step.text)) {
    throw new Error('PICKUP_STEPS must use the format "Titel :: Text", one entry per line.');
  }

  content.pickup.steps = pickupSteps;
}

failOnValidationErrors(content);
await writeContent(content);
console.log('Updated offers and pickup content.');
