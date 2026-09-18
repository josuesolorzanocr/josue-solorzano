"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Perfil } from "@/lib/pr/perfil";

const LIMITE_TEXTO = 4000;

export default function EditorPerfil({
  vigente, historial, fechas, puedeEditar,
}: {
  vigente: Perfil | null;
  historial: Perfil[];
  /** Fechas ya formateadas en el servidor, en hora de Costa Rica. */
  fechas: Record<string, string>;
  puedeEditar: boolean;
}) {
  const router = useRouter();
  const [texto, setTexto] = useState(vigente?.texto ?? "");
  const [firmaEs, setFirmaEs] = useState(vigente?.firma_es ?? "");
  const [firmaEn, setFirmaEn] = useState(vigente?.firma_en ?? "");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const cambiado =
    texto.trim() !== (vigente?.texto ?? "") ||
    firmaEs.trim() !== (vigente?.firma_es ?? "") ||
    firmaEn.trim() !== (vigente?.firma_en ?? "");

  function usarVersion(v: Perfil) {
    setTexto(v.texto); setFirmaEs(v.firma_es); setFirmaEn(v.firma_en);
    setAviso("Cargué esa versión en el editor. Revísela y dele Guardar para que vuelva a ser la vigente.");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function guardar() {
    setOcupado(true); setError(""); setAviso("");
    try {
      const r = await fetch("/api/pr-autopilot/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, firma_es: firmaEs, firma_en: firmaEn }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "No se pudo guardar."); return; }
      setAviso(d.sin_cambios
        ? "No había cambios que guardar."
        : "Guardado. La próxima consulta que llegue ya se califica con este perfil.");
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  const campo = "w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm disabled:opacity-60";

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-300">
        <p>
          <strong className="text-white">Esto es todo lo que Claude sabe de usted.</strong>{" "}
          Con este texto califica cada consulta y escribe cada borrador. Lo que no esté aquí,
          lo trata como algo que usted no sabe.
        </p>
        <p className="mt-2 text-neutral-400">
          Escriba sólo cosas ciertas y que pueda sostener: Claude las puede usar en respuestas
          que salen con su nombre a periodistas.
        </p>
        <details className="mt-3 text-neutral-400">
          <summary className="cursor-pointer text-neutral-300">Qué conviene poner</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Su especialidad y a quién atiende.</li>
            <li>Experiencia comprobable: años, cargos, instituciones.</li>
            <li>Datos propios que haya medido usted (con fecha y de dónde salen).</li>
            <li>Libros, publicaciones, certificaciones.</li>
            <li>Idiomas y país.</li>
            <li>Temas en los que <em>no</em> quiere aparecer: también cuenta.</li>
          </ul>
        </details>
      </div>

      <div className="space-y-2">
        <label className="flex items-baseline justify-between text-sm font-medium">
          <span>Perfil</span>
          <span className={`text-xs tabular-nums ${texto.length > LIMITE_TEXTO ? "text-red-400" : "text-neutral-500"}`}>
            {texto.length} / {LIMITE_TEXTO}
          </span>
        </label>
        <textarea
          value={texto} rows={12} disabled={!puedeEditar}
          onChange={(e) => setTexto(e.target.value)}
          className={campo}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          <span>Firma en español</span>
          <input value={firmaEs} disabled={!puedeEditar} onChange={(e) => setFirmaEs(e.target.value)} className={campo} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Firma en inglés</span>
          <input value={firmaEn} disabled={!puedeEditar} onChange={(e) => setFirmaEn(e.target.value)} className={campo} />
        </label>
      </div>
      <p className="-mt-3 text-xs text-neutral-500">
        La firma va tal cual al final de cada borrador. Nada de marcadores como [nombre] o [sitio].
      </p>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {aviso && <p className="text-sm text-emerald-400">{aviso}</p>}

      {puedeEditar && (
        <div className="flex items-center gap-3">
          <button
            disabled={ocupado || !cambiado}
            onClick={guardar}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-40"
          >
            {ocupado ? "Guardando…" : "Guardar"}
          </button>
          {vigente && (
            <span className="text-xs text-neutral-500">Vigente desde {fechas[vigente.id]}</span>
          )}
        </div>
      )}

      {historial.length > 1 && (
        <div className="space-y-2 border-t border-neutral-800 pt-6">
          <h2 className="text-sm font-medium">Versiones anteriores</h2>
          {historial.slice(1).map((v) => (
            <div key={v.id} className="flex items-start justify-between gap-3 rounded-lg border border-neutral-800 p-3 text-sm">
              <div className="min-w-0">
                <p className="text-xs text-neutral-500">{fechas[v.id]}</p>
                <p className="mt-1 truncate text-neutral-400">{v.texto.split("\n")[0]}</p>
              </div>
              {puedeEditar && (
                <button onClick={() => usarVersion(v)}
                  className="shrink-0 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:bg-neutral-800">
                  Usar este texto
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
