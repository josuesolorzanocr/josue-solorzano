/**
 * PR Auto-Pilot - reenviador de Gmail  (sin acentos a proposito:
 * el portapapeles los rompe al pegar en el editor de Apps Script)
 *
 * Lee los correos que tengan la etiqueta ETIQUETA_ENTRADA y los manda al
 * webhook del sitio. Usted decide que entra a esa etiqueta con los filtros
 * de Gmail: asi, agregar una plataforma nueva NO exige tocar este codigo.
 *
 *  INSTALACION 
 *
 * 1. EN GMAIL, cree un filtro por cada plataforma:
 *      Buscar  De: community@connectively.us  Crear filtro
 *       marcar "Aplicar la etiqueta"  Nueva etiqueta: PR-AutoPilot
 *       marcar "Aplicar tambien a las conversaciones que coinciden"
 *
 * 2. EN script.google.com  Nuevo proyecto  pegue todo esto.
 *
 * 3. Configuracion del proyecto  Propiedades de la secuencia de comandos:
 *      WEBHOOK_SECRET = <el valor de PR_AUTOPILOT_WEBHOOK_SECRET>
 *    (va aqui y NO en el codigo, para que no viaje en copias ni respaldos)
 *
 * 4. Ejecute `probar()` una vez. Autorice los permisos que pida.
 *    Debe imprimir 200 y aparecer una consulta en su tablero.
 *
 * 5. Activadores (el reloj (reloj))  Anadir activador:
 *      funcion: revisarCorreos - origen: segun tiempo - cada 5 minutos
 *
 * 6. Ejecute `diagnostico()` cuando quiera saber si esta entrando trabajo.
 */

var CONFIG = {
  WEBHOOK_URL: "https://www.josuesolorzano.com/api/pr-autopilot/webhook",
  ETIQUETA_ENTRADA: "PR-AutoPilot",
  ETIQUETA_LISTO: "PR-AutoPilot-enviado",
  USER_ID: "",            // opcional, solo si hay varias personas usando el tablero
  MAX_POR_CORRIDA: 20,
  DIAS_ATRAS: 3
};

/** De que plataforma viene, segun quien lo manda. Verificado, no inventado. */
// `verificado: true` = se busca por ese remitente en Gmail.
// Un remitente que nunca escribe no cuesta nada: Gmail devuelve cero.
// Lo caro es al reves: NO buscar donde si llega trabajo.
// Los demas son suposiciones: NO se usan para buscar, solo para etiquetar
// de que plataforma viene un correo que ya entro por la etiqueta de Gmail.
// Cuando confirme uno, cambielo a true y ya se busca solo.
var REMITENTES = [
  { patron: "connectively.us",   nombre: "Connectively",      verificado: true  },
  { patron: "helpareporter.com", nombre: "HARO/Featured",     verificado: true  },
  { patron: "featured.com",      nombre: "HARO/Featured",     verificado: true  },
  { patron: "qwoted.com",        nombre: "Qwoted",            verificado: true  },
  { patron: "sourceofsources",   nombre: "Source of Sources", verificado: false },
  { patron: "journorequests",    nombre: "JournoRequests",    verificado: false }
];

function secreto_() {
  var s = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  if (!s) {
    throw new Error(
      "Falta WEBHOOK_SECRET en Propiedades de la secuencia de comandos. " +
      "Debe ser el mismo valor de PR_AUTOPILOT_WEBHOOK_SECRET del sitio.");
  }
  return s;
}

function etiqueta_(nombre) {
  return GmailApp.getUserLabelByName(nombre) || GmailApp.createLabel(nombre);
}

function plataformaDe_(remitente) {
  var r = (remitente || "").toLowerCase();
  for (var i = 0; i < REMITENTES.length; i++) {
    if (r.indexOf(REMITENTES[i].patron) !== -1) return REMITENTES[i].nombre;
  }
  return "otra";   // entra igual: mejor revisarla a mano que perderla
}

function revisarCorreos() {
  var entrada = etiqueta_(CONFIG.ETIQUETA_ENTRADA);
  var listo = etiqueta_(CONFIG.ETIQUETA_LISTO);

  // Busca por etiqueta O por remitente conocido. Con cualquiera de las dos
  // basta: si usted no creo el filtro de Gmail, los remitentes verificados
  // igual entran. Y si manana agrega una plataforma, le pone la etiqueta y
  // funciona sin tocar este codigo.
  var partes = ['label:"' + CONFIG.ETIQUETA_ENTRADA + '"'];
  for (var i = 0; i < REMITENTES.length; i++) {
    if (REMITENTES[i].verificado) partes.push("from:" + REMITENTES[i].patron);
  }
  var q = "{" + partes.join(" ") + "}" +
          ' -label:"' + CONFIG.ETIQUETA_LISTO + '"' +
          ' newer_than:' + CONFIG.DIAS_ATRAS + 'd';

  var hilos = GmailApp.search(q, 0, CONFIG.MAX_POR_CORRIDA);
  var enviados = 0, fallidos = 0;

  for (var h = 0; h < hilos.length; h++) {
    var mensajes = hilos[h].getMessages();
    var okHilo = true;

    for (var m = 0; m < mensajes.length; m++) {
      if (enviados >= CONFIG.MAX_POR_CORRIDA) break;
      var msg = mensajes[m];
      var carga = {
        plataforma: plataformaDe_(msg.getFrom()),
        asunto: msg.getSubject(),
        cuerpo: msg.getPlainBody().slice(0, 20000),
        periodista: msg.getFrom(),
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
          okHilo = false; fallidos++;
          Logger.log("Webhook respondio " + r.getResponseCode() + ": " + r.getContentText());
        }
      } catch (e) {
        okHilo = false; fallidos++;
        Logger.log("Error de red: " + e);
      }
    }
    // Solo se marca como listo si TODO el hilo salio bien.
    // Si algo fallo, se reintenta en la proxima corrida.
    if (okHilo) hilos[h].addLabel(listo);
  }

  Logger.log("Enviados: " + enviados + " - Fallidos: " + fallidos +
             " - Hilos revisados: " + hilos.length);
}

/** Corra esto UNA vez a mano: autoriza permisos y comprueba la tuberia. */
function probar() {
  var r = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    headers: { "x-webhook-secret": secreto_() },
    payload: JSON.stringify({
      plataforma: "prueba",
      asunto: "Prueba de conexion del PR Auto-Pilot",
      cuerpo: "Si esto aparece en el tablero, la tuberia funciona de punta a punta."
    }),
    muteHttpExceptions: true
  });
  Logger.log("HTTP " + r.getResponseCode() + " - " + r.getContentText());
  if (r.getResponseCode() !== 200) {
    Logger.log("Si dice 401, el WEBHOOK_SECRET no coincide con el del sitio.");
  }
}

/** Esta entrando trabajo? Corra esto cuando tenga la duda. */
function diagnostico() {
  var e = GmailApp.getUserLabelByName(CONFIG.ETIQUETA_ENTRADA);
  var l = GmailApp.getUserLabelByName(CONFIG.ETIQUETA_LISTO);
  Logger.log("Etiqueta de entrada existe: " + (e ? "SI" : "NO - cree el filtro en Gmail"));
  if (e) {
    Logger.log("Correos con la etiqueta: " + GmailApp.search('label:"' + CONFIG.ETIQUETA_ENTRADA + '"').length);
  }
  Logger.log("Ya enviados: " + (l ? GmailApp.search('label:"' + CONFIG.ETIQUETA_LISTO + '"').length : 0));
  for (var i = 0; i < REMITENTES.length; i++) {
    if (!REMITENTES[i].verificado) continue;
    var n = GmailApp.search("from:" + REMITENTES[i].patron + " newer_than:30d").length;
    Logger.log("Correos de " + REMITENTES[i].nombre + " (30 dias): " + n);
  }
  Logger.log("Secreto configurado: " +
    (PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET") ? "SI" : "NO"));
}
