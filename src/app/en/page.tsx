import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import ServicesSection from "@/components/sections/ServicesSection";
import Testimonials from "@/components/sections/Testimonials";
import BookAuthority from "@/components/sections/BookAuthority";
import ContactSection from "@/components/sections/ContactSection";
import { siteConfig } from "@/lib/utils";
import { faqSchema, professionalServiceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Josué Solórzano | Digital Authority & AI Systems" },
  description:
    "Digital authority from Costa Rica: websites that rank on Google and in AI search, digital PR, and business systems built with AI.",
  alternates: {
    canonical: `${siteConfig.url}/en`,
    languages: { es: siteConfig.url, en: `${siteConfig.url}/en`, "x-default": siteConfig.url },
  },
  openGraph: {
    title: "Josué Solórzano | Digital Authority & AI Systems",
    description: "Digital authority and AI systems: websites that rank, AI search visibility, digital PR and custom business systems built with AI.",
    url: `${siteConfig.url}/en`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Josue Solorzano — Brand Positioning" }],
  },
};

const faqs = [
  {
    question: "What does a premium website include?",
    answer: "Modern design, ultra-fast loading, SEO optimization, intelligent lead capture form (email + WhatsApp), mobile-optimized, and built to appear on Google and in AI answers like ChatGPT.",
  },
  {
    question: "What countries does Josue Solorzano work with?",
    answer: "Josué works remotely from Costa Rica with experts and companies in any country, with a focus on the USA, Canada, Europe, and Latin America.",
  },
  {
    question: "How does the lead capture system work?",
    answer: "Every time someone fills out your site's form, you receive an instant notification by email and WhatsApp with all their details so you can respond immediately.",
  },
  {
    question: "What is AI optimization?",
    answer: "A set of techniques that make tools like ChatGPT, Claude, Perplexity, and Gemini mention your brand when someone searches for services like yours.",
  },
];

export default function EnHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema()) }} />
      <Hero lang="en" />
      <Stats lang="en" />
      <About lang="en" />
      <ServicesSection lang="en" />
      <Testimonials lang="en" />
      <BookAuthority lang="en" />
      <ContactSection lang="en" />
    </>
  );
}
