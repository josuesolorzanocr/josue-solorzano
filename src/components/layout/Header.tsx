"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const navEs: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Sobre Mí", href: "/sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Precios", href: "/#precios" },
  { label: "Blog", href: "/blog" },
  { label: "Libro", href: "/libros" },
];

const navEn: NavItem[] = [
  { label: "Home", href: "/en" },
  { label: "About", href: "/en/about" },
  { label: "Services", href: "/en#services" },
  { label: "Pricing", href: "/en#pricing" },
  { label: "Blog", href: "/en/blog" },
  { label: "Book", href: "/en/books" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");
  const nav = isEn ? navEn : navEs;
  const contactHref = isEn ? "/en#contact" : "/#contacto";
  const langToggleHref = isEn ? "/" : "/en";
  const langToggleLabel = isEn ? "ES" : "EN";

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass border-b border-[#1e1e2e]" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={isEn ? "/en" : "/"} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#b8860b] animate-pulse-glow flex-shrink-0">
              <Image
                src="/images/josue-avatar.jpg"
                alt="Josué Solórzano"
                width={36}
                height={36}
                className="object-cover object-top w-full h-full"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-sm tracking-tight">Josué Solórzano</span>
              <span className="text-[#f0c040] text-xs font-semibold tracking-widest">Digital Authority</span>
            </div>

          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "text-[#f0c040] bg-[#b8860b1a]"
                    : "text-[#8888aa] hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={langToggleHref}
              className="text-xs font-semibold text-[#8888aa] hover:text-white border border-[#1e1e2e] hover:border-[#b8860b] rounded-md px-3 py-1.5 transition-all"
            >
              {langToggleLabel}
            </Link>
            <Link
              href={contactHref}
              className="bg-[#b8860b] hover:bg-[#a07708] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all glow"
            >
              {isEn ? "Contact" : "Contacto"}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#8888aa] hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden glass border-t border-[#1e1e2e] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    pathname === item.href
                      ? "text-[#f0c040] bg-[#b8860b1a]"
                      : "text-[#8888aa] hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 flex gap-2">
                <Link
                  href={langToggleHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-xs font-semibold text-[#8888aa] border border-[#1e1e2e] rounded-lg px-3 py-2.5 transition-all"
                >
                  {langToggleLabel}
                </Link>
                <Link
                  href={contactHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-[#b8860b] text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
                >
                  {isEn ? "Contact" : "Contacto"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
