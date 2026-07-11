import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { personSchema, websiteSchema, navigationSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Josue Solorzano | Especialista en Crecimiento Digital y Posicionamiento de Marcas",
    template: "%s | Josue Solorzano",
  },
  description: siteConfig.description,
  keywords: [
    "Josue Solorzano",
    "especialista crecimiento digital",
    "posicionamiento de marcas",
    "sitios web premium",
    "SEO para negocios",
    "optimización para IAs",
    "autoridad digital",
    "marketing digital Costa Rica",
    "diseño web USA Europa",
  ],
  authors: [{ name: "Josue Solorzano", url: siteConfig.url }],
  creator: "Josue Solorzano",
  publisher: "Josue Solorzano",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_CR",
    alternateLocale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Josue Solorzano | Especialista en Crecimiento Digital y Posicionamiento de Marcas",
    description: siteConfig.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Josue Solorzano — Especialista en Crecimiento Digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Josue Solorzano | Especialista en Crecimiento Digital",
    description: siteConfig.description,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteConfig.url,
    languages: { es: siteConfig.url, en: `${siteConfig.url}/en` },
  },
  verification: {
    google: "xKbP5Vb3U7fDrMjQ3mUfL-7kSQxNpXaT8hXIu4r4VN0",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
                { name: "Inicio", url: siteConfig.url },
                { name: "Sobre Mí", url: `${siteConfig.url}/sobre-mi` },
                { name: "Servicios", url: `${siteConfig.url}/#servicios` },
                { name: "Precios", url: `${siteConfig.url}/#precios` },
                { name: "Blog", url: `${siteConfig.url}/blog` },
                { name: "Contacto", url: `${siteConfig.url}/#contacto` },
              ])
            ),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <GoogleAnalytics />
        <Header />
        {children}
      </body>
    </html>
  );
}
