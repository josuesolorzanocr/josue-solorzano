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

// Todavía no hay clientes, así que no hay testimonios.
// Se agregan SOLO cuando sean reales, de personas que dieron su permiso.
// Mientras el arreglo esté vacío, la sección no se renderiza (ver Testimonials.tsx).
export const testimonials: Testimonial[] = [];
