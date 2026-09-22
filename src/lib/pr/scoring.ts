import type { Perfil } from "./perfil";
import { anthropic, MODELO, textoDe } from "./claude";
import { redactarUna, parsearJson, type ItemChecklist } from "./redaccion";
import { bloqueDeConsulta } from "./boletin";

/**
 * Tope alto a propósito. Con 1500 se truncaba la respuesta a medias y el JSON
 * quedaba roto: el 2026-09-02 se perdió así una consulta con score 82.
 * Un boletín con 6 consultas necesita 6 borradores.
 * 2026-09-19: el razonamiento automático del modelo cuenta dentro del tope y
 * puede gastar miles de tokens antes de escribir; de 8000 pasó a 16000.
 */
const MAX_TOKENS = 16000;

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
  /** Idioma en que escribió el periodista: la respuesta sale en éste. */
  idioma: "es" | "en";
  score: number;
  motivo: string;
  draft: string;
  /** Lo que pide el periodista y si el borrador lo cumple. Vacío si no hay borrador. */
  checklist: ItemChecklist[];
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
    // Enlaces de seguimiento de correo (Qwoted manda "url1940.qwoted.com/ls/click?…"):
    // sin sus parámetros no llevan a ningún lado. Mejor nada; el webhook pone la
    // dirección de la plataforma (visto el 2026-09-18 con American City Business Journals).
    const rastreo = /^(url\d+|click|links?|email|track|t)\./i.test(u.hostname)
      || /\/(ls|wf)\/click/i.test(u.pathname);
    if (rastreo) return null;
    const conToken = u.pathname.split("/").some((p) => /^[A-Za-z0-9_-]{32,}$/.test(p));
    return conToken ? u.origin : u.origin + u.pathname;
  } catch {
    return null;
  }
}

/** Dónde se contesta, cuando la consulta no trae su propio enlace o correo. */
export const DONDE_SE_CONTESTA: Record<string, string> = {
  Qwoted: "https://app.qwoted.com/",
  Connectively: "https://www.connectively.us/experts/questions",
};

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
${input.cuerpo.slice(0, 120000)}
---

PASO 1 — Extraé cada consulta individual.
Ignorá encabezados, pies, enlaces de "ver todas", publicidad y avisos de la
plataforma. Si el correo no trae ninguna consulta real de un periodista,
devolvé un arreglo vacío [].
NO es una consulta, y no la incluyas: una publicación de alguien que se
OFRECE como fuente ("I'd be happy to share my perspective", "available for
comment", "#PRRequest" de un experto o una agencia). Una consulta es un
periodista o medio que BUSCA fuentes. Contestarle a otra fuente gasta una
respuesta en nada (pasó el 2026-09-18 con un tuit en Connectively).

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
     PRECAUCIÓN: si de esta consulta sólo ves el título en el índice y NO ves su
     ficha completa (con Email:, Deadline: y el texto de la consulta), poné
     sin_ia en true y decilo en el motivo: sin la letra menuda no se sabe si
     prohíbe IA, y equivocarse ahí cuesta la cuenta.
   - idioma: "en" o "es", el idioma en que ESCRIBIÓ EL PERIODISTA la consulta
     (no el de estas instrucciones).

a) SCORE de 0 a 100: qué tan bien encaja con la experiencia REAL de esta persona.
   80-100 = es exactamente su tema. 50-79 = adyacente, se puede responder con
   honestidad. 20-49 = lejano. 0-19 = no tiene nada que ver.
   Castigá el score si responder exigiría inventar credenciales, cifras o
   experiencia que el perfil no respalda.

NO escribas borradores en este paso: sólo extraé y calificá. Los borradores
se escriben después, uno por uno, sólo para las consultas que valen la pena.

Devolvé SOLO un arreglo JSON válido, sin texto alrededor y sin bloques de código:
[{"titulo":"<título literal, idioma original>",
  "pregunta":"<la consulta, resumida en español en una o dos frases>",
  "medio":"<publicación o null>",
  "deadline":"<ISO 8601 con zona horaria, o null>",
  "responder_a":"<correo o enlace literal, o null>",
  "sin_ia":<true o false>,
  "idioma":"<en o es>",
  "busca_fuentes":<true si un periodista o medio BUSCA fuentes; false si alguien se OFRECE como fuente, o es publicidad o aviso>,
  "score":<número>,
  "motivo":"<una frase>"}]`;

  const r = await anthropic().messages.create({
    model: MODELO,
    max_tokens: MAX_TOKENS,
    messages: [{ role: "user", content: prompt }],
  });

  const texto = textoDe(r);

  // Si el modelo se quedó sin tokens, es mejor saberlo que adivinar.
  if (r.stop_reason === "max_tokens") {
    throw new Error(
      `La respuesta se truncó en ${MAX_TOKENS} tokens. El correo trae demasiadas ` +
      `consultas; hay que subir MAX_TOKENS o partir el correo.`);
  }

  const parsed = parsearJson(texto);
  if (!Array.isArray(parsed)) {
    throw new Error("Se esperaba un arreglo y llegó: " + typeof parsed);
  }

  // La instrucción de no incluir ofertas de fuentes no alcanzó sola (prueba del
  // 2026-09-18): el modelo tiene que marcarlo y el código lo descarta.
  const consultas = (parsed as Record<string, unknown>[]).filter((p) => p.busca_fuentes !== false);
  const evaluaciones: Evaluacion[] = consultas.map((p) => ({
    titulo: String(p.titulo || p.pregunta || "").slice(0, 500),
    pregunta: String(p.pregunta || "").slice(0, 2000),
    medio: p.medio ? String(p.medio).slice(0, 200) : null,
    deadline: fechaValida(p.deadline),
    responder_a: limpiarDestino(p.responder_a),
    sin_ia: p.sin_ia === true,
    idioma: p.idioma === "es" ? "es" as const : "en" as const,
    score: Math.max(0, Math.min(100, Math.round(Number(p.score) || 0))),
    motivo: String(p.motivo || "").slice(0, 500),
    draft: "",
    checklist: [],
  })).filter((e) => e.pregunta);

  // PASO 2, aparte: borrador sólo para las que valen la pena y siguen a
  // tiempo, una por una y en paralelo. Antes el borrador y el checklist de
  // TODAS iban en la misma respuesta: el 2026-09-18 un boletín largo de
  // Qwoted pasó los 8000 tokens y se perdió entero. Así, por largo que sea el
  // boletín, la calificación es corta y cada borrador tiene su propio espacio.
  const ahoraMs = Date.now();
  await Promise.all(evaluaciones.map(async (ev) => {
    const vencida = ev.deadline !== null && Date.parse(ev.deadline) <= ahoraMs;
    if (ev.score < UMBRAL_BORRADOR || vencida) return;
    const consulta = bloqueDeConsulta(input.cuerpo, ev.titulo)
      || [ev.titulo, ev.medio && `Medio: ${ev.medio}`, `Resumen: ${ev.pregunta}`].filter(Boolean).join("\n");
    try {
      const r = await redactarUna({
        consulta, plataforma: input.plataforma, sin_ia: ev.sin_ia, idioma: ev.idioma, perfil: input.perfil,
      });
      ev.draft = r.draft;
      ev.checklist = r.checklist;
    } catch (e) {
      // Un borrador que falla no tumba la calificación: queda para «Rehacer».
      ev.motivo = `${ev.motivo} (el borrador falló: ${e instanceof Error ? e.message : String(e)}; use «Rehacer borrador»)`.slice(0, 500);
    }
  }));

  return evaluaciones;
}

/** Desde qué nota se escribe borrador: lo mismo que entra a «Para responder». */
const UMBRAL_BORRADOR = 40;
