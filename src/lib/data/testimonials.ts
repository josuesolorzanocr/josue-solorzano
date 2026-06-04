export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  quoteEn: string;
  avatar: string;
  service: string;
  serviceEn: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Carlos Herrera",
    role: "Dueño",
    company: "Restaurante El Fogón",
    quote:
      "Antes de tener el sitio, dependía 100% del boca a boca. Ahora recibo 3-4 consultas por semana directo por WhatsApp desde el formulario. El sitio se pagó solo en el primer mes.",
    quoteEn:
      "Before having the site, I relied 100% on word of mouth. Now I get 3-4 inquiries per week directly on WhatsApp from the form. The site paid for itself in the first month.",
    avatar: "CH",
    service: "Sitio Web Premium + Captura de Leads",
    serviceEn: "Premium Website + Lead Capture",
  },
  {
    name: "Daniela Moreno",
    role: "Fundadora",
    company: "DM Consulting",
    quote:
      "Mi negocio aparece ahora en las respuestas de ChatGPT cuando alguien busca consultoras en mi área. Eso antes era imposible. La inversión valió cada centavo.",
    quoteEn:
      "My business now appears in ChatGPT answers when someone searches for consultants in my area. That was impossible before. The investment was worth every cent.",
    avatar: "DM",
    service: "Optimización para IAs",
    serviceEn: "AI Optimization",
  },
  {
    name: "Marcos Villanueva",
    role: "Director",
    company: "MV Arquitectos",
    quote:
      "Pasé de la página 4 de Google a la primera página en 6 semanas. Mis competidores llevan años intentando eso. El SEO que implementaron es de otro nivel.",
    quoteEn:
      "I went from page 4 on Google to the first page in 6 weeks. My competitors have been trying to do that for years. The SEO they implemented is on another level.",
    avatar: "MV",
    service: "Primera Página de Google",
    serviceEn: "Google First Page",
  },
];
