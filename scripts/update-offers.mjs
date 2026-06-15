import { applyIfSet, failOnValidationErrors, parseListInput, readContent, writeContent } from './lib/content-admin.mjs';

const { content } = await readContent();

applyIfSet(content.willhaben, 'headline', process.env.WILLHABEN_HEADLINE);
applyIfSet(content.willhaben, 'description', process.env.WILLHABEN_DESCRIPTION);
applyIfSet(content.willhaben, 'verifiedOn', process.env.WILLHABEN_VERIFIED_ON);
applyIfSet(content.willhaben, 'url', process.env.WILLHABEN_URL);
applyIfSet(content.willhaben, 'ctaText', process.env.WILLHABEN_CTA_TEXT);
applyIfSet(content.willhaben, 'contactCtaText', process.env.WILLHABEN_CONTACT_CTA_TEXT);

const willhabenHighlights = parseListInput(process.env.WILLHABEN_HIGHLIGHTS);
if (willhabenHighlights.length) {
  content.willhaben.highlights = willhabenHighlights;
}

failOnValidationErrors(content);
await writeContent(content);
console.log('Updated offers content.');
