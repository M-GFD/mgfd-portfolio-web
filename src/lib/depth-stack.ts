/** Constantes compartidas del viaje en profundidad (scroll + navegación). */

export const DEPTH_EMERGE_END = 0.72;
export const DEPTH_HOLD_END = 0.8;
export const DEPTH_UNITS_PER_SECTION = 1;
export const DEPTH_SCROLL_VH_PER_UNIT = 1.15;

/** Nav/CTA: sin hold al 100%; scroll manual: con fijación leve. */
let depthNavScrolling = false;

type DepthNavDriver = {
  getUnit: () => number;
  setUnit: (unit: number) => void;
  getCount: () => number;
};

let depthNavDriver: DepthNavDriver | null = null;

export function registerDepthNavDriver(driver: DepthNavDriver | null) {
  depthNavDriver = driver;
}

export function setDepthNavScrolling(active: boolean) {
  depthNavScrolling = active;
  if (typeof document !== 'undefined') {
    const root = getDepthJourney();
    if (root) {
      if (active) root.dataset.depthNav = 'true';
      else delete root.dataset.depthNav;
    }
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

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Abortar intro automática del Hero (p. ej. si el usuario navega o hace scroll). */
let heroIntroAbort: (() => void) | null = null;

export function abortDepthHeroIntro() {
  heroIntroAbort?.();
  heroIntroAbort = null;
}

const HERO_INTRO_MS = 3600;

/**
 * Emersión lenta del Hero al 100% al entrar (solo pila desktop).
 * Se omite si hay hash a otra sección o reduced-motion.
 */
export async function playDepthHeroIntro(): Promise<boolean> {
  abortDepthHeroIntro();

  const root = getDepthJourney();
  if (!isDepthStackActive(root) || !root || !depthNavDriver) return false;

  const hash = window.location.hash;
  if (
    hash === '#about' ||
    hash === '#works' ||
    hash === '#technologies'
  ) {
    return false;
  }

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (reducedMotion) {
    const count = depthNavDriver.getCount();
    const target = unitForSectionIndex(0, count);
    depthNavDriver.setUnit(target);
    window.scrollTo(0, scrollYForDepthUnit(root, target, count));
    return true;
  }

  // Esperar a que cierre el Experience Gate.
  if (document.querySelector('[data-experience-gate]')) {
    await new Promise<void>((resolve) => {
      const done = () => {
        observer.disconnect();
        window.clearTimeout(timeout);
        resolve();
      };
      const observer = new MutationObserver(() => {
        if (!document.querySelector('[data-experience-gate]')) done();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = window.setTimeout(done, 12000);
    });
    await new Promise((r) => window.setTimeout(r, 200));
  }

  if (!depthNavDriver || !isDepthStackActive(root)) return false;
  if (window.scrollY > 32) return false;

  const count = depthNavDriver.getCount();
  const targetUnit = unitForSectionIndex(0, count);
  const startUnit = 0;

  depthNavDriver.setUnit(startUnit);
  window.scrollTo(0, 0);

  let cancelled = false;
  const cancel = () => {
    cancelled = true;
    setDepthNavScrolling(false);
  };
  heroIntroAbort = cancel;

  const onUserInterrupt = () => cancel();
  window.addEventListener('wheel', onUserInterrupt, { passive: true });
  window.addEventListener('touchstart', onUserInterrupt, { passive: true });
  window.addEventListener('pointerdown', onUserInterrupt, { passive: true });

  setDepthNavScrolling(true);

  await new Promise<void>((resolve) => {
    const t0 = performance.now();

    const step = (now: number) => {
      if (cancelled || !depthNavDriver) {
        resolve();
        return;
      }

      const t = Math.min(1, (now - t0) / HERO_INTRO_MS);
      const unit = startUnit + (targetUnit - startUnit) * easeInOutCubic(t);
      depthNavDriver.setUnit(unit);
      window.scrollTo(0, scrollYForDepthUnit(root, unit, count));

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        depthNavDriver.setUnit(targetUnit);
        window.scrollTo(0, scrollYForDepthUnit(root, targetUnit, count));
        resolve();
      }
    };

    requestAnimationFrame(step);
  });

  window.removeEventListener('wheel', onUserInterrupt);
  window.removeEventListener('touchstart', onUserInterrupt);
  window.removeEventListener('pointerdown', onUserInterrupt);

  if (!cancelled) setDepthNavScrolling(false);
  if (heroIntroAbort === cancel) heroIntroAbort = null;
  return !cancelled;
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

/**
 * Navegación por ancla: anima la unidad de la pila directamente (sin hold)
 * y sincroniza window.scrollY. Más fluido que scroll→progress→paint.
 */
export async function animateDepthNavToHash(
  hash: string,
  durationMs: number,
): Promise<boolean> {
  abortDepthHeroIntro();

  const root = getDepthJourney();
  if (!isDepthStackActive(root) || !root || !depthNavDriver) return false;

  const count = depthNavDriver.getCount();
  const index = resolveDepthSectionIndex(hash, root);
  if (index == null) return false;

  const targetUnit = unitForSectionIndex(index, count);
  const startUnit = depthNavDriver.getUnit();
  const distance = Math.abs(targetUnit - startUnit);

  if (distance < 0.001) {
    depthNavDriver.setUnit(targetUnit);
    window.scrollTo(0, scrollYForDepthUnit(root, targetUnit, count));
    return true;
  }

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (reducedMotion) {
    depthNavDriver.setUnit(targetUnit);
    window.scrollTo(0, scrollYForDepthUnit(root, targetUnit, count));
    return true;
  }

  setDepthNavScrolling(true);

  await new Promise<void>((resolve) => {
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      const unit = startUnit + (targetUnit - startUnit) * eased;
      depthNavDriver?.setUnit(unit);
      window.scrollTo(0, scrollYForDepthUnit(root, unit, count));

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        depthNavDriver?.setUnit(targetUnit);
        window.scrollTo(0, scrollYForDepthUnit(root, targetUnit, count));
        resolve();
      }
    };

    requestAnimationFrame(step);
  });

  setDepthNavScrolling(false);
  return true;
}
