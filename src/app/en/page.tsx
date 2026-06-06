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
  title: "Josue Solorzano | Digital Growth & Brand Positioning Specialist",
  description:
    "Premium digital services from Costa Rica for clients in the USA, Europe, and worldwide. Websites, Google first page, AI optimization, and digital authority.",
  alternates: {
    canonical: `${siteConfig.url}/en`,
    languages: { es: siteConfig.url, en: `${siteConfig.url}/en` },
  },
  openGraph: {
    title: "Josue Solorzano | Digital Growth & Brand Positioning Specialist",
    description: "Premium digital services: websites, SEO, AI optimization, verified profiles and intelligent lead capture systems.",
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
    answer: "Josue works with clients worldwide, with a special focus on the USA, Canada, Europe, and Latin America.",
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
