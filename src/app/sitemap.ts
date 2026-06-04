import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data/blog-posts";
import { siteConfig } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    // Spanish — core pages
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: { languages: { es: base, en: `${base}/en` } } },
    { url: `${base}/sobre-mi`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: { languages: { es: `${base}/sobre-mi`, en: `${base}/en/about` } } },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.95, alternates: { languages: { es: `${base}/blog`, en: `${base}/en/blog` } } },
    { url: `${base}/libros`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: { languages: { es: `${base}/libros`, en: `${base}/en/books` } } },
    // English — core pages
    { url: `${base}/en`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/en/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/en/blog`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/en/books`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Media Kit — Phase 5 DAB
    { url: `${base}/media-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.flatMap((post) => [
    {
      url: `${base}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: { es: `${base}/blog/${post.slug}`, en: `${base}/en/blog/${post.slugEn}` } },
    },
    {
      url: `${base}/en/blog/${post.slugEn}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  return [...staticRoutes, ...blogRoutes];
}
