# Rediseño del portfolio _mgfd_ — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la pila en profundidad por un sitio con scroll en X/Y. Los proyectos se muestran en escenas fijadas con mockups 3D realistas. Se suman un About editorial, ritmo y contraste premium, y un video de fondo 1080p cinematográfico.

**Architecture:**
- **Página:** documento de flujo normal con secciones `sticky`. La matemática de coreografía es pura (`scene-motion.ts`) y se testea.
- **3D:** un único `<Canvas>` de react-three-fiber con drei `View` por escena, cargado de forma diferida. Los equipos se modelan proceduralmente sobre perfiles squircle con materiales físicos e iluminación de estudio por `Lightformer`.
- **Video:** el grade se graba con ffmpeg (más Real-ESRGAN si hace falta); no se aplican efectos CSS sobre el `<video>`.

**Tech Stack:** Next.js 16 · React 19 · Tailwind v4 · three · @react-three/fiber v9 · @react-three/drei · lenis · vitest · sharp · Chrome headless · ffmpeg · realesrgan-ncnn-vulkan.

**Spec:** `docs/superpowers/specs/2026-11-26-rediseno-portfolio-design.md`

## Global Constraints

- **Rama:** todo se hace en `redesign`. No se pushea a `main` sin aprobación de Mateo.
- **Textos:** no cambia ningún texto. `src/messages/es.json` y `en.json` quedan sin diff (`git diff --exit-code src/messages`).
- **Tipografía:** no cambia; se mantienen `src/app/fonts.ts` y las familias actuales.
- **Video:** ningún `filter` ni `mix-blend-mode` sobre el `<video>` ni sobre capas encima de él.
- **Breakpoint:** escritorio es `(min-width: 1024px)`; por debajo es la versión móvil.
- **Separación entre secciones:** `clamp(120px, 18vh, 220px)`. Ancho máximo del contenido: `1240px`.
- **Escena por proyecto:**
  - Duración: `220vh` de contenedor con un viewport fijo de `100vh`.
  - Fases: entrada `0–0.35`, reposo `0.35–0.75`, salida `0.75–1`.
- **3D:**
  - `three`, `@react-three/fiber` y `@react-three/drei` no entran en el bundle inicial (import dinámico).
  - DPR `[1, 2]` en escritorio y `≤ 1.5` en móvil.
  - `frameloop="demand"`.
- **Equipos:** sin logos ni marcas en los equipos 3D.
- **Mockups:** WebP calidad 85 en `public/images/mockups/<proyecto>/`.
  - Capturas a 2× en notebook `1440×900`, tablet `834×1194` y celular `390×844`.
- **Rendimiento de scroll en escritorio:** promedio de al menos 55 fps y menos de 3 cuadros de más de 33 ms en un recorrido completo.
  - Se mide con el script rAF de la Task 8.
- **Descargas:** ffmpeg y realesrgan solo con permiso explícito de Mateo en el chat. Se guardan en `tools/` (git-ignorado).

## Review Focus

1. **Cruzar el breakpoint de 1024 px redimensionando a mitad de página.** Debe pasar de escenas fijadas a la versión apilada (o al revés) sin lienzos duplicados ni huecos, y conservar la sección visible. *(Task 6: test de `layoutModeFor`, más el chequeo manual en la Task 8.)*
2. **Navegador sin WebGL o con el contexto perdido.** Se ven composiciones estáticas con las capturas, sin pantalla negra ni errores. *(Task 5: test de `canUseWebGL`; Task 6: fallback.)*
3. **Click en "Trabajos" del header o del Hero.** Debe aterrizar en el reposo del primer proyecto, no en plena entrada. *(Task 4: test de `sceneRestScrollY`.)*
4. **Fling rápido o salto al final con End.** Cada escena queda en un estado determinista (la pose depende solo del progreso), sin equipos trabados a mitad de camino. *(Task 4: tests de clamp con progreso `< 0` y `> 1`.)*
5. **Cambiar ES/EN con una escena fijada.** Los textos cambian sin saltos de layout ni que el lienzo se reinicie. *(Task 8: chequeo manual.)*

---

### Task 1: Rama, infraestructura de tests y material de mockups

**Files:**
- Create: `scripts/mockups/capture.mjs`, `scripts/mockups/crop.mjs`
- Create: `src/data/mockup-screens.ts`, `src/data/mockup-screens.test.ts`
- Create: `vitest.config.ts`
- Create: `public/images/mockups/{vertic,feg,1190,novogas,poli}/*.webp`
- Modify: `package.json` (devDependency `vitest`; scripts `"test": "vitest run"`, `"mockups:capture"`, `"mockups:crop"`)

**Interfaces:**
- Produces:
  - `type DeviceKind = 'laptop' | 'tablet' | 'phone'`
  - `type ProjectScreens = { projectId: number; devices: Partial<Record<DeviceKind, string[]>> }`. Cada array es una lista de rutas públicas `/images/mockups/...`; la primera es la pantalla por defecto y el resto se cicla.
  - `export const mockupScreens: ProjectScreens[]`, en el orden de los proyectos: 6 (Vertic), 5 (FEG), 1 (1190), 2 (Novogas), 3 (POLI).
  - `export function screensFor(projectId: number): ProjectScreens`. Lanza un error si el id no existe.

- [ ] **Step 1: Crear la rama `redesign` desde `main` y commitear spec y plan**

Run: `git checkout -b redesign && git add docs/superpowers .gitignore && git commit -m "docs: spec y plan del rediseño"`
Expected: rama nueva con 1 commit.

- [ ] **Step 2: Instalar vitest y crear `vitest.config.ts`**

`environment: 'node'`, alias `@` → `./src`.

Run: `npm i -D vitest && npx vitest --version`
Expected: imprime la versión.

- [ ] **Step 3: Escribir el test que falla, `src/data/mockup-screens.test.ts`**

```ts
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { mockupScreens, screensFor } from './mockup-screens';

const MIN = { laptop: [1600, 1000], tablet: [900, 1300], phone: [500, 1000] } as const;

it('cubre los 5 proyectos en orden', () => {
  expect(mockupScreens.map((s) => s.projectId)).toEqual([6, 5, 1, 2, 3]);
});
it('asigna los equipos del spec', () => {
  expect(Object.keys(screensFor(6).devices).sort()).toEqual(['laptop', 'phone', 'tablet']);
  expect(Object.keys(screensFor(5).devices).sort()).toEqual(['laptop', 'phone', 'tablet']);
  expect(Object.keys(screensFor(1).devices).sort()).toEqual(['laptop', 'tablet']);
  expect(Object.keys(screensFor(2).devices).sort()).toEqual(['laptop', 'phone']);
  expect(Object.keys(screensFor(3).devices)).toEqual(['laptop']);
});
it('todas las pantallas existen en disco como webp', () => {
  for (const s of mockupScreens) for (const list of Object.values(s.devices))
    for (const src of list!) {
      expect(src).toMatch(/^\/images\/mockups\/.+\.webp$/);
      expect(existsSync(`public${src}`)).toBe(true);
    }
});
it('las capturas de Vertic y FEG tienen resolución 2x', async () => {
  for (const id of [6, 5]) for (const [kind, list] of Object.entries(screensFor(id).devices)) {
    const m = await sharp(`public${list![0]}`).metadata();
    const [w, h] = MIN[kind as keyof typeof MIN];
    expect(m.width).toBeGreaterThanOrEqual(w);
    expect(m.height).toBeGreaterThanOrEqual(h);
  }
});
it('screensFor lanza con id desconocido', () => {
  expect(() => screensFor(999)).toThrow();
});
```

- [ ] **Step 4: Correr el test y verificar que falla**

Run: `npx vitest run src/data/mockup-screens.test.ts`
Expected: FAIL (`Cannot find module './mockup-screens'`).

- [ ] **Step 5: Implementar `scripts/mockups/capture.mjs`**

- **Navegador:** usa `C:/Program Files/Google/Chrome/Application/chrome.exe` con `--headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=W,H --virtual-time-budget=8000 --screenshot=<png>`.
- **Sitios:** `https://vertictechnology.com/` y `https://feg.ar/`, en los tres tamaños de Global Constraints.
- **Conversión:** pasa el PNG a WebP q85 con sharp.
- **Salida:** `public/images/mockups/<proyecto>/<device>-01.webp`.
- **Revisión:** abre cada captura con Read. Si hay banners de cookies o pop-ups, recaptura agregando `?` o usando `--run-all-compositor-stages-before-draw`. Si persisten, documenta el caso.

- [ ] **Step 6: Implementar `scripts/mockups/crop.mjs`**

Usa sharp:
- **POLI:** recorta la pantalla de `public/images/project-03.webp`, unos `x 134–912, y 106–610` (ajustar viendo la imagen). Salida: `poli/laptop-01.webp`.
- **1190:** copia `1190_asset_01..07.webp` a `1190/`, en `laptop-0N.webp` (horizontales) y `tablet-0N.webp`. Rellena con letterbox negro a 16:10 o 3:4 según el equipo.
- **Novogas, notebook:** usa `novogas_desktop.webp` y lo recorta a 16:10 desde arriba, en `laptop-01.webp`.
- **Novogas, celular:** recorta de 3 a 4 pantallas de `novogas_mobile.webp` (fila superior oscura, y = 1340–1840 aprox.) y las escala a 780 px de alto con lanczos. Salida: `phone-0N.webp`.

- [ ] **Step 7: Crear `src/data/mockup-screens.ts` con las rutas generadas**

Run: `npm run mockups:capture && npm run mockups:crop && npx vitest run src/data/mockup-screens.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 8: Commit**

```bash
git add scripts/mockups src/data/mockup-screens* vitest.config.ts package.json package-lock.json public/images/mockups
git commit -m "feat(mockups): material de pantallas por proyecto y tests"
```

---

### Task 2: Base de layout en X/Y, ritmo, superficies y scroll suave

**Files:**
- Modify: `src/app/page.tsx`. Se quitan `PremiumScrollJourney`, `CircularScrollOrbit` y el estado `isDesktop`, y queda flujo normal: `Hero` → `Profile` → `Technologies` → `#works` → `Footer`.
- Modify: `src/app/globals.css`. Se quitan las reglas de `.depth-stack*`, `.orbit-*` y `.snap-section`, y se agregan tokens.
- Create: `src/lib/smooth-scroll.ts`, `src/lib/smooth-scroll.test.ts`
- Create: `src/components/layout/SmoothScroll.tsx`
- Modify: `src/components/providers/AppProviders.tsx` (monta `SmoothScroll`; quita `SmoothSectionScroll` y `AnchorSmoothScroll` si dependen de `section-scroll`)
- Modify: `src/components/portfolio/Hero.tsx` (se quitan `playDepthHeroIntro` y `scrollToSectionByHash` de depth-stack; entra con fundido y desplazamiento en Y)
- Modify: `src/components/ui/text-reveal.tsx` (se quita la dependencia de `depth-stack`)
- Modify: `src/components/portfolio/Footer.tsx` (sin prop `fixed`; flujo normal)

**Interfaces:**
- Produces:
  - `export function shouldUseSmoothScroll(env: { finePointer: boolean; reducedMotion: boolean }): boolean`
  - `export function scrollToHash(hash: string, opts?: { offset?: number }): void`. Usa Lenis si está activo; si no, `window.scrollTo` con `behavior: 'smooth'`.
  - Tokens CSS en `globals.css`:
    - Espaciado: `--space-1..7` = `8px 16px 24px 40px 64px 104px 168px`, `--section-gap: clamp(120px, 18vh, 220px)`, `--content-max: 1240px`.
    - Superficies: `--surface-1`, `--surface-2`.
    - Utilidades: `.surface-1`, `.surface-2` (fondo, borde de luz interior `inset 0 1px 0 rgba(255,255,255,.08|.14)`, sombra ambiente más sombra de contacto) y `.section-rhythm` (`padding-block: calc(var(--section-gap) / 2)`).

- [ ] **Step 1: Escribir el test que falla, `src/lib/smooth-scroll.test.ts`**

```ts
import { shouldUseSmoothScroll } from './smooth-scroll';
it('solo con puntero fino y sin reduced-motion', () => {
  expect(shouldUseSmoothScroll({ finePointer: true, reducedMotion: false })).toBe(true);
  expect(shouldUseSmoothScroll({ finePointer: false, reducedMotion: false })).toBe(false);
  expect(shouldUseSmoothScroll({ finePointer: true, reducedMotion: true })).toBe(false);
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npx vitest run src/lib/smooth-scroll.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `smooth-scroll.ts` y `SmoothScroll.tsx`**

- `npm i lenis`.
- Instancia Lenis con `{ lerp: 0.085, smoothWheel: true }` solo si `shouldUseSmoothScroll` da true.
- Intercepta clicks en `a[href^="#"]` y los manda a `scrollToHash` con un offset igual a la altura del header.

- [ ] **Step 4: Reescribir `page.tsx` y `globals.css` y limpiar Hero, text-reveal y Footer**

- Cada sección usa `.section-rhythm` y el contenedor `max-w-[var(--content-max)]`.
- `#works` queda como contenedor vacío con el título y el CTA actuales. Las escenas llegan en la Task 6; `ProjectList` se mantiene temporalmente.
- Hero: título con `text-shadow` sutil para separarlo del video, y botón con `.surface-*`.
- Estados globales de botones y links: `hover`, `active` (scale .98) y `focus-visible` (anillo de 2 px `rgba(255,255,255,.85)` con offset de 3 px).

- [ ] **Step 5: Verificar**

Run: `npx vitest run && npx tsc --noEmit -p .`
Expected: PASS y sin errores nuevos.

Run: `npm run dev`. En Chrome a 1536 px y 375 px:
- `document.documentElement.scrollWidth === clientWidth`.
- Los links del header llevan a `#about` y `#works`.
- No queda ningún `transform` 3D en las secciones (`[data-depth-panel]`, `[data-orbit-panel]` inexistentes).
- La consola no muestra errores.

- [ ] **Step 6: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "feat(layout): scroll en X/Y, ritmo de secciones y superficies; fuera la pila Z"
```

---

### Task 3: About editorial dividido y Herramientas

**Files:**
- Modify: `src/components/portfolio/Profile.tsx`
- Modify: `src/components/portfolio/Technologies.tsx`. Pasa a ser una fila de íconos en `.surface-2`, con tooltip o etiqueta y sin la animación circular. Se exporta como bloque reutilizable `ToolsRow` y `Technologies` se mantiene como sección o se integra bajo el About.

**Interfaces:**
- Consumes: tokens y `.surface-*` de la Task 2; `t('about.title' | 'about.p1' | 'about.p2' | 'about.p3' | 'technologies.title')`.
- Produces: `export function ToolsRow(): JSX.Element`.

- [ ] **Step 1: Implementar el layout**

- **Grilla:** 12 columnas en `≥1024`. El retrato ocupa 5 columnas y el texto 7.
- **Retrato:** `profile_03.webp` con `aspect-[4/5]`, `rounded-[28px]`, `.surface-2`, una luz de borde (gradiente a 120° de `rgba(255,255,255,.18)` a transparente) y sombra profunda. Si `profile_03` (720×720) queda corto en 4:5, prueba con `profile_01.jpg` o `profile_02.jpg` y elige el de mejor encuadre (decisión documentada en el commit).
- **Texto:**
  - Antetítulo "Sobre mí": reutiliza la clave `nav.about` o la que ya exista con ese texto; no se crean claves nuevas.
  - El título `h2` con `about.title`.
  - `p1` a `clamp(1.25rem, 1.6vw, 1.6rem)`.
  - `p2` y `p3` a `1rem/1.7`, en color `rgba(255,255,255,.78)` o más (AA sobre `--surface-1`).
- **Herramientas:** `ToolsRow` debajo, a todo el ancho.
- **Móvil:** el retrato arriba (`max-w-[320px]`) y el texto debajo.
- **TextReveal:** se mantiene solo si el texto final queda a opacidad 1 y no baja el contraste.

- [ ] **Step 2: Verificar**

Run: `git diff --exit-code src/messages`
Expected: sin salida.

En Chrome, en escritorio y a 375 px, en ES y EN:
- El texto renderizado es idéntico al de `es.json` y `en.json`.
- El contraste de `p2` es de al menos 4.5:1 (medido con DevTools).

- [ ] **Step 3: Commit**

```bash
git add src/components/portfolio/Profile.tsx src/components/portfolio/Technologies.tsx
git commit -m "feat(about): layout editorial dividido y fila de herramientas"
```

---

### Task 4: Coreografía de escenas (matemática pura)

**Files:**
- Create: `src/lib/scene-motion.ts`, `src/lib/scene-motion.test.ts`

**Interfaces:**
- Consumes: `DeviceKind` (Task 1).
- Produces:
  - `export const SCENE_PHASES = { enterEnd: 0.35, holdEnd: 0.75 } as const`
  - `export type Pose = { x: number; y: number; rotX: number; rotY: number; opacity: number }`. `x` e `y` van en unidades de mundo; las rotaciones, en radianes.
  - `export type Slot = { device: DeviceKind; rest: Pose; from: 'left' | 'right' | 'bottom' }`
  - `export function poseAt(slot: Slot, progress: number): Pose`. El progreso se recorta a [0, 1].
  - `export function sceneProgress(rect: { top: number; height: number }, viewportH: number): number`. Devuelve 0 cuando el contenedor arranca a fijarse y 1 cuando se suelta.
  - `export function sceneRestScrollY(containerTop: number, containerHeight: number, viewportH: number): number`. Devuelve el `scrollY` absoluto donde el progreso vale `(enterEnd + holdEnd) / 2`.
  - `export function slotsFor(devices: DeviceKind[]): Slot[]`. Da las composiciones de reposo para 1, 2 o 3 equipos (la notebook al centro y algo atrás en Y, la tablet a la derecha y el celular adelante a la izquierda). No usa la profundidad Z de la página: la composición es en X/Y y la escala la da el tamaño de cada equipo.

- [ ] **Step 1: Escribir el test que falla**

```ts
import { poseAt, sceneProgress, sceneRestScrollY, slotsFor, SCENE_PHASES } from './scene-motion';
const slot = slotsFor(['laptop', 'phone'])[1];

it('entra desde fuera y con opacidad 0', () => {
  const p = poseAt(slot, 0);
  expect(p.opacity).toBe(0);
  expect(Math.abs(p.x - slot.rest.x) + Math.abs(p.y - slot.rest.y)).toBeGreaterThan(2);
});
it('reposo exacto en todo el tramo de hold', () => {
  for (const t of [SCENE_PHASES.enterEnd, 0.5, SCENE_PHASES.holdEnd]) expect(poseAt(slot, t)).toEqual(slot.rest);
});
it('sale con opacidad 0 al final', () => {
  expect(poseAt(slot, 1).opacity).toBe(0);
});
it('recorta el progreso fuera de rango (fling / salto)', () => {
  expect(poseAt(slot, -3)).toEqual(poseAt(slot, 0));
  expect(poseAt(slot, 7)).toEqual(poseAt(slot, 1));
});
it('sceneProgress mapea el tramo fijado a 0..1', () => {
  expect(sceneProgress({ top: 0, height: 2200 }, 1000)).toBe(0);
  expect(sceneProgress({ top: -1200, height: 2200 }, 1000)).toBe(1);
  expect(sceneProgress({ top: -600, height: 2200 }, 1000)).toBeCloseTo(0.5);
  expect(sceneProgress({ top: 500, height: 2200 }, 1000)).toBe(0);
});
it('sceneRestScrollY cae en el centro del reposo', () => {
  expect(sceneRestScrollY(3000, 2200, 1000)).toBeCloseTo(3000 + 1200 * 0.55);
});
it('slotsFor da un slot por equipo y composiciones distintas', () => {
  expect(slotsFor(['laptop']).length).toBe(1);
  expect(slotsFor(['laptop', 'tablet', 'phone']).map((s) => s.device)).toEqual(['laptop', 'tablet', 'phone']);
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npx vitest run src/lib/scene-motion.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `scene-motion.ts`**

- **Easing:** `easeOutCubic` en la entrada y `easeInCubic` en la salida.
- **Entrada:** `from` desplaza `x` en ±6 (left/right) o `y` en −4 (bottom). Suma un `rotY` extra de ±0.35 rad que se resuelve en reposo, para revelar biseles y reflejos.
- **Opacidad:** smoothstep sobre el primer 60 % de la entrada y espejado en la salida.

- [ ] **Step 4: Correr y verificar que pasa**

Run: `npx vitest run src/lib/scene-motion.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scene-motion.ts src/lib/scene-motion.test.ts
git commit -m "feat(scenes): coreografía pura de escenas con tests"
```

---

### Task 5: Equipos 3D procedurales y estudio de luz

**Files:**
- Create: `src/components/three/geometry/squircle.ts`, `squircle.test.ts`
- Create: `src/components/three/devices/Laptop.tsx`, `Tablet.tsx`, `Phone.tsx`, `materials.ts`, `Screen.tsx`
- Create: `src/components/three/Studio.tsx`
- Create: `src/lib/webgl.ts`, `src/lib/webgl.test.ts`
- Create: `src/app/lab/devices/page.tsx` (banco de pruebas visual; `notFound()` si `process.env.NODE_ENV === 'production'`)
- Modify: `package.json` (`three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`)

**Interfaces:**
- Consumes: `DeviceKind`, `screensFor` (Task 1).
- Produces:
  - `export function squircleShape(w: number, h: number, r: number, opts?: { n?: number; segments?: number }): THREE.Shape`. Usa superelipse con `n = 4` por defecto y 24 segmentos por esquina.
  - `export function canUseWebGL(create?: () => HTMLCanvasElement | null): boolean`
  - `export function Laptop(props: { screen: string; screens?: string[]; cycle?: number } & GroupProps)`. Igual para `Tablet` y `Phone`. `cycle` es un índice entero de la pantalla visible.
  - `export function Studio(props: { quality: 'high' | 'low' })`
  - Dimensiones en unidades de mundo (1 u = 10 cm):

    | Equipo | Ancho | Alto | Profundidad | Radio |
    |---|---|---|---|---|
    | Notebook (tapa) | 3.04 | 2.0 | 0.05 | 0.12 |
    | Notebook (base) | 3.04 | — | 0.10 | — (profundidad útil 2.1) |
    | Tablet | 1.79 | 2.47 | 0.06 | 0.18 |
    | Celular | 0.72 | 1.50 | 0.08 | 0.13 |

- [ ] **Step 1: Escribir los tests que fallan**

```ts
// squircle.test.ts
import { squircleShape } from './squircle';
it('genera un contorno cerrado, simétrico y dentro de la caja', () => {
  const pts = squircleShape(2, 1, 0.2).getPoints();
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  expect(Math.max(...xs)).toBeCloseTo(1, 3); expect(Math.min(...xs)).toBeCloseTo(-1, 3);
  expect(Math.max(...ys)).toBeCloseTo(0.5, 3); expect(Math.min(...ys)).toBeCloseTo(-0.5, 3);
  expect(pts.length).toBeGreaterThanOrEqual(4 * 24);
});
it('no deja facetas: ángulo entre segmentos consecutivos < 5° en las esquinas', () => {
  const pts = squircleShape(2, 1, 0.2).getPoints();
  for (let i = 1; i < pts.length - 1; i++) {
    const a = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
    const b = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x);
    const d = Math.abs(Math.atan2(Math.sin(b - a), Math.cos(b - a)));
    expect(d).toBeLessThan((5 * Math.PI) / 180);
  }
});
// webgl.test.ts
import { canUseWebGL } from '@/lib/webgl';
it('false si no hay contexto', () => {
  expect(canUseWebGL(() => ({ getContext: () => null }) as unknown as HTMLCanvasElement)).toBe(false);
  expect(canUseWebGL(() => null)).toBe(false);
});
it('true con contexto webgl2', () => {
  expect(canUseWebGL(() => ({ getContext: (k: string) => (k === 'webgl2' ? {} : null) }) as unknown as HTMLCanvasElement)).toBe(true);
});
```

- [ ] **Step 2: Correr y verificar que fallan**

Run: `npx vitest run src/components/three src/lib/webgl.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar `squircle.ts` y `webgl.ts`**

Run: `npm i three @react-three/fiber @react-three/drei && npm i -D @types/three && npx vitest run src/components/three src/lib/webgl.test.ts`
Expected: PASS.

- [ ] **Step 4: Implementar los equipos, los materiales, `Screen` y `Studio`**

- **Cuerpos:** `ExtrudeGeometry(squircleShape(...), { depth, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 8, curveSegments: 24 })`.
- **Materiales (`materials.ts`):**
  - Aluminio: `MeshPhysicalMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.32, clearcoat: 0.3 })`, con variante grafito `#2b2d31`.
  - Marco negro: `roughness: 0.4`.
  - Vidrio: `transmission: 0`, `roughness: 0.05`, `clearcoat: 1`, sobre la pantalla con `opacity: 0.08`.
- **`Screen`:** `useTexture` con `colorSpace = SRGBColorSpace`, `anisotropy = gl.capabilities.getMaxAnisotropy()` y `meshBasicMaterial` con `toneMapped={false}`. Lleva un plano de reflejo encima.
- **`Studio`:**
  - `<Environment resolution={256}>` con 3 `Lightformer`: key rect arriba a la izquierda (intensidad 3), fill a la derecha (1) y rim atrás (2).
  - `<ContactShadows opacity={0.55} blur={2.6} far={4} />`.
  - En `low`, `resolution` 64 y sin rim.
- **Detalles:**
  - Notebook: bisagra cilíndrica, muesca de 0.18×0.04 y teclado como plano oscuro con micro-relieve opcional.
  - Celular: isla de cámara squircle y botones laterales.
  - Tablet: cámara frontal.

- [ ] **Step 5: Verificación visual en `/lab/devices`**

Run: `npm run dev` y abrir `http://localhost:3000/lab/devices` en Chrome.
- Los tres equipos rotan lentamente con las capturas de Vertic.
- Haciendo zoom en las esquinas no se ven facetas.
- Los reflejos se desplazan al rotar.
- La consola no muestra errores.
- Se guarda un screenshot para Mateo con SendUserFile.

- [ ] **Step 6: Commit**

```bash
git add src/components/three src/lib/webgl* src/app/lab package.json package-lock.json
git commit -m "feat(3d): notebook, tablet y celular procedurales con estudio de luz"
```

---

### Task 6: Escenas fijadas de proyectos (escritorio) y apiladas (móvil)

**Files:**
- Create: `src/components/works/WorksScenes.tsx`, `ProjectScene.tsx`, `SceneCanvas.tsx`, `DeviceRig.tsx`, `StaticComposition.tsx`
- Create: `src/lib/layout-mode.ts`, `src/lib/layout-mode.test.ts`
- Modify: `src/app/page.tsx` (`#works` monta `WorksScenes`)
- Delete: `src/components/portfolio/ProjectList.tsx`

**Interfaces:**
- Consumes: `mockupScreens` y `screensFor` (Task 1); `poseAt`, `slotsFor`, `sceneProgress` y `SCENE_PHASES` (Task 4); `Laptop`, `Tablet`, `Phone`, `Studio` y `canUseWebGL` (Task 5); `projects` y `t('projectsList.{id}.*')`.
- Produces:
  - `export function layoutModeFor(width: number, reducedMotion: boolean): 'pinned' | 'stacked' | 'static'`. Devuelve `static` si hay reduced-motion, `pinned` si el ancho es de 1024 o más, y `stacked` en otro caso.
  - `WorksScenes` asigna `id="project-<id>"` a cada escena.

- [ ] **Step 1: Escribir el test que falla, `layout-mode.test.ts`**

```ts
import { layoutModeFor } from './layout-mode';
it('elige modo por ancho y reduced-motion', () => {
  expect(layoutModeFor(1536, false)).toBe('pinned');
  expect(layoutModeFor(1024, false)).toBe('pinned');
  expect(layoutModeFor(1023, false)).toBe('stacked');
  expect(layoutModeFor(375, false)).toBe('stacked');
  expect(layoutModeFor(1536, true)).toBe('static');
});
```

- [ ] **Step 2: Correr, verificar que falla, implementar y verificar que pasa**

Run: `npx vitest run src/lib/layout-mode.test.ts`
Expected: FAIL antes de implementar y PASS después.

- [ ] **Step 3: Implementar las escenas**

- **`SceneCanvas`:** un único `<Canvas>` fijo detrás de las escenas (`position: fixed; inset: 0; pointer-events: none`) con `<View.Port />`.
  - Configuración: `frameloop="demand"`, `dpr` según Global Constraints y `gl={{ antialias: true, powerPreference: 'high-performance' }}`.
  - Tone mapping: `AgXToneMapping`.
  - Se carga con `next/dynamic({ ssr: false })`. Un `IntersectionObserver` lo monta cuando `#works` está a menos de `150vh`.
- **`ProjectScene`, modo `pinned`:**
  - Contenedor `h-[220vh]` con un hijo `sticky top-0 h-screen` en grilla de 12 columnas.
  - Texto en 4 columnas (título, subtítulo, descripción y botón a `websiteUrl`) en `.surface-1`.
  - `<View>` en 8 columnas con `<DeviceRig>`.
  - El progreso sale de `sceneProgress(el.getBoundingClientRect(), innerHeight)` en un listener de scroll con rAF (o con el callback de Lenis) y se pasa por ref, sin estado de React por cuadro. Después se llama a `invalidate()`.
- **`DeviceRig`:** aplica `poseAt(slot, progress)` a cada grupo en `useFrame`. En la fase de hold, `cycle = floor((progress - 0.35) / 0.4 * screens.length)` para ciclar pantallas.
- **Texto:** entra y sale con la misma fase, por opacidad y `translateY` de 24 px.
- **Indicador:** "N / 5" sticky y fino.
- **Modo `stacked`:** sin sticky. Cada proyecto mide `min-h-[90vh]` y su `<View>` ocupa el ancho; el progreso es la entrada del elemento al viewport (0 → 0.5) y se queda en reposo.
- **Modo `static`, o `canUseWebGL() === false`, o pérdida de contexto (`webglcontextlost`):** se monta `StaticComposition`, con las capturas en marcos CSS simples y sombras `.surface-2`.
- **Cambio de modo:** se re-evalúa en `matchMedia('(min-width: 1024px)')` y en `prefers-reduced-motion`. Al cambiar, el nodo de la escena visible queda en pantalla con `scrollIntoView({ block: 'start' })` sobre la escena activa.
- **CTA:** el `mailto` actual se mantiene al final de `#works`.

- [ ] **Step 4: Verificar**

Run: `npx vitest run && npx tsc --noEmit -p .`
Expected: PASS.

En Chrome a 1536 px:
- Cada escena entra, reposa y sale.
- El link "Trabajos" del header aterriza en reposo (`sceneRestScrollY` usado por `scrollToHash` cuando el hash es `#works`).
- Con End o un fling al final, todos los equipos quedan en reposo o fuera, nunca a mitad de camino.

A 375 px:
- Las escenas van apiladas y no hay overflow horizontal.

Redimensionando entre 1100 y 900 px:
- No se duplican lienzos (`document.querySelectorAll('canvas').length === 1`).

Con `chrome://flags` WebGL desactivado, o forzando `canUseWebGL` a false:
- Se ve `StaticComposition`.

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "feat(works): escenas fijadas con mockups 3D y versión móvil apilada"
```

---

### Task 7: Video de fondo 1080p cinematográfico

**Files:**
- Create: `scripts/video/build-bg.sh`
- Create: `public/images/bg_1080.mp4`, `public/images/bg_720.mp4`, `public/images/bg_poster.webp`
- Modify: `src/lib/background-media.ts`, `src/lib/background-media.test.ts`
- Modify: `src/components/layout/BackgroundVideoLayer.tsx`
- Modify: `.gitignore` (agregar `tools/`)

**Interfaces:**
- Produces: `export function pickBackgroundSrc(viewportWidth: number, dpr: number): '/images/bg_1080.mp4' | '/images/bg_720.mp4'`. Devuelve 720 si `viewportWidth * dpr <= 1400`.

- [ ] **Step 1: Pedir permiso a Mateo en el chat para las dos descargas, con nombre, origen y tamaño**

| Archivo | Origen | Tamaño |
|---|---|---|
| `ffmpeg-release-essentials.zip` | https://www.gyan.dev/ffmpeg/builds/ | ~100 MB |
| `realesrgan-ncnn-vulkan-20220424-windows.zip` | https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0 | ~45 MB |

Sin un "sí" explícito, la tarea se detiene acá.

- [ ] **Step 2: Escribir el test que falla, `background-media.test.ts`**

```ts
import { pickBackgroundSrc } from './background-media';
it('elige resolución por píxeles físicos', () => {
  expect(pickBackgroundSrc(375, 3)).toBe('/images/bg_720.mp4');
  expect(pickBackgroundSrc(1280, 1)).toBe('/images/bg_720.mp4');
  expect(pickBackgroundSrc(1536, 1.25)).toBe('/images/bg_1080.mp4');
});
```

Run: `npx vitest run src/lib/background-media.test.ts`
Expected: FAIL.

- [ ] **Step 3: Descargar y descomprimir en `tools/` y comparar las fuentes**

- Extrae cuadros en t = 2, 9 y 17 s de `portfolio_vid_bg.webm` (escalado a 1080) y de `portfolio_vid_bg.mp4` (escalado a 1080 con lanczos) a `tools/compare/*.png`.
- Revisa los pares con Read.
- **Si el webm muestra detalle real:** es la fuente (`SRC=webm`, sin IA).
- **Si es tan blando como el mp4:** `SRC=mp4` y se aplica Real-ESRGAN.

- [ ] **Step 4: Implementar `scripts/video/build-bg.sh`**

1. **Upscale (solo si `SRC=mp4`):** extrae cuadros PNG con ffmpeg y corre `realesrgan-ncnn-vulkan -n realesr-general-x4v3 -s 2` (con `-dn 0.3` si el modelo lo admite; si no, usa `realesrgan-x4plus`). Rearma el video a los fps originales.
2. **Grade:** escala a `1920:1080:flags=lanczos` y aplica, en este orden:
   - `curves`: negros a 0.04 y altas suaves.
   - `eq=saturation=0.82:contrast=1.06:gamma=0.96`.
   - `colorbalance`: sombras levemente frías y altas cálidas.
   - `vignette=PI/5`.
   - `noise=alls=6:allf=t`.
3. **Codificación:**
   - `bg_1080.mp4`: `libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p -movflags +faststart -an`.
   - `bg_720.mp4`: lo mismo a `1280:720` con `-crf 22`.
   - `bg_poster.webp`: el primer cuadro.
4. **Revisión:** revisa cuadros del resultado con Read antes de seguir. Si el grade aplasta escenas oscuras, ajusta las curvas.

Run: `bash scripts/video/build-bg.sh && npx vitest run src/lib/background-media.test.ts`
Expected: PASS. `bg_1080.mp4` pesa entre 8 y 20 MB y `bg_720.mp4` menos de 8 MB.

- [ ] **Step 5: Conectar `BackgroundVideoLayer`**

- El `src` sale de `pickBackgroundSrc`, calculado en el cliente.
- Usa `poster="/images/bg_poster.webp"`.
- Se mantienen el scrim y el grano actuales (sin blend).
- Los archivos `portfolio_vid_bg.*` no se borran sin preguntar.

- [ ] **Step 6: Commit**

```bash
git add scripts/video src/lib/background-media* src/components/layout/BackgroundVideoLayer.tsx public/images/bg_* .gitignore
git commit -m "feat(video): fondo 1080p/720p con grade cinematográfico grabado"
```

---

### Task 8: Limpieza, rendimiento y verificación final

**Files:**
- Delete: lo que haya quedado sin uso, verificado con grep.
  - `src/components/layout/PremiumScrollJourney.tsx`, `CircularScrollOrbit.tsx`, `ParallaxShell.tsx`, `SnapSection.tsx`, `SmoothSectionScroll.tsx`, `AnchorSmoothScroll.tsx`.
  - `src/lib/depth-stack.ts`, `src/lib/section-scroll.ts`.
- Create: `scripts/perf/scroll-fps.js` (snippet para pegar en la consola: recorrido programático de 3 s y fps/p95/cuadros largos, como el usado en la sesión).

- [ ] **Step 1: Borrar los archivos sin uso y verificar**

Run: `grep -rn "depth-stack\|section-scroll\|PremiumScrollJourney\|CircularScrollOrbit" src`
Expected: sin resultados.

Run: `npx tsc --noEmit -p . && npm run lint && npx vitest run && npm run build`
Expected: build exitoso. El lint no tiene más errores que los 3 preexistentes de `ProjectList.tsx`, y esos desaparecen con el archivo.

- [ ] **Step 2: Medir el rendimiento en Chrome a 1536 px con `npm run build && npm start`**

Corre `scripts/perf/scroll-fps.js` tres veces.
Expected:
- Promedio de 55 fps o más.
- Menos de 3 cuadros de más de 33 ms.
- En el panel Network, three y R3F se cargan recién cerca de `#works`.

- [ ] **Step 3: Hacer el recorrido manual**

- Escritorio y 375 px, en ES y EN.
- Cambio de idioma con una escena fijada (Review Focus 5).
- Redimensionado cruzando 1024 px (Review Focus 1).
- Reduced-motion.
- Consola sin errores.
- Screenshots de Hero, About y dos escenas para Mateo con SendUserFile.

- [ ] **Step 4: Commit y push de la rama para tener la preview de Vercel**

```bash
git add -A && git commit -m "chore: limpieza del sistema de profundidad y verificación"
git push -u origin redesign
```

Expected: Vercel crea una URL de preview; pasársela a Mateo. El merge a `main` se hace solo con su aprobación.
