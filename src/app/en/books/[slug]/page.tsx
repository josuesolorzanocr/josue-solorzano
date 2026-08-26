import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { books, getBookBySlug } from "@/lib/data/books";
import { siteConfig } from "@/lib/utils";
import { bookSchema, webPageSchema } from "@/lib/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  return {
    title: `${book.titleEn} by Josue Solorzano`,
    description: `${book.subtitleEn} — ${book.descriptionEn.slice(0, 150)}...`,
    keywords: [...book.tagsEn, "Josue Solorzano", "leadership book"],
    alternates: {
      canonical: `${siteConfig.url}/en/books/${book.slug}`,
      languages: { es: `${siteConfig.url}/libros/${book.slug}`, en: `${siteConfig.url}/en/books/${book.slug}` },
    },
    openGraph: { title: book.titleEn, description: book.subtitleEn, url: `${siteConfig.url}/en/books/${book.slug}` },
  };
}

export default async function BookEnPage({ params }: Props) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const otherBooks = books.filter((b) => b.slug !== book.slug);
  const breadcrumbs = [
    { name: "Home", item: `${siteConfig.url}/en` },
    { name: "Books", item: `${siteConfig.url}/en/books` },
    { name: book.titleEn, item: `${siteConfig.url}/en/books/${book.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema({ title: book.titleEn, description: book.descriptionEn, year: book.year, publisher: book.publisher, slug: book.slug })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: book.titleEn, description: book.subtitleEn, url: `${siteConfig.url}/en/books/${book.slug}`, breadcrumbs })) }} />

      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/en" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/en/books" className="hover:text-white transition-colors">Books</a>
            <span>/</span>
            <span className="text-[#a78bfa]">{book.titleEn}</span>
          </nav>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${book.coverColor}33, ${book.coverColor}0a)` }}>
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, ${book.coverColor}55, transparent 70%)` }} />
                <div className="relative text-center p-8">
                  <BookOpen size={56} style={{ color: book.coverColor }} className="mx-auto mb-4 opacity-70" />
                  <h1 className="text-white font-bold text-xl leading-tight">{book.titleEn}</h1>
                  <p className="text-white/60 text-sm mt-2">{book.subtitleEn}</p>
                </div>
              </div>
              <div className="mt-6 bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 space-y-3">
                {[{ label: "Year", value: book.year.toString() }, { label: "Pages", value: `${book.pages} pages` }, { label: "Publisher", value: book.publisher }].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-[#8888aa]">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold py-3.5 rounded-xl transition-all glow">
                Buy on Amazon <ArrowRight size={16} />
              </a>
            </div>
            <div className="lg:col-span-2">
              <span className="text-[#a78bfa] text-xs font-semibold uppercase tracking-widest">Bestseller {book.year}</span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-2">{book.titleEn}</h1>
              <p className="text-[#8888aa] text-xl mb-6">{book.subtitleEn}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {book.tagsEn.map((tag) => (
                  <span key={tag} className="text-xs text-[#a78bfa] bg-[#7c3aed1a] border border-[#7c3aed33] px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <h2 className="text-white text-xl font-bold mb-3">About the book</h2>
              <p className="text-[#ccccdd] leading-relaxed text-lg">{book.descriptionEn}</p>
              <div className="mt-10 bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-4">What you&apos;ll learn</h2>
                <ul className="space-y-3">
                  {["Practical frameworks you can implement from day one", "Real case studies from Latin American leaders who transformed their organizations", "Proven methodologies tested with 50,000+ leaders in 15 countries", "Self-assessment tools and personalized action plan"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#7c3aed1a] border border-[#7c3aed33] flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                      </span>
                      <span className="text-[#ccccdd] text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Other books by Josue</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {otherBooks.map((b) => (
              <Link key={b.slug} href={`/en/books/${b.slug}`} className="group flex gap-5 p-5 bg-[#111118] border border-[#1e1e2e] rounded-xl hover:border-[#7c3aed33] transition-all">
                <div className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${b.coverColor}22` }}>
                  <BookOpen size={20} style={{ color: b.coverColor }} />
                </div>
                <div>
                  <div className="text-white font-semibold group-hover:text-[#a78bfa] transition-colors">{b.titleEn}</div>
                  <div className="text-[#8888aa] text-xs mt-1 line-clamp-2">{b.subtitleEn}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
