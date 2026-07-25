'use client';

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
} from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextRevealProps extends ComponentPropsWithoutRef<'div'> {
  children: string;
  /** Retraso (s) antes de iniciar el revelado cuando la sección es visible. */
  delay?: number;
  /** Clases del contenedor de palabras (tono fantasma). */
  textClassName?: string;
  /** Color del texto ya revelado. */
  wordClassName?: string;
}

/**
 * Magic UI Text Reveal — adaptado al viaje en profundidad / órbita:
 * revela palabra a palabra al volverse visible (sin runway de 200vh).
 */
export const TextReveal: FC<TextRevealProps> = ({
  children,
  className,
  delay = 0,
  textClassName,
  wordClassName = 'text-neutral-300',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useMotionValue(0);
  const startedRef = useRef(false);

  if (typeof children !== 'string') {
    throw new Error('TextReveal: children must be a string');
  }

  const words = children.split(' ').filter(Boolean);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animControls: ReturnType<typeof animate> | null = null;
    let rafId = 0;

    const isVisible = () => {
      const panel = el.closest('[data-depth-panel]') as HTMLElement | null;
      const inDepth =
        panel &&
        panel.closest('[data-scroll-journey]') &&
        !panel.closest('.depth-stack--flat');

      if (inDepth && panel) {
        return parseFloat(getComputedStyle(panel).opacity || '0') > 0.45;
      }

      const orbitPanel = el.closest('.orbit-panel') as HTMLElement | null;
      if (orbitPanel) {
        const opacity = parseFloat(getComputedStyle(orbitPanel).opacity || '1');
        if (opacity < 0.45) return false;
      }

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      return rect.top < vh * 0.82 && rect.bottom > vh * 0.18;
    };

    const tryStart = () => {
      if (startedRef.current || !isVisible()) return;
      startedRef.current = true;
      animControls = animate(progress, 1, {
        duration: 2.4,
        delay,
        ease: [0.22, 1, 0.36, 1],
      });
    };

    const tick = () => {
      tryStart();
      if (!startedRef.current) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    window.addEventListener('scroll', tryStart, { passive: true });
    window.addEventListener('resize', tryStart);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', tryStart);
      window.removeEventListener('resize', tryStart);
      animControls?.stop();
    };
  }, [delay, progress]);

  return (
    <div ref={containerRef} className={cn('relative z-0', className)} {...props}>
      <span
        className={cn(
          'flex flex-wrap text-sm leading-relaxed font-normal text-neutral-300/25 sm:text-base',
          textClassName,
        )}
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word
              key={`${word}-${i}`}
              progress={progress}
              range={[start, end]}
              wordClassName={wordClassName}
            >
              {word}
            </Word>
          );
        })}
      </span>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  wordClassName?: string;
}

const Word: FC<WordProps> = ({
  children,
  progress,
  range,
  wordClassName,
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-[0.2em] inline-block">
      <span className="absolute opacity-30">{children}</span>
      <motion.span style={{ opacity }} className={wordClassName}>
        {children}
      </motion.span>
    </span>
  );
};
