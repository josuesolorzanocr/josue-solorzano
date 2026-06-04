"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { books } from "@/lib/data/books";

interface BooksSectionProps {
  lang?: "es" | "en";
}

export default function BooksSection({ lang = "es" }: BooksSectionProps) {
  const isEn = lang === "en";

  return (
    <section id={isEn ? "books" : "libros"} className="py-24 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
            {isEn ? "Books" : "Libros"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            {isEn ? "Ideas that transform" : "Ideas que transforman"}
          </h2>
          <p className="text-[#8888aa] leading-relaxed">
            {isEn
              ? "Three books packed with frameworks, stories, and methodologies you can apply from today."
              : "Tres libros llenos de frameworks, historias y metodologías que puedes aplicar desde hoy."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {books.map((book, i) => (
            <motion.div
              key={book.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={isEn ? `/en/books/${book.slug}` : `/libros/${book.slug}`}>
                <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden hover:border-[#b8860b33] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#b8860b1a]">
                  {/* Book cover placeholder */}
                  <div
                    className="h-56 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${book.coverColor}33, ${book.coverColor}11)` }}
                  >
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 40%, ${book.coverColor}44, transparent 70%)` }} />
                    <div className="relative text-center p-6">
                      <BookOpen size={40} style={{ color: book.coverColor }} className="mx-auto mb-3 opacity-80" />
                      <div className="text-white font-bold text-lg leading-tight">
                        {isEn ? book.titleEn : book.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#f0c040] text-xs font-semibold">{book.year}</span>
                      <span className="text-[#8888aa] text-xs">{book.pages} {isEn ? "pages" : "páginas"}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#f0c040] transition-colors">
                      {isEn ? book.titleEn : book.title}
                    </h3>
                    <p className="text-[#8888aa] text-xs mb-4 leading-relaxed line-clamp-2">
                      {isEn ? book.subtitleEn : book.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(isEn ? book.tagsEn : book.tags).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-[#f0c040] bg-[#b8860b1a] px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href={isEn ? "/en/books" : "/libros"}
            className="group inline-flex items-center gap-2 text-[#f0c040] hover:text-white font-semibold transition-colors"
          >
            {isEn ? "Explore all books" : "Ver todos los libros"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
