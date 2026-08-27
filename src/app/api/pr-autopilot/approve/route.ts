import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prSupabase } from "@/lib/pr/supabase";
import { sesionActual, puedeAprobar } from "@/lib/pr/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await sesionActual();
  if (!puedeAprobar(user)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const { id, texto, destinatario, accion } = await request.json();
  if (!id) return NextResponse.json({ error: "falta id" }, { status: 400 });

  const sb = prSupabase();

  if (accion === "rechazar") {
    await sb.from("pr_queries").update({
      estado: "rechazada", aprobada_por: user!.id, aprobada_en: new Date().toISOString(),
    }).eq("id", id);
    return NextResponse.json({ ok: true, estado: "rechazada" });
  }

  const { data: q } = await sb.from("pr_queries")
    .select("id,asunto,estado,draft").eq("id", id).maybeSingle();
  if (!q) return NextResponse.json({ error: "no existe" }, { status: 404 });
  if (q.estado === "enviada") {
    return NextResponse.json({ error: "ya se había enviado" }, { status: 409 });
  }

  const cuerpo = String(texto || q.draft || "").trim();
  if (!cuerpo) return NextResponse.json({ error: "no hay texto que enviar" }, { status: 400 });
  if (!destinatario) return NextResponse.json({ error: "falta destinatario" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "falta RESEND_API_KEY" }, { status: 500 });

  await new Resend(apiKey).emails.send({
    from: "Josue Solorzano <noreply@josuesolorzano.com>",
    to: String(destinatario),
    replyTo: "vjosue.3004@gmail.com",
    subject: q.asunto ? `Re: ${q.asunto}` : "Respuesta a su consulta",
    text: cuerpo,
  });

  await sb.from("pr_queries").update({
    estado: "enviada", draft_editado: cuerpo,
    aprobada_por: user!.id,
    aprobada_en: new Date().toISOString(),
    enviada_en: new Date().toISOString(),
  }).eq("id", id);

  return NextResponse.json({ ok: true, estado: "enviada" });
}
