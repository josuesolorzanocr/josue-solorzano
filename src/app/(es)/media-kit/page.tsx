import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mail, Globe, Users, BookOpen, Mic, Building2 } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Media Kit | Josue Solorzano",
  description:
    "Media kit profesional de Josue Solorzano. Bio oficial, estadísticas, temas de conferencias, libros publicados y contacto para medios, podcasts y prensa.",
  alternates: { canonical: `${siteConfig.url}/media-kit` },
  robots: { index: true, follow: true },
};

const stats = [
  { label: "Productos de Autoridad Digital", value: "3" },
  { label: "Tiempo de Respuesta", value: "24h" },
  { label: "Libro publicado en Amazon", value: "1" },
  { label: "Mercados Globales · USA · Europa · LATAM", value: "3" },
];

const topics = [
  "Autoridad Digital y Posicionamiento de Marca Personal",
  "Cómo optimizar tu presencia digital para que Google y las IAs entiendan mejor tu autoridad",
  "El Sistema de Autoridad Digital: 7 fases para construir presencia de clase mundial",
  "Identidad, Criterio y Responsabilidad Personal (Método C.A.D.)",
  "Estrategias de Visibilidad Online para el Mercado USA y Europa",
  "Por qué el SEO tradicional ya no es suficiente en la era de la búsqueda con IA",
];

const pitchEmails = [
  {
    to: "Podcasts",
    subject: "Guest pitch: Josué Solórzano — Digital Authority & AI Search Expert",
    body: `Hi [Host Name],

I'm Josué Solórzano, a digital authority specialist from Costa Rica helping experts, consultants, founders and service businesses build world-class online presence — so they become more visible, understood and trusted across Google, AI search and global markets.

I'd love to be a guest on [Podcast Name]. Here's what I can bring to your audience:

🎯 Topic: "How AI Search Is Changing Digital Authority for Experts and Businesses"
— Why many professionals are invisible to AI-powered search
— The authority signals AI platforms use to understand brands
— How websites, schema, LinkedIn, PR and content work together
— Why traditional SEO is no longer enough

I'm the author of "Define Your Authority" (Amazon) and creator of the Digital Authority System — a 7-phase framework that positions brands as trusted references in their industry.

Happy to send a one-pager or jump on a 15-min call.

Best,
Josué Solórzano
josuesolorzano.com | vjosue.3004@gmail.com
`,
  },
  {
    to: "Medios y Revistas",
    subject: "Expert source: Digital authority and AI search strategies — Josue Solorzano",
    body: `Hi [Editor/Reporter Name],

I'm Josue Solorzano, a digital authority specialist based in Costa Rica, working with clients in the US, Europe, and Latin America.

I'm available as an expert source for stories on:
• How professionals and businesses can improve their visibility in AI-powered search
• The new rules of digital authority in the AI era
• Why traditional SEO is no longer enough for brands competing globally
• How schema, structured data, and entity signals shape AI understanding

I can provide data, quotes, or a full interview at your convenience.

Media kit and headshots: josuesolorzano.com/media-kit
Email: vjosue.3004@gmail.com

Best regards,
Josue Solorzano
`,
  },
];

export default function MediaKitPage() {
  const breadcrumbs = [
    { name: "Inicio", item: siteConfig.url },
    { name: "Media Kit", item: `${siteConfig.url}/media-kit` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              title: "Media Kit — Josue Solorzano",
              description:
                "Kit de prensa oficial de Josue Solorzano para medios, podcasts y prensa especializada.",
              url: `${siteConfig.url}/media-kit`,
              breadcrumbs,
            })
          ),
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#b8860b] opacity-[0.06] blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="flex items-center justify-center gap-2 text-xs text-[#8888aa] mb-8">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#f0c040]">Media Kit</span>
          </nav>
          {/* Foto */}
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#b8860b] shadow-lg shadow-[#b8860b33]">
              <Image
                src="/images/josue-avatar.jpg"
                alt="Josué Solórzano"
                width={112}
                height={112}
                className="object-cover object-top w-full h-full"
              />
            </div>
          </div>
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">Para Medios y Prensa</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-2">
            Josué <span className="gradient-text">Solórzano</span>
          </h1>
          <p className="text-[#8888aa] text-base mb-2">Digital Authority Strategist · Costa Rica</p>
          <p className="text-[#8888aa] text-xl leading-relaxed max-w-2xl mx-auto mt-4">
            Todo lo que necesitas para cubrir, entrevistar o presentar a Josué Solórzano en tu medio, podcast o plataforma.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="mailto:vjosue.3004@gmail.com?subject=Media%20Inquiry%20—%20Josue%20Solorzano"
              className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-6 py-3 rounded-xl transition-all glow text-sm"
            >
              <Mail size={16} />
              Contactar para entrevista
            </a>
            <a
              href={siteConfig.url}
              className="inline-flex items-center gap-2 border border-[#1e1e2e] hover:border-[#b8860b33] text-[#8888aa] hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              <Globe size={16} />
              Ver sitio web
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#0d0d14] border-y border-[#1e1e2e]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-[#8888aa] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio oficial */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Bio corta */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Bio Corta (50 palabras)</h2>
              </div>
              <p className="text-[#ccccdd] leading-relaxed text-sm">
                Josué Solórzano es especialista en autoridad digital y posicionamiento de marca desde Costa Rica. Ayuda a expertos, consultores, fundadores y negocios de servicios a construir una presencia digital de clase mundial que mejora confianza, visibilidad y conversión en Google, IAs y mercados globales. Es autor del libro &quot;Define Tu Autoridad&quot;, publicado en Amazon.
              </p>
              <p className="mt-4 text-xs text-[#555566]">
                Selecciona el texto y copia
              </p>
            </div>

            {/* Bio larga */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Bio Completa (150 palabras)</h2>
              </div>
              <p className="text-[#ccccdd] leading-relaxed text-sm">
                Josué Solórzano es especialista en autoridad digital y posicionamiento de marca, trabajando con clientes en América Latina, Estados Unidos y Europa. Es creador del Sistema de Autoridad Digital (DA) — un sistema de 7 fases diseñado para posicionar marcas como referentes confiables en su industria, a través de sitio web premium, SEO avanzado, optimización para IAs y relaciones públicas digitales.
                <br /><br />
                Con una formación marcada por disciplina operacional y ejecución bajo presión, aplica los mismos estándares de precisión al mundo digital. Es autor del libro &quot;Define Tu Autoridad: Despierta Tu Nueva Identidad&quot;, publicado por Legacy Publishers y disponible en Amazon. Actualmente entrega proyectos para clientes en USA, Europa y Latinoamérica.
              </p>
            </div>

            {/* Datos rápidos */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Datos Rápidos</h2>
              </div>
              <ul className="space-y-3 text-sm text-[#ccccdd]">
                {[
                  { label: "Ubicación", value: "Costa Rica" },
                  { label: "Idiomas", value: "Español · Inglés" },
                  { label: "Mercados", value: "USA · Europa · Latinoamérica" },
                  { label: "Sitio web", value: "josuesolorzano.com" },
                  { label: "Libro", value: "Define Tu Autoridad (Amazon)" },
                  { label: "Especialidad", value: "Sistemas de Autoridad Digital" },
                ].map((fact) => (
                  <li key={fact.label} className="flex justify-between border-b border-[#1e1e2e] pb-2">
                    <span className="text-[#8888aa]">{fact.label}</span>
                    <span className="font-medium">{fact.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-[#b8860b1a] border border-[#b8860b33] rounded-xl">
                <p className="text-[#f0c040] text-xs font-semibold mb-1">¿Medios en inglés?</p>
                <a href="/en/press" className="text-[#8888aa] text-xs hover:text-white transition-colors">
                  Ver Press Kit en inglés → josuesolorzano.com/en/press
                </a>
              </div>
            </div>

            {/* Libro */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Libro Publicado</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-white font-bold">Define Tu Autoridad</div>
                  <div className="text-[#8888aa] text-sm">Define Your Authority · Legacy Publishers · 2024</div>
                </div>
                <p className="text-[#ccccdd] text-sm leading-relaxed">
                  Despierta Tu Nueva Identidad. Un libro sobre identidad, criterio y responsabilidad personal usando el método C.A.D. (Claridad, Acción y Disciplina). Disponible en Amazon.
                </p>
                <a
                  href="https://a.co/d/0c5Ttyh8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#f0c040] hover:text-white text-sm font-medium transition-colors"
                >
                  <BookOpen size={14} />
                  Ver en Amazon
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temas de conferencia */}
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Mic size={20} className="text-[#f0c040]" />
            <h2 className="text-white font-bold text-2xl">Temas de Entrevista</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {topics.map((topic, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                <span className="text-[#f0c040] font-bold text-sm mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[#ccccdd] text-sm leading-relaxed">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pitch Emails */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Mail size={20} className="text-[#f0c040]" />
            <h2 className="text-white font-bold text-2xl">Pitch Emails — Para Medios y Podcasts</h2>
          </div>
          <div className="space-y-8">
            {pitchEmails.map((email, i) => (
              <div key={i} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
                  <div>
                    <span className="text-[#f0c040] text-xs font-semibold uppercase tracking-widest">{email.to}</span>
                    <p className="text-white text-sm font-medium mt-1">Asunto: {email.subject}</p>
                  </div>
                </div>
                <pre className="px-6 py-5 text-[#8888aa] text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {email.body}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto para medios */}
      <section className="py-16 bg-[#0d0d14] border-t border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 size={32} className="text-[#f0c040] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Contacto para Medios</h2>
          <p className="text-[#8888aa] mb-8">
            Para entrevistas, artículos, podcasts o apariciones en medios, escríbenos directamente.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:vjosue.3004@gmail.com?subject=Media%20Inquiry%20—%20Josue%20Solorzano"
              className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-8 py-4 rounded-xl transition-all glow"
            >
              <Mail size={18} />
              vjosue.3004@gmail.com
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=Hola%20Josue%2C%20te%20contacto%20desde%20tu%20Media%20Kit`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#25d366] text-[#25d366] hover:bg-[#25d36611] font-semibold px-8 py-4 rounded-xl transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
