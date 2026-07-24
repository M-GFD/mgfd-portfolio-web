'use client';

import Link from 'next/link';
import { BlogMarkdown } from '@/components/blog/BlogMarkdown';
import { BlogShareButton } from '@/components/blog/BlogShareButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBlogDate } from '@/lib/blog-format';
import type { BlogPost } from '@/lib/blog-types';

type BlogArticleViewProps = {
  post: BlogPost;
  shareUrl: string;
};

export function BlogArticleView({ post, shareUrl }: BlogArticleViewProps) {
  const { t, locale } = useLanguage();

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
      >
        <header className="mb-8 border-b border-white/10 pb-8 sm:mb-10">
          <p className="mb-3 text-xs text-neutral-500 sm:text-sm">
            <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
          </p>
          <h1
            id="blog-article-title"
            className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight"
          >
            {post.title}
          </h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <BlogShareButton url={shareUrl} title={post.title} />
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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
          <BlogMarkdown content={post.content} />
        </div>
      </article>
    </div>
  );
}
