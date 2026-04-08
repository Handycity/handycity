// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.PUBLIC_SITE_BASE || '/';

export default defineConfig({
  site: 'https://handycity.at',
  base,
  vite: {
    plugins: [tailwindcss()]
  }
});
