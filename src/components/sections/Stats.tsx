"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  labelEn: string;
}

const stats: Stat[] = [
  { value: 3, suffix: "", label: "Productos de Autoridad", labelEn: "Authority Products" },
  { value: 24, suffix: "h", label: "Tiempo de respuesta", labelEn: "Response Time" },
  { value: 3, suffix: "", label: "Mercados Globales · USA · Europa · LATAM", labelEn: "Global Markets · USA · Europe · LATAM" },
  { value: 7, suffix: "", label: "Fases · Sistema de Autoridad", labelEn: "Phases · Authority System" },
];

function Counter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = value / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

interface StatsProps {
  lang?: "es" | "en";
}

export default function Stats({ lang = "es" }: StatsProps) {
  const isEn = lang === "en";

  return (
    <section className="py-20 border-y border-[#1e1e2e] bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2 glow-text">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[#8888aa] text-sm leading-snug">
                {isEn ? stat.labelEn : stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
