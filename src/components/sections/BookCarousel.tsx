"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookCarouselProps {
  coverImage: string;
  backImage: string;
  title: string;
}

export default function BookCarousel({ coverImage, backImage, title }: BookCarouselProps) {
  const [current, setCurrent] = useState(0);
  const images = [coverImage, backImage];
  const labels = ["Portada", "Reverso"];

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative max-w-sm mx-auto w-full">
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-[#1e1e2e] bg-[#0d0d14]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: current === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: current === 0 ? 30 : -30 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex items-center justify-center p-2"
          >
            <Image
              src={images[current]}
              alt={`${title} — ${labels[current]}`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110"
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110"
          aria-label="Imagen siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dots + label */}
      <div className="flex items-center justify-center gap-4 mt-5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all rounded-full ${
              i === current
                ? "bg-[#b8860b] w-6 h-2"
                : "bg-[#1e1e2e] w-2 h-2 hover:bg-[#b8860b44]"
            }`}
            aria-label={labels[i]}
          />
        ))}
      </div>
      <p className="text-center text-[#8888aa] text-xs mt-2">
        {labels[current]} · {current + 1} / {images.length}
      </p>
    </div>
  );
}
