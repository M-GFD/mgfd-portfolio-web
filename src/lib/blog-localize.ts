import type { BlogLocale, BlogPostBundle, BlogPostView } from '@/lib/blog-types';

const LOCALE_FALLBACK: BlogLocale[] = ['es', 'en'];

export function resolveBlogPost(
  bundle: BlogPostBundle,
  locale: BlogLocale,
): BlogPostView | null {
  const order: BlogLocale[] = [
    locale,
    ...LOCALE_FALLBACK.filter((l) => l !== locale),
  ];

  for (const candidate of order) {
    const translation = bundle.translations[candidate];
    if (!translation) continue;
    return {
      slug: bundle.slug,
      date: bundle.date,
      draft: bundle.draft,
      locale: candidate,
      title: translation.title,
      description: translation.description,
      content: translation.content,
      tags: translation.tags,
    };
  }

  return null;
}

export function resolveBlogPostMeta(
  bundle: BlogPostBundle,
  locale: BlogLocale,
): Omit<BlogPostView, 'content'> | null {
  const resolved = resolveBlogPost(bundle, locale);
  if (!resolved) return null;
  const { content: _content, ...meta } = resolved;
  return meta;
}
