import type { MetadataRoute } from "next";
import { getAllBlogPostBundles } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  const home = new URL("/", origin);
  const blog = new URL("/blog", origin);

  const posts = getAllBlogPostBundles().map((post) => ({
    url: new URL(`/blog/${post.slug}`, origin).href,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: home.href,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: blog.href,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts,
  ];
}
