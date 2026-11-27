import type Lenis from 'lenis';

/** Scroll suave solo con mouse/trackpad y sin reduced-motion; táctil queda nativo. */
export function shouldUseSmoothScroll(env: {
  finePointer: boolean;
  reducedMotion: boolean;
}): boolean {
  return env.finePointer && !env.reducedMotion;
}

let lenis: Lenis | null = null;

/** Registrado por `<SmoothScroll />` mientras Lenis está activo. */
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Resolvedores de destino por hash (p. ej. #works → reposo del primer proyecto). */
const hashTargets = new Map<string, () => number | null>();

export function registerHashTarget(hash: string, resolve: () => number | null) {
  hashTargets.set(hash, resolve);
  return () => {
    if (hashTargets.get(hash) === resolve) hashTargets.delete(hash);
  };
}

export function headerOffset(): number {
  const header = document.querySelector('header');
  return header ? header.getBoundingClientRect().height : 0;
}

/** Lleva a la sección del hash con Lenis si está activo; si no, scroll nativo suave. */
export function scrollToHash(hash: string, opts: { offset?: number } = {}): void {
  if (!hash.startsWith('#')) return;
  const custom = hashTargets.get(hash)?.();
  let y: number | null = custom ?? null;
  if (y == null) {
    const el = hash === '#' ? document.body : document.getElementById(hash.slice(1));
    if (!el) return;
    const offset = opts.offset ?? headerOffset();
    y = el.getBoundingClientRect().top + window.scrollY - offset;
  }
  y = Math.max(0, y);
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.4 });
  } else {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }
  if (window.location.hash !== hash) history.replaceState(null, '', hash);
}
