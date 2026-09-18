import { anthropic, MODELO, textoDe } from "./claude";
import type { Perfil } from "./perfil";

/**
 * Cómo se escribe una respuesta a un periodista. Lo usan la calificación
 * (el borrador inicial) y "Rehacer borrador", para que las dos escriban igual.
 *
 * Revisión del 2026-09-18: los borradores contestaban 2 de 3 preguntas, no
 * traían lo que el periodista pidió incluir (cargo, empresa) y uno daba a
 * entender clientes que no existen. Estas reglas atacan eso de frente.
 */
export interface ItemChecklist {
  pide: string;
  cumple: boolean;
}

export function reglasDeRedaccion(perfil: Perfil): string {
  return `ANTES de escribir, hacé la lista de TODO lo que pide el periodista: cada
   pregunta que hace y cada dato que pide incluir (nombre, cargo, empresa,
   enlace, foto, LinkedIn, ubicación, etc.). Esa lista es el "checklist".

   Reglas del borrador, sin excepción:
   - Contestá CADA pregunta del periodista, en el orden en que las hizo.
   - Abrí con una o dos frases que se puedan citar tal cual: la respuesta más
     fuerte, concreta y sin rodeos. Es lo que el periodista copia.
   - Preferí siempre un dato propio, concreto y comprobable del perfil (con su
     fecha) antes que un consejo general.
   - Incluí lo que el periodista pidió incluir si el perfil lo tiene (cargo,
     empresa, enlaces). Si el perfil no lo tiene, NO lo inventes: esa línea del
     checklist queda sin cumplir.
   - Solo afirmaciones que el perfil respalde. NUNCA inventes ni insinúes
     clientes, años de experiencia, premios, apariciones en medios, tamaño de
     equipo o de audiencia. Respetá lo que el perfil dice que no se puede decir.
   - Nada de superlativos ("líder", "el mejor", "reconocido mundialmente").
   - No ofrezcas llamadas, entrevistas ni nada en un idioma que el perfil no
     diga que la persona habla.
   - Máximo 200 palabras, párrafos cortos, tono profesional y directo. Sin
     saludo largo ni relleno.
   - Cerrá SIEMPRE con esta línea de firma, copiada LITERAL, en el MISMO idioma
     del borrador:
     INGLÉS:  ${perfil.firma_en}
     ESPAÑOL: ${perfil.firma_es}
     Prohibido "[website]", "[nombre]" o cualquier rodeo.

   CHECKLIST: cada cosa que pide el periodista, redactada corta EN ESPAÑOL, y si
   el borrador la cumple. Ejemplo:
   [{"pide":"Diferencia entre GEO y SEO","cumple":true},
    {"pide":"Incluir foto","cumple":false}]`;
}

export const REGLA_SIN_IA = `Si el periodista NO acepta respuestas escritas con IA, NO escribas una
   respuesta lista para mandar: mandarle texto de IA a quien lo prohíbe es
   engañarlo. En su lugar, el draft es una guía EN ESPAÑOL que empieza con
   "GUÍA — escríbala con sus palabras:" y sigue con una viñeta por cada
   pregunta del periodista, con lo que esta persona podría contar según su
   perfil. Sin firma. El checklist dice qué preguntas cubre la guía.`;

/** Normaliza el checklist que devuelve el modelo. */
export function checklistValido(v: unknown): ItemChecklist[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x) => ({ pide: String(x.pide ?? "").slice(0, 200).trim(), cumple: x.cumple === true }))
    .filter((x) => x.pide)
    .slice(0, 15);
}

/** Saca JSON de la respuesta del modelo aunque venga con cercas de código. */
export function parsearJson(texto: string): unknown {
  const limpio = texto.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try {
    return JSON.parse(limpio);
  } catch {
    const m = limpio.match(/[[{][\s\S]*[\]}]/);
    if (!m) throw new Error("El modelo no devolvió JSON: " + texto.slice(0, 300));
    return JSON.parse(m[0]);
  }
}

/**
 * Rehace el borrador de UNA consulta con el perfil vigente y las reglas de hoy.
 * `consulta` es el bloque literal del boletín; si no se guardó (consultas de
 * antes del 2026-09-18), va lo que haya y el borrador lo avisa.
 */
export async function redactarUna(input: {
  consulta: string;
  plataforma: string;
  sin_ia: boolean;
  idioma: "es" | "en";
  perfil: Perfil;
}): Promise<{ draft: string; checklist: ItemChecklist[] }> {
  const prompt = `Sos el asistente de PR de esta persona. Este perfil es TODO lo que
sabés de ella; lo que no esté aquí, tratalo como algo que no sabe o no hace:

---
${input.perfil.texto}
---
Si el perfil trae un sitio web, usalo tal cual, nunca como marcador.

Esta es UNA consulta de un periodista, que llegó por ${input.plataforma}:
---
${input.consulta.slice(0, 8000)}
---

Escribí el borrador de respuesta en ${input.idioma === "es" ? "ESPAÑOL" : "INGLÉS"}, el idioma del periodista.

${input.sin_ia ? REGLA_SIN_IA : reglasDeRedaccion(input.perfil)}
${input.sin_ia ? "\n   (Aun así, el checklist sigue las mismas reglas: cada pregunta y cada dato que pide.)" : ""}

Devolvé SOLO un objeto JSON válido, sin texto alrededor y sin bloques de código:
{"draft":"<el texto>","checklist":[{"pide":"<...>","cumple":<true o false>}]}`;

  const r = await anthropic().messages.create({
    model: MODELO,
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });
  if (r.stop_reason === "max_tokens") throw new Error("El borrador se cortó a la mitad.");
  const p = parsearJson(textoDe(r)) as Record<string, unknown>;
  const draft = String(p?.draft ?? "").trim();
  if (!draft) throw new Error("El modelo no devolvió borrador.");
  return { draft: draft.slice(0, 8000), checklist: checklistValido(p.checklist) };
}
