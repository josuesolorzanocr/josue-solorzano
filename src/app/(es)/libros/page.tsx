import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, alternatesCanonicas } from "@/lib/utils";
import { webPageSchema, bookSchema } from "@/lib/schema";
import { books } from "@/lib/data/books";
import BookCarousel from "@/components/sections/BookCarousel";

export const metadata: Metadata = {
  title: { absolute: "Define Tu Autoridad — Libro de Josué Solórzano" },
  description:
    "Define Tu Autoridad: Despierta Tu Nueva Identidad. El libro de Josué Solórzano sobre identidad, disciplina y responsabilidad personal. Disponible en Amazon.",
  keywords: ["Define Tu Autoridad", "libro Josué Solórzano", "identidad", "disciplina", "autoridad personal", "Legacy Publishers"],
  alternates: alternatesCanonicas("es", "/libros", "/en/books"),
  openGraph: {
    title: "Define Tu Autoridad — Josué Solórzano",
    description: "Despierta Tu Nueva Identidad. Un libro sobre identidad, criterio y responsabilidad personal.",
    url: `${siteConfig.url}/libros`,
    images: [{ url: "/images/libro-portada.jpg", width: 800, height: 1067 }],
  },
};

export default function LibrosPage() {
  const book = books[0];
  const breadcrumbs = [
    { name: "Inicio", item: siteConfig.url },
    { name: "Libro", item: `${siteConfig.url}/libros` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            bookSchema({ title: book.title, description: book.description, year: book.year, publisher: book.publisher, slug: book.slug })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({ title: "Define Tu Autoridad — Josué Solórzano", description: book.description, url: `${siteConfig.url}/libros`, breadcrumbs })
          ),
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#b8860b] opacity-[0.05] blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-[#8888aa] mb-10">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#f0c040]">Libro</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Carousel */}
            <BookCarousel
              coverImage={book.coverImage}
              backImage={book.backImage}
              title={book.title}
            />

            {/* Info */}
            <div>
              <span className="text-[#f0c040] text-xs font-semibold uppercase tracking-widest">
                {book.publisher} · {book.year}
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-2">
                {book.title}
              </h1>
              <p className="text-[#b8860b] text-xl font-semibold mb-6">
                {book.subtitle}
              </p>

              {/* Hook */}
              <div className="border-l-4 border-[#b8860b] pl-5 mb-8">
                <p className="text-white text-lg leading-relaxed italic">
                  &ldquo;{book.hook}&rdquo;
                </p>
              </div>

              <p className="text-[#8888aa] leading-relaxed mb-8">
                {book.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {book.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#f0c040] bg-[#b8860b1a] border border-[#b8860b33] px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-lg shadow-[#b8860b22]"
                >
                  📦 Comprar en Amazon
                </a>
                <Link
                  href="/#contacto"
                  className="inline-flex items-center justify-center gap-2 border border-[#1e1e2e] hover:border-[#b8860b33] text-[#8888aa] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
                >
                  Contactar al autor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-[#0d0d14] border-y border-[#1e1e2e] mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl text-[#b8860b] mb-6">&ldquo;</div>
          <blockquote className="text-white text-xl lg:text-2xl leading-relaxed font-light italic mb-8">
            {book.testimonial.quote}
          </blockquote>
          <cite className="text-[#b8860b] font-bold tracking-widest uppercase text-sm not-italic">
            — {book.testimonial.author}
          </cite>
        </div>
      </section>

      {/* Método CAD */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">El corazón del libro</span>
            <h2 className="text-4xl font-bold text-white mt-3">El Método C.A.D.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { letter: "C", word: "Claridad", desc: "Saber quién eres, qué quieres y por qué lo quieres. Sin claridad, la acción es solo ruido." },
              { letter: "A", word: "Acción", desc: "Decidir con dirección. No esperar el momento perfecto. Actuar desde quien decides ser." },
              { letter: "D", word: "Disciplina", desc: "Convertirte en una persona capaz de sostener lo que conquistas. La consistencia define tu autoridad." },
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

      {/* Final CTA */}
      <section className="py-16 bg-[#0d0d14] border-t border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Deja de vivir en automático
          </h2>
          <p className="text-[#8888aa] mb-8">
            Disponible en Amazon. Físico y digital.
          </p>
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-bold px-10 py-4 rounded-xl transition-all text-base"
          >
            📦 Conseguir mi ejemplar en Amazon
          </a>
        </div>
      </section>
    </>
  );
}
