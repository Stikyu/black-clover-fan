// Genera las capturas del README y la imagen para compartir. Antes: npm run revisar -- --solo-compilar
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.resolve('dist-check');
const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const servidor = http
  .createServer((q, r) => {
    let p = path.join(raiz, decodeURIComponent(q.url.split('?')[0]));
    if (p.endsWith(path.sep)) p += 'index.html';
    fs.readFile(p, (e, b) => {
      r.writeHead(e ? 404 : 200, { 'content-type': TIPOS[path.extname(p)] ?? 'text/plain' });
      r.end(e ? '' : b);
    });
  })
  .listen(0);
const base = `http://localhost:${servidor.address().port}`;
fs.mkdirSync('docs/capturas', { recursive: true });

const nav = await chromium.launch();
async function captura(nombre, ruta, { w = 1440, h = 900, nivel = '0', tema = '', ancla, antes, archivo } = {}) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
  const p = await ctx.newPage();
  await p.addInitScript(([n, t]) => { localStorage.setItem('bc-nivel', n); if (t) localStorage.setItem('bc-tema', t); }, [nivel, tema]);
  await p.goto(base + ruta);
  await p.evaluate(() => document.fonts.ready);
  if (antes) await antes(p);
  if (ancla) await p.evaluate((s) => document.querySelector(s).scrollIntoView(), ancla);
  await p.waitForTimeout(1400);
  const destino = archivo ?? `docs/capturas/${nombre}.jpg`;
  await p.screenshot(destino.endsWith('.png') ? { path: destino } : { path: destino, type: 'jpeg', quality: 84 });
  await ctx.close();
  console.log(destino);
}

await captura('portada', '/');
await captura('estado', '/', { ancla: '#estado', nivel: '1' });
await captura('guia', '/guia/', { nivel: '1' });
await captura('personajes', '/personajes/');
await captura('ficha', '/personajes/asta/');
await captura('escuadrones', '/escuadrones/');
await captura('historia', '/historia/', { ancla: '#spade' });
await captura('quiz', '/quiz/');
await captura('pergamino', '/', { tema: 'claro' });
await captura('celular', '/', { w: 390, h: 844 });
await captura('celular-selector', '/personajes/', { w: 390, h: 844, antes: (p) => p.click('[data-nivel-boton]') });
await captura('og', '/', { w: 1200, h: 630, archivo: 'public/og.png' });

await nav.close();
servidor.close();
