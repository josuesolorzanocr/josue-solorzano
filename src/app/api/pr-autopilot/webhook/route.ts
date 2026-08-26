import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { prSupabase } from "@/lib/pr/supabase";
import { evaluarQuery } from "@/lib/pr/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Comparación de tiempo constante: no filtra el secreto por cuánto tarda. */
function secretoValido(recibido: string | null): boolean {
  const esperado = process.env.PR_AUTOPILOT_WEBHOOK_SECRET;
  if (!esperado || !recibido) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
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
  const medio = body.medio ? String(body.medio) : (body.outlet ? String(body.outlet) : null);
  const periodista = body.periodista ? String(body.periodista) : (body.reporter ? String(body.reporter) : null);
  const userId = body.user_id ? String(body.user_id) : null;

  if (!cuerpo) {
    return NextResponse.json({ error: "cuerpo vacío" }, { status: 400 });
  }

  // Huella para no procesar dos veces el mismo correo reenviado.
  const emailHash = createHash("sha256")
    .update(plataforma + "|" + (asunto || "") + "|" + cuerpo.slice(0, 2000))
    .digest("hex");

  const sb = prSupabase();

  const { data: yaExiste } = await sb
    .from("pr_queries").select("id").eq("email_hash", emailHash).maybeSingle();
  if (yaExiste) {
    return NextResponse.json({ ok: true, duplicada: true, id: yaExiste.id });
  }

  let score: number | null = null;
  let motivo: string | null = null;
  let draft: string | null = null;
  try {
    const ev = await evaluarQuery({ plataforma, medio, periodista, asunto, cuerpo });
    score = ev.score; motivo = ev.motivo; draft = ev.draft;
  } catch (e) {
    // Si el scoring falla, la query igual se guarda: se revisa a mano.
    motivo = "scoring falló: " + (e instanceof Error ? e.message : String(e));
  }

  const { data, error } = await sb.from("pr_queries").insert({
    user_id: userId, plataforma, medio, periodista, asunto, cuerpo,
    deadline: body.deadline ? String(body.deadline) : null,
    score, score_motivo: motivo, draft, email_hash: emailHash,
  }).select("id").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hoy = new Date().toISOString().slice(0, 10);
  await sb.rpc("pr_stats_sumar", {
    p_fecha: hoy, p_user: userId, p_score: score ?? 0,
  }).then(() => {}, () => {}); // si la función no existe todavía, no truena el webhook

  return NextResponse.json({ ok: true, id: data.id, score });
}
