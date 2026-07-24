import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {
  BlogLocale,
  BlogPostBundle,
  BlogPostTranslation,
} from '@/lib/blog-types';

export type { BlogLocale, BlogPostBundle, BlogPostTranslation } from '@/lib/blog-types';
export { resolveBlogPost, resolveBlogPostMeta } from '@/lib/blog-localize';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const LOCALES: BlogLocale[] = ['es', 'en'];

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === 'string');
}

function readLocaleFile(
  slug: string,
  locale: BlogLocale,
): { translation: BlogPostTranslation; date: string; draft: boolean } | null {
  const filePath = path.join(BLOG_DIR, slug, `${locale}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description =
    typeof data.description === 'string' ? data.description.trim() : '';
  const date = typeof data.date === 'string' ? data.date.trim() : '';
  if (!title || !description || !date) return null;

  return {
    date,
    draft: data.draft === true,
    translation: {
      title,
      description,
      content: content.trim(),
      tags: parseTags(data.tags),
    },
  };
}

function readBundle(slug: string): BlogPostBundle | null {
  const dir = path.join(BLOG_DIR, slug);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;

  const translations: BlogPostBundle['translations'] = {};
  let date = '';
  let draft = false;

  for (const locale of LOCALES) {
    const parsed = readLocaleFile(slug, locale);
    if (!parsed) continue;
    translations[locale] = parsed.translation;
    // Preferí metadatos compartidos desde ES; si no hay ES, usá el primero disponible.
    if (!date || locale === 'es') {
      date = parsed.date;
      draft = parsed.draft;
    }
  }

  if (!date || Object.keys(translations).length === 0) return null;

  return { slug, date, draft, translations };
}

export function getAllBlogPostBundles(options?: {
  includeDrafts?: boolean;
}): BlogPostBundle[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const includeDrafts = options?.includeDrafts === true;

  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readBundle(entry.name))
    .filter((bundle): bundle is BlogPostBundle => {
      if (!bundle) return false;
      if (!includeDrafts && bundle.draft) return false;
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getBlogPostBundleBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): BlogPostBundle | null {
  const bundle = readBundle(slug);
  if (!bundle) return null;
  if (!options?.includeDrafts && bundle.draft) return null;
  return bundle;
}

export function getBlogSlugs(options?: { includeDrafts?: boolean }): string[] {
  return getAllBlogPostBundles(options).map((post) => post.slug);
}
