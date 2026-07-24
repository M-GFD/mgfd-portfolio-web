import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/portfolio/Header';
import Footer from '@/components/portfolio/Footer';
import { BlogArticleView } from '@/components/blog/BlogArticleView';
import { getBlogPostBySlug, getBlogSlugs } from '@/lib/blog';
import { getSiteUrl } from '@/lib/site-url';

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return { title: 'Blog' };
  }

  const path = `/blog/${post.slug}`;
  const url = new URL(path, getSiteUrl()).href;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      siteName: 'Portfolio web Mateo G. Fontana Dalmasso (MGFD)',
      locale: post.locale === 'en' ? 'en_US' : 'es_AR',
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const shareUrl = new URL(`/blog/${post.slug}`, getSiteUrl()).href;

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="relative z-0 flex-1 px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-10 sm:px-6 sm:pb-14">
        <BlogArticleView post={post} shareUrl={shareUrl} />
      </main>
      <Footer />
    </div>
  );
}
