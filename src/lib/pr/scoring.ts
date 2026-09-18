import Anthropic from "@anthropic-ai/sdk";
import type { Perfil } from "./perfil";

/** Cliente por demanda: el build no debe depender de la llave. */
let cliente: Anthropic | null = null;
function anthropic(): Anthropic {
  if (cliente) return cliente;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Falta ANTHROPIC_API_KEY.");
  cliente = new Anthropic({ apiKey });
  return cliente;
}

const MODELO = "claude-sonnet-5";

/**
 * Tope alto a propósito. Con 1500 se truncaba la respuesta a medias y el JSON
 * quedaba roto: el 2026-09-02 se perdió así una consulta con score 82.
 * Un boletín con 6 consultas necesita 6 borradores.
 */
const MAX_TOKENS = 8000;

export interface Evaluacion {
  /** Título de la consulta copiado literal del boletín: sirve de huella estable. */
  titulo: string;
  pregunta: string;
  medio: string | null;
  /** ISO 8601 con zona horaria, o null si no se pudo leer con certeza. */
  deadline: string | null;
  /** Correo literal del boletín o URL de la plataforma. Nunca inventado. */
  responder_a: string | null;
  /** El periodista dice que no acepta respuestas escritas con IA. */
  sin_ia: boolean;
  score: number;
  motivo: string;
  draft: string;
}

/**
 * Lo que devuelve el modelo como "dónde contestar" pasa por aquí antes de
 * guardarse. Un correo se deja tal cual. De una URL se guarda sólo origen y
 * ruta: los parámetros son donde viajan las sesiones (Connectively manda
 * enlaces que abren la cuenta sin contraseña). Si la ruta misma trae algo con
 * forma de token, se deja sólo el sitio.
 */
export function limpiarDestino(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return null;
  if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s)) return s.toLowerCase();
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    const conToken = u.pathname.split("/").some((p) => /^[A-Za-z0-9_-]{32,}$/.test(p));
    return conToken ? u.origin : u.origin + u.pathname;
  } catch {
    return null;
  }
}

function fechaValida(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

/**
 * Evalúa UN correo que puede traer VARIAS consultas.
 *
 * HARO, Connectively y Source of Sources no mandan una consulta por correo:
 * mandan boletines con varias, agrupadas por tema. Calificar el boletín entero
 * como una sola cosa promedia lo bueno con lo malo — el 2026-09-05 una consulta
 * de SEO perfecta quedó en 65 por venir junto a una de optometría.
 */
export async function evaluarCorreo(input: {
  plataforma: string;
  medio?: string | null;
  periodista?: string | null;
  asunto?: string | null;
  cuerpo: string;
  /** Quién responde. Sale de la base (pestaña «Mi perfil»), nunca del código. */
  perfil: Perfil;
}): Promise<Evaluacion[]> {
  const ahora = new Date().toISOString();
  const prompt = `Sos el asistente de PR de esta persona. Este perfil es TODO lo que
sabés de ella; lo que no esté aquí, tratalo como algo que no sabe o no hace:

---
${input.perfil.texto}
---
Si el perfil trae un sitio web, usalo tal cual, nunca como marcador.

Fecha y hora actual (UTC): ${ahora}

Llegó este correo de ${input.plataforma}. Asunto: ${input.asunto || "sin asunto"}

IMPORTANTE: estos correos suelen ser BOLETINES con VARIAS consultas de
periodistas, agrupadas por tema. Tu primer trabajo es SEPARARLAS.

---
${input.cuerpo.slice(0, 20000)}
---

PASO 1 — Extraé cada consulta individual.
Ignorá encabezados, pies, enlaces de "ver todas", publicidad y avisos de la
plataforma. Si el correo no trae ninguna consulta real de un periodista,
devolvé un arreglo vacío [].

PASO 2 — Para CADA consulta, por separado:

0) DATOS PARA CONTESTAR. Copiados del correo, NUNCA inventados ni deducidos:
   - titulo: el título o resumen de la consulta copiado LITERAL, en su idioma
     original (en HARO y Source of Sources es la línea "Summary:").
   - responder_a: el correo al que se contesta, copiado LITERAL (HARO trae
     "Email: reply+...@helpareporter.com"; Source of Sources trae "EMAIL:").
     Si la consulta no trae correo pero sí un enlace para contestar en la
     plataforma (Qwoted, Connectively), poné ese enlace. Si no hay ninguno, null.
   - deadline: la fecha límite convertida a ISO 8601 CON zona horaria, por
     ejemplo "2026-09-21T19:00:00-04:00". "ET"/"Eastern" es la hora de Nueva
     York: -04:00 de marzo a noviembre, -05:00 el resto del año. "PT"/"Pacific"
     es -07:00 de marzo a noviembre, -08:00 el resto. Si falta el año, usá el
     de la fecha actual. Si no hay fecha límite o no se entiende, null.
   - sin_ia: true si la consulta dice que NO acepta respuestas escritas con IA
     ("No AI Pitches Considered", "can't accept AI-written responses",
     "NO AI responses" y parecidos). Si no lo dice, false.

a) SCORE de 0 a 100: qué tan bien encaja con la experiencia REAL de esta persona.
   80-100 = es exactamente su tema. 50-79 = adyacente, se puede responder con
   honestidad. 20-49 = lejano. 0-19 = no tiene nada que ver.
   Castigá el score si responder exigiría inventar credenciales, cifras o
   experiencia que el perfil no respalda.

b) DRAFT de respuesta al periodista, en el idioma de la consulta.
   Si el score es menor a 40, o si la fecha límite ya pasó, poné el draft en ""
   (vacío) para no gastar trabajo.
   Si sin_ia es true, NO escribas una respuesta lista para mandar: mandarle
   texto de IA a quien lo prohíbe es engañarlo. En su lugar, el draft es una
   guía EN ESPAÑOL que empieza con "GUÍA — escríbala con sus palabras:" y
   sigue con 3 a 5 viñetas de qué podría contar esta persona con base en su perfil.
   Sin firma.
   Reglas del draft normal, sin excepción:
   - Máximo 180 palabras.
   - Empezá con la respuesta concreta, no con presentación.
   - Solo afirmaciones que el perfil respalde. NUNCA inventes números de
     clientes, años, premios, apariciones en medios ni tamaño de audiencia.
   - Nada de superlativos ("líder", "el mejor", "reconocido mundialmente").
   - Cerrá SIEMPRE con esta línea de firma, copiada LITERAL, en el MISMO
     idioma del borrador:
     INGLÉS:  ${input.perfil.firma_en}
     ESPAÑOL: ${input.perfil.firma_es}
     Prohibido "[website]", "[nombre]" o cualquier rodeo.

Devolvé SOLO un arreglo JSON válido, sin texto alrededor y sin bloques de código:
[{"titulo":"<título literal, idioma original>",
  "pregunta":"<la consulta, resumida en español en una o dos frases>",
  "medio":"<publicación o null>",
  "deadline":"<ISO 8601 con zona horaria, o null>",
  "responder_a":"<correo o enlace literal, o null>",
  "sin_ia":<true o false>,
  "score":<número>,
  "motivo":"<una frase>",
  "draft":"<el texto o cadena vacía>"}]`;

  const r = await anthropic().messages.create({
    model: MODELO,
    max_tokens: MAX_TOKENS,
    messages: [{ role: "user", content: prompt }],
  });

  const texto = r.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  // Si el modelo se quedó sin tokens, es mejor saberlo que adivinar.
  if (r.stop_reason === "max_tokens") {
    throw new Error(
      `La respuesta se truncó en ${MAX_TOKENS} tokens. El correo trae demasiadas ` +
      `consultas; hay que subir MAX_TOKENS o partir el correo.`);
  }

  const json = texto.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    const m = json.match(/\[[\s\S]*\]/);
    if (!m) throw new Error("El modelo no devolvió JSON: " + texto.slice(0, 300));
    parsed = JSON.parse(m[0]);
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Se esperaba un arreglo y llegó: " + typeof parsed);
  }

  return (parsed as Record<string, unknown>[]).map((p) => ({
    titulo: String(p.titulo || p.pregunta || "").slice(0, 500),
    pregunta: String(p.pregunta || "").slice(0, 2000),
    medio: p.medio ? String(p.medio).slice(0, 200) : null,
    deadline: fechaValida(p.deadline),
    responder_a: limpiarDestino(p.responder_a),
    sin_ia: p.sin_ia === true,
    score: Math.max(0, Math.min(100, Math.round(Number(p.score) || 0))),
    motivo: String(p.motivo || "").slice(0, 500),
    draft: String(p.draft || "").slice(0, 8000),
  })).filter((e) => e.pregunta);
}
