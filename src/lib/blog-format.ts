import type { BlogLocale } from '@/lib/blog-types';

export function formatBlogDate(date: string, locale: BlogLocale): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}
