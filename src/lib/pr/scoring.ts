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
  score: number;
  motivo: string;
  draft: string;
}

export async function evaluarQuery(input: {
  plataforma: string;
  medio?: string | null;
  periodista?: string | null;
  asunto?: string | null;
  cuerpo: string;
}): Promise<Evaluacion> {
  const prompt = `Sos el asistente de PR de esta persona:

${PERFIL}

Llegó esta consulta de un periodista desde ${input.plataforma}:

Medio: ${input.medio || "no indicado"}
Periodista: ${input.periodista || "no indicado"}
Asunto: ${input.asunto || "no indicado"}

---
${input.cuerpo.slice(0, 6000)}
---

Hacé dos cosas:

1. SCORE de 0 a 100: qué tan bien encaja esta consulta con la experiencia REAL de
   Josué. 80-100 = es exactamente su tema. 50-79 = adyacente, se puede responder con
   honestidad. 20-49 = lejano. 0-19 = no tiene nada que ver.
   Castigá el score si responder exigiría inventar credenciales, cifras o experiencia
   que el perfil no respalda.

2. DRAFT de respuesta al periodista, en el idioma de la consulta.
   Reglas del draft, sin excepción:
   - Máximo 180 palabras.
   - Empezá con la respuesta concreta a lo que preguntó, no con presentación.
   - Solo afirmaciones que el perfil respalde. NUNCA inventes números de clientes,
     años, premios, apariciones en medios ni tamaño de audiencia.
   - Nada de superlativos ("líder", "el mejor", "reconocido mundialmente").
   - Cerrá SIEMPRE con una línea de firma. TODA la firma va en el mismo idioma
     que el borrador. Copiá uno de estos dos formatos según el idioma:

     Si el borrador está en INGLÉS:
       Josué Solórzano — digital authority and AI search visibility — https://josuesolorzano.com
     Si el borrador está en ESPAÑOL:
       Josué Solórzano — autoridad digital y visibilidad en buscadores de IA — https://josuesolorzano.com

     La dirección va literal y completa. Está prohibido escribir "[website]",
     "website available on request" o cualquier otro rodeo: el dato lo tenés.
   - Si el score es menor a 20, el draft debe ser una sola línea:
     "No responder: fuera de su área."

Devolvé SOLO un objeto JSON válido, sin texto alrededor y sin bloques de código:
{"score": <número>, "motivo": "<una frase>", "draft": "<el texto>"}`;

  const r = await anthropic().messages.create({
    model: MODELO,
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const texto = r.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const json = texto.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  let parsed: Partial<Evaluacion>;
  try {
    parsed = JSON.parse(json);
  } catch {
    const m = json.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("El modelo no devolvió JSON: " + texto.slice(0, 200));
    parsed = JSON.parse(m[0]);
  }

  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
  return {
    score,
    motivo: String(parsed.motivo || "").slice(0, 500),
    draft: String(parsed.draft || "").slice(0, 8000),
  };
}
