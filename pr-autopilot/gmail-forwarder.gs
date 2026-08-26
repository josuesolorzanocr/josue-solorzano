/**
 * PR Auto-Pilot · reenviador de Gmail  (DAB v2.0 Fase 5.2)
 *
 * Corre cada 5 minutos en el Gmail de quien recibe las alertas de PR.
 * Detecta correos de HARO/Featured, Qwoted, Connectively, Source of Sources
 * y JournoRequests, y los manda al webhook del sitio.
 *
 * INSTALACIÓN
 *  1. script.google.com → Nuevo proyecto → pegar esto.
 *  2. Llenar CONFIG de abajo.
 *  3. Ejecutar `probar()` una vez y autorizar los permisos.
 *  4. Activadores (reloj) → nueva función `revisarCorreos` → cada 5 minutos.
 *
 * El secreto se guarda en Propiedades del script, NO en el código:
 *  Configuración del proyecto → Propiedades de la secuencia de comandos →
 *  agregar  WEBHOOK_SECRET = <el mismo valor de PR_AUTOPILOT_WEBHOOK_SECRET>
 */

var CONFIG = {
  WEBHOOK_URL: "https://josuesolorzano.com/api/pr-autopilot/webhook",
  USER_ID: "",              // opcional: el uuid de pr_users si hay varios
  ETIQUETA_LISTO: "PR-enviado",
  MAX_POR_CORRIDA: 20
};

var FUENTES = [
  { nombre: "HARO/Featured",     query: "from:(helpareporter.com OR featured.com)" },
  { nombre: "Qwoted",            query: "from:qwoted.com" },
  { nombre: "Connectively",      query: "from:connectively.us" },
  { nombre: "Source of Sources", query: "from:sourceofsources.com" },
  { nombre: "JournoRequests",    query: "from:journorequests.com" }
];

function secreto_() {
  var s = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  if (!s) throw new Error("Falta la propiedad WEBHOOK_SECRET en el proyecto.");
  return s;
}

function etiqueta_() {
  return GmailApp.getUserLabelByName(CONFIG.ETIQUETA_LISTO) ||
         GmailApp.createLabel(CONFIG.ETIQUETA_LISTO);
}

function revisarCorreos() {
  var listo = etiqueta_();
  var enviados = 0;

  FUENTES.forEach(function (f) {
    var q = f.query + ' newer_than:2d -label:"' + CONFIG.ETIQUETA_LISTO + '"';
    GmailApp.search(q, 0, CONFIG.MAX_POR_CORRIDA).forEach(function (hilo) {
      if (enviados >= CONFIG.MAX_POR_CORRIDA) return;
      hilo.getMessages().forEach(function (m) {
        if (enviados >= CONFIG.MAX_POR_CORRIDA) return;
        var carga = {
          plataforma: f.nombre,
          asunto: m.getSubject(),
          cuerpo: m.getPlainBody().slice(0, 20000),
          periodista: m.getFrom(),
          user_id: CONFIG.USER_ID || null
        };
        try {
          var r = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
            method: "post",
            contentType: "application/json",
            headers: { "x-webhook-secret": secreto_() },
            payload: JSON.stringify(carga),
            muteHttpExceptions: true
          });
          if (r.getResponseCode() === 200) {
            enviados++;
          } else {
            Logger.log("El webhook respondió " + r.getResponseCode() + ": " + r.getContentText());
          }
        } catch (e) {
          Logger.log("Error mandando: " + e);
        }
      });
      hilo.addLabel(listo);
    });
  });

  Logger.log("Correos enviados al webhook: " + enviados);
}

/** Corré esto UNA vez a mano para autorizar permisos y ver que el webhook contesta. */
function probar() {
  var r = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    headers: { "x-webhook-secret": secreto_() },
    payload: JSON.stringify({
      plataforma: "prueba",
      asunto: "Prueba de conexión del PR Auto-Pilot",
      cuerpo: "Si esto llega al tablero, la tubería funciona de punta a punta."
    }),
    muteHttpExceptions: true
  });
  Logger.log(r.getResponseCode() + " · " + r.getContentText());
}
