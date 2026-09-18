"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PrQuery } from "@/lib/pr/supabase";
import { esCorreo, type Vencimiento } from "@/lib/pr/fechas";

function colorScore(s: number | null) {
  if (s === null) return "bg-neutral-700 text-neutral-200";
  if (s >= 70) return "bg-emerald-600 text-white";
  if (s >= 40) return "bg-amber-600 text-white";
  return "bg-neutral-700 text-neutral-300";
}

const VACIO: Record<string, string> = {
  responder: "No hay consultas por responder. Cuando entre una de 40 puntos o más, aparece aquí.",
  enviadas: "Todavía no ha contestado ninguna.",
  vencidas: "Ninguna se ha vencido.",
  descartadas: "No hay consultas descartadas.",
};

export default function PanelQueries({
  queries, vencimientos, vista, puedeAprobar,
}: {
  queries: PrQuery[];
  vencimientos: Record<string, Vencimiento | null>;
  vista: string;
  puedeAprobar: boolean;
}) {
  const router = useRouter();
  const [abierta, setAbierta] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);

  function abrir(q: PrQuery) {
    if (abierta === q.id) { setAbierta(null); return; }
    setAbierta(q.id);
    setTexto(q.draft_editado || q.draft || "");
    setDestinatario(esCorreo(q.responder_a) ? q.responder_a : "");
    setError(""); setCopiado(false);
  }

  async function actuar(id: string, accion: "enviar" | "marcar" | "rechazar") {
    if (accion === "enviar" && !window.confirm(`¿Enviar la respuesta a ${destinatario}? No se puede deshacer.`)) return;
    setOcupado(true); setError("");
    try {
      const r = await fetch("/api/pr-autopilot/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accion, texto, destinatario }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Falló."); return; }
      setAbierta(null); setTexto(""); setDestinatario("");
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function copiar() {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
  }

  if (!queries.length) {
    return (
      <p className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">
        {VACIO[vista] || "Nada por aquí."}
      </p>
    );
  }

  return (
    <section className="space-y-3">
      {queries.map((q) => {
        const v = vencimientos[q.id];
        const porCorreo = esCorreo(q.responder_a);
        const enPlataforma = !!q.responder_a && !porCorreo;
        return (
          <article key={q.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${colorScore(q.score)}`}>
                    {q.score ?? "revisar"}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-neutral-500">
                    {q.plataforma}{q.medio ? ` · ${q.medio}` : ""}
                  </span>
                  {q.sin_ia && (
                    <span className="rounded bg-red-950 px-2 py-0.5 text-xs text-red-300">no acepta IA</span>
                  )}
                </div>
                <h3 className="mt-1 font-medium">{q.asunto || "(sin asunto)"}</h3>
                <p className={`mt-1 text-xs ${
                  v?.urgente ? "font-semibold text-red-400" : v?.vencida ? "text-neutral-500" : "text-neutral-300"
                }`}>
                  {v ? `Vence: ${v.texto}` : "Sin fecha límite registrada: revísela en el boletín"}
                </p>
                {q.estado === "enviada" && (
                  <p className="mt-1 text-xs text-emerald-400" suppressHydrationWarning>
                    {q.enviada_a ? `Enviada a ${q.enviada_a}` : "Contestada en la plataforma"}
                    {q.enviada_en ? ` · ${new Date(q.enviada_en).toLocaleString("es-CR", { timeZone: "America/Costa_Rica" })}` : ""}
                  </p>
                )}
                {q.score_motivo && (
                  <p className="mt-1 text-xs text-neutral-400">{q.score_motivo}</p>
                )}
              </div>
              {(puedeAprobar && q.estado === "pendiente") || q.estado === "enviada" ? (
                <button
                  onClick={() => abrir(q)}
                  className="shrink-0 rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
                >
                  {abierta === q.id ? "Cerrar" : q.estado === "enviada" ? "Ver lo enviado" : "Revisar"}
                </button>
              ) : null}
            </div>

            {abierta === q.id && q.estado === "enviada" && (
              <pre className="mt-4 whitespace-pre-wrap rounded bg-neutral-950 p-3 text-xs text-neutral-300">
                {q.draft_editado || "(no quedó registrado el texto)"}
              </pre>
            )}

            {abierta === q.id && q.estado === "pendiente" && (
              <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
                <div className="rounded-lg bg-neutral-950 p-3 text-sm">
                  {q.titulo && <p className="font-medium text-neutral-200">{q.titulo}</p>}
                  <p className="mt-1 text-neutral-400">{q.cuerpo}</p>
                </div>

                <div className="rounded-lg border border-neutral-800 p-3 text-sm">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Cómo se contesta</p>
                  {porCorreo && <p className="mt-1">Por correo a <span className="font-mono">{q.responder_a}</span>. Sale desde su buzón de PR y le llega copia.</p>}
                  {enPlataforma && (
                    <p className="mt-1">
                      Dentro de la plataforma:{" "}
                      <a href={q.responder_a!} target="_blank" rel="noopener noreferrer" className="underline">abrir {q.plataforma}</a>.
                      Copie el texto, péguelo allá y después márquela como contestada.
                    </p>
                  )}
                  {!q.responder_a && <p className="mt-1 text-amber-300">No se encontró el contacto. Búsquelo en el boletín original en Gmail.</p>}
                </div>

                {q.sin_ia && (
                  <p className="rounded-lg bg-red-950 p-3 text-sm text-red-200">
                    Este periodista <strong>no acepta respuestas escritas con IA</strong>. Lo de abajo es
                    sólo una guía: escriba la respuesta con sus palabras y sus propios ejemplos.
                  </p>
                )}

                {!enPlataforma && (
                  <input
                    type="email" value={destinatario} placeholder="Correo del periodista"
                    onChange={(e) => setDestinatario(e.target.value)}
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
                  />
                )}
                <textarea
                  value={texto} rows={12} onChange={(e) => setTexto(e.target.value)}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex flex-wrap gap-2">
                  {!enPlataforma && (
                    <button
                      disabled={ocupado || !esCorreo(destinatario) || !texto.trim()}
                      onClick={() => actuar(q.id, "enviar")}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-40"
                    >
                      {ocupado ? "Enviando…" : "Aprobar y enviar"}
                    </button>
                  )}
                  <button
                    disabled={!texto.trim()} onClick={copiar}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    {copiado ? "Copiado ✓" : "Copiar texto"}
                  </button>
                  <button
                    disabled={ocupado || !texto.trim()} onClick={() => actuar(q.id, "marcar")}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Ya la contesté por otro lado
                  </button>
                  <button
                    disabled={ocupado} onClick={() => actuar(q.id, "rechazar")}
                    className="rounded-lg border border-neutral-800 px-4 py-2 text-sm text-neutral-400 disabled:opacity-40"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
