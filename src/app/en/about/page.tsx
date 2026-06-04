import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/utils";
import { webPageSchema, personSchema } from "@/lib/schema";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "About Josue Solorzano | International Speaker & Leadership Expert",
  description:
    "Meet Josue Solorzano: from Latin American entrepreneur to international keynote speaker in 15 countries. Author of 3 bestselling leadership books.",
  alternates: { canonical: `${siteConfig.url}/en/about` },
  openGraph: {
    title: "About Josue Solorzano",
    description: "From Latin American entrepreneur to global leadership voice. Meet Josue Solorzano.",
    url: `${siteConfig.url}/en/about`,
  },
};

const timeline = [
  { year: "2009", title: "The Beginning", desc: "Josue founds his first consulting firm at 23 with $500 and a clear vision: democratizing leadership across Latin America." },
  { year: "2013", title: "First International Stage", desc: "His first keynote outside Mexico in Bogotá. The impact is immediate — he's invited to 12 events that same year." },
  { year: "2016", title: "Regional Expansion", desc: "Josue establishes presence in 7 countries. His Leadership Without a Title methodology is adopted by Fortune 500 companies." },
  { year: "2021", title: "First Bestseller", desc: "'Leader Without a Title' becomes an Amazon bestseller in Business & Leadership in 3 weeks." },
  { year: "2022", title: "Entrepreneurial Ecosystem", desc: "Second book published. Online Academy launched, reaching 50,000 students in year one." },
  { year: "2023", title: "High-Impact Mindset", desc: "Third book breaks sales records. Forbes México names Josue one of the 30 most influential voices in business." },
  { year: "2024", title: "Today", desc: "Josue impacts 50,000+ people per year through keynotes, books, podcast, and a digital community of 500K+ followers." },
];

export default function AboutEnPage() {
  const breadcrumbs = [
    { name: "Home", item: `${siteConfig.url}/en` },
    { name: "About", item: `${siteConfig.url}/en/about` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: "About Josue Solorzano", description: "Story and trajectory of Josue Solorzano, international speaker and bestselling author.", url: `${siteConfig.url}/en/about`, breadcrumbs })) }} />

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
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">The Story</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-6 leading-tight">
            From entrepreneur to <span className="gradient-text">global voice</span>
          </h1>
          <p className="text-[#8888aa] text-xl leading-relaxed">
            Josue Solorzano's story didn't begin at Harvard or with family wealth. It began with an idea, $500, and the conviction that Latin America deserved better leaders.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="aspect-[4/5] bg-[#111118] border border-[#1e1e2e] rounded-2xl flex items-center justify-center max-w-md">
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-[#b8860b] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">JS</div>
                  <p className="text-[#8888aa] text-sm">Josue Solorzano</p>
                  <p className="text-[#8888aa] text-xs mt-1">Speaker · Author · Consultant</p>
                </div>
              </div>
            </div>
            <div className="space-y-6 text-[#ccccdd] leading-relaxed">
              <p className="text-lg">
                Josue Solorzano was born and raised in Mexico. From a young age, he knew he wanted to be someone who left an impact, not just results. That distinction — between leaving a mark and simply achieving things — is the thread running through everything he does.
              </p>
              <p>
                He studied Business Administration, but his real education came from the trenches of entrepreneurship. His early years were marked by failure as much as learning: businesses that didn't work, partners who left, markets that didn't respond as expected.
              </p>
              <p>
                It was in those failures that Josue discovered what would become his mission: helping other leaders and entrepreneurs shorten their learning curve, navigate uncertainty with clarity, and build not just businesses, but legacies.
              </p>
              <p>
                Today, 15 years later, Josue has delivered 800+ keynotes in 15 countries, written 3 books that have transformed hundreds of thousands of lives, and built an impact ecosystem that includes an online academy, a Top 10 Latin America podcast, and a 500K+ digital community.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { label: "Years of experience", value: "15+" },
                  { label: "Countries", value: "15+" },
                  { label: "People impacted/year", value: "50K+" },
                  { label: "Published books", value: "3" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-[#8888aa] text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">The Journey</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-[#1e1e2e]" />
            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-8 items-start">
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="text-[#f0c040] font-bold text-sm">{item.year}</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#b8860b] border-2 border-[#050508] flex-shrink-0 mt-1 relative z-10" />
                  <div className="flex-1 pb-8">
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-[#8888aa] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactSection lang="en" />
    </>
  );
}
