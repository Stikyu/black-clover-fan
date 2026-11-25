import type { APIRoute } from 'astro';
import { todosLosPersonajes } from '@/lib/orden';
import { armas } from '@/lib/armas';
import { dibujarVineta } from '@/lib/vinetas';

export const getStaticPaths = async () => (await todosLosPersonajes()).map((p) => ({ params: { id: p.id }, props: { p } }));

export const GET: APIRoute = ({ props }) => {
  const a = armas(props.p);
  return new Response(dibujarVineta(props.p.id, a.color, a.trama), { headers: { 'Content-Type': 'image/svg+xml' } });
};
