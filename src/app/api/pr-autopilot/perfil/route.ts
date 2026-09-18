import { NextResponse } from "next/server";
import { prSupabase } from "@/lib/pr/supabase";
import { sesionActual, puedeAprobar } from "@/lib/pr/auth";
import { LIMITES, perfilVigente } from "@/lib/pr/perfil";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Guarda una versión NUEVA del perfil. Nunca edita ni borra las anteriores:
 * volver atrás es guardar otra vez el texto de una versión vieja.
 */
export async function POST(request: Request) {
  const user = await sesionActual();
  if (!puedeAprobar(user)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const texto = String(body.texto ?? "").trim();
  const firma_es = String(body.firma_es ?? "").trim();
  const firma_en = String(body.firma_en ?? "").trim();

  if (texto.length < LIMITES.texto.min || texto.length > LIMITES.texto.max) {
    return NextResponse.json({
      error: `El perfil debe tener entre ${LIMITES.texto.min} y ${LIMITES.texto.max} caracteres (tiene ${texto.length}).`,
    }, { status: 400 });
  }
  for (const [nombre, f] of [["en español", firma_es], ["en inglés", firma_en]] as const) {
    if (f.length < LIMITES.firma.min || f.length > LIMITES.firma.max) {
      return NextResponse.json({
        error: `La firma ${nombre} debe tener entre ${LIMITES.firma.min} y ${LIMITES.firma.max} caracteres.`,
      }, { status: 400 });
    }
    // La firma va LITERAL al final de cada borrador: un marcador ahí sale
    // tal cual en el correo al periodista.
    if (/\[[^\]]*\]|\{[^}]*\}|<[^>]*>/.test(f)) {
      return NextResponse.json({
        error: `La firma ${nombre} tiene un marcador entre corchetes o llaves. Escriba el dato real.`,
      }, { status: 400 });
    }
  }

  // Guardar lo mismo que ya está no crea una versión de más.
  const actual = await perfilVigente().catch(() => null);
  if (actual && actual.texto === texto && actual.firma_es === firma_es && actual.firma_en === firma_en) {
    return NextResponse.json({ ok: true, sin_cambios: true, id: actual.id });
  }

  const { data, error } = await prSupabase()
    .from("pr_perfil")
    .insert({ texto, firma_es, firma_en, creado_por: user!.id })
    .select("id,creado_en")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: data.id, creado_en: data.creado_en });
}
