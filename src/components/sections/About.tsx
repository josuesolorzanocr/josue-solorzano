"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AboutProps {
  lang?: "es" | "en";
}

export default function About({ lang = "es" }: AboutProps) {
  const isEn = lang === "en";

  const highlights = isEn
    ? [
        "Premium websites built to convert visitors into clients — not just look good",
        "Systems designed to scale: one site works for you 24/7 without extra effort",
        "Every project is bilingual and optimized for global markets from day one",
        "Measurable results: more leads, higher Google rankings, AI visibility",
      ]
    : [
        "Sitios web premium construidos para convertir visitantes en clientes — no solo verse bien",
        "Sistemas diseñados para escalar: un sitio trabaja por ti 24/7 sin esfuerzo extra",
        "Cada proyecto es bilingüe y optimizado para mercados globales desde el primer día",
        "Resultados medibles: más leads, mejor posición en Google, visibilidad en IAs",
      ];

  return (
    <section id={isEn ? "about" : "sobre-mi"} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#1e1e2e] aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <Image
                src="/images/josue-solorzano.jpg"
                alt="Josué Solórzano — Especialista en Autoridad Digital"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-40" />
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 lg:right-0 glass rounded-xl p-4 shadow-xl border border-[#b8860b33]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#b8860b1a] flex items-center justify-center text-xl">🚀</div>
                <div>
                  <div className="text-white font-semibold text-sm">{isEn ? "Scalable Systems" : "Sistemas Escalables"}</div>
                  <div className="text-[#8888aa] text-xs">{isEn ? "Built for growth" : "Diseñados para crecer"}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
              {isEn ? "Why it works" : "Por qué funciona"}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-6 leading-tight">
              {isEn ? (
                <>Quality products that <span className="gradient-text">scale your business</span></>
              ) : (
                <>Productos de calidad que <span className="gradient-text">escalan tu negocio</span></>
              )}
            </h2>
            <div className="space-y-4 text-[#8888aa] leading-relaxed mb-8">
              <p>
                {isEn
                  ? "A premium digital presence isn't a cost — it's a machine that generates clients while you sleep. Every system we build is designed with one purpose: that your business grows without you having to be present every moment."
                  : "Una presencia digital premium no es un gasto — es una máquina que genera clientes mientras duermes. Cada sistema que construimos está diseñado con un propósito: que tu negocio crezca sin que tengas que estar presente cada momento."}
              </p>
              <p>
                {isEn
                  ? "Quality is not negotiable. A slow site, a poorly positioned one, or one invisible to AIs costs you clients every single day. We build to the highest standard from day one — because mediocrity online is invisible."
                  : "La calidad no es negociable. Un sitio lento, mal posicionado o invisible para las IAs te cuesta clientes todos los días. Construimos al más alto estándar desde el primer día — porque la mediocridad en internet es invisibilidad."}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#b8860b1a] border border-[#b8860b33] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
                  </span>
                  <span className="text-[#ccccdd] text-sm">{h}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              href={isEn ? "/en/about" : "/sobre-mi"}
              className="group inline-flex items-center gap-2 text-[#f0c040] hover:text-white font-semibold transition-colors"
            >
              {isEn ? "Read the full story" : "Leer la historia completa"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
