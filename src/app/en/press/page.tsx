import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";
import { webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Press & Media | Josue Solorzano",
  description: "Press kit for Josue Solorzano: media appearances, high-resolution photos, official bio, and contact information for journalists and producers.",
  keywords: ["Josue Solorzano press", "media kit speaker", "press contact leadership speaker"],
  alternates: { canonical: `${siteConfig.url}/en/press` },
};

const mediaAppearances = [
  { outlet: "Forbes México", type: "Article", title: "The 30 Most Influential Voices in Mexican Business", year: 2023 },
  { outlet: "CNN en Español", type: "TV Interview", title: "The New Latin American Leadership", year: 2024 },
  { outlet: "Bloomberg Línea", type: "Podcast", title: "How to Build Innovation Ecosystems in LATAM", year: 2024 },
  { outlet: "El Financiero", type: "Article", title: "Business Books Every CEO Should Read", year: 2023 },
  { outlet: "Expansión MX", type: "Interview", title: "Josue Solorzano: The Titleless Leadership Transforming Companies", year: 2022 },
  { outlet: "Entrepreneurs Magazine", type: "Cover Story", title: "The Speaker Who Changed How Business is Done in LATAM", year: 2022 },
];

export default function PressEnPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ title: "Press & Media — Josue Solorzano", description: "Press kit and media coverage for Josue Solorzano.", url: `${siteConfig.url}/en/press`, breadcrumbs: [{ name: "Home", item: `${siteConfig.url}/en` }, { name: "Press", item: `${siteConfig.url}/en/press` }] })) }} />

      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#b8860b] opacity-[0.06] blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="flex items-center justify-center gap-2 text-xs text-[#8888aa] mb-8">
            <a href="/en" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#f0c040]">Press</span>
          </nav>
          <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">Press & Media</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-6">
            Coverage that <span className="gradient-text">matters</span>
          </h1>
          <p className="text-[#8888aa] text-xl leading-relaxed max-w-2xl mx-auto">
            Resources for journalists, producers, and media outlets. Press kit, official bio, and direct contact for interviews.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">Media Appearances</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mediaAppearances.map((item) => (
              <div key={item.title} className="flex gap-5 p-5 bg-[#111118] border border-[#1e1e2e] rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm">{item.outlet}</span>
                    <span className="text-xs text-[#8888aa] bg-[#1e1e2e] px-2 py-0.5 rounded">{item.type}</span>
                  </div>
                  <p className="text-[#ccccdd] text-sm line-clamp-2">{item.title}</p>
                  <span className="text-[#8888aa] text-xs mt-1 block">{item.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Official Bio (for media)</h2>
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
                <p className="text-[#ccccdd] text-sm font-semibold mb-2">Short version (50 words):</p>
                <p className="text-[#ccccdd] text-sm leading-relaxed mb-6 italic border-l-2 border-[#b8860b] pl-4">
                  Josue Solorzano is an international keynote speaker, author of three bestselling books, and leadership and entrepreneurship expert. He has impacted 50,000+ people in 15 countries. Author of &quot;High-Impact Mindset,&quot; &quot;Entrepreneurial Ecosystem,&quot; and &quot;Leader Without a Title.&quot;
                </p>
                <p className="text-[#ccccdd] text-sm font-semibold mb-2">Long version (150 words):</p>
                <p className="text-[#ccccdd] text-sm leading-relaxed italic border-l-2 border-[#b8860b] pl-4">
                  Josue Solorzano is one of Latin America&apos;s most sought-after international speakers and one of Forbes México&apos;s 30 most influential voices in business. Over 15 years, he has delivered 800+ keynotes in 15 countries, helping leaders, entrepreneurs, and organizations transform their mindset and results. He is the author of three bestselling books — &quot;High-Impact Mindset,&quot; &quot;Entrepreneurial Ecosystem,&quot; and &quot;Leader Without a Title&quot; — translated into five languages. His podcast ranks in the Top 10 in Latin America in the Business category, and his digital community exceeds 500,000 followers. Josue works with Fortune 500 companies, hyper-growth startups, and government organizations across the region.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Downloads</h2>
                <div className="space-y-3">
                  {[
                    { label: "Press photos (high resolution)", size: "12 MB", format: "ZIP" },
                    { label: "Logo & visual identity", size: "4 MB", format: "ZIP" },
                    { label: "Speaking one-pager", size: "2 MB", format: "PDF" },
                    { label: "Technical rider", size: "1 MB", format: "PDF" },
                  ].map((file) => (
                    <div key={file.label} className="flex items-center justify-between p-4 bg-[#111118] border border-[#1e1e2e] rounded-xl">
                      <div>
                        <div className="text-white text-sm font-medium">{file.label}</div>
                        <div className="text-[#8888aa] text-xs">{file.size} · {file.format}</div>
                      </div>
                      <a href="#" className="text-xs text-[#f0c040] hover:text-white transition-colors font-semibold">Download</a>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Press Contact</h2>
                <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6 space-y-3">
                  <div>
                    <div className="text-[#8888aa] text-xs">Press email</div>
                    <a href="mailto:press@josuesolorzano.com" className="text-white font-semibold text-sm hover:text-[#f0c040] transition-colors">press@josuesolorzano.com</a>
                  </div>
                  <div>
                    <div className="text-[#8888aa] text-xs">Response time</div>
                    <div className="text-white text-sm font-medium">24-48 business hours</div>
                  </div>
                  <div>
                    <div className="text-[#8888aa] text-xs">Available for</div>
                    <div className="text-white text-sm font-medium">Interviews, articles, podcast, TV</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
