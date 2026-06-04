"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { speakingEvents, speakingTopics } from "@/lib/data/speaking";

interface SpeakingSectionProps {
  lang?: "es" | "en";
}

export default function SpeakingSection({ lang = "es" }: SpeakingSectionProps) {
  const isEn = lang === "en";
  const recentEvents = speakingEvents.slice(0, 4);

  return (
    <section id={isEn ? "speaking" : "conferencias"} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Topics */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
                {isEn ? "Keynotes & Workshops" : "Conferencias & Talleres"}
              </span>
              <h2 className="text-4xl font-bold text-white mt-3 mb-4 leading-tight">
                {isEn ? "An experience your audience won't forget" : "Una experiencia que tu audiencia no olvidará"}
              </h2>
              <p className="text-[#8888aa] leading-relaxed mb-8">
                {isEn
                  ? "Each talk is customized to your organization's needs, culture, and challenges. No generic presentations — only tailored experiences."
                  : "Cada conferencia está personalizada a las necesidades, cultura y retos de tu organización. Cero presentaciones genéricas — solo experiencias a la medida."}
              </p>
            </motion.div>

            <div className="space-y-4">
              {speakingTopics.map((topic, i) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex gap-4 p-4 rounded-xl border border-[#1e1e2e] hover:border-[#b8860b33] bg-[#111118] transition-all"
                >
                  <div className="text-2xl flex-shrink-0">{topic.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-semibold text-sm">
                        {isEn ? topic.titleEn : topic.title}
                      </h3>
                      <span className="text-[#8888aa] text-xs bg-[#1e1e2e] rounded-md px-2 py-0.5 flex-shrink-0">
                        {topic.duration}
                      </span>
                    </div>
                    <p className="text-[#8888aa] text-xs mt-1 leading-relaxed">
                      {isEn ? topic.descriptionEn : topic.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Link
                href={isEn ? "/en/speaking" : "/conferencias"}
                className="group inline-flex items-center gap-2 text-[#f0c040] hover:text-white font-semibold transition-colors"
              >
                {isEn ? "See all speaking topics" : "Ver todos los temas"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Recent Events */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white font-bold text-xl mb-6"
            >
              {isEn ? "Recent Engagements" : "Eventos Recientes"}
            </motion.h3>

            <div className="space-y-3">
              {recentEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#111118] border border-[#1e1e2e]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#b8860b1a] border border-[#b8860b33] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#f0c040] font-bold text-xs">{event.year}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate">
                      {isEn ? event.eventEn : event.event}
                    </div>
                    <div className="text-[#f0c040] text-xs mt-0.5">
                      {isEn ? event.topicEn : event.topic}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[#8888aa] text-xs">
                        <MapPin size={10} />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1 text-[#8888aa] text-xs capitalize">
                        <Calendar size={10} />
                        {event.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#b8860b1a] to-[#111118] border border-[#b8860b33]"
            >
              <h4 className="text-white font-bold mb-2">
                {isEn ? "Ready to book Josue?" : "¿Listo para contratar a Josue?"}
              </h4>
              <p className="text-[#8888aa] text-sm mb-4">
                {isEn
                  ? "Available for keynotes, workshops, retreats, and executive programs in Latin America and globally."
                  : "Disponible para keynotes, talleres, retiros y programas ejecutivos en Latinoamérica y globalmente."}
              </p>
              <Link
                href={isEn ? "/en#contact" : "/#contacto"}
                className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
              >
                {isEn ? "Get in touch" : "Contáctanos"}
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
