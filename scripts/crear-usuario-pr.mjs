#!/usr/bin/env node
/**
 * Crea o actualiza un usuario del PR Auto-Pilot.
 * La contraseña se pide por teclado: NO se pasa por argumento (quedaría en el
 * historial del shell) ni se guarda en ningún archivo.
 *
 *   node scripts/crear-usuario-pr.mjs correo@ejemplo.com "Nombre" owner
 */
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import readline from "node:readline";
import { Writable } from "node:stream";
import fs from "node:fs";

// Carga .env.local sin dependencias extra
for (const archivo of [".env.local", ".env"]) {
  if (!fs.existsSync(archivo)) continue;
  for (const linea of fs.readFileSync(archivo, "utf8").split("\n")) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const [email, nombre = null, rol = "owner"] = process.argv.slice(2);
if (!email) {
  console.error('Uso: node scripts/crear-usuario-pr.mjs correo@ejemplo.com "Nombre" owner');
  process.exit(1);
}
if (!["owner", "editor", "viewer"].includes(rol)) {
  console.error("El rol debe ser owner, editor o viewer."); process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

function pedirPassword(texto) {
  return new Promise((resolve) => {
    const mudo = new Writable({ write(_c, _e, cb) { cb(); } });
    const rl = readline.createInterface({ input: process.stdin, output: mudo, terminal: true });
    process.stdout.write(texto);
    rl.question("", (r) => { process.stdout.write("\n"); rl.close(); resolve(r); });
  });
}

const pass = await pedirPassword("Contraseña (no se muestra): ");
if (pass.length < 12) { console.error("Mínimo 12 caracteres."); process.exit(1); }
const pass2 = await pedirPassword("Repetila: ");
if (pass !== pass2) { console.error("No coinciden."); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });
const hash = await bcrypt.hash(pass, 12);

const { data, error } = await sb
  .from("pr_users")
  .upsert(
    { email: email.trim().toLowerCase(), nombre, rol, password_hash: hash, activo: true },
    { onConflict: "email" }
  )
  .select("id,email,rol")
  .single();

if (error) { console.error("Error:", error.message); process.exit(1); }
console.log(`\n✅ Usuario listo: ${data.email} · rol ${data.rol}`);
console.log("   Entrá en /admin/login\n");
