"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EcosystemProps {
  lang?: "es" | "en";
}

const ecosystemEs = [
  { icon: "🔍", title: "Authority Audit", desc: "Diagnóstico completo de tu presencia digital", href: "/#precios" },
  { icon: "🤖", title: "AI Presence Starter", desc: "Optimización técnica para que las IAs te recomienden", href: "/#precios" },
  { icon: "🏆", title: "Digital Authority Blueprint", desc: "Transformación total en 7 fases — Done For You", href: "/#precios" },
  { icon: "📚", title: "Libro en Amazon", desc: "Líder Sin Título — disponible en Amazon", href: "/libros" },
  { icon: "📰", title: "Media Kit", desc: "Bio oficial, pitch emails y recursos para prensa", href: "/media-kit" },
  { icon: "✍️", title: "Blog", desc: "Estrategias de autoridad digital y posicionamiento", href: "/blog" },
];

const ecosystemEn = [
  { icon: "🔍", title: "Authority Audit", desc: "Complete diagnosis of your digital presence", href: "/en#pricing" },
  { icon: "🤖", title: "AI Presence Starter", desc: "Technical optimization so AIs recommend you", href: "/en#pricing" },
  { icon: "🏆", title: "Digital Authority Blueprint", desc: "Full transformation in 7 phases — Done For You", href: "/en#pricing" },
  { icon: "📚", title: "Book on Amazon", desc: "Leader Without a Title — available on Amazon", href: "/en/books" },
  { icon: "📰", title: "Media Kit", desc: "Official bio, pitch emails and press resources", href: "/media-kit" },
  { icon: "✍️", title: "Blog", desc: "Digital authority and positioning strategies", href: "/en/blog" },
];

export default function Ecosystem({ lang = "es" }: EcosystemProps) {
  const isEn = lang === "en";
  const items = isEn ? ecosystemEn : ecosystemEs;

  return (
    <section id="ecosistema" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
            {isEn ? "Ecosystem" : "Ecosistema"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            {isEn ? "Multiple channels, one mission" : "Múltiples canales, una misión"}
          </h2>
          <p className="text-[#8888aa] leading-relaxed">
            {isEn
              ? "The Josue Solorzano ecosystem is designed to reach you wherever you are in your leadership journey."
              : "El ecosistema Josue Solorzano está diseñado para alcanzarte donde estés en tu camino de liderazgo."}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link href={item.href} className="group flex items-center gap-5 p-5 bg-[#111118] border border-[#1e1e2e] rounded-xl hover:border-[#b8860b33] hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#b8860b1a] border border-[#b8860b33] flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm group-hover:text-[#f0c040] transition-colors">{item.title}</div>
                  <div className="text-[#8888aa] text-xs mt-0.5">{item.desc}</div>
                </div>
                <ArrowRight size={14} className="text-[#8888aa] group-hover:text-[#f0c040] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
