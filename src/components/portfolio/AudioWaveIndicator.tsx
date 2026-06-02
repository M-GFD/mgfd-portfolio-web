'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const WIDTH = 20;
const HEIGHT = 20;
const MID_Y = HEIGHT / 2;
const STEPS = 24;
const AMPLITUDE = 3.5;
const FREQUENCY = 0.65;
const PHASE_STEP = 0.12;

function wavePath(phase: number, amplitude: number) {
  let d = '';
  for (let i = 0; i <= STEPS; i++) {
    const x = (i / STEPS) * WIDTH;
    const y = MID_Y + amplitude * Math.sin(FREQUENCY * x + phase);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

export function AudioWaveIndicator({ active }: { active: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const phaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    pathEl.setAttribute('d', wavePath(0, active ? AMPLITUDE : 0));

    if (!active) {
      stop();
      return;
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      pathEl.setAttribute('d', wavePath(0, AMPLITUDE));
      return;
    }

    const tick = () => {
      phaseRef.current += PHASE_STEP;
      pathEl.setAttribute('d', wavePath(phaseRef.current, AMPLITUDE));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stop;
  }, [active]);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={cn(
        'h-5 w-5 shrink-0',
        active ? 'text-neutral-200' : 'text-neutral-500',
      )}
      aria-hidden
    >
      <path
        ref={pathRef}
        d={wavePath(0, 0)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
