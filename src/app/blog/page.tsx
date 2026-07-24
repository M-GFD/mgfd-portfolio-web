import type { Metadata } from 'next';
import Header from '@/components/portfolio/Header';
import Footer from '@/components/portfolio/Footer';
import { BlogIndexView } from '@/components/blog/BlogIndexView';
import { getAllBlogPosts } from '@/lib/blog';
import esMessages from '@/messages/es.json';

export const metadata: Metadata = {
  title: esMessages.blog.title,
  description: esMessages.blog.subtitle,
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: esMessages.blog.title,
    description: esMessages.blog.subtitle,
    siteName: 'Portfolio web Mateo G. Fontana Dalmasso (MGFD)',
  },
  twitter: {
    card: 'summary_large_image',
    title: esMessages.blog.title,
    description: esMessages.blog.subtitle,
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts().map(
    ({ content: _content, ...meta }) => meta,
  );

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="relative z-0 flex-1 px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-10 sm:px-6 sm:pb-14">
        <BlogIndexView posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
