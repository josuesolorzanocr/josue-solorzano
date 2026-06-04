"use client";

import { motion } from "framer-motion";

interface PhilosophyProps {
  lang?: "es" | "en";
}

const pillarsEs = [
  { icon: "🧠", title: "Mentalidad Primero", desc: "Todo resultado extraordinario comienza con un cambio interno. La mentalidad es el software que corre todo lo demás." },
  { icon: "⚡", title: "Ejecución Radical", desc: "Las ideas sin acción no existen. Los resultados se construyen con ejecución consistente, no con inspiración ocasional." },
  { icon: "🌐", title: "Ecosistema sobre Red", desc: "Las redes se construyen para pedir. Los ecosistemas se construyen para dar. La diferencia determina tu techo de crecimiento." },
  { icon: "🏆", title: "Legado, no Logro", desc: "Los logros son personales y temporales. El legado es colectivo y permanente. Lidera pensando en generaciones, no en trimestres." },
];

const pillarsEn = [
  { icon: "🧠", title: "Mindset First", desc: "Every extraordinary result begins with an internal shift. Mindset is the software running everything else." },
  { icon: "⚡", title: "Radical Execution", desc: "Ideas without action don't exist. Results are built with consistent execution, not occasional inspiration." },
  { icon: "🌐", title: "Ecosystem over Network", desc: "Networks are built to ask. Ecosystems are built to give. The difference determines your growth ceiling." },
  { icon: "🏆", title: "Legacy, not Achievement", desc: "Achievements are personal and temporary. Legacy is collective and permanent. Lead thinking in generations, not quarters." },
];

export default function Philosophy({ lang = "es" }: PhilosophyProps) {
  const isEn = lang === "en";
  const pillars = isEn ? pillarsEn : pillarsEs;

  return (
    <section id={isEn ? "philosophy" : "filosofia"} className="py-24 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
            {isEn ? "Philosophy" : "Filosofía"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            {isEn ? "The principles that guide everything" : "Los principios que guían todo"}
          </h2>
          <p className="text-[#8888aa] leading-relaxed">
            {isEn
              ? "After 15 years helping leaders and entrepreneurs, four pillars have proven to be universal constants of sustained impact."
              : "Después de 15 años ayudando a líderes y emprendedores, cuatro pilares han demostrado ser constantes universales del impacto sostenido."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 hover:border-[#b8860b33] transition-all hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#b8860b0a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
                <p className="text-[#8888aa] text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-2xl lg:text-3xl font-bold text-white leading-snug max-w-3xl mx-auto">
            &ldquo;
            {isEn
              ? "The most valuable investment you can make is not in your business. It's in the person who runs it."
              : "La inversión más valiosa que puedes hacer no es en tu negocio. Es en la persona que lo dirige."}
            &rdquo;
          </p>
          <cite className="text-[#f0c040] text-sm font-semibold mt-4 block">— Josue Solorzano</cite>
        </motion.blockquote>
      </div>
    </section>
  );
}
