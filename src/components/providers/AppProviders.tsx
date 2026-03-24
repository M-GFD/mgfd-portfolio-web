'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="mgfd-theme">
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
