import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { prSupabase } from "@/lib/pr/supabase";
import { evaluarCorreo } from "@/lib/pr/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Comparación de tiempo constante: no filtra el secreto por cuánto tarda. */
function secretoValido(recibido: string | null): boolean {
  const esperado = process.env.PR_AUTOPILOT_WEBHOOK_SECRET;
  if (!esperado || !recibido) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function huella(...partes: string[]): string {
  return createHash("sha256").update(partes.join("|")).digest("hex");
}

/**
 * Los correos de las plataformas traen enlaces con sesión: Connectively manda
 * enlaces mágicos que abren la cuenta sin contraseña. El texto crudo sólo se
 * guarda para revisarlo a mano, y para eso los enlaces no hacen falta: el
 * original sigue en Gmail.
 */
function sinEnlaces(texto: string): string {
  return texto.replace(/\bhttps?:\/\/\S+/gi, "[enlace quitado]");
}

export async function POST(request: Request) {
  if (!secretoValido(request.headers.get("x-webhook-secret"))) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const plataforma = String(body.plataforma || body.platform || "desconocida");
  const cuerpo = String(body.cuerpo || body.body || "").trim();
  const asunto = body.asunto ? String(body.asunto) : (body.subject ? String(body.subject) : null);
  const periodista = body.periodista ? String(body.periodista) : (body.reporter ? String(body.reporter) : null);
  const userId = body.user_id ? String(body.user_id) : null;

  if (!cuerpo) {
    return NextResponse.json({ error: "cuerpo vacío" }, { status: 400 });
  }

  const sb = prSupabase();

  // Si este correo exacto ya se procesó, no se vuelve a gastar API.
  const huellaCorreo = huella("correo", plataforma, asunto || "", cuerpo.slice(0, 4000));
  const { data: yaVisto } = await sb
    .from("pr_queries").select("id").eq("email_hash", huellaCorreo).maybeSingle();
  if (yaVisto) {
    return NextResponse.json({ ok: true, duplicada: true, id: yaVisto.id });
  }

  // Estos correos son BOLETINES: traen varias consultas. Se separan y se
  // califica cada una por su cuenta. Calificar el boletín entero promediaba
  // lo bueno con lo malo (ver incidente del 2026-09-05).
  let evaluaciones;
  try {
    evaluaciones = await evaluarCorreo({ plataforma, periodista, asunto, cuerpo });
  } catch (e) {
    // Si el scoring falla, el correo NO se pierde: se guarda entero para
    // revisarlo a mano. Fallar en silencio es peor que fallar sucio.
    const { data, error } = await sb.from("pr_queries").insert({
      user_id: userId, plataforma, periodista, asunto,
      cuerpo: sinEnlaces(cuerpo),
      score: null,
      score_motivo: "scoring falló: " + (e instanceof Error ? e.message : String(e)),
      email_hash: huellaCorreo,
    }).select("id").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data.id, scoring: "falló", revisar_a_mano: true });
  }

  if (!evaluaciones.length) {
    // Boletín sin consultas reales (sólo avisos de la plataforma). Se registra
    // para no volver a gastar API con el mismo correo.
    // Sólo el asunto: el cuerpo de un aviso de plataforma no le sirve a nadie
    // y suele traer el enlace de verificación de la cuenta.
    await sb.from("pr_queries").insert({
      user_id: userId, plataforma, periodista, asunto,
      cuerpo: "(aviso de la plataforma, sin consultas; el original sigue en Gmail)",
      score: 0, score_motivo: "el correo no traía ninguna consulta de periodista",
      estado: "rechazada", email_hash: huellaCorreo,
    });
    return NextResponse.json({ ok: true, consultas: 0 });
  }

  const vistas = new Set<string>();
  const filas = evaluaciones.map((ev, i) => ({
    user_id: userId,
    plataforma,
    medio: ev.medio,
    periodista,
    asunto: ev.pregunta.slice(0, 300),
    cuerpo: ev.pregunta,
    score: ev.score,
    score_motivo: ev.motivo,
    draft: ev.draft || null,
    // La primera fila lleva la huella del correo (para deduplicar el correo);
    // las demás llevan la suya propia, por consulta.
    email_hash: i === 0 ? huellaCorreo : huella("consulta", plataforma, ev.pregunta),
  })).filter((f) => !vistas.has(f.email_hash) && vistas.add(f.email_hash));

  // `email_hash` es único. Con un insert normal, UNA consulta repetida (el
  // mismo boletín la trae dos veces, o ya vino en el de ayer) tumbaba el lote
  // entero con 500; Apps Script reintentaba cada 5 minutos y cada reintento
  // le volvía a pagar a Claude. Ahora la repetida se salta y el resto entra.
  const { data, error } = await sb.from("pr_queries")
    .upsert(filas, { onConflict: "email_hash", ignoreDuplicates: true })
    .select("id,score");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hoy = new Date().toISOString().slice(0, 10);
  for (const f of data) {
    await sb.rpc("pr_stats_sumar", { p_fecha: hoy, p_user: userId, p_score: f.score })
            .then(() => {}, () => {});
  }

  return NextResponse.json({
    ok: true,
    consultas: data.length,
    scores: data.map((d) => d.score),
    relevantes: data.filter((d) => (d.score ?? 0) >= 70).length,
  });
}
