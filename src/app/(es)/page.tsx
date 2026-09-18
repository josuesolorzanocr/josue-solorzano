import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import ServicesSection from "@/components/sections/ServicesSection";
import Testimonials from "@/components/sections/Testimonials";
import BookAuthority from "@/components/sections/BookAuthority";
import ContactSection from "@/components/sections/ContactSection";
import { siteConfig, alternatesCanonicas } from "@/lib/utils";
import { faqSchema, professionalServiceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Josué Solórzano | Autoridad Digital y Sistemas con IA" },
  description:
    "Autoridad digital desde Costa Rica: sitios web que posicionan en Google y en buscadores de IA, relaciones públicas y sistemas de negocio construidos con IA.",
  alternates: alternatesCanonicas("es", "", "/en"),
};

const faqs = [
  {
    question: "¿Qué incluye un sitio web premium?",
    answer: "Diseño moderno, carga ultra rápida, optimización SEO, formulario inteligente de captura de leads, adaptado a móviles y optimizado para aparecer en Google y en las respuestas de IAs como ChatGPT.",
  },
  {
    question: "¿En qué países trabaja Josue Solorzano?",
    answer: "Trabaja de forma remota desde Costa Rica y atiende a expertos y empresas de cualquier país, con enfoque en Estados Unidos, Canadá, Europa y América Latina.",
  },
  {
    question: "¿Cómo funciona el sistema de captura de leads?",
    answer: "Cada vez que alguien llena el formulario de tu sitio, recibes una notificación instantánea en tu correo y en tu WhatsApp con todos sus datos para que puedas responder de inmediato.",
  },
  {
    question: "¿Qué es la optimización para IAs?",
    answer: "Es un conjunto de técnicas que hacen que herramientas como ChatGPT, Claude, Perplexity y Gemini mencionen tu marca cuando alguien busca servicios como los tuyos.",
  },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema()) }} />
      <Hero lang="es" />
      <Stats lang="es" />
      <About lang="es" />
      <ServicesSection lang="es" />
      <Testimonials lang="es" />
      <BookAuthority lang="es" />
      <ContactSection lang="es" />
    </>
  );
}
