/**
 * Utilidades para leer los boletines de las plataformas SIN pasar por Claude.
 *
 * Se guarda el bloque literal de cada consulta para poder rehacer el borrador
 * después (con otro perfil o mejores reglas) sin volver a Gmail. Pedirle a
 * Claude que copie cada bloque costaría miles de tokens por boletín; cortarlo
 * aquí, con el título como ancla, no cuesta nada.
 */

/**
 * Quita sólo los enlaces que pueden llevar una sesión: los que traen
 * parámetros (?token=...) o un tramo con forma de token en la ruta.
 * Los enlaces limpios (artículos de ejemplo del periodista) se quedan.
 */
export function enlacesSeguros(texto: string): string {
  return texto.replace(/\bhttps?:\/\/[^\s<>"')\]]+/gi, (url) => {
    const conToken = /[?#]/.test(url) || url.split("/").some((p) => /^[A-Za-z0-9_-]{32,}$/.test(p));
    return conToken ? "[enlace quitado]" : url;
  });
}

// Donde empieza la consulta siguiente o termina la actual, en HARO y en SOS.
const CORTE = /\n[ \t]*(?:_{3,}|-{5,}|\*{5,}|Back to [Tt]op|\d+\)\s*(?:SUMMARY|Summary):)/;

/** El bloque literal de una consulta dentro del boletín, o null si no se encuentra. */
export function bloqueDeConsulta(boletin: string, titulo: string): string | null {
  const t = titulo.trim();
  if (t.length < 8) return null;
  // El título aparece en el índice y en el cuerpo: el cuerpo es la última vez.
  let i = boletin.lastIndexOf(t);
  if (i === -1) {
    // Claude a veces cambia un guion o una comilla: se busca por el comienzo.
    const inicio = t.slice(0, 40).toLowerCase();
    i = boletin.toLowerCase().lastIndexOf(inicio);
  }
  if (i === -1) return null;

  const resto = boletin.slice(i + t.length);
  const m = resto.match(CORTE);
  const fin = m && m.index !== undefined ? i + t.length + m.index : Math.min(boletin.length, i + 6000);
  // Desde el comienzo de la línea del título, para incluir "7) SUMMARY:".
  const desde = boletin.lastIndexOf("\n", i) + 1;
  const bloque = boletin.slice(desde, fin).trim();
  return bloque.length >= 40 ? enlacesSeguros(bloque).slice(0, 6000) : null;
}
