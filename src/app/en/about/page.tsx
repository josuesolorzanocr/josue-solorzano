import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { webPageSchema, personSchema } from "@/lib/schema";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "About Josué Solórzano | Digital Authority Specialist",
  description:
    "Meet Josué Solórzano: a Costa Rican specialist in premium digital services, AI optimization, and digital authority. Building world-class online presences from Costa Rica.",
  alternates: { canonical: `${siteConfig.url}/en/about` },
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
  { icon: "🤖", title: "Ahead of the curve", desc: "While others are just discovering AI, I'm already using it to position my clients inside it." },
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
            I didn&apos;t come from the tech world.<br />
            <span className="gradient-text">I came to transform it.</span>
          </h1>
          <p className="text-[#8888aa] text-xl leading-relaxed">
            A Costa Rican who went from the streets to the digital frontier — and now helps businesses around the world dominate the internet.
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
                There are things that shape you in ways you don&apos;t expect.
              </p>
              <p>
                For years I worked as a police officer. A job that demands absolute discipline, attention to detail, and the ability to act with clarity when everything around you is chaos. I didn&apos;t leave those skills behind when I changed direction — I brought them with me.
              </p>
              <p>
                A few months ago I discovered the world of artificial intelligence and digital services. And what I saw made one thing clear: <strong className="text-white">most businesses in the world are completely invisible on the internet.</strong> No presence, no authority, no system to attract clients.
              </p>
              <p>
                I decided to learn with the same intensity I trained for the most demanding job I&apos;d ever had. I studied SEO, premium web design, AI optimization, digital authority. And I realized I could build something very few people offer: <strong className="text-white">world-class results from Costa Rica, for clients in any corner of the planet.</strong>
              </p>
              <p>
                I don&apos;t have decades of experience. I have something better: fresh eyes, access to the world&apos;s most advanced tools, and the discipline of someone who never delivers half-finished work.
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
