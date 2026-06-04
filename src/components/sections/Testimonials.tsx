"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/data/testimonials";
import { Star, MessageSquarePlus } from "lucide-react";

interface TestimonialsProps {
  lang?: "es" | "en";
}

export default function Testimonials({ lang = "es" }: TestimonialsProps) {
  const isEn = lang === "en";

  return (
    <section id="testimonios" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
            {isEn ? "Testimonials" : "Testimonios"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            {isEn ? "Results that speak for themselves" : "Resultados que hablan solos"}
          </h2>
          <p className="text-[#8888aa] leading-relaxed">
            {isEn
              ? "Real businesses, real results. This is what happens when digital presence is done right."
              : "Negocios reales, resultados reales. Esto es lo que pasa cuando la presencia digital se hace bien."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 hover:border-[#b8860b33] transition-all flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={14} className="fill-[#b8860b] text-[#b8860b]" />
                ))}
              </div>

              {/* Service tag */}
              <span className="text-[#f0c040] text-xs font-semibold bg-[#b8860b1a] border border-[#b8860b22] px-3 py-1 rounded-full self-start mb-4">
                {isEn ? t.serviceEn : t.service}
              </span>

              <blockquote className="text-[#ccccdd] text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{isEn ? t.quoteEn : t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 border-t border-[#1e1e2e] pt-4">
                <div className="w-10 h-10 rounded-full bg-[#b8860b] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{t.name}</div>
                  <div className="text-[#8888aa] text-xs truncate">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leave a review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <p className="text-[#8888aa] text-sm">
            {isEn ? "Did we work together?" : "¿Trabajamos juntos?"}
          </p>
          <a
            href={`mailto:vjosue.3004@gmail.com?subject=${encodeURIComponent(isEn ? "I want to leave a review" : "Quiero dejar mi testimonio")}&body=${encodeURIComponent(isEn ? "Hi Josue,\n\nI'd like to share my experience working with you:\n\n" : "Hola Josue,\n\nMe gustaría compartir mi experiencia trabajando contigo:\n\n")}`}
            className="inline-flex items-center gap-2 border border-[#b8860b33] text-[#f0c040] hover:bg-[#b8860b1a] font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
          >
            <MessageSquarePlus size={16} />
            {isEn ? "Leave your review" : "Dejar mi reseña"}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
