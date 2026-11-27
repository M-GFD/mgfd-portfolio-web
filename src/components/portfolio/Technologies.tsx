'use client';

import Image from 'next/image';
import { technologies } from '@/constants/technologies';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Technology } from '@/types/portfolio';

function techImageSrc(tech: Technology) {
  if (tech.imageFile) return `/images/${tech.imageFile}`;
  return `/images/${tech.name.toLowerCase()}.${tech.imageExt ?? 'png'}`;
}

/** Fila de herramientas: íconos con etiqueta sobre una superficie elevada. */
export function ToolsRow() {
  const { t } = useLanguage();
  return (
    <div className="surface-2 rim-light relative rounded-[24px] p-[clamp(20px,3vw,36px)]">
      <h3 className="mb-[var(--space-3)] text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {t('technologies.title')}
      </h3>
      <ul className="grid grid-cols-4 gap-x-[var(--space-2)] gap-y-[var(--space-3)] sm:grid-cols-6 lg:grid-cols-12">
        {technologies.map((tech) => (
          <li key={tech.name} className="group flex flex-col items-center gap-[10px]">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.04] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_8px_20px_-10px_rgb(0_0_0/0.8)] ring-1 ring-white/[0.06] transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:bg-white/[0.08] motion-reduce:transition-none">
              <Image
                src={techImageSrc(tech)}
                alt=""
                width={32}
                height={32}
                className="size-8 object-contain"
              />
            </span>
            <span className="text-center text-[0.75rem] leading-tight font-medium text-[var(--text-body)]">
              {tech.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
