/**
 * Fechas límite en la hora de Josué. Los boletines las dan en hora del este o
 * del pacífico de EE. UU.; hacer esa cuenta de cabeza a las 11 de la noche es
 * como se pierde una consulta.
 */
const FORMATO_CR = new Intl.DateTimeFormat("es-CR", {
  timeZone: "America/Costa_Rica",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export interface Vencimiento {
  texto: string;     // "lun 21 sept, 5:00 p. m. (en 3 días)"
  urgente: boolean;  // quedan menos de 24 h
  vencida: boolean;
}

export function vencimiento(deadline: string | null, ahora = Date.now()): Vencimiento | null {
  if (!deadline) return null;
  const t = Date.parse(deadline);
  if (Number.isNaN(t)) return null;

  const faltan = t - ahora;
  const horas = Math.floor(faltan / 3_600_000);
  const dias = Math.floor(horas / 24);
  const resto =
    faltan <= 0 ? "venció" :
    horas < 1 ? "en menos de 1 hora" :
    horas < 24 ? `en ${horas} h` :
    dias === 1 ? "mañana" : `en ${dias} días`;

  return {
    texto: `${FORMATO_CR.format(t)} (${resto})`,
    urgente: faltan > 0 && faltan < 24 * 3_600_000,
    vencida: faltan <= 0,
  };
}

/** ¿Es un correo? Lo demás que llegue en `responder_a` es una URL. */
export function esCorreo(s: string | null | undefined): s is string {
  return !!s && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s);
}
