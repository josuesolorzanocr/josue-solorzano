"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PrQuery } from "@/lib/pr/supabase";
import { esCorreo, type Vencimiento } from "@/lib/pr/fechas";
import type { UsoCupo } from "@/lib/pr/cupos";

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

/** La respuesta sale en inglés salvo que el periodista haya escrito en español. */
const saleEnIngles = (q: PrQuery) => q.idioma !== "es";

const caja = "w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm";

export default function PanelQueries({
  queries, vencimientos, cupos, vista, puedeAprobar,
}: {
  queries: PrQuery[];
  vencimientos: Record<string, Vencimiento | null>;
  cupos: UsoCupo[];
  vista: string;
  puedeAprobar: boolean;
}) {
  const router = useRouter();
  const [abierta, setAbierta] = useState<string | null>(null);
  const abiertaRef = useRef<string | null>(null);
  /** Lo que se envía: en inglés, sólo existe después de "Preparar versión en inglés". */
  const [texto, setTexto] = useState("");
  /** Lo que Josué lee y edita, en español. */
  const [textoEs, setTextoEs] = useState("");
  /** El inglés traducido de vuelta al español: para ver qué dice de verdad. */
  const [vueltaEs, setVueltaEs] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [traduciendo, setTraduciendo] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [copiado, setCopiado] = useState(false);
  /** Checklist recién rehecho, antes de que el servidor refresque la lista. */
  const [checklists, setChecklists] = useState<Record<string, PrQuery["checklist"]>>({});

  async function traducir(cuerpo: Record<string, string>) {
    const r = await fetch("/api/pr-autopilot/traducir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "No se pudo traducir.");
    return d;
  }

  async function abrir(q: PrQuery) {
    if (abierta === q.id) { setAbierta(null); abiertaRef.current = null; return; }
    setAbierta(q.id); abiertaRef.current = q.id;
    setDestinatario(esCorreo(q.responder_a) ? q.responder_a : "");
    setError(""); setAviso(""); setCopiado(false); setVueltaEs("");

    if (!saleEnIngles(q)) {
      setTexto(q.draft_editado || q.draft || ""); setTextoEs("");
      return;
    }
    setTexto("");
    setTextoEs(q.draft_es || "");
    if (!q.draft_es && (q.draft_editado || q.draft)) await cargarEspanol(q.id);
  }

  async function cargarEspanol(id: string) {
    setTraduciendo("Traduciendo el borrador al español…");
    try {
      const d = await traducir({ id, modo: "a_espanol" });
      if (abiertaRef.current === id) setTextoEs(d.es || "");
    } catch (e) {
      if (abiertaRef.current === id) setError(e instanceof Error ? e.message : String(e));
    } finally {
      setTraduciendo("");
    }
  }

  async function rehacer(q: PrQuery) {
    if (!window.confirm("Esto escribe un borrador nuevo con su perfil actual y reemplaza el que hay. ¿Seguir?")) return;
    setError(""); setAviso(""); setCopiado(false);
    setTraduciendo("Escribiendo un borrador nuevo con su perfil actual…");
    try {
      const r = await fetch("/api/pr-autopilot/redactar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: q.id }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "No se pudo rehacer.");
      setChecklists((c) => ({ ...c, [q.id]: d.checklist }));
      if (d.aviso) setAviso(d.aviso);
      setTexto(""); setVueltaEs("");
      if (saleEnIngles(q)) {
        setTextoEs("");
        setTraduciendo("");
        await cargarEspanol(q.id);
      } else {
        setTexto(d.draft || "");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setTraduciendo("");
    }
  }

  function editarEspanol(valor: string) {
    setTextoEs(valor);
    // El inglés preparado ya no corresponde a lo que dice el español.
    if (texto) { setTexto(""); setVueltaEs(""); }
  }

  async function prepararIngles(id: string) {
    setError(""); setCopiado(false);
    setTraduciendo("Preparando la versión en inglés y revisándola…");
    try {
      const d = await traducir({ id, modo: "a_ingles", texto_es: textoEs });
      setTexto(d.en || ""); setVueltaEs(d.vuelta_es || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setTraduciendo("");
    }
  }

  async function actuar(q: PrQuery, accion: "enviar" | "marcar" | "rechazar") {
    if (accion === "enviar" && !window.confirm(`¿Enviar la respuesta a ${destinatario}? No se puede deshacer.`)) return;
    setOcupado(true); setError("");
    try {
      const ingles = saleEnIngles(q);
      const r = await fetch("/api/pr-autopilot/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: q.id, accion, destinatario,
          texto: ingles ? (texto || textoEs) : texto,
          texto_es: ingles ? textoEs : undefined,
        }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Falló."); return; }
      setAbierta(null); abiertaRef.current = null;
      setTexto(""); setTextoEs(""); setVueltaEs(""); setDestinatario("");
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
        const ingles = saleEnIngles(q);
        const listo = !!texto.trim();
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
              <div className="mt-4 space-y-3">
                {q.respuesta_es && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Lo que usted aprobó, en español</p>
                    <pre className="whitespace-pre-wrap rounded bg-neutral-950 p-3 text-xs text-neutral-300">{q.respuesta_es}</pre>
                  </div>
                )}
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Lo que salió</p>
                  <pre className="whitespace-pre-wrap rounded bg-neutral-950 p-3 text-xs text-neutral-300">
                    {q.draft_editado || "(no quedó registrado el texto)"}
                  </pre>
                </div>
              </div>
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
                  {ingles && <p className="mt-1 text-neutral-400">El periodista escribió en inglés: usted trabaja en español y la respuesta sale en inglés.</p>}
                  {(() => {
                    const c = cupos.find((x) => x.plataforma === q.plataforma);
                    if (!c || c.limiteMensual === null) return null;
                    return (
                      <p className={`mt-1 ${c.quedan === 0 ? "font-medium text-amber-300" : "text-neutral-400"}`}>
                        {q.plataforma} permite {c.limiteMensual} respuestas al mes en el plan gratis.{" "}
                        {c.quedan === 0
                          ? "Ya las usó todas este mes: esta sólo se podría contestar pagando."
                          : `Le quedan ${c.quedan}: gástelas sólo en consultas que calcen perfecto.`}
                      </p>
                    );
                  })()}
                </div>

                {q.consulta_original && (
                  <details className="rounded-lg border border-neutral-800 p-3 text-sm">
                    <summary className="cursor-pointer text-neutral-300">Ver la consulta original, tal como la escribió el periodista</summary>
                    <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-neutral-400">{q.consulta_original}</pre>
                  </details>
                )}

                {(() => {
                  const lista = checklists[q.id] ?? q.checklist;
                  if (!lista?.length) return null;
                  const faltan = lista.filter((i) => !i.cumple).length;
                  return (
                    <div className="rounded-lg border border-neutral-800 p-3 text-sm">
                      <p className="text-xs uppercase tracking-wide text-neutral-500">Lo que pide el periodista</p>
                      <ul className="mt-2 space-y-1">
                        {lista.map((i, n) => (
                          <li key={n} className={i.cumple ? "text-neutral-300" : "text-amber-300"}>
                            {i.cumple ? "✓" : "✗"} {i.pide}
                          </li>
                        ))}
                      </ul>
                      {faltan > 0 && (
                        <p className="mt-2 text-xs text-neutral-500">
                          Lo marcado con ✗ no está en el borrador porque su perfil no lo tiene. Agréguelo usted si lo tiene, o déjelo fuera: nunca se inventa.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {q.sin_ia && (
                  <p className="rounded-lg bg-red-950 p-3 text-sm text-red-200">
                    Este periodista <strong>no acepta respuestas escritas con IA</strong>. Lo de abajo es
                    sólo una guía: escriba la respuesta con sus palabras y sus propios ejemplos.
                    {ingles && " Como la traducción al inglés la hace una IA, al preparar el inglés se agrega sola una nota que lo dice. Ojo: la nota es transparencia, no garantiza pasar el detector automático de IA de HARO."}
                  </p>
                )}

                {!enPlataforma && (
                  <input
                    type="email" value={destinatario} placeholder="Correo del periodista"
                    onChange={(e) => setDestinatario(e.target.value)}
                    className={caja}
                  />
                )}

                {ingles ? (
                  <>
                    <label className="block text-xs uppercase tracking-wide text-neutral-500">Su respuesta, en español</label>
                    <textarea
                      value={textoEs} rows={12} onChange={(e) => editarEspanol(e.target.value)}
                      disabled={!!traduciendo} className={caja}
                    />
                    {listo && (
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Así sale en inglés (esto es lo que se envía)</p>
                          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded bg-neutral-950 p-3 text-xs text-neutral-300">{texto}</pre>
                        </div>
                        <div>
                          <p className="mb-1 text-xs uppercase tracking-wide text-emerald-500">Lo que dice ese inglés, traducido de vuelta: revise que no falte ni sobre nada</p>
                          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded border border-emerald-900 bg-neutral-950 p-3 text-xs text-neutral-200">{vueltaEs}</pre>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <textarea value={texto} rows={12} onChange={(e) => setTexto(e.target.value)} className={caja} />
                )}

                {traduciendo && <p className="text-sm text-neutral-400">{traduciendo}</p>}
                {aviso && <p className="text-sm text-amber-300">{aviso}</p>}
                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex flex-wrap gap-2">
                  {ingles && !listo && (
                    <button
                      disabled={!!traduciendo || !textoEs.trim()}
                      onClick={() => prepararIngles(q.id)}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-40"
                    >
                      Preparar versión en inglés
                    </button>
                  )}
                  {!enPlataforma && (!ingles || listo) && (
                    <button
                      disabled={ocupado || !!traduciendo || !esCorreo(destinatario) || !listo}
                      onClick={() => actuar(q, "enviar")}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-40"
                    >
                      {ocupado ? "Enviando…" : ingles ? "Aprobar y enviar en inglés" : "Aprobar y enviar"}
                    </button>
                  )}
                  {(!ingles || listo) && (
                    <button
                      disabled={!listo} onClick={copiar}
                      className="rounded-lg border border-neutral-700 px-4 py-2 text-sm disabled:opacity-40"
                    >
                      {copiado ? "Copiado ✓" : ingles ? "Copiar el inglés" : "Copiar texto"}
                    </button>
                  )}
                  <button
                    disabled={ocupado || !!traduciendo || !(texto.trim() || textoEs.trim())}
                    onClick={() => actuar(q, "marcar")}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Ya la contesté por otro lado
                  </button>
                  <button
                    disabled={ocupado || !!traduciendo} onClick={() => rehacer(q)}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Rehacer borrador con mi perfil actual
                  </button>
                  <button
                    disabled={ocupado} onClick={() => actuar(q, "rechazar")}
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
