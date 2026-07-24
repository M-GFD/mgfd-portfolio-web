'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBlogDate } from '@/lib/blog-format';
import { resolveBlogPostMeta } from '@/lib/blog-localize';
import type { BlogPostBundle } from '@/lib/blog-types';

type BlogIndexViewProps = {
  posts: BlogPostBundle[];
};

export function BlogIndexView({ posts }: BlogIndexViewProps) {
  const { t, locale } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-10 sm:mb-12">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
          MGFD
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {t('blog.title')}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
          {t('blog.subtitle')}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-neutral-400 sm:text-base">{t('blog.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-4 sm:gap-5">
          {posts.map((post) => {
            const resolved = resolveBlogPostMeta(post, locale);
            if (!resolved) return null;
            const href = `/blog/${resolved.slug}`;
            return (
              <li key={resolved.slug}>
                <article className="glass-card p-5 sm:p-6" lang={resolved.locale}>
                  <p className="mb-2 text-xs text-neutral-500 sm:text-sm">
                    <time dateTime={resolved.date}>
                      {formatBlogDate(resolved.date, locale)}
                    </time>
                  </p>
                  <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
                    <Link
                      href={href}
                      className="transition-colors hover:text-neutral-200"
                    >
                      {resolved.title}
                    </Link>
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed text-neutral-400 sm:text-base">
                    {resolved.description}
                  </p>
                  <Link
                    href={href}
                    className="inline-flex text-sm font-medium text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white/70"
                  >
                    {t('blog.readMore')}
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
