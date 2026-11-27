import type { DeviceKind } from '@/data/mockup-screens';

/**
 * Coreografía de las escenas fijadas de Works (matemática pura, sin DOM).
 * Progreso 0..1 del tramo fijado: entrada [0, enterEnd], reposo [enterEnd, holdEnd], salida [holdEnd, 1].
 */
export const SCENE_PHASES = { enterEnd: 0.35, holdEnd: 0.75 } as const;

/** x/y en unidades de mundo; rotaciones en radianes. */
export type Pose = { x: number; y: number; rotX: number; rotY: number; opacity: number };

export type Slot = { device: DeviceKind; rest: Pose; from: 'left' | 'right' | 'bottom' };

const ENTER_SHIFT_X = 6;
const ENTER_SHIFT_Y = -4;
const ENTER_ROT_Y = 0.35;
const EXIT_SHIFT_Y = 3;
const EXIT_ROT_X = -0.15;

const clamp01 = (v: number) => (v <= 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInCubic = (t: number) => t ** 3;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export function poseAt(slot: Slot, progress: number): Pose {
  const t = clamp01(Number.isFinite(progress) ? progress : 0);
  const { rest, from } = slot;
  const { enterEnd, holdEnd } = SCENE_PHASES;

  if (t >= enterEnd && t <= holdEnd) return { ...rest };

  if (t < enterEnd) {
    const u = t / enterEnd;
    const k = 1 - easeOutCubic(u); // 1 → fuera, 0 → reposo
    const side = from === 'left' ? -1 : from === 'right' ? 1 : 0;
    return {
      x: rest.x + side * ENTER_SHIFT_X * k,
      y: rest.y + (from === 'bottom' ? ENTER_SHIFT_Y * k : 0),
      rotX: rest.rotX,
      // Giro extra que se resuelve en reposo: revela biseles y reflejos al entrar.
      rotY: rest.rotY + (side === 0 ? 1 : -side) * ENTER_ROT_Y * k,
      opacity: smoothstep(0, 0.6, u),
    };
  }

  const v = (t - holdEnd) / (1 - holdEnd);
  const k = easeInCubic(v);
  return {
    x: rest.x,
    y: rest.y + EXIT_SHIFT_Y * k,
    rotX: rest.rotX + EXIT_ROT_X * k,
    rotY: rest.rotY,
    opacity: 1 - smoothstep(0.4, 1, v),
  };
}

/** 0 cuando el contenedor empieza a fijarse (top = 0) y 1 cuando se suelta (bottom = viewport). */
export function sceneProgress(rect: { top: number; height: number }, viewportH: number): number {
  const range = rect.height - viewportH;
  if (range <= 0) return rect.top <= 0 ? 1 : 0;
  return clamp01(-rect.top / range);
}

/** scrollY absoluto donde el progreso cae en el centro del reposo. */
export function sceneRestScrollY(containerTop: number, containerHeight: number, viewportH: number): number {
  const mid = (SCENE_PHASES.enterEnd + SCENE_PHASES.holdEnd) / 2;
  return containerTop + Math.max(0, containerHeight - viewportH) * mid;
}

const pose = (x: number, y: number, rotX = 0, rotY = 0): Pose => ({ x, y, rotX, rotY, opacity: 1 });

/** Composiciones de reposo en X/Y. La escala la da el tamaño real de cada equipo. */
const COMPOSITIONS: Record<string, Partial<Record<DeviceKind, Omit<Slot, 'device'>>>> = {
  laptop: { laptop: { rest: pose(0, 0, 0, -0.12), from: 'bottom' } },
  tablet: { tablet: { rest: pose(0, 0, 0, -0.18), from: 'right' } },
  phone: { phone: { rest: pose(0, 0, 0, 0.2), from: 'left' } },
  'laptop+phone': {
    laptop: { rest: pose(0.4, 0.15, 0, -0.1), from: 'bottom' },
    phone: { rest: pose(-1.5, -0.5, 0, 0.25), from: 'left' },
  },
  'laptop+tablet': {
    laptop: { rest: pose(-0.55, 0.15, 0, 0.08), from: 'bottom' },
    tablet: { rest: pose(1.75, -0.2, 0, -0.22), from: 'right' },
  },
  'phone+tablet': {
    tablet: { rest: pose(0.45, 0, 0, -0.18), from: 'right' },
    phone: { rest: pose(-1.05, -0.4, 0, 0.25), from: 'left' },
  },
  'laptop+phone+tablet': {
    laptop: { rest: pose(0, 0.25, 0, -0.04), from: 'bottom' },
    tablet: { rest: pose(2.05, -0.2, 0, -0.24), from: 'right' },
    phone: { rest: pose(-1.85, -0.55, 0, 0.26), from: 'left' },
  },
};

export function slotsFor(devices: DeviceKind[]): Slot[] {
  const unique = [...new Set(devices)];
  const comp = COMPOSITIONS[[...unique].sort().join('+')];
  return unique.map((device, i) => {
    const entry = comp?.[device];
    if (entry) return { device, rest: { ...entry.rest }, from: entry.from };
    // Respaldo: fila centrada en X.
    return { device, rest: pose((i - (unique.length - 1) / 2) * 2.4, 0), from: 'bottom' };
  });
}
