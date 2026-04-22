import { applyIfSet, failOnValidationErrors, readContent, writeContent } from './lib/content-admin.mjs';

const { content } = await readContent();

applyIfSet(content.hero, 'kicker', process.env.HERO_KICKER);
applyIfSet(content.hero, 'headline', process.env.HERO_HEADLINE);
applyIfSet(content.hero, 'subheadline', process.env.HERO_SUBHEADLINE);
applyIfSet(content.hero.ctaPrimary, 'text', process.env.HERO_PRIMARY_TEXT);
applyIfSet(content.hero.ctaPrimary, 'href', process.env.HERO_PRIMARY_HREF);
applyIfSet(content.hero.ctaSecondary, 'text', process.env.HERO_SECONDARY_TEXT);
applyIfSet(content.hero.ctaSecondary, 'href', process.env.HERO_SECONDARY_HREF);

applyIfSet(content.company, 'phone', process.env.COMPANY_PHONE);
applyIfSet(content.company, 'phoneDisplay', process.env.COMPANY_PHONE_DISPLAY);
applyIfSet(content.company, 'email', process.env.COMPANY_EMAIL);
applyIfSet(content.company.address, 'street', process.env.COMPANY_STREET);
applyIfSet(content.company.address, 'zip', process.env.COMPANY_ZIP);
applyIfSet(content.company.address, 'city', process.env.COMPANY_CITY);
applyIfSet(content.company.map, 'placeUrl', process.env.COMPANY_MAP_URL);

applyIfSet(content.site, 'title', process.env.SITE_TITLE);
applyIfSet(content.site, 'description', process.env.SITE_DESCRIPTION);

failOnValidationErrors(content);
await writeContent(content);
console.log('Updated business and hero content.');
