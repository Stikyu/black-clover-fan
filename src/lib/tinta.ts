/** Pluma, tinta y campo heráldico: piezas comunes de blasones y viñetas. */
export const K = '#140d07';
export const C = '#f1e4c6';
export const M = '#cdb98a';
export const G = '#dcb04f';
export const R = '#b8402f';
export const V = '#5f9a4a';
export const A = '#8fb4c9';

export const n = (v: number) => Math.round(v * 10) / 10;

/** Mancha con contorno de tinta. */
export const P = (d: string, relleno = C, w = 2.2) => `<path d="${d}" fill="${relleno}" stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
/** Línea de tinta. */
export const L = (d: string, color = K, w = 1.5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const O = (x: number, y: number, r: number, relleno = C, w = 2.2) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${relleno}" stroke="${K}" stroke-width="${w}"/>`;
export const g = (dentro: string, x = 0, y = 0, e = 1, giro = 0) => `<g transform="translate(${n(x)} ${n(y)})${giro ? ` rotate(${giro})` : ''}${e !== 1 ? ` scale(${e})` : ''}">${dentro}</g>`;
/** Copia reflejada para figuras simétricas. */
export const espejo = (dentro: string) => `${dentro}<g transform="scale(-1 1)">${dentro}</g>`;
export const gira = (dentro: string, k: number, desde = 0) => Array.from({ length: k }, (_, i) => `<g transform="rotate(${n(desde + (360 / k) * i)})">${dentro}</g>`).join('');

/** Espiral hecha de medias vueltas. */
export function espiral(vueltas: number, paso: number, sentido: 1 | 0 = 1, r0 = 2): string {
  let d = 'M0 0';
  let x = 0;
  let lado = 1;
  let r = r0;
  for (let i = 0; i < vueltas * 2; i++) {
    x += lado * r * 2;
    d += `A${n(r)} ${n(r)} 0 0 ${sentido} ${n(x)} 0`;
    lado *= -1;
    r += paso;
  }
  return d;
}

/** Pluma que nace en el origen y apunta hacia arriba. */
export const pluma = (largo: number, ancho: number, relleno = C) =>
  P(`M0 0C${-ancho} ${n(-largo * 0.3)} ${-ancho} ${n(-largo * 0.8)} 0 ${-largo}C${ancho} ${n(-largo * 0.8)} ${ancho} ${n(-largo * 0.3)} 0 0Z`, relleno, 1.8) +
  L(`M0 0V${n(-largo * 0.86)}M0 ${n(-largo * 0.4)}L${n(-ancho * 0.55)} ${n(-largo * 0.55)}M0 ${n(-largo * 0.4)}L${n(ancho * 0.55)} ${n(-largo * 0.55)}M0 ${n(-largo * 0.6)}L${n(-ancho * 0.5)} ${n(-largo * 0.73)}M0 ${n(-largo * 0.6)}L${n(ancho * 0.5)} ${n(-largo * 0.73)}`, K, 1);

/** Estrella o destello de k puntas. */
export function estrella(k: number, R1: number, r1: number, relleno = G, w = 1.8): string {
  let d = '';
  for (let i = 0; i < k * 2; i++) {
    const a = (Math.PI / k) * i - Math.PI / 2;
    const r = i % 2 ? r1 : R1;
    d += `${i ? 'L' : 'M'}${n(Math.cos(a) * r)} ${n(Math.sin(a) * r)}`;
  }
  return P(d + 'Z', relleno, w);
}

/** Forma del escudo en una caja de 200 por 240. */
export const ESCUDO = 'M12 14C70 8 132 18 188 12C186 48 190 82 188 118C186 176 144 210 100 232C56 210 14 176 12 116C10 82 14 48 12 14Z';
const FILETE = 'M23 25C76 20 130 29 177 24C175 54 179 86 177 118C175 168 138 198 100 218C62 198 25 168 23 116C21 86 25 54 23 25Z';

const TRAMAS: Record<string, string> = {
  oro: '<pattern id="t" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3.500" cy="3.500" r="1.700" fill="#fff3d0"/><circle cx="10.500" cy="10.500" r="1.700" fill="#fff3d0"/></pattern>',
  plata: '<pattern id="t" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M6 20l8-8M19 8l3-3" stroke="#fff3d0" stroke-width="1.500"/></pattern>',
  gules: '<pattern id="t" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M4 0V8" stroke="#fff3d0" stroke-width="1.500"/></pattern>',
  azur: '<pattern id="t" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4H8" stroke="#fff3d0" stroke-width="1.500"/></pattern>',
  sinople: '<pattern id="t" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><path d="M4.500 0V9" stroke="#fff3d0" stroke-width="1.500"/></pattern>',
  purpura: '<pattern id="t" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M4.500 0V9" stroke="#fff3d0" stroke-width="1.500"/></pattern>',
  sable: '<pattern id="t" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M4 0V8M0 4H8" stroke="#fff3d0" stroke-width="1.200"/></pattern>',
  agua: '<pattern id="t" width="24" height="12" patternUnits="userSpaceOnUse"><path d="M0 6q6-7 12 0t12 0" fill="none" stroke="#fff3d0" stroke-width="1.500"/></pattern>',
  coral: '<pattern id="t" width="12" height="24" patternUnits="userSpaceOnUse"><path d="M6 0q-7 6 0 12t0 12" fill="none" stroke="#fff3d0" stroke-width="1.500"/></pattern>',
};

/** Escudo completo con una figura en el centro. `caja` permite agregar yelmo, hojas y cinta alrededor. */
export function escudo(color: string, trama: string, figura: string, { caja = '0 0 200 240', detras = '', delante = '' } = {}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${caja}"><defs>${TRAMAS[trama] ?? TRAMAS.plata}<clipPath id="c"><path d="${ESCUDO}"/></clipPath><radialGradient id="s" cx=".5" cy=".42" r=".75"><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>${detras}<path d="${ESCUDO}" fill="${color}"/><g clip-path="url(#c)"><path d="${ESCUDO}" fill="url(#t)" opacity=".17"/><path d="${ESCUDO}" fill="url(#s)"/>${figura}</g><path d="${FILETE}" fill="none" stroke="#f1e4c6" stroke-width="1.600" opacity=".4"/><path d="${ESCUDO}" fill="none" stroke="${G}" stroke-width="6"/><path d="${ESCUDO}" fill="none" stroke="${K}" stroke-width="1.200" opacity=".55"/>${delante}</svg>`;
}
