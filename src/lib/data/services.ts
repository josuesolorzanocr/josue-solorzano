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
  priceContext?: string;
  priceContextEn?: string;
  description: string;
  descriptionEn: string;
  idealFor: string;
  idealForEn: string;
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
    description: "Analizamos cómo aparece tu marca en Google, plataformas de IA, tu sitio web y frente a tus competidores — para darte un roadmap claro de mejora.",
    descriptionEn: "We analyze how your brand appears across Google, AI platforms, your website and competitors — then give you a prioritized roadmap to improve trust, visibility and conversion.",
  },
  {
    icon: "🤖",
    title: "Optimización para IAs",
    titleEn: "AI Optimization",
    description: "Optimizamos tus señales de autoridad digital para que las plataformas de IA entiendan mejor quién eres, qué haces, a quién ayudas y cuándo tu marca es relevante.",
    descriptionEn: "We optimize your digital authority signals so AI platforms can better understand who you are, what you do, who you help, and when your brand is relevant.",
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
    titleEn: "Authority Profiles",
    description: "Perfiles de autoridad configurados según elegibilidad: LinkedIn, perfiles de autor, páginas de prensa, directorios profesionales y evaluación para Wikidata.",
    descriptionEn: "Authority profiles configured according to your eligibility: LinkedIn, author profiles, media pages, business directories, Wikidata evaluation and relevant industry platforms.",
  },
  {
    icon: "📰",
    title: "Kit de Prensa Profesional",
    titleEn: "Professional Press Kit",
    description: "Media kit, pitch emails y plantillas de artículos listos para que podcasts, revistas y medios hablen de ti.",
    descriptionEn: "Media kit, pitch emails, and guest article templates ready for podcasts, magazines, and media to cover you.",
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
    name: "Auditoría de Autoridad Digital",
    nameEn: "Digital Authority Audit",
    price: "$297",
    priceNote: "pago único",
    priceNoteEn: "one-time payment",
    description: "Descubre cómo se percibe tu marca actualmente en Google, plataformas de IA, tu sitio web y frente a tus competidores — y recibe un roadmap claro de 7 pasos para mejorar tu visibilidad, credibilidad y conversión.",
    descriptionEn: "Discover how your brand is currently perceived across Google, AI platforms, your website and your competitive landscape — then receive a clear 7-step roadmap to improve your visibility, credibility and conversion.",
    idealFor: "Ideal para expertos, consultores, fundadores y negocios de servicios que quieren saber exactamente qué está debilitando su autoridad digital antes de invertir en implementación.",
    idealForEn: "Ideal for experts, consultants, founders and service businesses who want to know exactly what is weakening their online authority before investing in implementation.",
    step: "Paso 1 — Diagnóstico",
    stepEn: "Step 1 — Diagnosis",
    features: [
      "Análisis de presencia en Google",
      "Análisis de visibilidad en IAs: ChatGPT, Perplexity, Gemini y Claude",
      "Revisión de autoridad y conversión de tu sitio web",
      "Comparación con tus 5 competidores top",
      "Reporte de gaps de autoridad y señales de confianza",
      "Roadmap personalizado de 7 pasos priorizados",
      "PDF profesional + video explicativo",
      "Entrega en 48-72 horas",
    ],
    featuresEn: [
      "Google presence analysis",
      "AI visibility analysis: ChatGPT, Perplexity, Gemini and Claude",
      "Website authority and conversion review",
      "Competitor comparison against your top 5 competitors",
      "Authority gaps and trust signals report",
      "Personalized 7-step priority roadmap",
      "Professional PDF report + Loom video walkthrough",
      "Delivered in 48-72 hours",
    ],
    highlighted: false,
    deliveryTime: "48-72 horas",
    deliveryTimeEn: "48-72 hours",
  },
  {
    name: "Optimización de Autoridad en IAs",
    nameEn: "AI Authority Optimization",
    price: "$597",
    priceNote: "precio introductorio",
    priceNoteEn: "introductory price",
    priceContext: "Precio regular: $997",
    priceContextEn: "Regular price: $997",
    description: "Optimizamos tu presencia digital para que las plataformas de IA entiendan, clasifiquen y muestren tu marca cuando ocurren búsquedas relevantes en ChatGPT, Perplexity, Gemini, Claude y experiencias de búsqueda con IA.",
    descriptionEn: "We optimize your digital presence so AI platforms can better understand, classify and surface your brand when relevant searches happen across ChatGPT, Perplexity, Gemini, Claude and AI-powered search experiences.",
    idealFor: "Ideal para negocios que ya tienen presencia digital y quieren prepararse para la nueva capa de búsqueda con IA.",
    idealForEn: "Ideal for businesses that already have digital presence and want to prepare for the new AI search layer.",
    step: "Paso 2 — Implementación",
    stepEn: "Step 2 — Implementation",
    features: [
      "Schema.org completo: Person, Organization, WebSite, FAQ",
      "Optimización de metadata para búsqueda con IA",
      "Revisión de robots.txt y acceso de crawlers",
      "Configuración de links de autoridad sameAs",
      "Revisión de consistencia de entidad en tus perfiles principales",
      "Evaluación de elegibilidad para perfiles de autoridad: LinkedIn, Amazon Author, Wikidata",
      "Estructura FAQ diseñada para búsqueda e IAs",
      "Reporte de antes / después con evidencia",
      "Entrega en 3-5 días hábiles",
    ],
    featuresEn: [
      "Full Schema.org: Person, Organization, WebSite, FAQ",
      "AI-friendly metadata optimization",
      "robots.txt and crawler access review",
      "sameAs authority links configuration",
      "Entity consistency review across your main profiles",
      "Authority profile eligibility review: LinkedIn, Amazon Author, Wikidata",
      "FAQ structure designed for search and AI understanding",
      "Before / after report with implementation evidence",
      "Delivered in 3-5 business days",
    ],
    highlighted: true,
    badge: "Más popular",
    badgeEn: "Most popular",
    deliveryTime: "3-5 días hábiles",
    deliveryTimeEn: "3-5 business days",
  },
  {
    name: "Sistema de Autoridad Digital",
    nameEn: "Digital Authority System",
    price: "$2,500",
    priceNote: "precio cliente fundador",
    priceNoteEn: "founding client price",
    priceContext: "Proyectos regulares desde $5,000+",
    priceContextEn: "Regular projects start at $5,000+",
    description: "Un ecosistema completo de autoridad hecho para ti, diseñado para posicionar tu marca como una referencia confiable en tu sitio web, Google, búsqueda con IA, activos de PR y canales de conversión.",
    descriptionEn: "A complete done-for-you authority ecosystem designed to position your brand as a trusted reference across your website, Google, AI search, PR assets and conversion channels.",
    idealFor: "Disponible para los primeros 5 clientes internacionales de caso de estudio.",
    idealForEn: "Available for the first 5 international case-study clients.",
    step: "Paso 3 — Transformación Total",
    stepEn: "Step 3 — Total Transformation",
    features: [
      "Todo lo de Optimización de Autoridad en IAs",
      "Sitio web premium de autoridad",
      "Posicionamiento estratégico y copy del sitio",
      "Formulario de contacto inteligente (Email + WhatsApp)",
      "SEO técnico completo: Schema.org, FAQ, Breadcrumbs, Sitemap",
      "Perfiles de autoridad según elegibilidad: LinkedIn, perfiles de autor, Wikidata",
      "Kit de prensa: media kit, pitch emails, plantillas de artículos",
      "Google Analytics, Search Console y Google Alerts configurados",
      "robots.txt y metadata optimizados para IA",
      "Estructura bilingüe (Español + Inglés)",
      "Reporte final + checklist de optimización de 30 días",
      "Entrega en 2-4 semanas",
    ],
    featuresEn: [
      "Everything in AI Authority Optimization",
      "Premium authority website",
      "Strategic positioning and website copy",
      "Smart contact form connected to email and WhatsApp",
      "Full technical SEO: Schema.org, FAQ, Breadcrumbs, Sitemap",
      "Authority profiles according to eligibility: LinkedIn, author profiles, Wikidata",
      "Press kit: media kit, pitch emails, guest article templates",
      "Google Analytics, Search Console and Google Alerts configured",
      "AI-friendly robots.txt and metadata structure",
      "Bilingual structure: English + Spanish",
      "Final implementation report and 30-day optimization checklist",
      "Delivered in 2-4 weeks",
    ],
    highlighted: false,
    badge: "Done-For-You",
    badgeEn: "Done-For-You",
    deliveryTime: "2-4 semanas",
    deliveryTimeEn: "2-4 weeks",
  },
];
