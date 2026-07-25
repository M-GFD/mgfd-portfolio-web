/** Constantes compartidas del viaje en profundidad (scroll + navegación). */

export const DEPTH_EMERGE_END = 0.72;
export const DEPTH_HOLD_END = 0.8;
export const DEPTH_UNITS_PER_SECTION = 1;
export const DEPTH_SCROLL_VH_PER_UNIT = 1.15;

/** Nav/CTA: sin hold al 100%; scroll manual: con fijación leve. */
let depthNavScrolling = false;

export function setDepthNavScrolling(active: boolean) {
  depthNavScrolling = active;
  if (typeof document !== 'undefined') {
    const root = getDepthJourney();
    if (root) {
      if (active) root.dataset.depthNav = 'true';
      else delete root.dataset.depthNav;
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('depth-stack-nav', { detail: { active } }),
    );
  }
}

export function isDepthNavScrolling() {
  return depthNavScrolling;
}

export function depthMaxUnit(sectionCount: number): number {
  return (
    Math.max(sectionCount - 1, 0) * DEPTH_UNITS_PER_SECTION + DEPTH_EMERGE_END
  );
}

export function getDepthJourney(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-scroll-journey]');
}

/** Desktop ancho: pila 3D. Móvil / tablet: scroll tradicional. */
export function prefersDepthStack(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 1024px)').matches;
}

export function isDepthStackActive(root?: HTMLElement | null): boolean {
  const el = root ?? getDepthJourney();
  return Boolean(
    el &&
      !el.classList.contains('depth-stack--flat') &&
      prefersDepthStack(),
  );
}

function viewHeight(): number {
  return window.visualViewport?.height || window.innerHeight || 1;
}

function getMaxScrollY(): number {
  return Math.max(
    0,
    document.documentElement.scrollHeight - viewHeight(),
  );
}

/** Índice de capa (0…n-1) para un hash (#about, #works, #contact, …). */
export function resolveDepthSectionIndex(
  hash: string,
  root: HTMLElement,
): number | null {
  const id = hash.replace(/^#/, '');
  if (!id) return 0;

  const count = Number(root.dataset.depthCount || 0);
  // Contacto es el footer fijo: no forma parte del recorrido de la pila.
  if (id === 'contact') return null;

  if (id === 'hero' || id === 'top') return 0;

  const layers = root.querySelectorAll<HTMLElement>('[data-depth-panel]');
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].querySelector(`#${CSS.escape(id)}`)) return i;
  }

  return null;
}

/** Unidad de progreso donde la sección está 100% emergida (en reposo). */
export function unitForSectionIndex(index: number, count: number): number {
  const max = depthMaxUnit(count);
  if (index <= 0) return Math.min(DEPTH_EMERGE_END, max);
  return Math.min(index * DEPTH_UNITS_PER_SECTION + DEPTH_EMERGE_END, max);
}

export function scrollYForDepthUnit(
  root: HTMLElement,
  unit: number,
  count: number,
): number {
  const viewH = viewHeight();
  const scrollable = Math.max(root.offsetHeight - viewH, 1);
  const max = depthMaxUnit(count);
  const p = max > 0 ? Math.min(1, Math.max(0, unit / max)) : 0;
  const rootTop = root.getBoundingClientRect().top + window.scrollY;
  return Math.min(Math.max(0, rootTop + p * scrollable), getMaxScrollY());
}

/**
 * Calcula el scrollY del documento para mostrar la sección del hash
 * emergida al 100% dentro de la pila. null si no hay journey activo.
 */
export function getDepthStackTargetY(hash: string): number | null {
  const root = getDepthJourney();
  if (!isDepthStackActive(root) || !root) return null;

  const count = Number(root.dataset.depthCount || 0);
  if (count < 1) return null;

  // Asegura layout (altura) aplicado por el journey.
  if (root.offsetHeight < viewHeight() + 8) return null;

  const index = resolveDepthSectionIndex(hash, root);
  if (index == null) return null;

  const unit = unitForSectionIndex(index, count);
  return scrollYForDepthUnit(root, unit, count);
}
