import { NextResponse } from "next/server";
import { prSupabase } from "@/lib/pr/supabase";
import { sesionActual, puedeAprobar } from "@/lib/pr/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * "Enviada" sólo quiere decir que Resend aceptó el correo. Esta ruta pregunta
 * qué pasó DESPUÉS: si se entregó, si rebotó o si sigue en camino.
 *
 * El 2026-09-19 una respuesta quedó marcada como enviada y la copia nunca
 * llegó, y no había forma de averiguar por qué: el identificador de Resend no
 * se guardaba. Ahora se guarda y esto lo consulta.
 */
const TEXTOS: Record<string, string> = {
  sent: "Aceptada por el servidor de correo; todavía sin confirmar la entrega.",
  delivered: "Entregada en el buzón del periodista.",
  delivery_delayed: "Retrasada: el servidor del periodista no la ha aceptado todavía. Sigue intentando.",
  bounced: "REBOTÓ: no llegó. Hay que contestar por otra vía.",
  complained: "El periodista la marcó como spam.",
  opened: "Entregada y abierta.",
  clicked: "Entregada, abierta y con clic en un enlace.",
  canceled: "Cancelada antes de salir.",
  queued: "En cola, todavía no sale.",
  scheduled: "Programada para más tarde.",
};

export async function POST(request: Request) {
  const user = await sesionActual();
  if (!puedeAprobar(user)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "falta id" }, { status: 400 });

  const sb = prSupabase();
  const { data: q } = await sb.from("pr_queries")
    .select("id,resend_id,enviada_a,enviada_en").eq("id", id).maybeSingle();
  if (!q) return NextResponse.json({ error: "no existe" }, { status: 404 });

  if (!q.resend_id) {
    return NextResponse.json({
      entrega: null,
      texto: q.enviada_a
        ? "Sin comprobante: se envió antes de que el sistema lo guardara."
        : "Contestada dentro de la plataforma: no hay correo que rastrear.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "falta RESEND_API_KEY" }, { status: 500 });

  let r: Response;
  try {
    r = await fetch(`https://api.resend.com/emails/${q.resend_id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
  } catch (e) {
    return NextResponse.json({
      error: "No se pudo preguntarle a Resend: " + (e instanceof Error ? e.message : String(e)),
    }, { status: 502 });
  }
  if (!r.ok) {
    return NextResponse.json({
      error: `Resend respondió ${r.status}. El comprobante existe, pero no se pudo leer el estado.`,
    }, { status: 502 });
  }

  const datos = (await r.json()) as { last_event?: string };
  const evento = String(datos.last_event || "").trim() || null;
  const ahora = new Date().toISOString();
  await sb.from("pr_queries").update({ entrega: evento, entrega_en: ahora }).eq("id", id);

  return NextResponse.json({
    entrega: evento,
    entrega_en: ahora,
    texto: (evento && TEXTOS[evento]) || `Estado según Resend: ${evento ?? "desconocido"}.`,
  });
}
