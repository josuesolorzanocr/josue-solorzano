import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/utils";
import { personSchema, websiteSchema, navigationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Josue Solorzano | International Keynote Speaker & Bestselling Author",
    template: "%s | Josue Solorzano",
  },
  description: siteConfig.descriptionEn,
  keywords: [
    "Josue Solorzano",
    "international keynote speaker",
    "latin america leadership",
    "entrepreneurship speaker",
    "high-impact mindset",
    "leadership books",
    "motivational speaker",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_MX",
    url: `${siteConfig.url}/en`,
    siteName: siteConfig.name,
    title: "Josue Solorzano | International Keynote Speaker & Bestselling Author",
    description: siteConfig.descriptionEn,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Josue Solorzano" }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: "Josue Solorzano | International Keynote Speaker",
    description: siteConfig.descriptionEn,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${siteConfig.url}/en`,
    languages: { es: siteConfig.url, en: `${siteConfig.url}/en` },
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            navigationSchema([
              { name: "Home", url: `${siteConfig.url}/en` },
              { name: "About", url: `${siteConfig.url}/en/about` },
              { name: "Books", url: `${siteConfig.url}/en/books` },
              { name: "Speaking", url: `${siteConfig.url}/en/speaking` },
              { name: "Blog", url: `${siteConfig.url}/en/blog` },
              { name: "Press", url: `${siteConfig.url}/en/press` },
            ])
          ),
        }}
      />
      <main>{children}</main>
      <Footer lang="en" />
    </>
  );
}
