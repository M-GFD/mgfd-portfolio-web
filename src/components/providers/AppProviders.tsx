'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ExperienceProvider } from '@/contexts/ExperienceContext';
import { AnchorSmoothScroll } from '@/components/layout/AnchorSmoothScroll';
import { BackgroundVideoLayer } from '@/components/layout/BackgroundVideoLayer';
import { ExperienceGate } from '@/components/layout/ExperienceGate';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      themes={['dark']}
      storageKey="mgfd-theme"
    >
      <LanguageProvider>
        <ExperienceProvider>
          <BackgroundVideoLayer />
          <AnchorSmoothScroll />
          <div className="relative z-10">{children}</div>
          <ExperienceGate />
        </ExperienceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
