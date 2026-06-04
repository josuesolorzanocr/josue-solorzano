"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Globe, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ContactSectionProps {
  lang?: "es" | "en";
}

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactSection({ lang = "es" }: ContactSectionProps) {
  const isEn = lang === "en";
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", company: "", email: "", service: "", message: "" });

  const services = isEn
    ? [
        { icon: "🌐", title: "Premium Websites", desc: "High-converting, fast, and SEO-optimized sites." },
        { icon: "📩", title: "Lead Capture System", desc: "Smart forms that send leads to email and WhatsApp." },
        { icon: "🤖", title: "AI Optimization", desc: "Get cited by ChatGPT, Claude, and Perplexity." },
        { icon: "📰", title: "Media Mentions", desc: "Appearances in recognized global media outlets." },
        { icon: "🔍", title: "Google First Page", desc: "SEO strategy to dominate your niche." },
        { icon: "✅", title: "Verified Profiles", desc: "HARO, LinkedIn, Wikidata, and more." },
      ]
    : [
        { icon: "🌐", title: "Sitios Web Premium", desc: "Sitios rápidos, modernos y optimizados para conversión." },
        { icon: "📩", title: "Captura de Leads", desc: "Formularios inteligentes que envían leads a tu correo y WhatsApp." },
        { icon: "🤖", title: "Optimización para IAs", desc: "Que ChatGPT, Claude y Perplexity te mencionen." },
        { icon: "📰", title: "Menciones en Medios", desc: "Apariciones en medios reconocidos del mundo." },
        { icon: "🔍", title: "Primera Página de Google", desc: "Estrategia SEO para dominar tu nicho." },
        { icon: "✅", title: "Perfiles Verificados", desc: "HARO, LinkedIn, Wikidata y más." },
      ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setFormState("success");
      setForm({ name: "", company: "", email: "", service: "", message: "" });
    } catch (err) {
      setFormState("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar. Intenta de nuevo.");
    }
  }

  return (
    <section id={isEn ? "contact" : "contacto"} className="py-24 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#f0c040] text-sm font-semibold uppercase tracking-widest">
              {isEn ? "Contact" : "Contacto"}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              {isEn ? "Let's grow your business" : "Hagamos crecer tu negocio"}
            </h2>
            <p className="text-[#8888aa] leading-relaxed max-w-xl mx-auto">
              {isEn
                ? "Tell me about your project. I respond within 24 business hours."
                : "Cuéntame sobre tu proyecto. Respondo dentro de las 24 horas hábiles."}
            </p>
          </motion.div>

          {/* Services grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 flex items-start gap-3"
              >
                <span className="text-xl flex-shrink-0">{s.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{s.title}</div>
                  <div className="text-[#8888aa] text-xs mt-0.5">{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact form + info */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8"
            >
              <h3 className="text-white font-bold text-xl mb-6">
                {isEn ? "Send a message" : "Envía un mensaje"}
              </h3>

              {formState === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={48} className="text-green-400 mb-4" />
                  <h4 className="text-white font-bold text-xl mb-2">
                    {isEn ? "Message sent!" : "¡Mensaje enviado!"}
                  </h4>
                  <p className="text-[#8888aa] text-sm leading-relaxed max-w-xs">
                    {isEn
                      ? "I'll get back to you within 24 business hours. Check your inbox for a confirmation."
                      : "Te responderé dentro de las 24 horas hábiles. Revisa tu bandeja de entrada."}
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-6 text-[#f0c040] text-sm font-medium hover:text-white transition-colors"
                  >
                    {isEn ? "Send another message" : "Enviar otro mensaje"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#8888aa] text-xs font-medium block mb-1.5">
                        {isEn ? "Full name *" : "Nombre completo *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white text-sm placeholder-[#8888aa] focus:outline-none focus:border-[#b8860b] transition-colors"
                        placeholder={isEn ? "Jane Doe" : "Juan Pérez"}
                      />
                    </div>
                    <div>
                      <label className="text-[#8888aa] text-xs font-medium block mb-1.5">
                        {isEn ? "Company" : "Empresa"}
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white text-sm placeholder-[#8888aa] focus:outline-none focus:border-[#b8860b] transition-colors"
                        placeholder={isEn ? "Acme Corp" : "Mi Empresa"}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#8888aa] text-xs font-medium block mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white text-sm placeholder-[#8888aa] focus:outline-none focus:border-[#b8860b] transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-[#8888aa] text-xs font-medium block mb-1.5">
                      {isEn ? "Service" : "Servicio"}
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#b8860b] transition-colors appearance-none"
                    >
                      <option value="">{isEn ? "Select a product..." : "Selecciona un producto..."}</option>
                      <option>{isEn ? "Authority Audit — $297" : "Auditoría de Autoridad — $297"}</option>
                      <option>{isEn ? "AI Visibility — $597" : "Visibilidad en IAs — $597"}</option>
                      <option>{isEn ? "Digital Authority — Full Package — $2,500" : "Autoridad Digital — Paquete Completo — $2,500"}</option>
                      <option>{isEn ? "Question / Other" : "Tengo una pregunta / Otro"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#8888aa] text-xs font-medium block mb-1.5">
                      {isEn ? "Message *" : "Mensaje *"}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white text-sm placeholder-[#8888aa] focus:outline-none focus:border-[#b8860b] transition-colors resize-none"
                      placeholder={isEn ? "Tell me about your business and what you need..." : "Cuéntame sobre tu negocio y qué necesitas lograr..."}
                    />
                  </div>

                  {formState === "error" && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-4001a border border-red-40033 rounded-lg px-4 py-3">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="w-full bg-[#b8860b] hover:bg-[#a07708] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-all glow flex items-center justify-center gap-2"
                  >
                    {formState === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isEn ? "Sending..." : "Enviando..."}
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {isEn ? "Send Message" : "Enviar Mensaje"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-4"
            >
              {[
                { icon: Mail, label: "Email", value: "vjosue.3004@gmail.com", href: "mailto:vjosue.3004@gmail.com" },
                { icon: Phone, label: "WhatsApp", value: "+506 8954 7758", href: "https://wa.me/50689547758" },
                { icon: Globe, label: isEn ? "Availability" : "Disponibilidad", value: isEn ? "USA · Europe · LATAM" : "USA · Europa · LATAM", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-[#111118] border border-[#1e1e2e] rounded-xl hover:border-[#b8860b33] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#b8860b1a] flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-[#f0c040]" />
                  </div>
                  <div>
                    <div className="text-[#8888aa] text-xs">{item.label}</div>
                    <div className="text-white font-semibold text-sm group-hover:text-[#f0c040] transition-colors">
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}

              <div className="p-5 bg-gradient-to-br from-[#b8860b1a] to-[#111118] border border-[#b8860b33] rounded-xl">
                <div className="text-white font-bold text-sm mb-1">
                  {isEn ? "Response time" : "Tiempo de respuesta"}
                </div>
                <div className="text-[#8888aa] text-xs leading-relaxed">
                  {isEn
                    ? "All inquiries answered within 24 business hours. You'll receive a confirmation email immediately."
                    : "Todas las consultas respondidas en 24 horas hábiles. Recibirás un email de confirmación de inmediato."}
                </div>
              </div>

              <a
                href="https://wa.me/50689547758"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25d3661a] hover:bg-[#25d36633] border border-[#25d36633] text-[#25d366] font-semibold text-sm py-3.5 rounded-xl transition-all"
              >
                <span className="text-lg">💬</span>
                {isEn ? "Chat on WhatsApp" : "Chatear por WhatsApp"}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
