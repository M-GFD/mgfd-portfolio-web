'use client';

import Link from 'next/link';
import { BlogMarkdown } from '@/components/blog/BlogMarkdown';
import { BlogShareButton } from '@/components/blog/BlogShareButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBlogDate } from '@/lib/blog-format';
import { resolveBlogPost } from '@/lib/blog-localize';
import type { BlogPostBundle } from '@/lib/blog-types';

type BlogArticleViewProps = {
  post: BlogPostBundle;
  shareUrl: string;
};

export function BlogArticleView({ post, shareUrl }: BlogArticleViewProps) {
  const { t, locale } = useLanguage();
  const resolved = resolveBlogPost(post, locale);

  if (!resolved) return null;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <p className="mb-6">
        <Link
          href="/blog"
          className="text-sm text-neutral-400 transition-colors hover:text-white"
        >
          ← {t('blog.backToBlog')}
        </Link>
      </p>

      <article
        className="glass-card min-w-0 w-full p-5 text-left sm:p-7 md:p-8"
        aria-labelledby="blog-article-title"
        lang={resolved.locale}
      >
        <header className="mb-8 border-b border-white/10 pb-8 sm:mb-10">
          <p className="mb-3 text-xs text-neutral-500 sm:text-sm">
            <time dateTime={resolved.date}>
              {formatBlogDate(resolved.date, locale)}
            </time>
          </p>
          <h1
            id="blog-article-title"
            className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight"
          >
            {resolved.title}
          </h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            {resolved.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <BlogShareButton
              url={shareUrl}
              title={resolved.title}
              className="sm:hidden"
            />
            {resolved.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {resolved.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-white/8 px-2 py-1 text-xs text-neutral-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="blog-prose">
          <BlogMarkdown content={resolved.content} />
        </div>
      </article>
    </div>
  );
}
