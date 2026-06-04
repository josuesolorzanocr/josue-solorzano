import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/lib/data/blog-posts";
import { siteConfig, formatDate } from "@/lib/utils";
import { webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Digital Marketing & Web Services Blog | Josue Solorzano",
  description: "Articles by Josue Solorzano on premium websites, SEO, AI optimization, lead capture, and digital authority. Learn to dominate the internet.",
  keywords: ["digital marketing blog", "premium websites", "SEO for business", "AI optimization", "Josue Solorzano blog"],
  alternates: { canonical: `${siteConfig.url}/en/blog` },
};

export default function BlogEnPage() {
  const breadcrumbs = [{ name: "Home", item: `${siteConfig.url}/en` }, { name: "Blog", item: `${siteConfig.url}/en/blog` }];
  const featured = blogPosts.filter((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: "Blog — Josue Solorzano", description: "Articles on leadership, entrepreneurship and mindset.", url: `${siteConfig.url}/en/blog`, breadcrumbs })) }} />

      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#b8860b] opacity-[0.06] blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="flex items-center justify-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/en" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#f0c040]">Blog</span>
          </nav>
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">Strategies & Perspectives</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-6">Josue&apos;s <span className="gradient-text">Blog</span></h1>
          <p className="text-[#8888aa] text-xl leading-relaxed max-w-2xl mx-auto">
            Practical guides on websites, SEO, artificial intelligence, and digital marketing. No empty theory — only what actually works to attract real clients.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {featured.map((post) => (
              <Link key={post.slugEn} href={`/en/blog/${post.slugEn}`} className="group bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden hover:border-[#b8860b33] hover:-translate-y-1 transition-all">
                <div className="h-44 relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.titleEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <span className="text-[#f0c040] text-xs font-semibold">{post.categoryEn}</span>
                  <h3 className="text-white font-bold text-base mt-2 mb-3 line-clamp-2 group-hover:text-[#f0c040] transition-colors">{post.titleEn}</h3>
                  <p className="text-[#8888aa] text-sm line-clamp-2 mb-4">{post.excerptEn}</p>
                  <div className="flex items-center justify-between text-xs text-[#8888aa]">
                    <span>{formatDate(post.publishedAt, "en-US")}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {post.readingTime} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">All Articles</h2>
          <div className="space-y-4">
            {rest.map((post) => (
              <Link key={post.slugEn} href={`/en/blog/${post.slugEn}`} className="group flex gap-5 p-5 bg-[#111118] border border-[#1e1e2e] rounded-xl hover:border-[#b8860b33] transition-all">
                <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.titleEn}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#f0c040] text-xs font-semibold">{post.categoryEn}</span>
                    <span className="text-[#8888aa] text-xs flex items-center gap-1"><Clock size={10} /> {post.readingTime} min</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm group-hover:text-[#f0c040] transition-colors line-clamp-1">{post.titleEn}</h3>
                  <p className="text-[#8888aa] text-xs mt-1 line-clamp-1">{post.excerptEn}</p>
                </div>
                <div className="flex items-center text-[#8888aa] group-hover:text-[#f0c040] transition-colors flex-shrink-0">
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
