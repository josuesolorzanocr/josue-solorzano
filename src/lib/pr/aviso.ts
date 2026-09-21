import { vencimiento } from "./fechas";

/**
 * Aviso al teléfono cuando entra una consulta buena.
 *
 * Las consultas duran dos o tres días y las buenas son pocas: enterarse al
 * abrir el panel es enterarse tarde. Esto avisa solo, apenas entra.
 *
 * Funciona sin configurar nada: si no hay llaves, no avisa y no falla. Un
 * aviso que no sale NUNCA puede tumbar la entrada de consultas.
 */
export const UMBRAL_AVISO = 70;

/** Cuántos avisos sueltos antes de mandar un resumen en vez de uno por consulta. */
const MAX_SUELTOS = 3;

const PANEL = "https://www.josuesolorzano.com/admin/pr-autopilot";

export interface ConsultaParaAvisar {
  plataforma: string;
  medio: string | null;
  titulo: string | null;
  asunto: string | null;
  score: number | null;
  deadline: string | null;
}

/** El texto que se manda. Aparte para poder probarlo sin mandar nada. */
export function mensajeDeAviso(filas: ConsultaParaAvisar[]): string | null {
  const buenas = filas
    .filter((f) => (f.score ?? 0) >= UMBRAL_AVISO)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  if (!buenas.length) return null;

  const linea = (f: ConsultaParaAvisar) => {
    const v = vencimiento(f.deadline);
    const donde = [f.plataforma, f.medio].filter(Boolean).join(" · ");
    const que = (f.titulo || f.asunto || "(sin título)").slice(0, 160);
    return `${f.score} — ${donde}\n${que}\n${v ? `Vence: ${v.texto}` : "Sin fecha límite en el boletín"}`;
  };

  if (buenas.length > MAX_SUELTOS) {
    const resumen = buenas.slice(0, MAX_SUELTOS).map((f) => `· ${f.score} ${[f.plataforma, f.medio].filter(Boolean).join(" · ")}`).join("\n");
    return `🔔 ${buenas.length} consultas nuevas que le sirven\n\n${resumen}\n…y ${buenas.length - MAX_SUELTOS} más.\n\n${PANEL}`;
  }
  return `🔔 Consulta nueva que le sirve\n\n${buenas.map(linea).join("\n\n")}\n\n${PANEL}`;
}

async function porTelegram(texto: string): Promise<string | null> {
  const token = process.env.TELEGRAM_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return null;
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: texto, disable_web_page_preview: true }),
  });
  return r.ok ? "telegram" : `telegram falló (${r.status})`;
}

async function porWhatsapp(texto: string): Promise<string | null> {
  const telefono = process.env.WHATSAPP_TELEFONO;
  const llave = process.env.WHATSAPP_CALLMEBOT_KEY;
  if (!telefono || !llave) return null;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(telefono)}`
    + `&text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(llave)}`;
  const r = await fetch(url);
  return r.ok ? "whatsapp" : `whatsapp falló (${r.status})`;
}

/**
 * Avisa por los canales configurados. Devuelve qué pasó, para el log.
 * Nunca lanza: el aviso es un extra, no parte de guardar la consulta.
 */
export async function avisarConsultasBuenas(filas: ConsultaParaAvisar[]): Promise<string[]> {
  const texto = mensajeDeAviso(filas);
  if (!texto) return [];
  const resultados = await Promise.all([
    porTelegram(texto).catch((e) => `telegram falló (${e instanceof Error ? e.message : String(e)})`),
    porWhatsapp(texto).catch((e) => `whatsapp falló (${e instanceof Error ? e.message : String(e)})`),
  ]);
  return resultados.filter((r): r is string => r !== null);
}
