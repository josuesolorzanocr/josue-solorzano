"use client";

import { motion } from "framer-motion";
import { Check, Clock, ArrowRight } from "lucide-react";
import { services, combos } from "@/lib/data/services";
import Link from "next/link";

interface ServicesSectionProps {
  lang?: "es" | "en";
}

export default function ServicesSection({ lang = "es" }: ServicesSectionProps) {
  const isEn = lang === "en";

  return (
    <>
      {/* What we do */}
      <section id={isEn ? "services" : "servicios"} className="py-24 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
              {isEn ? "What we build for you" : "Qué construimos para ti"}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              {isEn ? "Everything an authority needs" : "Todo lo que una autoridad necesita"}
            </h2>
            <p className="text-[#8888aa] leading-relaxed">
              {isEn
                ? "From diagnosis to full transformation — we handle every layer of your digital authority so you can focus on your expertise."
                : "Desde el diagnóstico hasta la transformación total — manejamos cada capa de tu autoridad digital para que tú te enfoques en tu expertise."}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="group bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 hover:border-[#b8860b44] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">
                  {isEn ? service.titleEn : service.title}
                </h3>
                <p className="text-[#8888aa] text-xs leading-relaxed">
                  {isEn ? service.descriptionEn : service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Ladder / Pricing */}
      <section id={isEn ? "pricing" : "precios"} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-6"
          >
            <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
              {isEn ? "The Authority Path" : "El Camino a la Autoridad"}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              {isEn ? "Choose your starting point" : "Elige tu punto de partida"}
            </h2>
            <p className="text-[#8888aa] leading-relaxed">
              {isEn
                ? "Three steps. One destination: becoming the undeniable reference in your industry."
                : "Tres pasos. Un destino: convertirte en la referencia indiscutible de tu industria."}
            </p>
          </motion.div>

          {/* Step connector */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden lg:flex items-center justify-center gap-0 mb-10"
          >
            {combos.map((combo, i) => (
              <div key={combo.name} className="flex items-center">
                <div className={`text-xs font-bold px-4 py-1.5 rounded-full border ${
                  combo.highlighted
                    ? "bg-[#b8860b] border-[#b8860b] text-white"
                    : "bg-[#111118] border-[#1e1e2e] text-[#8888aa]"
                }`}>
                  {isEn ? combo.stepEn : combo.step}
                </div>
                {i < combos.length - 1 && (
                  <div className="w-24 h-px bg-gradient-to-r from-[#b8860b44] to-[#b8860b22] mx-1 flex items-center justify-center">
                    <ArrowRight size={12} className="text-[#b8860b55]" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {combos.map((combo, i) => (
              <motion.div
                key={combo.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col rounded-2xl p-8 border transition-all ${
                  combo.highlighted
                    ? "bg-gradient-to-b from-[#b8860b1a] to-[#111118] border-[#b8860b55] shadow-2xl shadow-[#b8860b1a] scale-[1.03]"
                    : "bg-[#111118] border-[#1e1e2e]"
                }`}
              >
                {combo.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-white text-xs font-bold px-4 py-1 rounded-full ${
                      combo.highlighted ? "bg-[#b8860b]" : "bg-[#1e1e2e] border border-[#b8860b33] text-[#f0c040]"
                    }`}>
                      {isEn ? combo.badgeEn : combo.badge}
                    </span>
                  </div>
                )}

                {/* Step label mobile */}
                <div className="lg:hidden mb-4">
                  <span className="text-[#f0c040] text-xs font-semibold uppercase tracking-widest">
                    {isEn ? combo.stepEn : combo.step}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-2">{isEn ? combo.nameEn : combo.name}</h3>
                  <p className="text-[#8888aa] text-sm leading-relaxed">
                    {isEn ? combo.descriptionEn : combo.description}
                  </p>
                </div>

                <div className="mb-1">
                  <span className="text-5xl font-bold text-white">{combo.price}</span>
                  <span className="text-[#8888aa] text-sm ml-2">
                    {isEn ? combo.priceNoteEn : combo.priceNote}
                  </span>
                </div>

                {(isEn ? combo.priceContextEn : combo.priceContext) && (
                  <div className="text-[#b8860b] text-xs font-medium mb-2">
                    {isEn ? combo.priceContextEn : combo.priceContext}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4 text-[#8888aa] text-xs">
                  <Clock size={12} />
                  <span>{isEn ? `Delivery: ${combo.deliveryTimeEn}` : `Entrega: ${combo.deliveryTime}`}</span>
                </div>

                {(isEn ? combo.idealForEn : combo.idealFor) && (
                  <div className="text-[#8888aa] text-xs leading-relaxed italic mb-4 border-l-2 border-[#b8860b33] pl-3">
                    {isEn ? combo.idealForEn : combo.idealFor}
                  </div>
                )}

                <ul className="space-y-3 mb-8 flex-1">
                  {(isEn ? combo.featuresEn : combo.features).map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check
                        size={15}
                        className={`flex-shrink-0 mt-0.5 ${combo.highlighted ? "text-[#f0c040]" : "text-[#b8860b]"}`}
                      />
                      <span className="text-[#ccccdd] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={isEn ? "/en#contact" : "/#contacto"}
                  className={`w-full text-center font-semibold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 group ${
                    combo.highlighted
                      ? "bg-[#b8860b] hover:bg-[#a07708] text-white glow"
                      : "border border-[#b8860b33] text-[#f0c040] hover:bg-[#b8860b1a]"
                  }`}
                >
                  {isEn ? "Get started" : "Comenzar ahora"}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[#8888aa] text-sm mt-10"
          >
            {isEn
              ? "Not sure which level fits your business? Start with the Digital Authority Audit or "
              : "¿No sabes qué nivel le conviene a tu negocio? Empieza con la Auditoría de Autoridad Digital o "}
            <Link href={isEn ? "/en#contact" : "/#contacto"} className="text-[#f0c040] hover:text-white transition-colors font-medium">
              {isEn ? "book a free fit call." : "agenda una llamada gratuita."}
            </Link>
          </motion.p>
        </div>
      </section>
    </>
  );
}
