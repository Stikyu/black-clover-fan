/** Grabado de fondo de la portada: cielo a buril, sierras, una ciudadela y un campo de tréboles. */
import { azar, cresta, poligono, laderas, altura, trazo, HOJA, angulos } from './grabado';

const PALETAS = {
  oscuro: { halo: '#d2a74b', trazo: '#c79a41', lejos: '#14110b', medio: '#110e09', cerca: '#0b1009', ventana: '#f0c866', verde: '#23431e', luz: '#3b6b32' },
  claro: { halo: '#fff6dc', trazo: '#6b4d1b', lejos: '#d8c79d', medio: '#ccb988', cerca: '#b7a873', ventana: '#8a2418', verde: '#4d6b34', luz: '#3a5627' },
};
export type Tema = keyof typeof PALETAS;

/** escena: "portada" completa, "movil" sin estrellas (irían sobre el texto) o solo el "campo" del pie. */
export function paisaje(escena: 'portada' | 'movil' | 'campo', tema: Tema): string {
  const p = PALETAS[tema];
  const r = azar(2015);
  const CX = 1180;
  const CY = 400;
  const aros = Array.from({ length: 58 }, (_, i) => {
    const radio = 150 + i * 15 + i * i * 0.12;
    const largo = 14 + r() * 70;
    const hueco = 3 + r() * (6 + i * 0.5);
    return { radio: radio.toFixed(0), dash: `${largo.toFixed(0)} ${hueco.toFixed(0)} ${(largo * 0.4).toFixed(0)} ${(hueco * 1.6).toFixed(0)}`, giro: (r() * 360).toFixed(0), op: Math.max(0.1, 0.62 - i * 0.0095).toFixed(2), w: (1.7 - i * 0.016).toFixed(2) };
  });

  const lejos = cresta(-20, 1620, 620, 190, r, 6);
  const medio = cresta(-20, 1620, 715, 120, r, 6);
  const cerca = cresta(-20, 1620, 800, 60, r, 5);

  // ciudadela sobre la segunda sierra
  const bx = 800;
  const by = altura(medio, bx - 40) + 4;
  const torre = (x: number, w: number, h: number, techo: number) => {
    const y = by - h;
    return `M${x} ${by + 160}V${y}L${x + w / 2} ${y - techo}L${x + w} ${y}V${by + 160}Z`;
  };
  const muro = (x: number, w: number, h: number) => {
    let d = `M${x} ${by + 160}V${by - h}`;
    const k = Math.round(w / 12);
    for (let i = 0; i < k; i++) d += `h${w / k / 2}v7h${w / k / 2}v-7`;
    return d + `V${by + 160}Z`;
  };
  const torres: [number, number, number, number][] = [[bx - 92, 22, 62, 34], [bx - 58, 30, 108, 52], [bx - 14, 38, 152, 74], [bx + 36, 26, 96, 46], [bx + 78, 20, 54, 30]];
  let sombraTorres = '';
  for (const [x, w, h] of torres) for (let i = 0; i < 6; i++) sombraTorres += trazo(x + w * (0.55 + i * 0.08), by - h + 2 + r() * 8, x + w * (0.55 + i * 0.08), by + 40, r, 0.5, 3);

  let sombraMuro = '';
  for (let y = by - 20; y < by + 60; y += 9) for (let x = bx - 104 + r() * 14; x < bx + 108; x += 16 + r() * 22) sombraMuro += trazo(x, y, x + 8 + r() * 8, y, r, 0.5, 2);

  // campo de tréboles
  const treboles: { x: number; y: number; e: number; g: number; k: number; luz: boolean }[] = [];
  for (let fila = 0; fila < 4; fila++) {
    const paso = 46 + fila * 17;
    for (let x = -10 + r() * paso; x < 1620; x += paso * (0.75 + r() * 0.6)) {
      const base = altura(cerca, Math.min(1619, Math.max(-19, x)));
      treboles.push({ x: Math.round(x), y: Math.round(base + 22 + fila * 30 + r() * 12), e: +(0.11 + fila * 0.05 + r() * 0.03).toFixed(3), g: Math.round((r() - 0.5) * 50), k: 3, luz: r() > 0.7 });
    }
  }
  const cuatro = treboles.findIndex((t) => t.x > 560 && t.e > 0.22);
  if (cuatro > -1) treboles[cuatro].k = 4;
  let pasto = '';
  for (let i = 0; i < 260; i++) {
    const x = r() * 1600;
    const y = altura(cerca, x) + r() * 110;
    pasto += `M${x.toFixed(0)} ${y.toFixed(0)}q${((r() - 0.5) * 8).toFixed(1)} ${(-8 - r() * 8).toFixed(1)} ${((r() - 0.5) * 12).toFixed(1)} ${(-14 - r() * 14).toFixed(1)}`;
  }
  const chispas = Array.from({ length: 22 }, () => ({ x: Math.round(780 + r() * 790), y: Math.round(90 + r() * 360), e: (0.5 + r() * 0.9).toFixed(2) }));

  const campo = `<path d="${poligono(cerca, 900)}" fill="${p.cerca}"/><path d="${pasto}" stroke="${p.verde}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>${treboles
    .map((t) => `<g transform="translate(${t.x} ${t.y}) rotate(${t.g}) scale(${t.e})"><path d="M0 0C6 40-8 80 4 150" stroke="${p.verde}" stroke-width="9" fill="none"/>${angulos(t.k).map((g) => `<use href="#h" transform="rotate(${g})" fill="${t.k === 4 ? p.trazo : t.luz ? p.luz : p.verde}"/>`).join('')}</g>`)
    .join('')}`;
  const hoja = `<defs><path id="h" d="${HOJA}"/></defs>`;
  const abre = (caja: string, w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${caja}" width="${w}" height="${h}" preserveAspectRatio="xMaxYMax slice">${hoja}`;
  if (escena === 'campo') return `${abre('0 700 1600 200', 1600, 200)}${campo}</svg>`;

  return `${abre('0 0 1600 900', 1600, 900)}<defs><radialGradient id="halo" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="520"><stop offset="0" stop-color="${p.halo}" stop-opacity="${escena === 'movil' ? 0.28 : 0.5}"/><stop offset=".45" stop-color="${p.halo}" stop-opacity=".16"/><stop offset="1" stop-color="${p.halo}" stop-opacity="0"/></radialGradient><linearGradient id="calma" x1="0" x2="1"><stop offset=".12" stop-color="#000"/><stop offset=".6" stop-color="#fff"/></linearGradient><mask id="cielo"><rect width="1600" height="900" fill="url(#calma)"/></mask></defs>
<rect width="1600" height="900" fill="url(#halo)"/>
<g mask="url(#cielo)" fill="none" stroke="${p.trazo}" opacity="${escena === 'movil' ? 0.34 : 1}">${aros.map((a) => `<circle cx="${CX}" cy="${CY}" r="${a.radio}" stroke-width="${a.w}" stroke-dasharray="${a.dash}" opacity="${a.op}" transform="rotate(${a.giro} ${CX} ${CY})"/>`).join('')}</g>
${escena === 'portada' ? `<g fill="${p.trazo}" opacity=".75">${chispas.map((c) => `<path transform="translate(${c.x} ${c.y}) scale(${c.e})" d="M0-7L1.4-1.4 7 0 1.4 1.4 0 7-1.4 1.4-7 0-1.4-1.4Z"/>`).join('')}</g>` : ''}
<path d="${poligono(lejos, 900)}" fill="${p.lejos}"/><path d="${laderas(lejos, 7, 60, r)}" stroke="${p.trazo}" fill="none" opacity=".34"/>
<path d="${torres.map((t) => torre(...t)).join('')}" fill="${p.medio}" stroke="${p.trazo}" stroke-width="1.3"/><path d="${sombraTorres}" stroke="${p.trazo}" stroke-width=".9" opacity=".5" fill="none"/>
<path d="${muro(bx - 110, 224, 34)}" fill="${p.medio}" stroke="${p.trazo}" stroke-width="1.3"/><path d="${sombraMuro}" stroke="${p.trazo}" stroke-width=".9" opacity=".4" fill="none"/>
<path d="M${bx - 10} ${by + 30}v-34a15 18 0 0 1 30 0v34" fill="${p.lejos}" stroke="${p.trazo}" stroke-width="1.3"/><path fill="${p.ventana}" d="${torres.map(([x, w, h]) => `M${x + w * 0.22} ${by - h + 22}v-9a3 3 0 0 1 6 0v9Z`).join('')}"/>
<path d="${poligono(medio, 900)}" fill="${p.medio}"/><path d="${laderas(medio, 6, 48, r)}" stroke="${p.trazo}" fill="none" opacity=".3"/>
${campo}</svg>`;
}
