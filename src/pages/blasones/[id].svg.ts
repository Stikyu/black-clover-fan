import type { APIRoute } from 'astro';
import { todosLosEscuadrones } from '@/lib/orden';
import { blason, armasCompletas } from '@/lib/blasones';

/** Dos dibujos por escuadrón: el escudo solo y las armas completas. */
export const getStaticPaths = async () =>
  (await todosLosEscuadrones()).flatMap((e) => [
    { params: { id: e.id }, props: { e, completas: false } },
    { params: { id: `${e.id}-armas` }, props: { e, completas: true } },
  ]);

export const GET: APIRoute = ({ props }) => {
  const { emblema, color, trama } = props.e.data;
  return new Response((props.completas ? armasCompletas : blason)(emblema, color, trama), { headers: { 'Content-Type': 'image/svg+xml' } });
};
