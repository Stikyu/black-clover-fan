import type { APIRoute } from 'astro';
import { paisaje, type Tema } from '@/lib/paisaje';

const ESCENAS = ['portada', 'movil', 'campo'] as const;
const TEMAS: Tema[] = ['oscuro', 'claro'];

export const getStaticPaths = () => ESCENAS.flatMap((escena) => TEMAS.map((tema) => ({ params: { nombre: `${escena}-${tema}` }, props: { escena, tema } })));

export const GET: APIRoute = ({ props }) => new Response(paisaje(props.escena, props.tema), { headers: { 'Content-Type': 'image/svg+xml' } });
