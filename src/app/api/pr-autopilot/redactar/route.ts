import { NextResponse } from "next/server";
import { prSupabase } from "@/lib/pr/supabase";
import { sesionActual, puedeAprobar } from "@/lib/pr/auth";
import { perfilVigente } from "@/lib/pr/perfil";
import { redactarUna } from "@/lib/pr/redaccion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * "Rehacer borrador": vuelve a escribir la respuesta de UNA consulta con el
 * perfil vigente y las reglas de hoy. Reemplaza el borrador anterior (el
 * tablero pide confirmación antes).
 */
export async function POST(request: Request) {
  const user = await sesionActual();
  if (!puedeAprobar(user)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }
  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "falta id" }, { status: 400 });

  const sb = prSupabase();
  const { data: q } = await sb.from("pr_queries")
    .select("id,estado,plataforma,titulo,medio,cuerpo,consulta_original,sin_ia,idioma")
    .eq("id", id).maybeSingle();
  if (!q) return NextResponse.json({ error: "no existe" }, { status: 404 });
  if (q.estado !== "pendiente") {
    return NextResponse.json({ error: "Sólo se rehacen consultas pendientes." }, { status: 409 });
  }

  // Sin el texto original (consultas de antes del 2026-09-18) se trabaja con
  // lo que haya, y se avisa: el borrador puede quedar corto.
  const aviso = q.consulta_original ? null
    : "No está guardado el texto original de esta consulta: el borrador se hizo con el resumen y puede quedar corto.";
  const consulta = q.consulta_original
    || [q.titulo, q.medio && `Medio: ${q.medio}`, `Resumen en español: ${q.cuerpo}`].filter(Boolean).join("\n");

  try {
    const perfil = await perfilVigente();
    const { draft, checklist } = await redactarUna({
      consulta, plataforma: q.plataforma, sin_ia: !!q.sin_ia,
      idioma: q.idioma === "es" ? "es" : "en", perfil,
    });
    const { error } = await sb.from("pr_queries").update({
      draft, checklist, draft_es: null, draft_editado: null, perfil_id: perfil.id,
    }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, draft, checklist, aviso });
  } catch (e) {
    return NextResponse.json({
      error: "No se pudo rehacer: " + (e instanceof Error ? e.message : String(e)),
    }, { status: 502 });
  }
}
