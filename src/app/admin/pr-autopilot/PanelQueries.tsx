"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PrQuery } from "@/lib/pr/supabase";

function colorScore(s: number | null) {
  if (s === null) return "bg-neutral-700 text-neutral-200";
  if (s >= 70) return "bg-emerald-600 text-white";
  if (s >= 40) return "bg-amber-600 text-white";
  return "bg-neutral-700 text-neutral-300";
}

export default function PanelQueries({
  queries, puedeAprobar,
}: { queries: PrQuery[]; puedeAprobar: boolean }) {
  const router = useRouter();
  const [abierta, setAbierta] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");

  async function actuar(id: string, accion: "enviar" | "rechazar") {
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

  if (!queries.length) {
    return (
      <p className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">
        Todavía no ha llegado ninguna consulta. Cuando el Apps Script del Gmail
        reenvíe la primera, aparece aquí con su score.
      </p>
    );
  }

  return (
    <section className="space-y-3">
      {queries.map((q) => (
        <article key={q.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${colorScore(q.score)}`}>
                  {q.score ?? "—"}
                </span>
                <span className="text-xs uppercase tracking-wide text-neutral-500">
                  {q.plataforma}{q.medio ? ` · ${q.medio}` : ""}
                </span>
                <span className="text-xs text-neutral-500">· {q.estado}</span>
              </div>
              <h3 className="mt-1 truncate font-medium">{q.asunto || "(sin asunto)"}</h3>
              {q.score_motivo && (
                <p className="mt-1 text-xs text-neutral-400">{q.score_motivo}</p>
              )}
            </div>
            {puedeAprobar && q.estado === "pendiente" && (
              <button
                onClick={() => {
                  setAbierta(abierta === q.id ? null : q.id);
                  setTexto(q.draft_editado || q.draft || "");
                  setError("");
                }}
                className="shrink-0 rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
              >
                {abierta === q.id ? "Cerrar" : "Revisar"}
              </button>
            )}
          </div>

          {abierta === q.id && (
            <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
              <details className="text-sm text-neutral-400">
                <summary className="cursor-pointer">Ver la consulta original</summary>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded bg-neutral-950 p-3 text-xs">
                  {q.cuerpo}
                </pre>
              </details>
              <input
                type="email" value={destinatario} placeholder="Correo del periodista"
                onChange={(e) => setDestinatario(e.target.value)}
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
              />
              <textarea
                value={texto} rows={10} onChange={(e) => setTexto(e.target.value)}
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-2">
                <button
                  disabled={ocupado} onClick={() => actuar(q.id, "enviar")}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-50"
                >
                  {ocupado ? "Enviando…" : "Aprobar y enviar"}
                </button>
                <button
                  disabled={ocupado} onClick={() => actuar(q.id, "rechazar")}
                  className="rounded-lg border border-neutral-700 px-4 py-2 text-sm disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
