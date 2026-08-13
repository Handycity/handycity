// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.PUBLIC_SITE_BASE || '/';

export default defineConfig({
  site: 'https://handycity.at',
  base,
  integrations: [
    sitemap({
      // Impressum and Datenschutz are served with <meta name="robots"
      // content="noindex">; listing them would contradict that.
      filter: (page) => !/\/(impressum|datenschutz)\/?$/.test(page)
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/dist/**', '**/.git/**']
      }
    }
  }
});
