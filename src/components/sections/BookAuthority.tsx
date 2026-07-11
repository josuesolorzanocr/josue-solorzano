"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import { books } from "@/lib/data/books";

interface BookAuthorityProps {
  lang?: "es" | "en";
}

export default function BookAuthority({ lang = "es" }: BookAuthorityProps) {
  const isEn = lang === "en";
  const book = books[0];

  return (
    <section className="py-24 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-56 sm:w-64 rounded-xl overflow-hidden border border-[#1e1e2e] shadow-2xl shadow-[#b8860b1a]">
              <Image
                src={book.coverImage}
                alt={isEn ? book.titleEn : book.title}
                width={400}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
              {isEn ? "Author" : "Autor"}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3 mb-4">
              {isEn ? "Authority backed by a published book" : "Autoridad respaldada por un libro publicado"}
            </h2>
            <p className="text-[#8888aa] leading-relaxed mb-6">
              {isEn ? book.hookEn : book.hook}
            </p>

            <div className="border-l-2 border-[#b8860b] pl-4 mb-8">
              <Quote size={18} className="text-[#b8860b] mb-2" />
              <p className="text-[#ccccdd] text-sm italic leading-relaxed mb-2">
                &ldquo;{isEn ? book.testimonialEn.quote : book.testimonial.quote}&rdquo;
              </p>
              <p className="text-[#8888aa] text-xs">
                — {isEn ? book.testimonialEn.author : book.testimonial.author}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={isEn ? `/en/books/${book.slug}` : `/libros/${book.slug}`}
                className="group inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                {isEn ? "Read more about the book" : "Conocer más del libro"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#b8860b33] text-[#f0c040] hover:bg-[#b8860b1a] font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                {isEn ? "Get it on Amazon" : "Consíguelo en Amazon"}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
