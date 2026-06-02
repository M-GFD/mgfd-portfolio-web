import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type SnapSectionProps = ComponentPropsWithoutRef<'section'> & {
  /** Sección más alta que el viewport (p. ej. Trabajos); permite scroll interno sin bloquear el snap siguiente. */
  long?: boolean;
};

export function SnapSection({
  long = false,
  className,
  children,
  ...props
}: SnapSectionProps) {
  return (
    <section
      className={cn('snap-section', long && 'snap-section--long', className)}
      {...props}
    >
      {children}
    </section>
  );
}
