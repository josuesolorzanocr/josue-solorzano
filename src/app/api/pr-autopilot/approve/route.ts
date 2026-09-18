import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prSupabase } from "@/lib/pr/supabase";
import { sesionActual, puedeAprobar } from "@/lib/pr/auth";
import { esCorreo } from "@/lib/pr/fechas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * El buzón de PR. Las respuestas salen desde aquí, el periodista contesta
 * aquí, y aquí llega la copia de cada envío (prueba de qué se mandó y cuándo).
 * Antes el reply-to era el Gmail personal: las respuestas se perdían del
 * buzón del sistema.
 */
const BUZON = process.env.PR_BUZON || "pr@josuesolorzano.com";
const REMITENTE = process.env.PR_REMITENTE || `Josué Solórzano <${BUZON}>`;

type Accion = "enviar" | "marcar" | "rechazar";

export async function POST(request: Request) {
  const user = await sesionActual();
  if (!puedeAprobar(user)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const { id, texto, texto_es, destinatario, accion } = (await request.json()) as {
    id?: string; texto?: string; texto_es?: string; destinatario?: string; accion?: Accion;
  };
  // Lo que Josué leyó y aprobó en español, cuando la respuesta sale en inglés.
  const respuestaEs = String(texto_es || "").trim() || null;
  if (!id) return NextResponse.json({ error: "falta id" }, { status: 400 });

  const sb = prSupabase();
  const ahora = new Date().toISOString();

  if (accion === "rechazar") {
    await sb.from("pr_queries").update({
      estado: "rechazada", aprobada_por: user!.id, aprobada_en: ahora,
    }).eq("id", id);
    return NextResponse.json({ ok: true, estado: "rechazada" });
  }

  const { data: q } = await sb.from("pr_queries")
    .select("id,titulo,estado,draft,sin_ia").eq("id", id).maybeSingle();
  if (!q) return NextResponse.json({ error: "no existe" }, { status: 404 });
  if (q.estado === "enviada") {
    return NextResponse.json({ error: "ya se había contestado" }, { status: 409 });
  }

  const cuerpo = String(texto || "").trim();
  if (!cuerpo) return NextResponse.json({ error: "no hay texto" }, { status: 400 });

  // Si el periodista dijo que no acepta IA, el sistema no deja mandar el
  // borrador de Claude tal cual. Es la diferencia entre ayudar y engañar.
  // Cuando Josué escribe en español, lo que se compara es SU español con la guía.
  const guia = String(q.draft || "").trim();
  if (q.sin_ia && (cuerpo === guia || respuestaEs === guia)) {
    return NextResponse.json({
      error: "Este periodista no acepta respuestas escritas con IA. Escríbala con sus palabras; el borrador es sólo una guía.",
    }, { status: 422 });
  }

  // Contestada dentro de la plataforma (Qwoted, Connectively): se registra
  // qué se contestó, sin mandar correo.
  if (accion === "marcar") {
    await sb.from("pr_queries").update({
      estado: "enviada", draft_editado: cuerpo, respuesta_es: respuestaEs, enviada_a: null,
      aprobada_por: user!.id, aprobada_en: ahora, enviada_en: ahora,
    }).eq("id", id);
    return NextResponse.json({ ok: true, estado: "enviada", canal: "plataforma" });
  }

  const para = String(destinatario || "").trim();
  if (!esCorreo(para)) {
    return NextResponse.json({ error: "El correo del periodista no es válido." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "falta RESEND_API_KEY" }, { status: 500 });

  // Resend NO lanza excepción cuando rechaza un envío: devuelve `error`.
  // Antes eso no se revisaba y la consulta quedaba "enviada" sin haber salido.
  const { data: envio, error } = await new Resend(apiKey).emails.send({
    from: REMITENTE,
    to: para,
    bcc: BUZON,
    replyTo: BUZON,
    // El título original, en el idioma del periodista. `asunto` es el
    // resumen en español que ve Josué en el tablero: no sirve de asunto.
    subject: q.titulo ? `Re: ${q.titulo}` : "Re: your media query",
    text: cuerpo,
  });
  if (error || !envio?.id) {
    return NextResponse.json({
      error: "No salió: " + (error?.message || "Resend no confirmó el envío") + ". La consulta sigue pendiente.",
    }, { status: 502 });
  }

  await sb.from("pr_queries").update({
    estado: "enviada", draft_editado: cuerpo, respuesta_es: respuestaEs, enviada_a: para,
    aprobada_por: user!.id, aprobada_en: ahora, enviada_en: ahora,
  }).eq("id", id);

  return NextResponse.json({ ok: true, estado: "enviada", canal: "correo", resend_id: envio.id });
}
