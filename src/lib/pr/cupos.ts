/**
 * Cuántas respuestas permite cada plataforma en el plan gratis.
 * Verificado el 2026-09-18 (ver memoria/plataformas-pr-limites en el cerebro):
 *  - Qwoted: 2 pitches al mes (página oficial de precios).
 *  - Connectively: 3 respuestas (la cuenta de Josué decía "3 Answers Remaining";
 *    que se renuevan cada mes lo dicen terceros, no una página oficial).
 *  - HARO y Source of Sources: sin límite publicado.
 * Si un cliente paga un plan, se cambia aquí.
 */
export interface Cupo {
  plataforma: string;
  limiteMensual: number | null;
  nota: string;
}

export const CUPOS: Cupo[] = [
  { plataforma: "HARO/Featured", limiteMensual: null, nota: "Sin límite publicado · filtra respuestas de IA si el periodista lo pide" },
  { plataforma: "Source of Sources", limiteMensual: null, nota: "Sin límite · un pitch fuera de tema = expulsión" },
  { plataforma: "Connectively", limiteMensual: 3, nota: "Plan gratis: 3 al mes" },
  { plataforma: "Qwoted", limiteMensual: 2, nota: "Plan gratis: 2 al mes, 2 h de espera" },
];

export interface UsoCupo extends Cupo {
  esteMes: number;
  total: number;
  quedan: number | null;
}

/** Inicio del mes actual en Costa Rica (UTC-6, sin horario de verano). */
export function inicioDeMesCR(ahora = new Date()): Date {
  const [anio, mes] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Costa_Rica", year: "numeric", month: "2-digit",
  }).format(ahora).split("-");
  return new Date(`${anio}-${mes}-01T00:00:00-06:00`);
}

/** Uso por plataforma, a partir de las consultas marcadas como contestadas. */
export function usoDeCupos(enviadas: { plataforma: string; enviada_en: string | null }[]): UsoCupo[] {
  const desde = inicioDeMesCR().getTime();
  return CUPOS.map((c) => {
    const propias = enviadas.filter((e) => e.plataforma === c.plataforma);
    const esteMes = propias.filter((e) => e.enviada_en && Date.parse(e.enviada_en) >= desde).length;
    return {
      ...c,
      esteMes,
      total: propias.length,
      quedan: c.limiteMensual === null ? null : Math.max(0, c.limiteMensual - esteMes),
    };
  });
}
