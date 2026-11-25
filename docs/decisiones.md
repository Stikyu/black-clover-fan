# Decisiones

Las que no venían cerradas en el pedido, con su motivo.

## Spoilers

- **El nivel se calcula por capítulo.** Cada dato guarda el capítulo en el que se revela y `src/lib/spoilers.ts` lo compara con el último capítulo animado. Cuando la T2 avanza, lo que era "spoiler del manga" baja solo a "spoiler de la T2".
- **El nivel más bajo da por vista la T1.** El pedido define tres niveles y ninguno es "no vi nada". La portada es segura para cualquiera; las demás páginas asumen los 170 episodios.
- **Tapado también para el teclado y el lector de pantalla.** El contenido borroso queda `inert`, así que no se encuentra con Ctrl+F ni se lee en voz alta.
- **Un personaje que debuta más adelante no aparece en el buscador.** Encontrarlo por nombre ya sería un spoiler. Su página lleva un título neutro, `noindex` y queda fuera del sitemap.
- **Los títulos de los episodios de la T2 se tapan en el nivel más bajo.** Varios cuentan lo que pasa.
- **El episodio 179 no cuenta como emitido**, aunque se filtró el 21 de noviembre. Manda la fecha oficial.

## Contenido

- **Los lemas de los escuadrones son propios** y la página lo dice: no existe un lema oficial para cada uno.
- **Nombres en español rioplatense, reinos sin traducir** (Clover, Spade, Heart, Diamond), como en el pedido.
- **El arco de entrenamiento en Heart va aparte** porque casi todo es material del anime.

## Diseño

- **Concepto:** un códice. Grabado a buril para la portada, pergamino para los datos, lacre para los spoilers, primera letra rubricada en cada título.
- **Escudos en lugar de retratos.** Color del escuadrón más su trama según el sistema Petra Sancta, con el que los grabadores del siglo XVII indicaban los colores en blanco y negro.
- **Tipografías argentinas:** Grenze Gotisch (Omnibus-Type) y Alegreya (Huerta Tipográfica).
- **Oscuro por defecto, con tema pergamino opcional.**
- **Skill design-taste-frontend:** se aplicaron su grilla, sus márgenes iguales, la entrada única del hero, un momento de scroll (letras que se arman), la capa de hover, las reglas de texto y sus controles. Donde chocaba con el pedido ganó el pedido: no hay fotografías (la skill las pide y el pedido exige dibujo propio) y la tipografía y la paleta no se sortearon. La regla de "una sección por pantalla" vale para la portada; las páginas de consulta tienen el largo de su contenido. `public/assets` son los archivos de movimiento de la skill, sin modificar.

## Técnica

- **Astro sin React.** Filtros, quiz, guía y spoilers son scripts chicos sin dependencias: la portada baja unos 200 KB en total.
- **Colecciones con esquema.** Si un JSON queda mal, `npm run build` falla con un mensaje claro y el deploy no sale.
- **El deploy corre las pruebas antes de publicar.**
