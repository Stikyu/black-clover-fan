/** Viñeta de cada personaje: qué motivos lleva, dónde van y cómo se describe en palabras. */
import { MOTIVOS } from './motivos';
import { escudo, g } from './tinta';

/** [motivo, x, y, escala, giro], con el centro del escudo en 0,0. */
type Pieza = [string, number, number, number?, number?];
interface Vineta { piezas: Pieza[]; texto: string }

export const VINETAS: Record<string, Vineta> = {
  asta: { piezas: [['trebol5', 0, -8, 1.15], ['espadon', 0, 4, 1.15, 18]], texto: 'una espada ancha y mellada sobre un trébol de cinco hojas' },
  yuno: { piezas: [['vientos', 0, 26, 0.95], ['trebol4', 0, -32, 0.9]], texto: 'un trébol de cuatro hojas sobre ráfagas de viento' },
  'noelle-silva': { piezas: [['ola', 0, 34, 1.05], ['lanza', 0, 0, 1.05, 24], ['tiara', -6, -50, 0.75]], texto: 'una lanza de agua entre una tiara y una ola' },
  'yami-sukehiro': { piezas: [['humo', 30, -8, 1.05], ['katana', -8, -4, 1.15]], texto: 'una katana y una columna de humo' },
  'nacht-faust': { piezas: [['luna', 0, -22, 1.1, 10], ['sombras', 0, 34, 1.05]], texto: 'cuatro sombras con cuernos bajo una luna' },
  'finral-roulacase': { piezas: [['portal', 0, -2, 1.25], ['alas', 0, 34, 0.75]], texto: 'un portal abierto con dos alas' },
  'magna-swing': { piezas: [['llama', 0, 6, 1.25], ['antiparras', 0, -44, 0.85]], texto: 'una bola de fuego bajo unos anteojos oscuros' },
  'luck-voltia': { piezas: [['rayos', 0, -10, 1.15], ['puno', 0, 34, 0.75]], texto: 'un puño entre dos rayos' },
  'gauche-adlai': { piezas: [['raiosol', 0, -12, 1.05], ['espejo', 0, 4, 1.05]], texto: 'un espejo de mano que devuelve la luz' },
  'vanessa-enoteca': { piezas: [['carrete', -26, 32, 0.8], ['copa', 34, 22, 0.8], ['gato', 0, -24, 1.1]], texto: 'un gato rojo, un carrete de hilo y una copa' },
  'charmy-pappitson': { piezas: [['cubiertos', 0, -32, 0.85], ['oveja', 0, 24, 1.15]], texto: 'una oveja de algodón con cubiertos' },
  grey: { piezas: [['humo', 34, 4, 0.95], ['mascara', -22, -14, 0.95, -10], ['mediaMascara', 16, 26, 0.85, 8]], texto: 'dos máscaras distintas envueltas en humo' },
  'gordon-agrippa': { piezas: [['frasco', 0, 18, 1.15], ['calavera', 0, -42, 0.7]], texto: 'un frasco de veneno con una calavera' },
  'zora-ideale': { piezas: [['ceniza', 0, -16, 1.05], ['mascaraDientes', 0, 34, 0.95]], texto: 'una máscara de dientes frente a un monte de ceniza' },
  'henry-legolant': { piezas: [['casa', 0, 4, 1.25]], texto: 'una casa torcida con ventanas encendidas' },
  'secre-swallowtail': { piezas: [['candado', 0, 26, 0.95], ['ave', 0, -34, 0.95]], texto: 'un pájaro oscuro posado sobre un candado' },
  'william-vangeance': { piezas: [['arbol', 0, 10, 1.2], ['mediaMascara', 0, 14, 0.62]], texto: 'un árbol enorme y una máscara emplumada' },
  'langris-vaude': { piezas: [['esfera', -8, -16, 1.15], ['esfera', 34, 42, 0.5, 60]], texto: 'una esfera que borra lo que toca' },
  'mimosa-vermillion': { piezas: [['hoja', -36, 22, 0.8, -42], ['hoja', 36, 22, 0.8, 42], ['flor', 0, -10, 1.15]], texto: 'una flor abierta entre dos hojas' },
  'klaus-lunettes': { piezas: [['jabalina', -24, 0, 1, -24], ['jabalina', 24, 0, 1, 24], ['anteojos', 0, 4, 0.95]], texto: 'unos anteojos delante de dos lanzas de acero' },
  'alecdora-sandler': { piezas: [['arena', 0, 0, 1.15]], texto: 'un reloj de arena' },
  'fuegoleon-vermillion': { piezas: [['llama', 0, -22, 1.15], ['puno', 0, 34, 0.9]], texto: 'un puño del que nace una llama' },
  'mereoleona-vermillion': { piezas: [['llama', -34, -16, 0.8, -14], ['llama', 34, -16, 0.8, 14], ['zarpa', 0, 18, 1.15]], texto: 'una zarpa entre dos llamas' },
  'leopold-vermillion': { piezas: [['llama', -34, 22, 0.75, -10], ['llama', 34, 22, 0.75, 10], ['llama', 0, -18, 1]], texto: 'tres llamas en triángulo' },
  'randall-luftair': { piezas: [['vientos', 0, -20, 0.95], ['espada', 0, 10, 0.95, 90]], texto: 'una espada bajo corrientes de aire' },
  'nozel-silva': { piezas: [['alas', 0, -30, 1], ['mercurio', 0, 24, 1.05]], texto: 'gotas de mercurio con alas' },
  'nebra-silva': { piezas: [['nubes', 0, 34, 1.05], ['abanico', 0, -22, 1.05]], texto: 'un abanico sobre la niebla' },
  'solid-silva': { piezas: [['serpiente', 0, 0, 1.2]], texto: 'una serpiente de agua' },
  'charlotte-roselei': { piezas: [['estoque', 0, 14, 1.15, 0], ['espinas', 0, 22, 1], ['rosa', 0, -30, 0.85]], texto: 'una rosa azul, zarzas y un estoque' },
  'sol-marron': { piezas: [['golem', 0, 0, 1.25]], texto: 'un gigante de tierra' },
  'jack-el-destripador': { piezas: [['hoces', 0, 4, 1.1]], texto: 'dos hoces cruzadas' },
  'sekke-bronzazza': { piezas: [['bola', 0, 8, 1.15], ['destello', 34, -38, 0.55]], texto: 'una rodela de bronce demasiado lustrada' },
  'en-ringard': { piezas: [['hongos', 0, 2, 1.25]], texto: 'un hongo grande y otro chico' },
  'kaiser-granvorka': { piezas: [['vortice', -8, -2, 1.25]], texto: 'un remolino' },
  'xerx-lugner': { piezas: [['hielo', 0, 8, 1.15], ['mascara', 0, -40, 0.55]], texto: 'cristales de hielo y una máscara' },
  'gueldre-poizot': { piezas: [['bolsaVelada', 0, -38, 0.75], ['monedas', 0, 24, 0.95]], texto: 'una bolsa de monedas y un ojo tachado' },
  'revchi-salik': { piezas: [['cadena', -8, -4, 1.05, 38], ['cadena', 8, -4, 1.05, -38]], texto: 'dos cadenas cruzadas' },
  'rill-boismortier': { piezas: [['pincel', 26, -10, 1.15, 32], ['paleta', -8, 14, 1.1]], texto: 'una paleta y un pincel' },
  'fragil-tormenta': { piezas: [['copo', 0, -8, 1.25], ['nubes', 0, 52, 0.75]], texto: 'un copo de nieve sobre una nube' },
  'dorothy-unsworth': { piezas: [['nubes', 0, 44, 0.95], ['luna', 34, -26, 0.75], ['sombrero', -8, -8, 1.05]], texto: 'un sombrero de bruja, una luna y una nube' },
  'kirsch-vermillion': { piezas: [['cerezo', -24, 30, 0.85, 12], ['cerezo', 34, 38, 0.6, -20], ['espejo', 16, -16, 0.95, 18], ['cerezo', -38, -34, 0.55]], texto: 'flores de cerezo y un espejo' },
  'julius-novachrono': { piezas: [['paginas', 0, 12, 1.15], ['reloj', 0, -8, 0.95]], texto: 'un reloj entre páginas sueltas' },
  'marx-francois': { piezas: [['orbe', 0, 2, 1.25]], texto: 'una esfera de comunicación' },
  'damnatio-kira': { piezas: [['balanza', 0, 2, 1.05]], texto: 'una balanza' },
  'hermana-lily': { piezas: [['velo', 0, -14, 1.05], ['gota', 0, 46, 0.6]], texto: 'un velo de monja y una gota de agua' },
  'reina-bruja': { piezas: [['gotaRoja', 0, 24, 1], ['corona', 0, -34, 0.95]], texto: 'una corona sobre una gota de sangre' },
  lumiere: { piezas: [['luzDos', 0, -12, 1.05], ['espada', 0, 6, 1]], texto: 'una espada delante de una luz de ocho puntas' },
  'fanzell-kruger': { piezas: [['viento', -30, 26, 1], ['espada', 6, -2, 1.15, 28]], texto: 'una espada y una espiral de viento' },
  mars: { piezas: [['cristal', 0, 4, 1.2], ['llama', 0, 40, 0.5]], texto: 'cristales con una llama al pie' },
  'lotus-whomalt': { piezas: [['humo', -26, -2, 1.1], ['humo', 24, 4, 1.1, 180]], texto: 'dos columnas de humo' },
  ladros: { piezas: [['haz', 0, 0, 1.15]], texto: 'un núcleo oscuro que absorbe dos haces' },
  lolopechka: { piezas: [['gota', -34, 28, 0.6], ['gota', 34, 28, 0.6], ['corazon', 0, 8, 0.95], ['anteojos', 0, -34, 0.8]], texto: 'un corazón, unos anteojos y dos gotas' },
  gadjah: { piezas: [['corazon', 0, 6, 1.05], ['rayo', 0, 0, 1.05]], texto: 'un rayo sobre un corazón' },
  'dante-zogratis': { piezas: [['gravedad', 0, 0, 1.2]], texto: 'una esfera negra que arrastra piedras' },
  'vanica-zogratis': { piezas: [['garra', 0, -12, 1.05], ['gotaRoja', 0, 46, 0.6], ['gotaRoja', -38, 34, 0.4], ['gotaRoja', 38, 34, 0.4]], texto: 'tres garras y gotas de sangre' },
  'zenon-zogratis': { piezas: [['hueso', 0, 8, 1.15], ['calavera', 0, -22, 0.75]], texto: 'huesos cruzados y una calavera' },
  'lucius-zogratis': { piezas: [['reloj', 0, 20, 0.85], ['almas', -32, -18, 0.75, -10], ['almas', 32, -18, 0.75, 10], ['halo', 0, -4, 0.8]], texto: 'dos almas, un halo y un reloj' },
  'ryuya-ryudo': { piezas: [['sol', 0, -26, 0.95], ['ojo', 0, 34, 0.95]], texto: 'un ojo abierto bajo un sol rojo' },
  'ichika-yami': { piezas: [['sol', 24, -28, 0.85], ['katana', -8, 2, 1.15]], texto: 'una katana delante de un sol' },
  licht: { piezas: [['trebol4', 0, -26, 0.85], ['espada', -4, 8, 1.05, 34], ['espada', 4, 8, 1.05, -34]], texto: 'dos espadas cruzadas bajo un trébol de cuatro hojas' },
  patry: { piezas: [['espadaLuz', 0, -4, 1.15], ['espadaLuz', -36, 18, 0.7, -18], ['espadaLuz', 36, 18, 0.7, 18]], texto: 'tres espadas de luz' },
  rhya: { piezas: [['cartas', 0, 0, 1.25]], texto: 'tres cartas iguales con marcos distintos' },
  vetto: { piezas: [['cuernos', 0, -24, 0.9], ['zarpa', 0, 28, 1]], texto: 'una zarpa y dos cuernos' },
  fana: { piezas: [['llama', 0, 0, 1.4], ['lagarto', 0, 4, 0.95]], texto: 'una salamandra dentro de una llama' },
  liebe: { piezas: [['cuernos', 0, -36, 0.75], ['trebol5', 0, 8, 0.8], ['grilletes', 0, 48, 0.75]], texto: 'un trébol de cinco hojas, cuernos y un grillete roto' },
  zagred: { piezas: [['cuernos', 0, -34, 0.95], ['boca', 0, 24, 1.05]], texto: 'una boca con colmillos y cuernos' },
  lucifero: { piezas: [['gravedad', 0, 22, 0.85], ['corona', 0, -38, 0.85]], texto: 'una corona sobre una esfera negra' },
  megicula: { piezas: [['florOro', 0, 34, 0.85], ['ojoEspiral', 0, -26, 1]], texto: 'un ojo en espiral sobre una flor' },
  beelzebub: { piezas: [['portal', 0, 4, 1.1], ['mosca', 0, 0, 0.95]], texto: 'una mosca delante de un portal' },
  'lilith-nahamah': { piezas: [['hielo', -30, 0, 0.8], ['llama', 30, 0, 0.95], ['cuernos', 0, -44, 0.6]], texto: 'hielo y fuego unidos por dos cuernos' },
  adrammelech: { piezas: [['luzDos', 0, -14, 1.15], ['corazon', 0, 10, 0.75]], texto: 'un corazón encendido por una luz de ocho puntas' },
};

export function dibujarVineta(id: string, color: string, trama: string): string {
  const v = VINETAS[id];
  if (!v) throw new Error(`Falta la viñeta de "${id}" en src/lib/vinetas.ts`);
  const figura = v.piezas
    .map(([m, x, y, e = 1, giro = 0]) => {
      if (!MOTIVOS[m]) throw new Error(`La viñeta de "${id}" usa un motivo que no existe: "${m}"`);
      return g(MOTIVOS[m], 100 + x * 1.1, 116 + y * 1.1, Math.round(e * 110) / 100, giro);
    })
    .join('');
  return escudo(color, trama, figura);
}
