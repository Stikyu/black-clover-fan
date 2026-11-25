/**
 * Niveles de spoiler. Cada dato sensible guarda el capítulo del manga en el que se revela
 * y el nivel se calcula solo: cuando la T2 avanza, lo que era "spoiler del manga" pasa a ser
 * "spoiler de la T2" sin tocar las fichas.
 */
import { anime, capituloAnimado } from './estado';

export type Nivel = 0 | 1 | 2;

export const NIVELES: { valor: Nivel; nombre: string; corto: string; detalle: string }[] = [
  { valor: 0, nombre: 'Vi el anime T1', corto: 'Vi la T1', detalle: 'Muestra lo que pasa hasta el episodio 170. Es el nivel inicial.' },
  { valor: 1, nombre: 'Voy al día con la T2', corto: 'Al día con la T2', detalle: `Suma lo que ya se emitió, hasta el episodio ${anime.ultimoEmitido}.` },
  { valor: 2, nombre: 'Leí el manga completo', corto: 'Leí el manga', detalle: 'Muestra todo, incluido el final en el capítulo 392.' },
];

export function nivelDeCapitulo(capitulo: number): Nivel {
  if (capitulo <= anime.capituloFinT1) return 0;
  if (capitulo <= capituloAnimado) return 1;
  return 2;
}

export const ETIQUETA: Record<Nivel, string> = {
  0: 'Temporada 1',
  1: 'Spoiler de la T2',
  2: 'Spoiler del manga',
};

export const CLAVE_NIVEL = 'bc-nivel';
export const CLAVE_TEMA = 'bc-tema';
