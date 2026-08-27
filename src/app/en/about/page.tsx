import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig, alternatesCanonicas } from "@/lib/utils";
import { webPageSchema, personSchema } from "@/lib/schema";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: { absolute: "About Josué Solórzano | Digital Authority Specialist" },
  description:
    "Meet Josué Solórzano: a Costa Rican specialist in premium digital services, AI optimization, and digital authority. Building world-class online presences from Costa Rica.",
  alternates: alternatesCanonicas("en", "/sobre-mi", "/en/about"),
  openGraph: {
    title: "About Josué Solórzano",
    description: "Costa Rican specialist in digital authority, AI optimization, and premium websites for global markets.",
    url: `${siteConfig.url}/en/about`,
  },
};

const values = [
  { icon: "🎯", title: "Precision", desc: "Every detail matters. I don't deliver anything that wouldn't meet my own standard." },
  { icon: "🚀", title: "Real results", desc: "I don't sell promises. I deliver systems that work and can be measured." },
  { icon: "🌍", title: "Global vision", desc: "From Costa Rica, I build digital presences that compete in any market in the world." },
  { icon: "🤖", title: "AI-Native Execution", desc: "Built for the way people search today: Google, AI platforms, LinkedIn, websites and trust signals working together." },
];

export default function AboutEnPage() {
  const breadcrumbs = [
    { name: "Home", item: `${siteConfig.url}/en` },
    { name: "About", item: `${siteConfig.url}/en/about` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: "About Josué Solórzano", description: "Story and values of Josué Solórzano, digital authority specialist.", url: `${siteConfig.url}/en/about`, breadcrumbs })) }} />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#b8860b] opacity-[0.06] blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="flex items-center justify-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/en" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#f0c040]">About</span>
          </nav>
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">The story behind it</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-6 leading-tight">
            I bring discipline, precision<br />
            <span className="gradient-text">and modern AI systems</span><br />
            to digital authority.
          </h1>
          <p className="text-[#8888aa] text-xl leading-relaxed">
            A Costa Rican specialist in premium digital authority — helping businesses around the world improve trust, visibility and conversion across Google, AI search and their entire online presence.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="aspect-[4/5] bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden max-w-md mx-auto">
                <Image
                  src="/images/josue-avatar.jpg"
                  alt="Josué Solórzano — Costa Rica"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-30" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 lg:right-0 glass rounded-xl p-4 border border-[#b8860b33]">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <div className="text-white font-bold text-sm">Global reach</div>
                    <div className="text-[#8888aa] text-xs">USA · Europe · LATAM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-[#ccccdd] leading-relaxed">
              <p className="text-xl text-white font-medium">
                I come from Costa Rica with a background shaped by discipline, pressure and precision.
              </p>
              <p>
                Before entering the digital world, I worked as a police officer — a role that trained me to observe details, make decisions under pressure and never deliver unfinished work. Those skills don&apos;t leave you. They become your standard.
              </p>
              <p>
                Today, I apply that same standard to digital authority: <strong className="text-white">premium websites, AI visibility, SEO structure, brand positioning and conversion systems for businesses that want to compete in global markets.</strong>
              </p>
              <p>
                I may not come from the traditional agency world — and that is exactly the advantage. I bring modern tools, AI-native execution and a disciplined process designed for today&apos;s market, where being found by Google and AI platforms matters as much as having a great product.
              </p>
              <p>
                The result: a digital authority system built with the same attention to detail that kept me sharp in the most demanding job I&apos;ve ever had.
              </p>

              <div className="pt-4">
                <Link
                  href="/en#contact"
                  className="group inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-6 py-3 rounded-xl transition-all glow"
                >
                  Let&apos;s work together
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Why clients <span className="gradient-text">trust me</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 hover:border-[#b8860b33] transition-all">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-[#8888aa] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl lg:text-3xl font-bold text-white leading-snug">
            &ldquo;You don&apos;t need to be the oldest in the market. You need to be the most <span className="gradient-text">visible</span> — and that&apos;s exactly what I build.&rdquo;
          </blockquote>
          <cite className="text-[#f0c040] text-sm font-semibold mt-6 block">— Josué Solórzano</cite>
        </div>
      </section>

      <ContactSection lang="en" />
    </>
  );
}
