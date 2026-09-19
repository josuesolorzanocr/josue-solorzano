import { createHmac } from "crypto";
import { prSupabase } from "@/lib/pr/supabase";

/**
 * Límite del formulario de contacto. Sin él, cualquiera podía usar el
 * formulario para mandar la respuesta automática, desde el dominio de Josué, a
 * la dirección que quisiera, cuantas veces quisiera.
 *
 * "Persona" = misma IP o mismo correo: cambiar sólo uno de los dos no alcanza.
 * En la base quedan huellas HMAC, nunca la IP ni el correo, y se borran solas.
 */
export const MAX_ENVIOS = 5;
const VENTANA_MS = 24 * 60 * 60 * 1000;
const GUARDAR_MS = 7 * 24 * 60 * 60 * 1000;

function huella(tipo: string, valor: string): string {
  const sal = process.env.CONTACTO_SAL;
  if (!sal) throw new Error("falta CONTACTO_SAL");
  return createHmac("sha256", sal).update(`${tipo}|${valor}`).digest("hex");
}

/** En Vercel, `x-forwarded-for` lo pone la plataforma: el primero es el visitante. */
export function ipDe(request: Request): string {
  return (request.headers.get("x-forwarded-for") || "").split(",")[0].trim()
    || request.headers.get("x-real-ip")
    || "desconocida";
}

/**
 * true si la persona todavía puede mandar, y en ese caso anota el envío.
 * Si la base falla, deja pasar: perder un prospecto real es peor que un envío
 * de más. El error queda en los logs de Vercel.
 */
export async function registrarEnvio(ip: string, email: string): Promise<boolean> {
  try {
    const sb = prSupabase();
    const ipHash = huella("ip", ip);
    const emailHash = huella("email", email.trim().toLowerCase());
    const desde = new Date(Date.now() - VENTANA_MS).toISOString();

    const { count, error } = await sb.from("contacto_envios")
      .select("id", { count: "exact", head: true })
      .or(`ip_hash.eq.${ipHash},email_hash.eq.${emailHash}`)
      .gte("creado_en", desde);
    if (error) throw error;
    if ((count ?? 0) >= MAX_ENVIOS) return false;

    const { error: alAnotar } = await sb.from("contacto_envios")
      .insert({ ip_hash: ipHash, email_hash: emailHash });
    if (alAnotar) throw alAnotar;

    // Las huellas viejas ya no sirven para el límite: fuera.
    await sb.from("contacto_envios").delete()
      .lt("creado_en", new Date(Date.now() - GUARDAR_MS).toISOString());
    return true;
  } catch (e) {
    console.error("Límite del formulario no disponible:", e);
    return true;
  }
}
