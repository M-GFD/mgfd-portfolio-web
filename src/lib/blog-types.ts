export type BlogLocale = 'es' | 'en';

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  locale: BlogLocale;
  tags: string[];
  draft: boolean;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};
