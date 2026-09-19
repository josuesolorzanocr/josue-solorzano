import { anthropic, MODELO, textoDe } from "./claude";
import type { Perfil } from "./perfil";

/**
 * Josué no lee inglés. Revisa y edita en español; al periodista le sale en
 * inglés. Como no puede leer lo que se envía, el inglés se traduce DE VUELTA
 * al español en una llamada aparte, para que vea qué dice de verdad.
 *
 * La firma no pasa por la traducción: se quita antes y se pega después, literal,
 * desde el perfil. Así nunca sale un nombre o una dirección alterados.
 */
const MAX_CARACTERES = 4000;

function separarFirma(texto: string, firmas: string[]): { cuerpo: string; tenia: boolean } {
  const t = texto.trim();
  for (const f of firmas) {
    if (f && t.endsWith(f.trim())) return { cuerpo: t.slice(0, -f.trim().length).trim(), tenia: true };
  }
  return { cuerpo: t, tenia: false };
}

const A_INGLES = `Traducí del español al inglés este texto: es la respuesta de un experto a
un periodista y se va a enviar tal cual.
Reglas, sin excepción:
- Fiel. No agregues, quites, suavices ni exageres nada: ni afirmaciones, ni
  cifras, ni ofrecimientos, ni tono.
- Nombres propios, cifras, fechas y direcciones web exactamente iguales.
- Inglés profesional y natural, como lo escribiría un profesional nativo.
- No agregues saludo, despedida ni firma.
- Si el texto ya está en inglés, devolvelo igual.
Devolvé SOLO el texto traducido, sin comillas ni comentarios.`;

const A_ESPANOL = `Traducí este texto al español de Costa Rica para que su autor, que no lee
inglés, sepa EXACTAMENTE qué dice antes de enviarlo.
Reglas, sin excepción:
- Fiel en el sentido: no mejores, no corrijas, no resumas, no agregues.
- Si algo del original es ambiguo o suena raro, traducilo igual de ambiguo o
  raro: el autor necesita verlo.
- Nombres propios, cifras, fechas y direcciones web exactamente iguales.
- Si el texto ya está en español, devolvelo igual.
Devolvé SOLO el texto traducido, sin comillas ni comentarios.`;

async function traducir(instruccion: string, texto: string): Promise<string> {
  if (!texto.trim()) return "";
  if (texto.length > MAX_CARACTERES) {
    throw new Error(`El texto es muy largo para traducir (máximo ${MAX_CARACTERES} caracteres).`);
  }
  // Sin razonamiento: traducir no lo necesita. Con el razonamiento automático
  // del modelo, a veces gastaba 2,520 de 3,000 tokens pensando y la traducción
  // salía cortada (visto el 2026-09-19 con una respuesta de 400 palabras,
  // 1 de cada 3 intentos). El tope alto es margen, no se cobra si no se usa.
  const r = await anthropic().messages.create({
    model: MODELO,
    max_tokens: 6000,
    thinking: { type: "disabled" },
    messages: [{ role: "user", content: `${instruccion}\n\n---\n${texto}\n---` }],
  });
  if (r.stop_reason === "max_tokens") throw new Error("La traducción se cortó a la mitad.");
  const salida = textoDe(r);
  if (!salida) throw new Error("La traducción volvió vacía.");
  return salida;
}

/**
 * Nota fija para los periodistas que no aceptan texto de IA: Josué escribe en
 * español con sus palabras y la IA sólo traduce. Se dice, no se esconde.
 * Va literal (no pasa por Claude) para que siempre diga exactamente esto.
 * Ojo: no garantiza pasar el detector automático de HARO (Pangram mide el
 * texto, no lee la nota); sirve para que el periodista que la reciba sepa.
 */
export const NOTA_TRADUCCION_EN =
  "Note: I wrote this answer myself in Spanish, my native language; the English version was translated with an AI tool.";

/** ¿El texto ya menciona la traducción? Para no poner la nota dos veces. */
export function mencionaTraduccion(texto: string): boolean {
  return /traduc|translat/i.test(texto);
}

/** Español de Josué → inglés que se envía, con la firma en inglés del perfil. */
export async function aIngles(
  textoEs: string,
  perfil: Perfil,
  opciones: { notaTraduccion?: boolean } = {},
): Promise<string> {
  const { cuerpo, tenia } = separarFirma(textoEs, [perfil.firma_es, perfil.firma_en]);
  let en = await traducir(A_INGLES, cuerpo);
  if (opciones.notaTraduccion && !mencionaTraduccion(cuerpo)) {
    en = `${en}\n\n${NOTA_TRADUCCION_EN}`;
  }
  return tenia ? `${en}\n\n${perfil.firma_en}` : en;
}

/** Inglés → español para leer, con la firma en español del perfil. */
export async function aEspanol(textoEn: string, perfil: Perfil): Promise<string> {
  const { cuerpo, tenia } = separarFirma(textoEn, [perfil.firma_en, perfil.firma_es]);
  const es = await traducir(A_ESPANOL, cuerpo);
  return tenia ? `${es}\n\n${perfil.firma_es}` : es;
}
