import { getCollection } from 'astro:content';
import personajes from '@/data/personajes.json';
import escuadrones from '@/data/escuadrones.json';
import reyes from '@/data/reyes-magos.json';

/** Las colecciones salen ordenadas por id; acá vuelven al orden en que están escritas en el JSON. */
const segun = <T extends { id: string }>(lista: T[], ref: { id: string }[]) => {
  const lugar = new Map(ref.map((r, i) => [r.id, i]));
  return [...lista].sort((a, b) => lugar.get(a.id)! - lugar.get(b.id)!);
};

export const todosLosPersonajes = async () => segun(await getCollection('personajes'), personajes);
export const todosLosEscuadrones = async () => segun(await getCollection('escuadrones'), escuadrones);
export const todosLosReyes = async () => segun(await getCollection('reyes'), reyes);
