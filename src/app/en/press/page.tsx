import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mail, Globe, Users, BookOpen, Mic, Building2 } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Press Kit | Josué Solórzano | Digital Authority Specialist",
  description:
    "Official press kit for Josué Solórzano — digital authority specialist from Costa Rica. Official bio, interview topics, published book and media contact.",
  alternates: {
    canonical: `${siteConfig.url}/en/press`,
    languages: { es: `${siteConfig.url}/media-kit`, en: `${siteConfig.url}/en/press`, "x-default": `${siteConfig.url}/media-kit` },
  },
  robots: { index: true, follow: true },
};

const stats = [
  { label: "Authority Products", value: "3" },
  { label: "Response Time", value: "24h" },
  { label: "Book on Amazon", value: "1" },
  { label: "Global Markets · USA · Europe · LATAM", value: "3" },
];

const topics = [
  "Digital Authority and Personal Brand Positioning",
  "How to optimize your digital presence so Google and AI platforms better understand your authority",
  "The Digital Authority System: 7 phases to build a world-class online presence",
  "Identity, Judgment and Personal Responsibility — The C.A.D. Method",
  "Online Visibility Strategies for the US and European Markets",
  "Why traditional SEO is no longer enough in the AI search era",
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
    to: "Media & Magazines",
    subject: "Expert source: Digital authority and AI search strategies — Josué Solórzano",
    body: `Hi [Editor/Reporter Name],

I'm Josué Solórzano, a digital authority specialist based in Costa Rica, working with clients in the US, Europe, and Latin America.

I'm available as an expert source for stories on:
• How professionals and businesses can improve their visibility in AI-powered search
• The new rules of digital authority in the AI era
• Why traditional SEO is no longer enough for brands competing globally
• How schema, structured data, and entity signals shape AI understanding

I can provide data, quotes, or a full interview at your convenience.

Press kit and headshots: josuesolorzano.com/en/press
Email: vjosue.3004@gmail.com

Best regards,
Josué Solórzano
`,
  },
];

export default function PressEnPage() {
  const breadcrumbs = [
    { name: "Home", item: `${siteConfig.url}/en` },
    { name: "Press Kit", item: `${siteConfig.url}/en/press` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              title: "Press Kit — Josué Solórzano",
              description: "Official press kit for Josué Solórzano for media, podcasts and specialized press.",
              url: `${siteConfig.url}/en/press`,
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
            <Link href="/en" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#f0c040]">Press Kit</span>
          </nav>
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
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">For Media & Press</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-2">
            Josué <span className="gradient-text">Solórzano</span>
          </h1>
          <p className="text-[#8888aa] text-base mb-2">Digital Authority Specialist · Costa Rica</p>
          <p className="text-[#8888aa] text-xl leading-relaxed max-w-2xl mx-auto mt-4">
            Everything you need to cover, interview or feature Josué Solórzano on your platform, podcast or publication.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="mailto:vjosue.3004@gmail.com?subject=Media%20Inquiry%20—%20Josue%20Solorzano"
              className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-6 py-3 rounded-xl transition-all glow text-sm"
            >
              <Mail size={16} />
              Contact for interview
            </a>
            <a
              href={`${siteConfig.url}/en`}
              className="inline-flex items-center gap-2 border border-[#1e1e2e] hover:border-[#b8860b33] text-[#8888aa] hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              <Globe size={16} />
              View website
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

      {/* Official Bios */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Short bio */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Short Bio (50 words)</h2>
              </div>
              <p className="text-[#ccccdd] leading-relaxed text-sm">
                Josué Solórzano is a digital authority specialist from Costa Rica helping experts, consultants, founders and service businesses build world-class online presence. His work improves trust, visibility and conversion across Google, AI search and global markets. He is the author of &quot;Define Your Authority,&quot; available on Amazon.
              </p>
              <p className="mt-4 text-xs text-[#555566]">Select text and copy</p>
            </div>

            {/* Full bio */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Full Bio (150 words)</h2>
              </div>
              <p className="text-[#ccccdd] leading-relaxed text-sm">
                Josué Solórzano is a digital authority specialist from Costa Rica working with clients in the US, Europe and Latin America. He is the creator of the Digital Authority System — a 7-phase framework designed to position brands as trusted references across Google, AI search and global markets, through premium website design, advanced SEO, AI optimization and digital PR.
                <br /><br />
                With a background built on operational discipline and execution under pressure, Josué applies the same precision standard to every client project. He is the author of &quot;Define Your Authority: Awaken Your New Identity,&quot; published by Legacy Publishers and available on Amazon. He currently delivers projects for clients in the US, Europe and Latin America.
              </p>
            </div>

            {/* Book */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Published Book</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-white font-bold">Define Your Authority</div>
                  <div className="text-[#8888aa] text-sm">Awaken Your New Identity · Legacy Publishers · 2024</div>
                </div>
                <p className="text-[#ccccdd] text-sm leading-relaxed">
                  A book about identity, judgment and personal responsibility using the C.A.D. method — Clarity, Action and Discipline. Available on Amazon in print and digital.
                </p>
                <a
                  href="https://a.co/d/0c5Ttyh8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#f0c040] hover:text-white text-sm font-medium transition-colors"
                >
                  <BookOpen size={14} />
                  View on Amazon
                </a>
              </div>
            </div>

            {/* Quick facts */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe size={20} className="text-[#f0c040]" />
                <h2 className="text-white font-bold text-lg">Quick Facts</h2>
              </div>
              <ul className="space-y-3 text-sm text-[#ccccdd]">
                {[
                  { label: "Location", value: "Costa Rica" },
                  { label: "Languages", value: "Spanish · English" },
                  { label: "Markets served", value: "USA · Europe · Latin America" },
                  { label: "Website", value: "josuesolorzano.com" },
                  { label: "Book", value: "Define Your Authority (Amazon)" },
                  { label: "Specialty", value: "Digital Authority Systems" },
                ].map((fact) => (
                  <li key={fact.label} className="flex justify-between border-b border-[#1e1e2e] pb-2">
                    <span className="text-[#8888aa]">{fact.label}</span>
                    <span className="font-medium">{fact.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Topics */}
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Mic size={20} className="text-[#f0c040]" />
            <h2 className="text-white font-bold text-2xl">Interview Topics</h2>
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
            <h2 className="text-white font-bold text-2xl">Pitch Emails — For Media & Podcasts</h2>
          </div>
          <div className="space-y-8">
            {pitchEmails.map((email, i) => (
              <div key={i} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1e1e2e]">
                  <span className="text-[#f0c040] text-xs font-semibold uppercase tracking-widest">{email.to}</span>
                  <p className="text-white text-sm font-medium mt-1">Subject: {email.subject}</p>
                </div>
                <pre className="px-6 py-5 text-[#8888aa] text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {email.body}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 bg-[#0d0d14] border-t border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 size={32} className="text-[#f0c040] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Media Contact</h2>
          <p className="text-[#8888aa] mb-8">
            For interviews, articles, podcasts or media appearances, reach out directly.
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
              href={`https://wa.me/${siteConfig.whatsapp}?text=Hi%20Josue%2C%20I%27m%20contacting%20you%20from%20your%20Press%20Kit`}
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
