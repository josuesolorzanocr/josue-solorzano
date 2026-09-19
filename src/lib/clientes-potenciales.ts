import { prSupabase } from "@/lib/pr/supabase";

/**
 * Cada mensaje del formulario queda en la tabla `clientes_potenciales`: es la
 * base de datos de quienes le escribieron a Josué. Se guarda ANTES del correo
 * de aviso; si Resend falla, el prospecto sigue ahí con `aviso_enviado = false`.
 *
 * No confundir con `prospectos`, que es la lista de salida (empresas que Josué
 * busca). Ésta es la de entrada: gente que lo buscó a él.
 */
export async function guardarClientePotencial(d: {
  name: unknown; company: unknown; email: unknown; service: unknown; message: unknown; en: boolean;
}): Promise<string | null> {
  try {
    const { data, error } = await prSupabase().from("clientes_potenciales").insert({
      nombre: String(d.name).trim().slice(0, 100),
      empresa: d.company ? String(d.company).trim().slice(0, 150) : null,
      email: String(d.email).trim().toLowerCase().slice(0, 254),
      servicio: d.service ? String(d.service).trim().slice(0, 100) : null,
      mensaje: String(d.message).trim().slice(0, 5000),
      idioma: d.en ? "en" : "es",
    }).select("id").single();
    if (error) throw error;
    return data.id as string;
  } catch (e) {
    console.error("No se pudo guardar el cliente potencial:", e);
    return null;
  }
}

export async function marcarAvisado(id: string): Promise<void> {
  const { error } = await prSupabase().from("clientes_potenciales")
    .update({ aviso_enviado: true }).eq("id", id);
  if (error) console.error("No se pudo marcar el aviso como enviado:", error);
}
