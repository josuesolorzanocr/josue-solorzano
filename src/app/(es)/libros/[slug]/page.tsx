import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
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
    title: `${book.title} | Josue Solorzano`,
    description: `${book.subtitle} — ${book.description.slice(0, 150)}...`,
    keywords: [...book.tags, "Josue Solorzano", "libro liderazgo"],
    alternates: { canonical: `${siteConfig.url}/libros/${book.slug}` },
    openGraph: {
      title: book.title,
      description: book.subtitle,
      url: `${siteConfig.url}/libros/${book.slug}`,
    },
  };
}

export default async function LibroPage({ params }: Props) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const otherBooks = books.filter((b) => b.slug !== book.slug);
  const breadcrumbs = [
    { name: "Inicio", item: siteConfig.url },
    { name: "Libros", item: `${siteConfig.url}/libros` },
    { name: book.title, item: `${siteConfig.url}/libros/${book.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema({ title: book.title, description: book.description, isbn: book.isbn, year: book.year, publisher: book.publisher, slug: book.slug })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: book.title, description: book.subtitle, url: `${siteConfig.url}/libros/${book.slug}`, breadcrumbs })) }} />

      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/" className="hover:text-white transition-colors">Inicio</a>
            <span>/</span>
            <a href="/libros" className="hover:text-white transition-colors">Libros</a>
            <span>/</span>
            <span className="text-[#a78bfa]">{book.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Book visual */}
            <div className="lg:col-span-1">
              <div
                className="aspect-[3/4] rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${book.coverColor}33, ${book.coverColor}0a)` }}
              >
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, ${book.coverColor}55, transparent 70%)` }} />
                <div className="relative text-center p-8">
                  <BookOpen size={56} style={{ color: book.coverColor }} className="mx-auto mb-4 opacity-70" />
                  <h1 className="text-white font-bold text-xl leading-tight">{book.title}</h1>
                  <p className="text-white/60 text-sm mt-2">{book.subtitle}</p>
                </div>
              </div>

              {/* Book meta */}
              <div className="mt-6 bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 space-y-3">
                {[
                  { label: "Año", value: book.year.toString() },
                  { label: "Páginas", value: `${book.pages} páginas` },
                  { label: "ISBN", value: book.isbn },
                  { label: "Editorial", value: book.publisher },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-[#8888aa]">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold py-3.5 rounded-xl transition-all glow"
              >
                Comprar en Amazon
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Book content */}
            <div className="lg:col-span-2">
              <span className="text-[#a78bfa] text-xs font-semibold uppercase tracking-widest">Bestseller {book.year}</span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-2">{book.title}</h1>
              <p className="text-[#8888aa] text-xl mb-6">{book.subtitle}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {book.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#a78bfa] bg-[#7c3aed1a] border border-[#7c3aed33] px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-white text-xl font-bold mb-3">Acerca del libro</h2>
                <p className="text-[#ccccdd] leading-relaxed text-lg">{book.description}</p>
              </div>

              {/* What you'll learn */}
              <div className="mt-10 bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-4">¿Qué aprenderás?</h2>
                <ul className="space-y-3">
                  {[
                    "Frameworks prácticos que puedes implementar desde el primer día",
                    "Casos reales de líderes latinoamericanos que transformaron sus organizaciones",
                    "Metodologías probadas con más de 50,000 líderes en 15 países",
                    "Herramientas de autoevaluación y plan de acción personalizado",
                  ].map((item, i) => (
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

      {/* Other books */}
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Otros libros de Josue</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {otherBooks.map((b) => (
              <Link key={b.slug} href={`/libros/${b.slug}`} className="group flex gap-5 p-5 bg-[#111118] border border-[#1e1e2e] rounded-xl hover:border-[#7c3aed33] transition-all">
                <div className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${b.coverColor}22` }}>
                  <BookOpen size={20} style={{ color: b.coverColor }} />
                </div>
                <div>
                  <div className="text-white font-semibold group-hover:text-[#a78bfa] transition-colors">{b.title}</div>
                  <div className="text-[#8888aa] text-xs mt-1 line-clamp-2">{b.subtitle}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
