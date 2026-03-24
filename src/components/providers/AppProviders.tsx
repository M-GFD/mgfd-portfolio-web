'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AnchorSmoothScroll } from '@/components/layout/AnchorSmoothScroll';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="mgfd-theme">
      <LanguageProvider>
        <AnchorSmoothScroll />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
