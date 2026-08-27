import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/utils";
import { webPageSchema, bookSchema } from "@/lib/schema";
import { books } from "@/lib/data/books";
import BookCarousel from "@/components/sections/BookCarousel";

export const metadata: Metadata = {
  title: "Define Your Authority — Book by Josué Solórzano",
  description:
    "Define Your Authority: Awaken Your New Identity. Josué Solórzano's book on identity, discipline and personal responsibility. Available on Amazon.",
  keywords: ["Define Your Authority", "Josué Solórzano book", "identity", "discipline", "personal authority", "Legacy Publishers"],
  alternates: {
    canonical: `${siteConfig.url}/en/books`,
    languages: { es: `${siteConfig.url}/libros`, en: `${siteConfig.url}/en/books`, "x-default": `${siteConfig.url}/libros` },
  },
  openGraph: {
    title: "Define Your Authority — Josué Solórzano",
    description: "Awaken Your New Identity. A book on identity, judgment and personal responsibility.",
    url: `${siteConfig.url}/en/books`,
    images: [{ url: "/images/libro-portada.jpg", width: 800, height: 1067 }],
  },
};

export default function BooksEnPage() {
  const book = books[0];
  const breadcrumbs = [
    { name: "Home", item: `${siteConfig.url}/en` },
    { name: "Book", item: `${siteConfig.url}/en/books` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema({ title: book.titleEn, description: book.descriptionEn, year: book.year, publisher: book.publisher, slug: book.slug })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: "Define Your Authority — Josué Solórzano", description: book.descriptionEn, url: `${siteConfig.url}/en/books`, breadcrumbs })) }} />

      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#b8860b] opacity-[0.05] blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-[#8888aa] mb-10">
            <Link href="/en" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#f0c040]">Book</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <BookCarousel coverImage={book.coverImage} backImage={book.backImage} title={book.titleEn} />
            <div>
              <span className="text-[#f0c040] text-xs font-semibold uppercase tracking-widest">{book.publisher} · {book.year}</span>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-2">{book.titleEn}</h1>
              <p className="text-[#b8860b] text-xl font-semibold mb-6">{book.subtitleEn}</p>
              <div className="border-l-4 border-[#b8860b] pl-5 mb-8">
                <p className="text-white text-lg leading-relaxed italic">&ldquo;{book.hookEn}&rdquo;</p>
              </div>
              <p className="text-[#8888aa] leading-relaxed mb-8">{book.descriptionEn}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {book.tagsEn.map((tag) => (
                  <span key={tag} className="text-xs text-[#f0c040] bg-[#b8860b1a] border border-[#b8860b33] px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-lg shadow-[#b8860b22]">
                  📦 Buy on Amazon
                </a>
                <Link href="/en#contact" className="inline-flex items-center justify-center gap-2 border border-[#1e1e2e] hover:border-[#b8860b33] text-[#8888aa] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all text-base">
                  Contact the author
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0d0d14] border-y border-[#1e1e2e] mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl text-[#b8860b] mb-6">&ldquo;</div>
          <blockquote className="text-white text-xl lg:text-2xl leading-relaxed font-light italic mb-8">{book.testimonialEn.quote}</blockquote>
          <cite className="text-[#b8860b] font-bold tracking-widest uppercase text-sm not-italic">— {book.testimonialEn.author}</cite>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">The heart of the book</span>
            <h2 className="text-4xl font-bold text-white mt-3">The C.A.D. Method</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { letter: "C", word: "Clarity", desc: "Knowing who you are, what you want and why. Without clarity, action is just noise." },
              { letter: "A", word: "Action", desc: "Deciding with direction. Not waiting for the perfect moment. Acting from who you choose to be." },
              { letter: "D", word: "Discipline", desc: "Becoming someone capable of sustaining what you conquer. Consistency defines your authority." },
            ].map((item) => (
              <div key={item.letter} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 text-center hover:border-[#b8860b33] transition-all">
                <div className="text-6xl font-black text-[#b8860b] mb-4">{item.letter}</div>
                <h3 className="text-white font-bold text-xl mb-3">{item.word}</h3>
                <p className="text-[#8888aa] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14] border-t border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stop living on autopilot</h2>
          <p className="text-[#8888aa] mb-8">Available on Amazon. Print and digital.</p>
          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-bold px-10 py-4 rounded-xl transition-all text-base">
            📦 Get my copy on Amazon
          </a>
        </div>
      </section>
    </>
  );
}
