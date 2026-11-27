'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ToolsRow } from '@/components/portfolio/Technologies';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

/** Revela su contenido (opacidad + desplazamiento) la primera vez que entra en pantalla. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function Profile() {
  const { t } = useLanguage();
  return (
    <section id="about" aria-labelledby="about-heading" className="section-rhythm scroll-mt-24">
      <div className="content-wrap">
        <div className="grid grid-cols-1 items-center gap-[var(--space-5)] lg:grid-cols-12 lg:gap-x-[var(--space-5)]">
          <Reveal className="mx-auto w-full max-w-[320px] lg:col-span-5 lg:max-w-none">
            <figure className="surface-2 rim-light relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_48px_110px_-36px_rgb(0_0_0/0.85),0_2px_6px_rgb(0_0_0/0.45)]">
              <img
                src="/images/profile_portrait.webp"
                alt="Mateo G. Fontana Dalmasso (MGFD)"
                width={810}
                height={1012}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgb(255_255_255/0.07),transparent_38%),linear-gradient(to_top,rgb(0_0_0/0.35),transparent_30%)]"
              />
            </figure>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <article className="surface-1 rim-light relative rounded-[28px] p-[clamp(28px,4vw,56px)]">
              <p className="mb-[var(--space-2)] text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {t('nav.about')}
              </p>
              <h2
                id="about-heading"
                className="text-lift text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] font-bold tracking-tight text-[var(--text-strong)]"
              >
                {t('about.title')}
              </h2>
              <p className="mt-[var(--space-4)] text-[clamp(1.25rem,1.6vw,1.6rem)] leading-[1.45] font-medium tracking-[-0.01em] text-pretty text-[var(--text-strong)]">
                {t('about.p1')}
              </p>
              <p className="mt-[var(--space-3)] max-w-[62ch] text-base leading-[1.7] text-pretty text-[var(--text-body)]">
                {t('about.p2')}
              </p>
              <p className="mt-[var(--space-2)] max-w-[62ch] text-base leading-[1.7] text-pretty text-[var(--text-body)]">
                {t('about.p3')}
              </p>
            </article>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-[var(--space-5)]">
          <ToolsRow />
        </Reveal>
      </div>
    </section>
  );
}
