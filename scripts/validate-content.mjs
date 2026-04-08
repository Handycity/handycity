import { failOnValidationErrors, readContent } from './lib/content-admin.mjs';

const { content } = await readContent();
failOnValidationErrors(content);
console.log('Content validation passed.');
