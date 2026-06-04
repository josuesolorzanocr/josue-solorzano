import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle } from "lucide-react";
import { speakingEvents, speakingTopics } from "@/lib/data/speaking";
import { siteConfig } from "@/lib/utils";
import { webPageSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Keynote Speaking | Josue Solorzano International Speaker",
  description:
    "Book Josue Solorzano for your next event. Keynotes, workshops, and executive programs on leadership, mindset, and entrepreneurship. 800+ talks in 15 countries.",
  keywords: ["keynote speaker latin america", "Josue Solorzano speaking", "leadership keynote", "entrepreneurship workshop", "book speaker"],
  alternates: { canonical: `${siteConfig.url}/en/speaking` },
  openGraph: { title: "Josue Solorzano — International Keynote Speaker", description: "Transformative experiences for your company or organization. 800+ talks, 15 countries.", url: `${siteConfig.url}/en/speaking` },
};

const faqs = [
  { question: "How far in advance should I book Josue?", answer: "We recommend reaching out at least 4-6 weeks before regular events, and 3-6 months before large or international events." },
  { question: "Does Josue customize his keynote for my industry?", answer: "Yes, absolutely. Each engagement includes a personalized briefing session where Josue studies your industry, company, and audience to create a relevant and actionable experience." },
  { question: "What languages does Josue speak in?", answer: "Josue delivers keynotes in both Spanish and English at the same level of impact and authenticity." },
  { question: "What formats are available?", answer: "Main keynote (45-90 min), interactive workshops (2-8 hours), executive retreats (1-2 days), and multi-session leadership development programs." },
];

export default function SpeakingEnPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: "Keynote Speaking — Josue Solorzano", description: "Book Josue Solorzano for keynotes, workshops, and executive programs.", url: `${siteConfig.url}/en/speaking`, breadcrumbs: [{ name: "Home", item: `${siteConfig.url}/en` }, { name: "Speaking", item: `${siteConfig.url}/en/speaking` }] })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />

      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#b8860b] opacity-[0.06] blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="flex items-center justify-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/en" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#f0c040]">Speaking</span>
          </nav>
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">Keynotes & Workshops</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-6">
            Experiences your audience <span className="gradient-text">won&apos;t forget</span>
          </h1>
          <p className="text-[#8888aa] text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            800+ keynotes in 15 countries. Zero generic presentations. Only personalized experiences with proven methodologies and measurable results.
          </p>
          <Link href="/en#contact" className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-8 py-4 rounded-xl transition-all glow">
            Check availability <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Speaking Topics</h2>
          <p className="text-[#8888aa] text-center mb-12 max-w-xl mx-auto">Each topic can be adapted as a keynote, workshop, or multi-session program based on your organization&apos;s needs.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {speakingTopics.map((topic) => (
              <div key={topic.title} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 hover:border-[#b8860b33] transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{topic.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-white font-bold text-lg">{topic.titleEn}</h3>
                      <span className="text-[#8888aa] text-xs bg-[#1e1e2e] rounded-md px-2 py-0.5 flex-shrink-0">{topic.duration}</span>
                    </div>
                    <p className="text-[#8888aa] text-sm mt-2 leading-relaxed">{topic.descriptionEn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Recent Engagements</h2>
          <div className="space-y-3">
            {speakingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-4 p-5 bg-[#111118] border border-[#1e1e2e] rounded-xl">
                <div className="w-14 h-14 rounded-xl bg-[#b8860b1a] border border-[#b8860b33] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#f0c040] font-bold text-xs">{event.year}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{event.eventEn}</h3>
                  <p className="text-[#f0c040] text-sm mt-0.5">{event.topicEn}</p>
                  <span className="flex items-center gap-1 text-[#8888aa] text-xs mt-1.5"><MapPin size={10} /> {event.location}</span>
                </div>
                <CheckCircle size={18} className="text-[#b8860b] flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer text-white font-medium text-sm list-none">
                  {faq.question}
                  <span className="text-[#f0c040] flex-shrink-0">+</span>
                </summary>
                <div className="px-6 pb-4 text-[#8888aa] text-sm leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
