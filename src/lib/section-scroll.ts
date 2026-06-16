export const SECTION_SELECTOR = '.snap-section';

const DEFAULT_DURATION_MS = 1100;
const SNAP_DURATION_MS = 780;
const EDGE_THRESHOLD_PX = 12;
const WHEEL_ACCUM_THRESHOLD = 36;

let animating = false;
let scrollIntentAccum = 0;
let scrollIntentResetTimer: ReturnType<typeof setTimeout> | null = null;

function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
}

/** Dispositivos táctiles: scroll-snap nativo del navegador (cross-browser). */
export function usesNativeSectionSnap(): boolean {
  if (typeof window === 'undefined') return false;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return false;
  }

  return (
    window.matchMedia('(hover: none), (pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

/** Desktop con ratón: animación JS entre secciones. */
export function usesAnimatedSectionScroll(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
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

export function getSectionTargetY(section: Element): number {
  const headerH = getHeaderOffset();
  const top = section.getBoundingClientRect().top + window.scrollY;
  const maxY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(Math.max(0, top - headerH), maxY);
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
      const eased = easeInOutQuint(t);
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

  await scrollToSectionElement(section);
  history.replaceState(null, '', hash);
}

function isGateOpen(): boolean {
  return document.querySelector('[data-experience-gate]') != null;
}

/** Debajo de la última sección con snap (p. ej. footer libre). */
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
  if (animating || isGateOpen() || usesNativeSectionSnap()) return false;

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
    const distFromTop = Math.abs(window.scrollY - targetTop);
    const sectionBottom = section.offsetTop + section.offsetHeight;
    const distFromBottom = Math.abs(
      window.scrollY + window.innerHeight - sectionBottom,
    );

    if (distFromTop > 72 && distFromBottom > 72) return;

    if (distFromTop <= distFromBottom) {
      await animateScrollTo(targetTop, SNAP_DURATION_MS);
    }
    return;
  }

  if (Math.abs(window.scrollY - targetTop) > 28) {
    await animateScrollTo(targetTop, SNAP_DURATION_MS);
  }
}
