/**
 * Estado de la franquicia. Todo sale de src/data/anime.json y src/data/manga.json:
 * para actualizar el sitio cuando se emite un episodio alcanza con editar anime.json.
 */
import { z } from 'astro/zod';
import animeCrudo from '@/data/anime.json';
import mangaCrudo from '@/data/manga.json';

const rango = z.tuple([z.number().int(), z.number().int()]);
const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const esquemaAnime = z
  .object({
    actualizado: fecha,
    ultimoEmitido: z.number().int(),
    capituloFinT1: z.number().int(),
    horaArgentina: z.string(),
    estreno: z.object({ horaUTC: z.string().regex(/^\d{2}:\d{2}$/), aclaracion: z.string() }),
    episodios: z.array(
      z.object({
        numero: z.number().int(),
        enTemporada: z.number().int(),
        titulo: z.string().nullable(),
        fecha,
        capitulos: rango.nullable(),
        nota: z.string().optional(),
      }),
    ),
  })
  .superRefine((d, ctx) => {
    const ultimo = d.episodios.find((e) => e.numero === d.ultimoEmitido);
    if (!ultimo) ctx.addIssue({ code: 'custom', message: `ultimoEmitido (${d.ultimoEmitido}) no está en la lista de episodios` });
    for (const e of d.episodios) {
      if (e.numero <= d.ultimoEmitido && (!e.titulo || !e.capitulos))
        ctx.addIssue({ code: 'custom', message: `El episodio ${e.numero} figura como emitido: completá "titulo" y "capitulos"` });
    }
  });

const esquemaManga = z.object({
  estado: z.string(),
  ultimoCapitulo: z.number().int(),
  fechaFinal: fecha,
  revistaFinal: z.string(),
  tomos: z.number().int(),
  fechaTomoFinal: fecha,
  edicionArgentina: z.object({ editorial: z.string(), ultimoTomo: z.number(), proximoTomo: z.number().nullable(), fechaProximo: fecha.nullable(), verificado: fecha, url: z.url() }),
  edicionEspana: z.object({ editorial: z.string(), ultimoTomo: z.number(), proximoTomo: z.number().nullable(), fechaProximo: fecha.nullable(), verificado: fecha, url: z.url() }),
  rangosTomos: z.array(rango),
});

export const anime = esquemaAnime.parse(animeCrudo);
export const manga = esquemaManga.parse(mangaCrudo);

export type Episodio = (typeof anime.episodios)[number];

export const emitidos = anime.episodios.filter((e) => e.numero <= anime.ultimoEmitido);
export const ultimo = emitidos[emitidos.length - 1];
export const proximo = anime.episodios.find((e) => e.numero > anime.ultimoEmitido) ?? null;

/** Último capítulo del manga que ya se vio animado. */
export const capituloAnimado = ultimo.capitulos![1];

/** Tomo japonés que contiene un capítulo (la numeración argentina coincide). */
export function tomoDe(capitulo: number): number {
  const i = manga.rangosTomos.findIndex(([a, b]) => capitulo >= a && capitulo <= b);
  return i + 1;
}

/** Capítulo por el que conviene seguir leyendo después de un episodio de la T2. */
export function seguirDespuesDe(numero: number): { capitulo: number; tomo: number } {
  const capitulo = numero <= 170 ? anime.capituloFinT1 : anime.episodios.find((e) => e.numero === numero)!.capitulos![1] + 1;
  return { capitulo, tomo: tomoDe(capitulo) };
}

/** Momento exacto de salida de un episodio en formato ISO (UTC). */
export const salidaISO = (e: Episodio) => `${e.fecha}T${anime.estreno.horaUTC}:00Z`;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function fechaLarga(iso: string, precision: 'dia' | 'mes' | 'anio' = 'dia'): string {
  const [a, m, d] = iso.split('-').map(Number);
  if (precision === 'anio') return String(a);
  if (precision === 'mes') return `${MESES[m - 1]} de ${a}`;
  return `${d === 1 ? '1.º' : d} de ${MESES[m - 1]} de ${a}`;
}

export function fechaCorta(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d}/${m}/${a}`;
}
