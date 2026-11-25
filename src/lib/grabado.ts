/**
 * Herramientas para dibujar "a buril": trazos con pulso, crestas y rayados.
 * Todo es determinista (misma semilla, mismo dibujo) y se genera al compilar.
 */
export function azar(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v: number) => Math.round(v * 10) / 10;

/** Línea con temblor de mano. */
export function trazo(x1: number, y1: number, x2: number, y2: number, r: () => number, pulso = 1.2, tramos = 4): string {
  let d = `M${n(x1)} ${n(y1)}`;
  for (let i = 1; i <= tramos; i++) {
    const t = i / tramos;
    const px = x1 + (x2 - x1) * t + (i < tramos ? (r() - 0.5) * pulso * 2 : 0);
    const py = y1 + (y2 - y1) * t + (i < tramos ? (r() - 0.5) * pulso * 2 : 0);
    d += `L${n(px)} ${n(py)}`;
  }
  return d;
}

export type Punto = [number, number];

/** Perfil de montaña por desplazamiento del punto medio. */
export function cresta(x0: number, x1: number, y: number, alto: number, r: () => number, pasos = 5): Punto[] {
  let pts: Punto[] = [[x0, y], [x1, y]];
  let amp = alto;
  for (let k = 0; k < pasos; k++) {
    const sig: Punto[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[i + 1];
      sig.push(pts[i], [(ax + bx) / 2, (ay + by) / 2 - (r() - 0.42) * amp]);
    }
    sig.push(pts[pts.length - 1]);
    pts = sig;
    amp *= 0.55;
  }
  return pts;
}

export const poligono = (pts: Punto[], piso: number) =>
  `M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L')}L${n(pts[pts.length - 1][0])} ${piso}L${n(pts[0][0])} ${piso}Z`;

/** Altura de una cresta en x. */
export function altura(pts: Punto[], x: number): number {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    if (x >= ax && x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax || 1);
  }
  return pts[pts.length - 1][1];
}

/** Rayado de ladera: trazos cortos que caen desde la cresta, más largos en la sombra. */
export function laderas(pts: Punto[], paso: number, largo: number, r: () => number): string {
  let d = '';
  const x0 = pts[0][0];
  const x1 = pts[pts.length - 1][0];
  for (let x = x0; x < x1; x += paso * (0.7 + r() * 0.6)) {
    const y = altura(pts, x);
    const baja = altura(pts, Math.min(x1, x + 8)) > y;
    const l = largo * (baja ? 1 : 0.35) * (0.5 + r() * 0.8);
    d += trazo(x, y + 2, x + l * 0.35, y + l, r, 0.8, 3);
  }
  return d;
}

/** Hoja de trébol (corazón) con la punta en el origen y apuntando hacia arriba. */
export const HOJA = 'M0 0C-10-22-46-36-42-70C-38-96-10-100 0-78C10-100 38-96 42-70C46-36 10-22 0 0Z';

/** Ángulos para un trébol de k hojas (la primera hacia arriba). */
export const angulos = (k: number) => Array.from({ length: k }, (_, i) => (360 / k) * i + (k === 4 ? 45 : 0));

/** Trenza de dos cabos para las guardas del grimorio. */
export function trenza(largo: number, amplitud: number, onda: number): [string, string] {
  const hebra = (fase: number) => {
    let d = '';
    for (let x = 0; x <= largo; x += onda / 8) d += `${d ? 'L' : 'M'}${n(x)} ${n(Math.sin((x / onda) * Math.PI * 2 + fase) * amplitud)}`;
    return d;
  };
  return [hebra(0), hebra(Math.PI)];
}
