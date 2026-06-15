// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.PUBLIC_SITE_BASE || '/';

export default defineConfig({
  site: 'https://handycity.at',
  base,
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: [
          '**/repo_push/**',
          '**/dist/**',
          '**/.git/**',
          '**/public/images/Handy mit Reparaturbonus _ Handycity Klagenfurt_files/**',
          '**/public/images/shop-innen-right_files/**'
        ]
      }
    }
  }
});
