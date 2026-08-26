import { siteConfig } from "./utils";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: "Josué Solórzano",
    givenName: "Josué",
    familyName: "Solórzano",
    url: siteConfig.url,
    image: `${siteConfig.url}/images/josue-solorzano.jpg`,
    description: siteConfig.description,
    jobTitle: "Especialista en Crecimiento Digital y Posicionamiento de Marcas",
    worksFor: {
      "@type": "Organization",
      name: "Josue Solorzano Digital",
      url: siteConfig.url,
    },
    nationality: { "@type": "Country", name: "Costa Rica" },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CR",
      addressRegion: "Costa Rica",
    },
    email: siteConfig.email,
    sameAs: [
      `https://linkedin.com/in/${siteConfig.linkedinHandle}`,
      `https://instagram.com/${siteConfig.instagramHandle}`,
      `https://www.facebook.com/${siteConfig.facebookHandle}`,
      // Amazon Author Central — Phase 4 DAB
      "https://www.amazon.com/author/josuesolorzano",
      // Amazon Author Page
      "https://www.amazon.com/stores/author/josuesolorzano",
      // Wikidata — Phase 4 DAB
      "https://www.wikidata.org/wiki/Q140067601",
    ],
    knowsAbout: [
      "Diseño Web Premium",
      "SEO (Search Engine Optimization)",
      "Optimización para Inteligencia Artificial",
      "Captura de Leads",
      "Autoridad Digital",
      "Marketing Digital",
      "Posicionamiento de Marcas",
      "Crecimiento Digital",
    ],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Especialista en Crecimiento Digital",
        occupationLocation: { "@type": "Country", name: "Costa Rica" },
        description: "Diseña y construye estrategias digitales para posicionar marcas a nivel global.",
      },
    ],
    knowsLanguage: ["es", "en"],
    // interactionStatistic: se quitó el contador que declaraba 0 seguidores.
    // Volver a ponerlo SOLO con conteos reales por plataforma (DAB Fase 6).
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#person` },
    inLanguage: ["es", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webPageSchema({
  title,
  description,
  url,
  breadcrumbs,
}: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    author: { "@id": `${siteConfig.url}/#person` },
    inLanguage: "es",
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    };
  }

  return schema;
}

export function bookSchema(book: {
  title: string;
  description: string;
  isbn: string;
  year: number;
  publisher: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    isbn: book.isbn,
    numberOfPages: undefined,
    author: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@type": "Organization", name: book.publisher },
    datePublished: `${book.year}-01-01`,
    url: `${siteConfig.url}/libros/${book.slug}`,
    inLanguage: "es",
    genre: ["Negocios", "Liderazgo", "Emprendimiento"],
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
  tags: string[];
  readingTime: number;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@id": `${siteConfig.url}/#person` },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${siteConfig.url}/blog/${post.slug}`,
    inLanguage: "es",
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.readingTime}M`,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    ...(post.image && {
      image: { "@type": "ImageObject", url: post.image, width: 1200, height: 630 },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "article p"],
    },
  };
}

export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#service`,
    name: "Josué Solórzano — Servicios Digitales Premium",
    url: siteConfig.url,
    description: siteConfig.description,
    provider: { "@id": `${siteConfig.url}/#person` },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Costa Rica" },
      { "@type": "Continent", name: "Europe" },
      { "@type": "Continent", name: "Latin America" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios Digitales",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sitio Web Premium", description: "Diseño web moderno, rápido y orientado a conversión." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sistema de Captura de Leads", description: "Formularios inteligentes con notificaciones por email y WhatsApp." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Optimización para IAs", description: "Posicionamiento en ChatGPT, Claude, Perplexity y Gemini." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Primera Página de Google", description: "Estrategia SEO para dominar los resultados de búsqueda." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Menciones en Medios", description: "Apariciones en medios digitales reconocidos del mundo." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Perfiles Verificados", description: "HARO, LinkedIn, Wikidata y directorios de autoridad." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Autoridad Digital", description: "Estrategia integral para construir y mantener autoridad online." } },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      telephone: `+${siteConfig.whatsapp}`,
      contactType: "customer service",
      availableLanguage: ["es", "en"],
      contactOption: "TollFree",
    },
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function navigationSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: items.map((i) => i.name),
    url: items.map((i) => i.url),
  };
}
