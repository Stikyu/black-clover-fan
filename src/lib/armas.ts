import { getCollection, type CollectionEntry } from 'astro:content';
import { REINO_ARMAS, REINO_NOMBRE } from './rutas';

export type Personaje = CollectionEntry<'personajes'>;
export type Escuadron = CollectionEntry<'escuadrones'>;

const escuadrones = await getCollection('escuadrones');

export const escuadronDe = (p: Personaje): Escuadron | undefined => escuadrones.find((e) => e.id === p.data.escuadron?.id);

/** Color, trama y afiliación visible de un personaje. */
export function armas(p: Personaje) {
  const e = escuadronDe(p);
  const base = e ? { color: e.data.color, trama: e.data.trama, emblema: e.data.emblema } : REINO_ARMAS[p.data.reino];
  return { ...base, afiliacion: e ? e.data.nombre : (p.data.afiliacion ?? REINO_NOMBRE[p.data.reino]) };
}
