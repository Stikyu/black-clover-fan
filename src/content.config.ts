import { defineCollection, reference } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const revelacion = z.object({ capitulo: z.number().int().min(1).max(392), texto: z.string().min(5) });
const rango = z.tuple([z.number().int(), z.number().int().nullable()]);

export const REINOS = ['clover', 'diamond', 'heart', 'spade', 'sol', 'elfos', 'inframundo'] as const;

const personajes = defineCollection({
  loader: file('src/data/personajes.json'),
  schema: z.object({
    nombre: z.string(),
    reino: z.enum(REINOS),
    escuadron: reference('escuadrones').nullable(),
    afiliacion: z.string().optional(),
    rol: z.string(),
    magia: z.string(),
    glifo: z.string(),
    grimorio: z.string(),
    /** Capítulo de la primera aparición: si es posterior a lo que vio quien lee, la ficha entera va sellada. */
    debut: z.number().int(),
    texto: z.string(),
    revelaciones: z.array(revelacion),
  }),
});

const escuadrones = defineCollection({
  loader: file('src/data/escuadrones.json'),
  schema: z.object({
    nombre: z.string(),
    original: z.string(),
    color: z.string().regex(/^#[0-9a-f]{6}$/),
    trama: z.string(),
    emblema: z.string(),
    capitan: reference('personajes'),
    vice: reference('personajes').nullable(),
    lema: z.string(),
    texto: z.string(),
    integrantes: z.array(reference('personajes')),
    cambios: z.array(revelacion),
  }),
});

const arcos = defineCollection({
  loader: file('src/data/arcos.json'),
  schema: z.object({
    orden: z.number().int(),
    nombre: z.string(),
    capitulos: rango.nullable(),
    episodios: rango.nullable(),
    partes: z.array(revelacion),
  }),
});

const reyes = defineCollection({
  loader: file('src/data/reyes-magos.json'),
  schema: z.object({ orden: z.string(), nombre: z.string(), magia: z.string(), capitulo: z.number().int(), texto: z.string() }),
});

const linea = defineCollection({
  loader: file('src/data/linea-de-tiempo.json'),
  schema: z.object({
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    precision: z.enum(['dia', 'mes', 'anio']).default('dia'),
    tipo: z.enum(['manga', 'anime', 'pelicula', 'juego', 'novela', 'teatro', 'anuncio']),
    titulo: z.string(),
    texto: z.string(),
  }),
});

export const collections = { personajes, escuadrones, arcos, reyes, linea };
