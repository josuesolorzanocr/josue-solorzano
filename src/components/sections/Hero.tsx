"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

interface HeroProps {
  lang?: "es" | "en";
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function Hero({ lang = "es" }: HeroProps) {
  const isEn = lang === "en";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050508]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#b8860b] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#0ea5e9] opacity-[0.04] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(#b8860b 1px, transparent 1px), linear-gradient(90deg, #b8860b 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-[#b8860b1a] border border-[#b8860b33] rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#b8860b] animate-pulse" />
            <span className="text-[#f0c040] text-sm font-medium">
              {isEn ? "Premium Digital Services & Brand Positioning" : "Servicios Digitales Premium & Posicionamiento de Marca"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
          >
            {isEn ? (
              <>Your brand, <span className="gradient-text">dominant</span><br />on the internet</>
            ) : (
              <>Tu marca, <span className="gradient-text">dominante</span><br />en internet</>
            )}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg sm:text-xl text-[#8888aa] leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            {isEn
              ? "Premium websites, AI-optimized content, verified profiles, and intelligent lead capture systems. We put your brand on the first page of Google — and in AI answers."
              : "Sitios web premium, contenido optimizado para IAs, perfiles verificados y sistemas inteligentes de captura de leads. Ponemos tu marca en la primera página de Google — y en las respuestas de las IAs."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={isEn ? "/en#contact" : "/#contacto"}
              className="group flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-8 py-4 rounded-xl transition-all glow text-base"
            >
              {isEn ? "Get a free quote" : "Cotiza gratis"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={isEn ? "/en#services" : "/#servicios"}
              className="flex items-center gap-2 text-white hover:text-[#f0c040] font-semibold px-8 py-4 rounded-xl border border-[#1e1e2e] hover:border-[#b8860b] transition-all text-base"
            >
              <Play size={16} className="fill-current" />
              {isEn ? "See services" : "Ver servicios"}
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-16 pt-8 border-t border-[#1e1e2e]"
          >
            <p className="text-[#8888aa] text-xs uppercase tracking-widest mb-6">
              {isEn ? "Your brand visible on" : "Tu marca visible en"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
              {["Google", "ChatGPT", "Perplexity", "LinkedIn", "Wikidata", "HARO", "Claude"].map((brand) => (
                <span key={brand} className="text-white font-bold text-sm tracking-wider">{brand}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#8888aa] text-xs">scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#b8860b] to-transparent" />
      </motion.div>
    </section>
  );
}
