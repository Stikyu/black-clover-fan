import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// En GitHub Pages el sitio vive en /black-clover-fan/. BASE_PATH=/ sirve para revisarlo en la raíz.
const base = process.env.BASE_PATH ?? '/black-clover-fan/';

// Los personajes que debutan después de la T1 quedan fuera del sitemap: su nombre ya es un spoiler.
const anime = JSON.parse(fs.readFileSync('./src/data/anime.json', 'utf8'));
const personajes = JSON.parse(fs.readFileSync('./src/data/personajes.json', 'utf8'));
const sellados = personajes.filter((p) => p.debut > anime.capituloFinT1).map((p) => `/personajes/${p.id}/`);

export default defineConfig({
  site: 'https://stikyu.github.io',
  base,
  outDir: process.env.OUT_DIR ?? './dist',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (url) => !url.includes('/404') && !sellados.some((s) => url.endsWith(s)) })],
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
