/**
 * Cambia la placa por el reproductor oficial cuando alguien hace clic.
 * Si después se baja el nivel de spoilers y el video queda tapado, se descarga el reproductor.
 */
const placas = new Map<HTMLElement, HTMLAnchorElement>();

document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-video]');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  const caja = a.parentElement!;
  const marco = document.createElement('iframe');
  marco.src = `https://www.youtube-nocookie.com/embed/${a.dataset.video}?autoplay=1&rel=0&hl=es-419`;
  marco.title = a.dataset.titulo ?? 'Video oficial';
  marco.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
  marco.allowFullscreen = true;
  marco.referrerPolicy = 'strict-origin-when-cross-origin';
  placas.set(caja, a);
  a.replaceWith(marco);
  marco.focus();
});

function cerrarTapados() {
  for (const [caja, a] of placas) {
    if (!caja.closest('[inert]')) continue;
    caja.querySelector('iframe')?.replaceWith(a);
    placas.delete(caja);
  }
}
document.addEventListener('bc:nivel', cerrarTapados);
