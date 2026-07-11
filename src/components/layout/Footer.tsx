import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/utils";

interface FooterProps {
  lang?: "es" | "en";
}

export default function Footer({ lang = "es" }: FooterProps) {
  const isEn = lang === "en";
  const base = isEn ? "/en" : "";

  const links = isEn
    ? [
        { label: "About", href: "/en/about" },
        { label: "Services", href: "/en#services" },
        { label: "Pricing", href: "/en#pricing" },
        { label: "Blog", href: "/en/blog" },
        { label: "Books", href: "/en/books" },
        { label: "Press Kit", href: "/en/press" },
        { label: "Contact", href: "/en#contact" },
      ]
    : [
        { label: "Sobre Mí", href: "/sobre-mi" },
        { label: "Servicios", href: "/#servicios" },
        { label: "Precios", href: "/#precios" },
        { label: "Blog", href: "/blog" },
        { label: "Libros", href: "/libros" },
        { label: "Media Kit", href: "/media-kit" },
        { label: "Contacto", href: "/#contacto" },
      ];

  const socialLinks = [
    { label: "LinkedIn", href: `https://linkedin.com/in/${siteConfig.linkedinHandle}`, icon: "in" },
    { label: "Instagram", href: `https://instagram.com/${siteConfig.instagramHandle}`, icon: "IG" },
    { label: "Facebook", href: `https://www.facebook.com/${siteConfig.facebookHandle}`, icon: "FB" },
  ];

  return (
    <footer className="border-t border-[#1e1e2e] bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#b8860b] flex-shrink-0">
                <Image
                  src="/images/josue-avatar.jpg"
                  alt="Josué Solórzano"
                  width={36}
                  height={36}
                  className="object-cover object-top w-full h-full"
                />
              </div>
              <span className="font-bold text-white text-lg">Josué Solórzano</span>
            </div>
            <p className="text-[#8888aa] text-sm leading-relaxed max-w-sm">
              {isEn
                ? "We help experts, consultants, founders and service businesses build premium digital authority systems designed to improve trust, visibility and conversion across Google, AI search and global markets."
                : "Ayudamos a expertos, consultores, fundadores y negocios de servicios a construir sistemas premium de autoridad digital diseñados para mejorar confianza, visibilidad y conversión en Google, búsquedas con IA y mercados globales."}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg border border-[#1e1e2e] flex items-center justify-center text-[#8888aa] hover:text-white hover:border-[#b8860b] hover:bg-[#b8860b1a] transition-all text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{isEn ? "Pages" : "Páginas"}</h3>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[#8888aa] hover:text-[#f0c040] text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{isEn ? "Contact" : "Contacto"}</h3>
            <ul className="space-y-2 text-sm text-[#8888aa]">
              <li>
                <a
                  href="mailto:vjosue.3004@gmail.com"
                  className="hover:text-[#f0c040] transition-colors"
                >
                  vjosue.3004@gmail.com
                </a>
              </li>
              <li className="mt-4">
                <Link
                  href={isEn ? "/en#contact" : "/#contacto"}
                  className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  {isEn ? "Get a free quote" : "Cotiza gratis"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e1e2e] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#8888aa] text-xs">
            © {new Date().getFullYear()} Josué Solórzano.{" "}
            {isEn ? "All rights reserved." : "Todos los derechos reservados."}
          </p>
          <div className="flex items-center gap-4 text-xs text-[#8888aa]">
            <Link href={`${base}/privacidad`} className="hover:text-white transition-colors">
              {isEn ? "Privacy Policy" : "Privacidad"}
            </Link>
            <Link href={`${base}/terminos`} className="hover:text-white transition-colors">
              {isEn ? "Terms" : "Términos"}
            </Link>
            <Link href={isEn ? "/" : "/en"} className="hover:text-[#f0c040] transition-colors font-medium">
              {isEn ? "🇪🇸 Español" : "🇺🇸 English"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
