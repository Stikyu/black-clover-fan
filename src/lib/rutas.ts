/** Antepone la base del sitio (en GitHub Pages, /black-clover-fan/). */
export const ruta = (r: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${r.replace(/^\//, '')}`;

export const REPO = 'https://github.com/Stikyu/black-clover-fan';

export const SECCIONES = [
  { href: 'historia/', nombre: 'Historia', glifo: 'pergamino', resumen: 'Los doce arcos en orden, con capítulos y episodios.' },
  { href: 'guia/', nombre: 'Guía', glifo: 'llave', resumen: 'Qué capítulo leer después de cada episodio.' },
  { href: 'personajes/', nombre: 'Personajes', glifo: 'ojo', resumen: 'Buscador con filtros por escuadrón, magia y reino.' },
  { href: 'escuadrones/', nombre: 'Escuadrones', glifo: 'escudo', resumen: 'Los nueve escuadrones y los Reyes Magos.' },
  { href: 'mundo/', nombre: 'Mundo', glifo: 'orbe', resumen: 'Tipos de magia, grimorios, reinos y demonios.' },
  { href: 'cronologia/', nombre: 'Cronología', glifo: 'reloj', resumen: 'Manga, anime, película y juegos desde 2015.' },
  { href: 'donde-ver/', nombre: 'Ver y leer', glifo: 'libro', resumen: 'Opciones legales en Argentina y Latinoamérica.' },
  { href: 'quiz/', nombre: 'Quiz', glifo: 'dado', resumen: 'Ocho preguntas para saber cuál es tu escuadrón.' },
];

export const REINO_NOMBRE: Record<string, string> = {
  clover: 'Clover', diamond: 'Diamond', heart: 'Heart', spade: 'Spade', sol: 'País del Sol', elfos: 'Elfos', inframundo: 'Inframundo',
};

/** Color y trama de los personajes sin escuadrón, según su reino. */
export const REINO_ARMAS: Record<string, { color: string; trama: string; emblema: string }> = {
  clover: { color: '#2c5527', trama: 'sinople', emblema: 'trebol' },
  diamond: { color: '#4b5f78', trama: 'azur', emblema: 'diamante' },
  heart: { color: '#8a3650', trama: 'gules', emblema: 'corazon' },
  spade: { color: '#33303a', trama: 'sable', emblema: 'pica' },
  sol: { color: '#9a3d22', trama: 'gules', emblema: 'sol' },
  elfos: { color: '#6b6a3a', trama: 'oro', emblema: 'luz' },
  inframundo: { color: '#401b1b', trama: 'sable', emblema: 'antimagia' },
};

export const iniciales = (nombre: string) => {
  const p = nombre.split(/\s+/).filter((x) => !['el', 'la', 'de', 'y', 'hermana'].includes(x.toLowerCase()));
  return (p[0]?.[0] ?? '') + (p[1]?.[0] ?? '');
};
