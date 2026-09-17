import Anthropic from "@anthropic-ai/sdk";

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

/** Quién responde. Si esto no es cierto, el draft miente. Mantenerlo real. */
const PERFIL = `
Josué Solórzano — Costa Rica. Especialista en autoridad digital:
posicionamiento en Google y en buscadores de IA (ChatGPT, Claude, Perplexity, Gemini).
Trabaja con expertos, consultores y fundadores de servicios profesionales.
Áreas: Schema.org y datos estructurados, robots.txt para crawlers de IA, SEO técnico,
Wikidata, sitios premium en Next.js, captura de leads.
Autor del libro "Define Tu Autoridad".
Sitio web: https://josuesolorzano.com  (usalo tal cual, nunca como marcador)
Idiomas: español e inglés.
`.trim();

export interface Evaluacion {
  pregunta: string;
  medio: string | null;
  deadline: string | null;
  score: number;
  motivo: string;
  draft: string;
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
}): Promise<Evaluacion[]> {
  const prompt = `Sos el asistente de PR de esta persona:

${PERFIL}

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

a) SCORE de 0 a 100: qué tan bien encaja con la experiencia REAL de Josué.
   80-100 = es exactamente su tema. 50-79 = adyacente, se puede responder con
   honestidad. 20-49 = lejano. 0-19 = no tiene nada que ver.
   Castigá el score si responder exigiría inventar credenciales, cifras o
   experiencia que el perfil no respalda.

b) DRAFT de respuesta al periodista, en el idioma de la consulta.
   Si el score es menor a 40, poné el draft en "" (vacío) para no gastar trabajo.
   Reglas del draft, sin excepción:
   - Máximo 180 palabras.
   - Empezá con la respuesta concreta, no con presentación.
   - Solo afirmaciones que el perfil respalde. NUNCA inventes números de
     clientes, años, premios, apariciones en medios ni tamaño de audiencia.
   - Nada de superlativos ("líder", "el mejor", "reconocido mundialmente").
   - Cerrá SIEMPRE con una línea de firma, en el MISMO idioma del borrador:
     INGLÉS:  Josué Solórzano — digital authority and AI search visibility — https://josuesolorzano.com
     ESPAÑOL: Josué Solórzano — autoridad digital y visibilidad en buscadores de IA — https://josuesolorzano.com
     La dirección va literal. Prohibido "[website]" o cualquier rodeo.

Devolvé SOLO un arreglo JSON válido, sin texto alrededor y sin bloques de código:
[{"pregunta":"<la consulta, resumida en una o dos frases>",
  "medio":"<publicación o null>",
  "deadline":"<fecha límite tal como aparece, o null>",
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
    pregunta: String(p.pregunta || "").slice(0, 2000),
    medio: p.medio ? String(p.medio).slice(0, 200) : null,
    deadline: p.deadline ? String(p.deadline).slice(0, 100) : null,
    score: Math.max(0, Math.min(100, Math.round(Number(p.score) || 0))),
    motivo: String(p.motivo || "").slice(0, 500),
    draft: String(p.draft || "").slice(0, 8000),
  })).filter((e) => e.pregunta);
}
