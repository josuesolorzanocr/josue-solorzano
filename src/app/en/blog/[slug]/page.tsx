import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { blogPosts, getPostBySlug } from "@/lib/data/blog-posts";
import { siteConfig, formatDate } from "@/lib/utils";
import { articleSchema, webPageSchema } from "@/lib/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slugEn }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slugEn === slug);
  if (!post) return {};

  return {
    title: post.titleEn,
    description: post.excerptEn,
    keywords: post.tagsEn,
    alternates: {
      canonical: `${siteConfig.url}/en/blog/${post.slugEn}`,
      languages: { es: `${siteConfig.url}/blog/${post.slug}`, en: `${siteConfig.url}/en/blog/${post.slugEn}` },
    },
    openGraph: { type: "article", title: post.titleEn, description: post.excerptEn, url: `${siteConfig.url}/en/blog/${post.slugEn}`, publishedTime: post.publishedAt, authors: ["Josue Solorzano"], images: [{ url: post.image, width: 1200, height: 630, alt: post.titleEn }] },
    twitter: { card: "summary_large_image", title: post.titleEn, description: post.excerptEn, images: [post.image] },
  };
}

export default async function BlogPostEnPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slugEn === slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slugEn !== post.slugEn && p.categoryEn === post.categoryEn).slice(0, 3);
  const breadcrumbs = [
    { name: "Home", item: `${siteConfig.url}/en` },
    { name: "Blog", item: `${siteConfig.url}/en/blog` },
    { name: post.titleEn, item: `${siteConfig.url}/en/blog/${post.slugEn}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema({ ...post, title: post.titleEn, excerpt: post.excerptEn, tags: post.tagsEn, slug: post.slugEn })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: post.titleEn, description: post.excerptEn, url: `${siteConfig.url}/en/blog/${post.slugEn}`, breadcrumbs })) }} />

      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#7c3aed] opacity-[0.05] blur-[80px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/en" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/en/blog" className="hover:text-white transition-colors">Blog</a>
            <span>/</span>
            <span className="text-[#a78bfa] truncate max-w-xs">{post.titleEn}</span>
          </nav>
          <div className="mb-6">
            <span className="text-[#a78bfa] text-xs font-semibold uppercase tracking-widest bg-[#7c3aed1a] border border-[#7c3aed33] px-3 py-1 rounded-full">{post.categoryEn}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">{post.titleEn}</h1>
          <p className="text-[#8888aa] text-xl leading-relaxed mb-8">{post.excerptEn}</p>
          <div className="flex items-center gap-6 text-sm text-[#8888aa] pb-8 border-b border-[#1e1e2e]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">JS</div>
              <span className="text-white font-medium">Josue Solorzano</span>
            </div>
            <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDate(post.publishedAt, "en-US")}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readingTime} min read</span>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-4">
        <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.titleEn}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-40" />
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-[#ccccdd] prose-p:leading-relaxed prose-strong:text-white prose-a:text-[#a78bfa] prose-blockquote:border-[#7c3aed] prose-blockquote:text-[#8888aa]">
            {post.contentEn.split("\n").map((line, i) => {
              if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
              if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
              if (line.startsWith("**") && line.endsWith("**")) return <p key={i}><strong>{line.slice(2, -2)}</strong></p>;
              if (line.trim() === "") return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </article>
          {/* Share buttons */}
          <div className="mt-10 pt-8 border-t border-[#1e1e2e]">
            <p className="text-[#8888aa] text-sm mb-4">Found this useful? Share it:</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteConfig.url}/en/blog/${post.slugEn}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-[#1e1e2e] text-[#8888aa] hover:text-white hover:border-[#0077b5] hover:bg-[#0077b51a] transition-all"
              >
                <span>in</span> LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteConfig.url}/en/blog/${post.slugEn}`)}&text=${encodeURIComponent(post.titleEn)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-[#1e1e2e] text-[#8888aa] hover:text-white hover:border-[#1da1f2] hover:bg-[#1da1f21a] transition-all"
              >
                <span>𝕏</span> Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.titleEn} → ${siteConfig.url}/en/blog/${post.slugEn}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-[#1e1e2e] text-[#8888aa] hover:text-white hover:border-[#25d366] hover:bg-[#25d3661a] transition-all"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-[#1e1e2e]">
            {post.tagsEn.map((tag) => (
              <span key={tag} className="text-xs text-[#8888aa] border border-[#1e1e2e] px-3 py-1 rounded-full hover:border-[#7c3aed33] hover:text-[#a78bfa] transition-all cursor-pointer">#{tag}</span>
            ))}
          </div>
          <div className="mt-10 p-6 bg-[#111118] border border-[#1e1e2e] rounded-2xl flex gap-5">
            <div className="w-14 h-14 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">JS</div>
            <div>
              <div className="text-white font-bold">Josue Solorzano</div>
              <p className="text-[#8888aa] text-sm mt-1 leading-relaxed">Premium digital services specialist from Costa Rica. Helps businesses in the USA, Europe, and Latin America dominate the internet with websites, SEO, and AI optimization.</p>
              <Link href="/en/about" className="text-[#a78bfa] text-sm font-medium hover:text-white transition-colors mt-2 inline-block">Learn more →</Link>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-16 bg-[#0d0d14]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link key={p.slugEn} href={`/en/blog/${p.slugEn}`} className="group bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#7c3aed33] transition-all">
                  <span className="text-[#a78bfa] text-xs font-semibold">{p.categoryEn}</span>
                  <h3 className="text-white font-semibold text-sm mt-2 mb-2 line-clamp-2 group-hover:text-[#a78bfa] transition-colors">{p.titleEn}</h3>
                  <p className="text-[#8888aa] text-xs line-clamp-2">{p.excerptEn}</p>
                  <div className="flex items-center gap-1 text-[#a78bfa] text-xs mt-3 font-medium">Read <ArrowRight size={12} /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/en/blog" className="inline-flex items-center gap-2 text-[#8888aa] hover:text-white transition-colors text-sm">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>
    </>
  );
}
