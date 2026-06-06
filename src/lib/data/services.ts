export interface Service {
  icon: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface Combo {
  name: string;
  nameEn: string;
  price: string;
  priceNote: string;
  priceNoteEn: string;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  highlighted: boolean;
  badge?: string;
  badgeEn?: string;
  deliveryTime: string;
  deliveryTimeEn: string;
  step: string;
  stepEn: string;
}

export const services: Service[] = [
  {
    icon: "🔍",
    title: "Diagnóstico de Autoridad",
    titleEn: "Authority Diagnosis",
    description: "Analizamos cómo te ve Google, qué dicen las IAs de ti y qué gaps te están costando clientes premium.",
    descriptionEn: "We analyze how Google sees you, what AIs say about you, and what gaps are costing you premium clients.",
  },
  {
    icon: "🤖",
    title: "Optimización para IAs",
    titleEn: "AI Optimization",
    description: "Hacemos que ChatGPT, Claude, Perplexity y Gemini te mencionen cuando alguien busca un experto en tu área.",
    descriptionEn: "We make ChatGPT, Claude, Perplexity, and Gemini mention you when someone searches for an expert in your field.",
  },
  {
    icon: "🌐",
    title: "Sitio Web Premium",
    titleEn: "Premium Website",
    description: "Next.js + Tailwind + animaciones. Rápido, moderno y diseñado para convertir visitantes en clientes de alto valor.",
    descriptionEn: "Next.js + Tailwind + animations. Fast, modern, and designed to convert visitors into high-value clients.",
  },
  {
    icon: "📩",
    title: "Captura de Leads",
    titleEn: "Lead Capture",
    description: "Cada contacto llega instantáneamente a tu email y WhatsApp con todos los datos para responder de inmediato.",
    descriptionEn: "Every lead arrives instantly to your email and WhatsApp with full details to respond immediately.",
  },
  {
    icon: "🔍",
    title: "SEO de Autoridad",
    titleEn: "Authority SEO",
    description: "Schema.org, breadcrumbs, FAQ y sitemap que posicionan tu nombre como referente en tu industria.",
    descriptionEn: "Schema.org, breadcrumbs, FAQ, and sitemap that position your name as a reference in your industry.",
  },
  {
    icon: "✅",
    title: "Perfiles Verificados",
    titleEn: "Verified Profiles",
    description: "Wikidata, LinkedIn optimizado, Amazon Author y HARO para que los medios te encuentren y te citen.",
    descriptionEn: "Wikidata, optimized LinkedIn, Amazon Author, and HARO so media can find and cite you.",
  },
  {
    icon: "📰",
    title: "Kit de Prensa Profesional",
    titleEn: "Professional Press Kit",
    description: "Media kit, pitch emails y artículos listos para que podcasts, revistas y medios hablen de ti.",
    descriptionEn: "Media kit, pitch emails, and articles ready for podcasts, magazines, and media to talk about you.",
  },
  {
    icon: "📈",
    title: "Analytics y Monitoreo",
    titleEn: "Analytics & Monitoring",
    description: "Google Analytics + Google Alerts para medir tu crecimiento y saber cuándo alguien menciona tu nombre.",
    descriptionEn: "Google Analytics + Google Alerts to measure your growth and know when someone mentions your name.",
  },
];

export const combos: Combo[] = [
  {
    name: "Auditoría de Presencia Digital",
    nameEn: "Digital Presence Audit",
    price: "$297",
    priceNote: "pago único",
    priceNoteEn: "one-time payment",
    description: "Diagnóstico completo de tu presencia digital. Descubre cómo te ven Google y las IAs — y exactamente qué hacer para dominar tu mercado.",
    descriptionEn: "Complete digital presence diagnosis. Discover how Google and AIs see you — and exactly what to do to dominate your market.",
    step: "Paso 1 — Diagnóstico",
    stepEn: "Step 1 — Diagnosis",
    features: [
      "Reporte de cómo aparece tu empresa en Google",
      "Análisis de qué dicen ChatGPT, Perplexity y Claude de ti",
      "Auditoría completa de tu sitio web actual",
      "Análisis vs. tus 5 competidores top",
      "Roadmap personalizado de 7 pasos priorizados",
      "PDF profesional + video explicativo",
      "Entrega en 48-72 horas",
    ],
    featuresEn: [
      "Report on how your business appears in Google",
      "Analysis of what ChatGPT, Perplexity, and Claude say about you",
      "Full audit of your current website",
      "Comparison against your top 5 competitors",
      "Personalized 7-step priority roadmap",
      "Professional PDF + explanatory video",
      "Delivered in 48-72 hours",
    ],
    highlighted: false,
    deliveryTime: "48-72 horas",
    deliveryTimeEn: "48-72 hours",
  },
  {
    name: "Visibilidad en IAs",
    nameEn: "AI Visibility",
    price: "$597",
    priceNote: "pago único",
    priceNoteEn: "one-time payment",
    description: "Optimizamos tu presencia para que ChatGPT, Perplexity, Gemini y Claude te reconozcan y recomienden cuando alguien busca lo que tú ofreces.",
    descriptionEn: "We optimize your presence so ChatGPT, Perplexity, Gemini and Claude recognize and recommend you when someone searches for what you offer.",
    step: "Paso 2 — Implementación",
    stepEn: "Step 2 — Implementation",
    features: [
      "Schema.org completo (Person, WebSite, FAQ)",
      "robots.txt optimizado para 20+ motores de IA",
      "sameAs links: LinkedIn, Amazon, Wikidata",
      "Perfil de Wikidata creado y configurado",
      "Optimización de metadata para rastreo de IAs",
      "Reporte de antes / después con evidencia",
      "Entrega en 3-5 días",
    ],
    featuresEn: [
      "Full Schema.org (Person, WebSite, FAQ)",
      "robots.txt optimized for 20+ AI engines",
      "sameAs links: LinkedIn, Amazon, Wikidata",
      "Wikidata profile created and configured",
      "Metadata optimization for AI crawling",
      "Before / after report with evidence",
      "Delivered in 3-5 days",
    ],
    highlighted: true,
    badge: "Más popular",
    badgeEn: "Most popular",
    deliveryTime: "3-5 días",
    deliveryTimeEn: "3-5 days",
  },
  {
    name: "Autoridad Digital",
    nameEn: "Digital Authority",
    price: "$2,500",
    priceNote: "pago único",
    priceNoteEn: "one-time payment",
    description: "Transformación digital completa. Las 7 fases ejecutadas para que tu empresa sea la referencia indiscutible de su industria en Google y las IAs.",
    descriptionEn: "Complete digital transformation. All 7 phases executed so your business becomes the undeniable reference in its industry on Google and AIs.",
    step: "Paso 3 — Transformación Total",
    stepEn: "Step 3 — Total Transformation",
    features: [
      "Todo lo de Visibilidad en IAs",
      "Sitio web premium (Next.js + Tailwind + animaciones)",
      "Formulario de contacto inteligente (Email + WhatsApp)",
      "SEO completo: Schema.org, FAQ, Breadcrumbs, Sitemap",
      "Perfiles verificados: Wikidata, HARO, LinkedIn, Amazon",
      "Kit de prensa: media kit, pitch emails, artículos",
      "Google Analytics + Google Alerts configurados",
      "robots.txt optimizado para 20+ motores de IA",
      "Sitio bilingüe (Español + Inglés)",
      "Entrega en 2-3 semanas",
    ],
    featuresEn: [
      "Everything in AI Visibility",
      "Premium website (Next.js + Tailwind + animations)",
      "Smart contact form (Email + WhatsApp)",
      "Full SEO: Schema.org, FAQ, Breadcrumbs, Sitemap",
      "Verified profiles: Wikidata, HARO, LinkedIn, Amazon",
      "Press kit: media kit, pitch emails, articles",
      "Google Analytics + Google Alerts configured",
      "robots.txt optimized for 20+ AI engines",
      "Bilingual site (Spanish + English)",
      "Delivered in 2-3 weeks",
    ],
    highlighted: false,
    badge: "Done-For-You",
    badgeEn: "Done-For-You",
    deliveryTime: "2-3 semanas",
    deliveryTimeEn: "2-3 weeks",
  },
];
