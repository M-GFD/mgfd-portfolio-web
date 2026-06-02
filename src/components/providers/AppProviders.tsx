'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ExperienceProvider } from '@/contexts/ExperienceContext';
import { AnchorSmoothScroll } from '@/components/layout/AnchorSmoothScroll';
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
          <AnchorSmoothScroll />
          {children}
          <ExperienceGate />
        </ExperienceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
