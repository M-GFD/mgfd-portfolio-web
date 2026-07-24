import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { BlogLocale, BlogPost, BlogPostMeta } from '@/lib/blog-types';

export type { BlogLocale, BlogPost, BlogPostMeta } from '@/lib/blog-types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function isBlogLocale(value: unknown): value is BlogLocale {
  return value === 'es' || value === 'en';
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === 'string');
}

function toMeta(slug: string, data: Record<string, unknown>): BlogPostMeta | null {
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description =
    typeof data.description === 'string' ? data.description.trim() : '';
  const date = typeof data.date === 'string' ? data.date.trim() : '';
  if (!title || !description || !date) return null;

  return {
    slug,
    title,
    description,
    date,
    locale: isBlogLocale(data.locale) ? data.locale : 'es',
    tags: parseTags(data.tags),
    draft: data.draft === true,
  };
}

function readPostFile(filename: string): BlogPost | null {
  if (!filename.endsWith('.md')) return null;
  const slug = filename.replace(/\.md$/i, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
  const { data, content } = matter(raw);
  const meta = toMeta(slug, data as Record<string, unknown>);
  if (!meta) return null;
  return { ...meta, content: content.trim() };
}

export function getAllBlogPosts(options?: {
  includeDrafts?: boolean;
  locale?: BlogLocale;
}): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const includeDrafts = options?.includeDrafts === true;
  const locale = options?.locale;

  return fs
    .readdirSync(BLOG_DIR)
    .map(readPostFile)
    .filter((post): post is BlogPost => {
      if (!post) return false;
      if (!includeDrafts && post.draft) return false;
      if (locale && post.locale !== locale) return false;
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getBlogPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): BlogPost | null {
  const filename = `${slug}.md`;
  const fullPath = path.join(BLOG_DIR, filename);
  if (!fs.existsSync(fullPath)) return null;
  const post = readPostFile(filename);
  if (!post) return null;
  if (!options?.includeDrafts && post.draft) return null;
  return post;
}

export function getBlogSlugs(options?: { includeDrafts?: boolean }): string[] {
  return getAllBlogPosts(options).map((post) => post.slug);
}
