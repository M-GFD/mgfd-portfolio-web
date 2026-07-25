export const SECTION_SELECTOR = '.snap-section';

const DEFAULT_DURATION_MS = 1100;
const SNAP_DURATION_MS = 780;
const EDGE_THRESHOLD_PX = 12;
const WHEEL_ACCUM_THRESHOLD = 36;

let animating = false;
let scrollIntentAccum = 0;
let scrollIntentResetTimer: ReturnType<typeof setTimeout> | null = null;
/** Tras llegar a Herramientas, el snap queda off hasta recargar. */
let sectionSnapReleased = false;

export function isSectionSnapReleased(): boolean {
  return sectionSnapReleased;
}

function canUseSectionSnap(): boolean {
  return !sectionSnapReleased;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Snap de sección desactivado: el scroll libre nativo evita tirones
 * entre secciones y en los extremos de la página.
 */
export function usesNativeSectionSnap(): boolean {
  return false;
}

/** Animación forzada entre secciones desactivada (mismo motivo). */
export function usesAnimatedSectionScroll(): boolean {
  return false;
}

export function isSectionScrollLocked(): boolean {
  return animating;
}

export function getHeaderOffset(): number {
  const header = document.querySelector('header');
  return header?.getBoundingClientRect().height ?? 0;
}

export function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR));
}

export function getMaxScrollY(): number {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
}

export function getSectionTargetY(section: Element): number {
  const headerH = getHeaderOffset();
  const top = section.getBoundingClientRect().top + window.scrollY;
  return Math.min(Math.max(0, top - headerH), getMaxScrollY());
}

export function getSectionBottomTargetY(section: Element): number {
  const sectionBottom =
    section.getBoundingClientRect().bottom + window.scrollY;
  return Math.min(Math.max(0, sectionBottom - window.innerHeight), getMaxScrollY());
}

export function getActiveSectionIndex(sections: HTMLElement[]): number {
  if (sections.length === 0) return 0;

  const anchor = window.scrollY + getHeaderOffset() + window.innerHeight * 0.38;
  let index = 0;

  for (let i = 0; i < sections.length; i++) {
    const sectionTop =
      sections[i].getBoundingClientRect().top + window.scrollY;
    if (sectionTop <= anchor + 1) index = i;
  }

  return index;
}

function isLongSection(section: HTMLElement): boolean {
  return section.classList.contains('snap-section--long');
}

function sectionAllowsInternalScroll(section: HTMLElement): boolean {
  return isLongSection(section);
}

function atSectionTop(section: HTMLElement): boolean {
  return window.scrollY <= getSectionTargetY(section) + EDGE_THRESHOLD_PX;
}

function atSectionBottom(section: HTMLElement): boolean {
  const sectionBottom = section.offsetTop + section.offsetHeight;
  const viewBottom = window.scrollY + window.innerHeight;
  return viewBottom >= sectionBottom - EDGE_THRESHOLD_PX;
}

/** Activa scroll-snap nativo en html (dispositivos táctiles). */
export function syncNativeSectionSnap(): void {
  document.documentElement.classList.toggle(
    'section-scroll-snap',
    usesNativeSectionSnap(),
  );

  for (const section of getSections()) {
    section.classList.remove('snap-section--scrollable');
  }
}

/** Desactiva snap al cruzar Herramientas por primera vez en la sesión. */
export function checkReleaseSectionSnapOnScroll(): void {
  if (sectionSnapReleased) return;

  const technologies = document.getElementById('technologies');
  if (!technologies) return;

  const headerH = getHeaderOffset();
  const sectionTop =
    technologies.getBoundingClientRect().top + window.scrollY;

  if (window.scrollY + headerH >= sectionTop - EDGE_THRESHOLD_PX) {
    sectionSnapReleased = true;
    document.documentElement.classList.remove('section-scroll-snap');
  }
}

export function animateScrollTo(
  targetY: number,
  durationMs = DEFAULT_DURATION_MS,
): Promise<void> {
  if (animating) return Promise.resolve();

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 1.5 || reducedMotion) {
    window.scrollTo(0, targetY);
    return Promise.resolve();
  }

  animating = true;

  return new Promise((resolve) => {
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      window.scrollTo(0, startY + distance * eased);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        animating = false;
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

export async function scrollToSectionElement(section: Element): Promise<void> {
  if (usesNativeSectionSnap()) {
    (section as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    return;
  }

  await animateScrollTo(getSectionTargetY(section));
}

export async function scrollToSectionByHash(hash: string): Promise<void> {
  const section = document.querySelector(hash);
  if (!section) {
    history.replaceState(null, '', hash);
    return;
  }

  if (hash === '#contact') {
    if (usesNativeSectionSnap()) {
      section.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      await animateScrollTo(getSectionBottomTargetY(section));
    }
  } else {
    await scrollToSectionElement(section);
  }

  history.replaceState(null, '', hash);
}

function isGateOpen(): boolean {
  return document.querySelector('[data-experience-gate]') != null;
}

/** Debajo de la última sección con snap (Trabajos en adelante: scroll libre). */
function isPastLastSnapSection(): boolean {
  const sections = getSections();
  if (!sections.length) return false;
  const last = sections[sections.length - 1];
  const lastBottom = last.offsetTop + last.offsetHeight;
  return window.scrollY + getHeaderOffset() > lastBottom - EDGE_THRESHOLD_PX;
}

function shouldAllowNativeScroll(
  section: HTMLElement,
  direction: 1 | -1,
): boolean {
  if (!sectionAllowsInternalScroll(section)) return false;
  if (direction > 0) return !atSectionBottom(section);
  return !atSectionTop(section);
}

export async function navigateSection(direction: 1 | -1): Promise<boolean> {
  if (
    animating ||
    isGateOpen() ||
    isSectionSnapReleased() ||
    usesNativeSectionSnap()
  ) {
    return false;
  }

  const sections = getSections();
  if (sections.length === 0) return false;

  const index = getActiveSectionIndex(sections);
  const current = sections[index];

  if (shouldAllowNativeScroll(current, direction)) {
    return false;
  }

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= sections.length) return false;

  await scrollToSectionElement(sections[nextIndex]);
  return true;
}

function resetScrollIntentAccum() {
  scrollIntentAccum = 0;
  if (scrollIntentResetTimer) {
    clearTimeout(scrollIntentResetTimer);
    scrollIntentResetTimer = null;
  }
}

export function handleWheelIntent(deltaY: number): boolean {
  if (
    animating ||
    isGateOpen() ||
    isSectionSnapReleased() ||
    isPastLastSnapSection() ||
    usesNativeSectionSnap()
  ) {
    return false;
  }

  scrollIntentAccum += deltaY;
  if (scrollIntentResetTimer) clearTimeout(scrollIntentResetTimer);
  scrollIntentResetTimer = setTimeout(resetScrollIntentAccum, 120);

  if (Math.abs(scrollIntentAccum) < WHEEL_ACCUM_THRESHOLD) return false;

  const direction: 1 | -1 = scrollIntentAccum > 0 ? 1 : -1;
  resetScrollIntentAccum();

  const sections = getSections();
  if (sections.length === 0) return false;

  const index = getActiveSectionIndex(sections);
  const current = sections[index];

  if (shouldAllowNativeScroll(current, direction)) {
    return false;
  }

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= sections.length) return false;

  void navigateSection(direction);
  return true;
}

export async function snapToNearestSection(): Promise<void> {
  if (
    animating ||
    isGateOpen() ||
    isSectionSnapReleased() ||
    isPastLastSnapSection() ||
    usesNativeSectionSnap()
  ) {
    return;
  }

  const sections = getSections();
  if (sections.length === 0) return;

  const index = getActiveSectionIndex(sections);
  const section = sections[index];
  const targetTop = getSectionTargetY(section);

  if (sectionAllowsInternalScroll(section)) {
    const targetBottom = getSectionBottomTargetY(section);
    const distFromTop = Math.abs(window.scrollY - targetTop);
    const distFromBottom = Math.abs(window.scrollY - targetBottom);

    if (distFromTop > 72 && distFromBottom > 72) return;

    if (distFromTop <= distFromBottom) {
      await animateScrollTo(targetTop, SNAP_DURATION_MS);
    } else {
      await animateScrollTo(targetBottom, SNAP_DURATION_MS);
    }
    return;
  }

  if (Math.abs(window.scrollY - targetTop) > 28) {
    await animateScrollTo(targetTop, SNAP_DURATION_MS);
  }
}
