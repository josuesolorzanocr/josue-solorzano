import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale = "es-MX"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const siteConfig = {
  name: "Josué Solórzano",
  description:
    "Servicios digitales premium: sitios web, optimización para IAs, primera página de Google, perfiles verificados y captura inteligente de leads.",
  descriptionEn:
    "Premium digital services: websites, AI optimization, Google first page, verified profiles, and intelligent lead capture systems.",
  url: "https://josuesolorzano.com",
  email: "vjosue.3004@gmail.com",
  whatsapp: "50689547758",
  linkedinHandle: "josuesolorzanocr",
  instagramHandle: "josuesolorzanor",
  facebookHandle: "josue.solorzanorojas",
};


/** Igual, pero fijando cuál de las dos es la canónica de esta página. */
export function alternatesCanonicas(actual: "es" | "en", rutaEs: string, rutaEn: string) {
  const es = `${siteConfig.url}${rutaEs}`;
  const en = `${siteConfig.url}${rutaEn}`;
  return {
    canonical: actual === "es" ? es : en,
    languages: { es, en, "x-default": es },
  };
}
