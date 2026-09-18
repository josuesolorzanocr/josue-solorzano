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
  const r = await anthropic().messages.create({
    model: MODELO,
    max_tokens: 3000,
    messages: [{ role: "user", content: `${instruccion}\n\n---\n${texto}\n---` }],
  });
  if (r.stop_reason === "max_tokens") throw new Error("La traducción se cortó a la mitad.");
  const salida = textoDe(r);
  if (!salida) throw new Error("La traducción volvió vacía.");
  return salida;
}

/** Español de Josué → inglés que se envía, con la firma en inglés del perfil. */
export async function aIngles(textoEs: string, perfil: Perfil): Promise<string> {
  const { cuerpo, tenia } = separarFirma(textoEs, [perfil.firma_es, perfil.firma_en]);
  const en = await traducir(A_INGLES, cuerpo);
  return tenia ? `${en}\n\n${perfil.firma_en}` : en;
}

/** Inglés → español para leer, con la firma en español del perfil. */
export async function aEspanol(textoEn: string, perfil: Perfil): Promise<string> {
  const { cuerpo, tenia } = separarFirma(textoEn, [perfil.firma_en, perfil.firma_es]);
  const es = await traducir(A_ESPANOL, cuerpo);
  return tenia ? `${es}\n\n${perfil.firma_es}` : es;
}
