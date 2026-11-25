/**
 * Pruebas del sitio compilado. Uso: npm run revisar (compila en la raíz y corre esto).
 * Cubren lo que más duele si se rompe: los spoilers, los filtros, el quiz y la accesibilidad.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
import Axe from '@axe-core/playwright';

const AxeBuilder = Axe.default ?? Axe;
const raiz = path.resolve('dist-check');
const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const RUTAS = ['/', '/historia/', '/guia/', '/personajes/', '/personajes/asta/', '/personajes/lucius-zogratis/', '/escuadrones/', '/mundo/', '/cronologia/', '/donde-ver/', '/quiz/'];
let servidor, base, nav;

before(async () => {
  servidor = http
    .createServer((q, r) => {
      let p = path.join(raiz, decodeURIComponent(q.url.split('?')[0]));
      if (p.endsWith(path.sep)) p += 'index.html';
      fs.readFile(p, (e, b) => {
        r.writeHead(e ? 404 : 200, { 'content-type': TIPOS[path.extname(p)] ?? 'text/plain' });
        r.end(e ? '' : b);
      });
    })
    .listen(0);
  base = `http://localhost:${servidor.address().port}`;
  nav = await chromium.launch();
});
after(async () => {
  await nav?.close();
  servidor?.close();
});

async function abrir(ruta, { ancho = 1280, alto = 900, nivel, tema, contexto = {} } = {}) {
  const ctx = await nav.newContext({ viewport: { width: ancho, height: alto }, reducedMotion: 'reduce', ...contexto });
  const p = await ctx.newPage();
  p.errores = [];
  p.on('pageerror', (e) => p.errores.push(e.message));
  if (nivel !== undefined || tema) await p.addInitScript(([n, t]) => { if (n !== undefined) localStorage.setItem('bc-nivel', String(n)); if (t) localStorage.setItem('bc-tema', t); }, [nivel, tema]);
  await p.goto(base + ruta);
  return p;
}

test('por defecto el nivel es el más bajo y lo tapado queda inerte', async () => {
  const p = await abrir('/historia/');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.nivel), '0');
  const r = await p.evaluate(() => [...document.querySelectorAll('.spoiler')].map((s) => { const c = s.querySelector('.spoiler__contenido'); return { inerte: c.hasAttribute('inert'), borroso: getComputedStyle(c).filter.includes('blur'), boton: s.querySelector('[data-abrir]').checkVisibility() }; }));
  assert.ok(r.length > 5);
  assert.ok(r.every((x) => x.inerte && x.borroso && x.boton), JSON.stringify(r));
  await p.context().close();
});

test('cada nivel destapa solo lo que corresponde', async () => {
  for (const nivel of [0, 1, 2]) {
    const p = await abrir('/historia/', { nivel });
    const mal = await p.evaluate((n) => [...document.querySelectorAll('.spoiler')].filter((s) => s.querySelector('.spoiler__contenido').hasAttribute('inert') !== Number(s.dataset.req) > n).length, nivel);
    assert.equal(mal, 0, `nivel ${nivel}`);
    await p.context().close();
  }
});

test('el selector guarda la elección y se conserva al cambiar de página', async () => {
  const p = await abrir('/historia/');
  await p.click('[data-nivel-boton]');
  await p.check('#nivel-panel input[value="2"]');
  assert.equal(await p.locator('.spoiler__contenido[inert]').count(), 0);
  await p.goto(base + '/mundo/');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.nivel), '2');
  assert.equal(await p.locator('.spoiler__contenido[inert]').count(), 0);
  await p.context().close();
});

test('el sitio funciona aunque localStorage esté bloqueado', async () => {
  const ctx = await nav.newContext();
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));
  await p.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('bloqueado'); } }));
  await p.goto(base + '/historia/');
  await p.click('[data-nivel-boton]');
  await p.check('#nivel-panel input[value="1"]');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.nivel), '1');
  assert.deepEqual(errores, []);
  await ctx.close();
});

test('mostrar y volver a tapar un spoiler con teclado', async () => {
  const p = await abrir('/personajes/asta/');
  const s = p.locator('.spoiler').first();
  await s.locator('[data-abrir]').focus();
  await p.keyboard.press('Enter');
  assert.equal(await s.locator('.spoiler__contenido').getAttribute('inert'), null);
  await s.locator('[data-cerrar]').press('Enter');
  assert.notEqual(await s.locator('.spoiler__contenido').getAttribute('inert'), null);
  await p.context().close();
});

test('buscar un personaje lacrado no lo delata', async () => {
  const p = await abrir('/personajes/');
  await p.fill('#q', 'lucius');
  assert.equal(await p.locator('.carta:visible').count(), 0);
  const p2 = await abrir('/personajes/', { nivel: 2 });
  await p2.fill('#q', 'lucius');
  assert.equal(await p2.locator('.carta:visible').count(), 1);
  await p.context().close();
  await p2.context().close();
});

test('filtros de personajes por escuadrón, magia y reino', async () => {
  const p = await abrir('/personajes/');
  await p.selectOption('#f-esc', 'toros-negros');
  assert.equal(await p.locator('.carta:visible').count(), 15);
  await p.selectOption('#f-mag', 'Fuego');
  assert.equal(await p.locator('.carta:visible').count(), 1);
  await p.click('#limpiar');
  await p.selectOption('#f-rei', 'spade');
  assert.equal(await p.locator('.carta:visible').count(), 3);
  await p.click('#limpiar');
  await p.fill('#q', 'noelle');
  assert.equal(await p.locator('.carta:visible').count(), 1);
  await p.context().close();
});

test('la página de un personaje lacrado no lo nombra en el título ni va al sitemap', async () => {
  const html = fs.readFileSync(path.join(raiz, 'personajes/lucius-zogratis/index.html'), 'utf8');
  assert.ok(!/<title>[^<]*Lucius/.test(html));
  assert.match(html, /noindex/);
  assert.ok(!fs.readFileSync(path.join(raiz, 'sitemap-0.xml'), 'utf8').includes('lucius'));
});

test('la calculadora de capítulos responde', async () => {
  const p = await abrir('/guia/');
  assert.equal(await p.textContent('.resultado [data-cap]'), '270');
  const anime = JSON.parse(fs.readFileSync('src/data/anime.json', 'utf8'));
  const ult = anime.episodios.find((e) => e.numero === anime.ultimoEmitido);
  await p.selectOption('[data-calculadora]', String(ult.numero));
  assert.equal(await p.textContent('.resultado [data-cap]'), String(ult.capitulos[1] + 1));
  await p.context().close();
});

test('el quiz pide respuesta, avanza y da un escuadrón', async () => {
  const p = await abrir('/quiz/');
  await p.click('#seguir');
  assert.match(await p.textContent('#error'), /Elegí una respuesta/);
  for (let i = 0; i < 8; i++) {
    await p.locator(`.pregunta[data-indice="${i}"] input`).nth(0).check();
    await p.click('#seguir');
  }
  assert.equal(await p.locator('#resultado article:visible').count(), 1);
  await p.locator('#resultado article:visible [data-repetir]').click();
  assert.ok(await p.locator('.pregunta[data-indice="0"]').isVisible());
  await p.context().close();
});

test('todos los escuadrones se pueden obtener en el quiz', () => {
  const quiz = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf8'));
  for (const id of Object.keys(quiz.resultados)) {
    const suma = {};
    for (const q of quiz.preguntas) {
      const mejor = [...q.opciones].sort((a, b) => (b.puntos[id] ?? 0) - (a.puntos[id] ?? 0))[0];
      for (const [k, n] of Object.entries(mejor.puntos)) suma[k] = (suma[k] ?? 0) + n;
    }
    const gana = Object.entries(suma).sort((a, b) => b[1] - a[1])[0][0];
    assert.equal(gana, id);
  }
});

test('sin errores de script ni desborde horizontal', async () => {
  for (const ruta of RUTAS)
    for (const ancho of [320, 390, 768, 1024, 1440]) {
      const p = await abrir(ruta, { ancho, nivel: 1 });
      const extra = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(extra <= 0, `${ruta} a ${ancho}: ${extra}px de más`);
      assert.deepEqual(p.errores, [], ruta);
      await p.context().close();
    }
});

test('accesibilidad automática (axe) en los dos temas', async () => {
  const fallas = [];
  for (const tema of ['oscuro', 'claro'])
    for (const ruta of RUTAS) {
      const p = await abrir(ruta, { tema, nivel: 2 });
      const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      for (const v of r.violations) fallas.push(`${tema} ${ruta} ${v.id} x${v.nodes.length}: ${v.nodes[0].target} ${v.nodes[0].failureSummary?.split('\n')[1] ?? ''}`);
      await p.context().close();
    }
  assert.deepEqual(fallas, []);
});

test('accesibilidad con spoilers tapados', async () => {
  const fallas = [];
  for (const ruta of RUTAS) {
    const p = await abrir(ruta, { nivel: 0 });
    const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).exclude('.spoiler__contenido[inert]').analyze();
    for (const v of r.violations) fallas.push(`${ruta} ${v.id} x${v.nodes.length}: ${v.nodes[0].target} ${v.nodes[0].failureSummary?.split('\n')[1] ?? ''}`);
    await p.context().close();
  }
  assert.deepEqual(fallas, []);
});

test('cada personaje y escuadrón tiene su dibujo y las imágenes cargan', async () => {
  for (const p of JSON.parse(fs.readFileSync('src/data/personajes.json', 'utf8'))) assert.ok(fs.existsSync(path.join(raiz, 'vinetas', `${p.id}.svg`)), p.id);
  for (const ruta of ['/personajes/', '/personajes/asta/', '/escuadrones/', '/quiz/']) {
    const p = await abrir(ruta, { nivel: 2 });
    const rotas = await p.evaluate(async () => {
      const imgs = [...document.images];
      imgs.forEach((i) => (i.loading = 'eager'));
      await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
      return imgs.filter((i) => !i.naturalWidth && i.checkVisibility()).map((i) => i.src);
    });
    assert.deepEqual(rotas, [], ruta);
    await p.context().close();
  }
});

test('los videos son oficiales, no piden nada antes del clic y se cierran si quedan tapados', async () => {
  const videos = JSON.parse(fs.readFileSync('src/data/videos.json', 'utf8'));
  assert.ok(videos.every((v) => ['TV Tokyo Anime', 'avex pictures'].includes(v.canal)));
  const p = await abrir('/', { nivel: 1 });
  const pedidos = [];
  await p.route(/youtube|ytimg/, (r) => { pedidos.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }); });
  await p.reload();
  assert.equal(pedidos.length, 0);
  await p.locator('#videos .video-tapa a[data-video]').first().click();
  await p.waitForSelector('#videos iframe');
  assert.match(await p.locator('#videos iframe').getAttribute('src'), /^https:\/\/www\.youtube-nocookie\.com\/embed\//);
  await p.click('[data-nivel-boton]');
  await p.check('#nivel-panel input[value="0"]');
  assert.equal(await p.locator('#videos iframe').count(), 0);
  await p.context().close();
});

test('enlaces internos y anclas existen', () => {
  const rotas = [];
  const paginas = fs.readdirSync(raiz, { recursive: true }).map(String).filter((f) => f.endsWith('.html'));
  for (const f of paginas) {
    const html = fs.readFileSync(path.join(raiz, f), 'utf8');
    for (const [, href] of html.matchAll(/<a[^>]+href="(\/[^"]*|#[^"]+)"/g)) {
      const [ruta, ancla] = href.split('#');
      const destino = ruta ? path.join(raiz, ruta, 'index.html') : path.join(raiz, f);
      if (!fs.existsSync(destino)) rotas.push(`${f} -> ${href}`);
      else if (ancla && !fs.readFileSync(destino, 'utf8').includes(`id="${ancla}"`)) rotas.push(`${f} -> ${href}`);
    }
  }
  assert.deepEqual([...new Set(rotas)], []);
});
