import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { webPageSchema, personSchema } from "@/lib/schema";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Sobre Mí | Josue Solorzano",
  description:
    "Conoce a Josue Solorzano: experto en servicios digitales premium desde Costa Rica con alcance global. Sitios web, SEO, optimización para IAs y autoridad digital.",
  keywords: ["Josue Solorzano", "servicios digitales Costa Rica", "experto SEO", "optimización IA", "diseño web premium"],
  alternates: { canonical: `${siteConfig.url}/sobre-mi` },
};

const values = [
  { icon: "🎯", title: "Precisión", desc: "Cada detalle importa. No entrego nada que no superaría mi propio estándar." },
  { icon: "🚀", title: "Resultados reales", desc: "No vendo promesas. Entrego sistemas que funcionan y se pueden medir." },
  { icon: "🌍", title: "Visión global", desc: "Desde Costa Rica, construyo presencias digitales que compiten en cualquier mercado del mundo." },
  { icon: "🤖", title: "A la vanguardia", desc: "Mientras otros apenas descubren la IA, yo ya la uso para posicionar a mis clientes dentro de ella." },
];

export default function SobreMiPage() {
  const breadcrumbs = [
    { name: "Inicio", item: siteConfig.url },
    { name: "Sobre Mí", item: `${siteConfig.url}/sobre-mi` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: "Sobre Josue Solorzano", description: "Historia y valores de Josue Solorzano, experto en servicios digitales premium.", url: `${siteConfig.url}/sobre-mi`, breadcrumbs })) }} />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#b8860b] opacity-[0.06] blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="flex items-center justify-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/" className="hover:text-white transition-colors">Inicio</a>
            <span>/</span>
            <span className="text-[#f0c040]">Sobre Mí</span>
          </nav>
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">La historia detrás</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-6 leading-tight">
            No vine del mundo tech.<br />
            <span className="gradient-text">Vine a transformarlo.</span>
          </h1>
          <p className="text-[#8888aa] text-xl leading-relaxed">
            Un costarricense que pasó de las calles a la vanguardia digital — y que ahora ayuda a negocios de todo el mundo a dominar internet.
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
                    <div className="text-white font-bold text-sm">Alcance global</div>
                    <div className="text-[#8888aa] text-xs">USA · Europa · LATAM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-[#ccccdd] leading-relaxed">
              <p className="text-xl text-white font-medium">
                Hay cosas que te forman de maneras que no esperas.
              </p>
              <p>
                Durante años trabajé como policía. Un trabajo que te exige disciplina absoluta, atención al detalle y la capacidad de actuar con claridad cuando todo a tu alrededor es caos. Esas habilidades no las dejé cuando cambié de camino — las traje conmigo.
              </p>
              <p>
                Hace pocos meses descubrí el mundo de la inteligencia artificial y los servicios digitales. Y lo que vi me dejó claro una cosa: <strong className="text-white">la mayoría de negocios en el mundo están completamente invisibles en internet.</strong> Sin presencia, sin autoridad, sin sistema para atraer clientes.
              </p>
              <p>
                Decidí aprender con la misma intensidad con la que entrenaba para el trabajo más exigente que había tenido. Estudié SEO, diseño web premium, optimización para IAs, autoridad digital. Y me di cuenta de que podía construir algo que muy pocos ofrecen: <strong className="text-white">resultados de nivel mundial desde Costa Rica, para clientes en cualquier rincón del planeta.</strong>
              </p>
              <p>
                No tengo décadas de experiencia. Tengo algo mejor: ojos frescos, acceso a las herramientas más avanzadas del mundo, y la disciplina de alguien que nunca entrega trabajo a medias.
              </p>

              <div className="pt-4">
                <Link
                  href="/#contacto"
                  className="group inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-6 py-3 rounded-xl transition-all glow"
                >
                  Trabajemos juntos
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
            Por qué los clientes <span className="gradient-text">confían en mí</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
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
            &ldquo;No necesitas ser el más antiguo en el mercado. Necesitas ser el más <span className="gradient-text">visible</span> — y eso es exactamente lo que construyo.&rdquo;
          </blockquote>
          <cite className="text-[#f0c040] text-sm font-semibold mt-6 block">— Josue Solorzano</cite>
        </div>
      </section>

      <ContactSection lang="es" />
    </>
  );
}
