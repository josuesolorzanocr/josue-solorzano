import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { prSupabase } from "@/lib/pr/supabase";
import { evaluarCorreo } from "@/lib/pr/scoring";
import { perfilVigente, type Perfil } from "@/lib/pr/perfil";
import { bloqueDeConsulta } from "@/lib/pr/boletin";

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

/** "InnoTech‑IT — Blog" y "Innotech-IT Blog" tienen que dar la misma huella. */
function normal(s: string | null): string {
  return (s || "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
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
  // `email_hash` cubre las filas de antes del 2026-09-17, cuando la primera
  // consulta de cada correo cargaba la huella del correo.
  const { data: yaVisto } = await sb
    .from("pr_queries").select("id")
    .or(`correo_hash.eq.${huellaCorreo},email_hash.eq.${huellaCorreo}`)
    .limit(1).maybeSingle();
  if (yaVisto) {
    return NextResponse.json({ ok: true, duplicada: true, id: yaVisto.id });
  }

  // Estos correos son BOLETINES: traen varias consultas. Se separan y se
  // califica cada una por su cuenta. Calificar el boletín entero promediaba
  // lo bueno con lo malo (ver incidente del 2026-09-05).
  let evaluaciones;
  let perfil: Perfil;
  try {
    // El perfil se lee en cada correo: lo que el dueño guarde en «Mi perfil»
    // cuenta desde la consulta siguiente, sin volver a publicar el sitio.
    perfil = await perfilVigente();
    evaluaciones = await evaluarCorreo({ plataforma, periodista, asunto, cuerpo, perfil });
  } catch (e) {
    // Si el scoring falla, el correo NO se pierde: se guarda entero para
    // revisarlo a mano. Fallar en silencio es peor que fallar sucio.
    const { data, error } = await sb.from("pr_queries").insert({
      user_id: userId, plataforma, periodista, asunto,
      cuerpo: sinEnlaces(cuerpo),
      score: null,
      score_motivo: "scoring falló: " + (e instanceof Error ? e.message : String(e)),
      email_hash: huellaCorreo, correo_hash: huellaCorreo,
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
      estado: "rechazada", email_hash: huellaCorreo, correo_hash: huellaCorreo,
    });
    return NextResponse.json({ ok: true, consultas: 0 });
  }

  const ahora = Date.now();
  const vistas = new Set<string>();
  const filas = evaluaciones.map((ev) => ({
    user_id: userId,
    plataforma,
    medio: ev.medio,
    periodista,
    asunto: ev.pregunta.slice(0, 300),
    titulo: ev.titulo,
    cuerpo: ev.pregunta,
    deadline: ev.deadline,
    responder_a: ev.responder_a,
    sin_ia: ev.sin_ia,
    idioma: ev.idioma,
    score: ev.score,
    score_motivo: ev.motivo,
    draft: ev.draft || null,
    checklist: ev.checklist.length ? ev.checklist : null,
    // El texto literal de la consulta: permite rehacer el borrador sin Gmail.
    consulta_original: bloqueDeConsulta(cuerpo, ev.titulo),
    estado: ev.deadline && Date.parse(ev.deadline) <= ahora ? "vencida" : "pendiente",
    // La huella sale del título LITERAL y del medio, no de la plataforma ni
    // del resumen de Claude (que cambia de palabras cada vez). Así la misma
    // consulta repetida en el boletín de mañana, o publicada en HARO y en
    // Source of Sources a la vez, entra una sola vez.
    email_hash: huella("consulta", normal(ev.titulo), normal(ev.medio)),
    correo_hash: huellaCorreo,
    // Con qué versión del perfil se calificó: si mañana cambia el perfil,
    // se sabe por qué esta consulta sacó la nota que sacó.
    perfil_id: perfil.id,
  })).filter((f) => !vistas.has(f.email_hash) && vistas.add(f.email_hash));

  // `email_hash` es único. Con un insert normal, UNA consulta repetida tumbaba
  // el lote entero con 500; Apps Script reintentaba cada 5 minutos y cada
  // reintento le volvía a pagar a Claude. Ahora la repetida se salta.
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
