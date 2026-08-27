import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/utils";
import { personSchema, websiteSchema, navigationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Josue Solorzano | Digital Growth & Brand Positioning Specialist",
    template: "%s | Josue Solorzano",
  },
  description: siteConfig.descriptionEn,
  keywords: [
    "Josue Solorzano",
    "digital growth specialist",
    "brand positioning",
    "premium websites",
    "SEO for businesses",
    "AI search optimization",
    "digital authority",
    "digital marketing Costa Rica",
    "web design USA Europe",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_MX",
    url: `${siteConfig.url}/en`,
    siteName: siteConfig.name,
    title: "Josue Solorzano | Digital Growth & Brand Positioning Specialist",
    description: siteConfig.descriptionEn,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Josue Solorzano" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Josue Solorzano | Digital Growth Specialist",
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
