/**
 * Anti-spoilers: aplica el nivel elegido, lo guarda y abre o cierra bloques sueltos.
 * El CSS ya tapa todo por defecto; este script además deja lo tapado fuera del alcance
 * del teclado, del lector de pantalla y del buscador de la página (atributo inert).
 */
const CLAVE = 'bc-nivel';
const CLAVE_TEMA = 'bc-tema';
const html = document.documentElement;

const guardar = (clave: string, valor: string) => {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    /* navegación privada o almacenamiento bloqueado: el nivel dura lo que dura la página */
  }
};

export const nivelActual = () => Number(html.dataset.nivel ?? 0);

function aplicar() {
  const nivel = nivelActual();
  document.querySelectorAll<HTMLElement>('.spoiler[data-req]').forEach((s) => {
    const libre = Number(s.dataset.req) <= nivel || s.hasAttribute('data-abierto');
    const c = s.querySelector<HTMLElement>(':scope > .spoiler__contenido');
    if (!c) return;
    c.toggleAttribute('inert', !libre);
    if (libre) c.removeAttribute('aria-hidden');
    else c.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll<HTMLInputElement>('input[data-nivel-opcion]').forEach((i) => {
    i.checked = Number(i.value) === nivel;
  });
  document.dispatchEvent(new CustomEvent('bc:nivel', { detail: nivel }));
}

function elegir(valor: string) {
  if (!['0', '1', '2'].includes(valor)) return;
  html.dataset.nivel = valor;
  guardar(CLAVE, valor);
  document.querySelectorAll('[data-abierto]').forEach((e) => e.removeAttribute('data-abierto'));
  aplicar();
  const aviso = document.getElementById('nivel-aviso');
  const nombre = document.querySelector<HTMLInputElement>(`input[data-nivel-opcion][value="${valor}"]`)?.dataset.nombre;
  if (aviso && nombre) aviso.textContent = `Nivel de spoilers: ${nombre}.`;
}

// panel del selector
const boton = document.querySelector<HTMLButtonElement>('[data-nivel-boton]');
const panel = document.getElementById('nivel-panel');
function abrirPanel(si: boolean) {
  if (!boton || !panel) return;
  panel.hidden = !si;
  boton.setAttribute('aria-expanded', String(si));
  if (si) panel.querySelector<HTMLInputElement>('input:checked')?.focus();
}
boton?.addEventListener('click', () => abrirPanel(Boolean(panel?.hidden)));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (panel && !panel.hidden) {
    abrirPanel(false);
    boton?.focus();
  }
  const enlaces = document.querySelector('.nav__links.is-open');
  if (enlaces) menu(false);
});
document.addEventListener('pointerdown', (e) => {
  if (panel && !panel.hidden && !(e.target as HTMLElement).closest('.nivel')) abrirPanel(false);
});
panel?.addEventListener('focusout', (e) => {
  const hacia = e.relatedTarget as Node | null;
  if (hacia && !panel.contains(hacia) && hacia !== boton) abrirPanel(false);
});

document.addEventListener('change', (e) => {
  const i = e.target as HTMLInputElement;
  if (i.matches('input[data-nivel-opcion]')) elegir(i.value);
});

// abrir y cerrar un bloque
document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const abrir = t.closest('[data-abrir]');
  const cerrar = t.closest('[data-cerrar]');
  if (abrir) {
    const s = abrir.closest<HTMLElement>('.spoiler, [data-req]');
    if (!s) return;
    s.setAttribute('data-abierto', '');
    aplicar();
    const c = s.querySelector<HTMLElement>('.spoiler__contenido, a');
    if (c) {
      if (!c.matches('a')) c.tabIndex = -1;
      c.focus({ preventScroll: true });
    }
  }
  if (cerrar) {
    const s = cerrar.closest<HTMLElement>('.spoiler');
    s?.removeAttribute('data-abierto');
    aplicar();
    s?.querySelector<HTMLElement>('[data-abrir]')?.focus({ preventScroll: true });
  }
});

// menú de celular
const menuBoton = document.querySelector<HTMLButtonElement>('.nav__toggle');
function menu(si: boolean) {
  document.querySelector('.nav__links')?.classList.toggle('is-open', si);
  menuBoton?.setAttribute('aria-expanded', String(si));
  document.body.style.overflow = si ? 'hidden' : '';
  if (!si) menuBoton?.focus();
}
menuBoton?.addEventListener('click', () => menu(menuBoton.getAttribute('aria-expanded') !== 'true'));

// tema
const temaBotones = document.querySelectorAll<HTMLButtonElement>('[data-tema-boton]');
function tema(claro: boolean) {
  if (claro) html.dataset.tema = 'claro';
  else delete html.dataset.tema;
  temaBotones.forEach((b) => b.setAttribute('aria-pressed', String(claro)));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', claro ? '#e9dcbc' : '#0e0c09');
}
tema(html.dataset.tema === 'claro');
temaBotones.forEach((b) =>
  b.addEventListener('click', () => {
    const claro = html.dataset.tema !== 'claro';
    tema(claro);
    guardar(CLAVE_TEMA, claro ? 'claro' : 'oscuro');
  }),
);

aplicar();
