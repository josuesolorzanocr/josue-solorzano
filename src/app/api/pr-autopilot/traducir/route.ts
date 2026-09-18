import { NextResponse } from "next/server";
import { prSupabase } from "@/lib/pr/supabase";
import { sesionActual, puedeAprobar } from "@/lib/pr/auth";
import { perfilVigente } from "@/lib/pr/perfil";
import { aEspanol, aIngles } from "@/lib/pr/traduccion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * modo "a_espanol": el borrador de Claude, en español, para que Josué lo lea y
 *   lo edite. Se guarda en `draft_es` y no se vuelve a pagar.
 * modo "a_ingles": el español de Josué → el inglés que se envía, más ese inglés
 *   traducido DE VUELTA al español en otra llamada, para que vea qué dice.
 *   No se guarda: lo que cuenta es lo que él apruebe al enviar.
 */
export async function POST(request: Request) {
  const user = await sesionActual();
  if (!puedeAprobar(user)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const { id, modo, texto_es } = (await request.json().catch(() => ({}))) as {
    id?: string; modo?: string; texto_es?: string;
  };
  if (!id) return NextResponse.json({ error: "falta id" }, { status: 400 });

  const sb = prSupabase();
  const { data: q } = await sb.from("pr_queries")
    .select("id,draft,draft_editado,draft_es,idioma").eq("id", id).maybeSingle();
  if (!q) return NextResponse.json({ error: "no existe" }, { status: 404 });

  try {
    const perfil = await perfilVigente();

    if (modo === "a_espanol") {
      if (q.draft_es) return NextResponse.json({ es: q.draft_es });
      const base = String(q.draft_editado || q.draft || "").trim();
      // Ya en español: la consulta es en español, o es una GUÍA para quien no acepta IA.
      const yaEsEspanol = q.idioma === "es" || base.startsWith("GUÍA");
      const es = !base ? "" : yaEsEspanol ? base : await aEspanol(base, perfil);
      if (es) await sb.from("pr_queries").update({ draft_es: es }).eq("id", id);
      return NextResponse.json({ es });
    }

    if (modo === "a_ingles") {
      const es = String(texto_es || "").trim();
      if (!es) return NextResponse.json({ error: "Escriba primero la respuesta en español." }, { status: 400 });
      const en = await aIngles(es, perfil);
      const vuelta_es = await aEspanol(en, perfil);
      return NextResponse.json({ en, vuelta_es });
    }

    return NextResponse.json({ error: "modo inválido" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({
      error: "No se pudo traducir: " + (e instanceof Error ? e.message : String(e)),
    }, { status: 502 });
  }
}
