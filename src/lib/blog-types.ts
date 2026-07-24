export type BlogLocale = 'es' | 'en';

export type BlogPostTranslation = {
  title: string;
  description: string;
  content: string;
  tags: string[];
};

/** Artículo con todas las traducciones disponibles (misma URL /blog/[slug]). */
export type BlogPostBundle = {
  slug: string;
  date: string;
  draft: boolean;
  translations: Partial<Record<BlogLocale, BlogPostTranslation>>;
};

/** Vista resuelta para un locale concreto (con fallback). */
export type BlogPostView = {
  slug: string;
  date: string;
  draft: boolean;
  locale: BlogLocale;
  title: string;
  description: string;
  content: string;
  tags: string[];
};
