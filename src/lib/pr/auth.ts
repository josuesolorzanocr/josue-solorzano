import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prSupabase, type PrUser } from "./supabase";

const COOKIE = "pr_session";
const DIAS = 7;

function secreto(): Uint8Array {
  const s = process.env.PR_AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("PR_AUTH_SECRET falta o es muy corto (mínimo 32 caracteres).");
  }
  return new TextEncoder().encode(s);
}

/** Retraso fijo para que un correo inexistente tarde lo mismo que una clave mala. */
async function esperaAntiTiming() {
  await new Promise((r) => setTimeout(r, 600));
}

export async function verificarCredenciales(
  email: string,
  password: string
): Promise<PrUser | null> {
  const sb = prSupabase();
  const { data } = await sb
    .from("pr_users")
    .select("id,email,nombre,rol,activo,password_hash")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (!data || !data.activo) {
    await esperaAntiTiming();
    return null;
  }
  const ok = await bcrypt.compare(password, data.password_hash);
  await esperaAntiTiming();
  if (!ok) return null;

  await sb.from("pr_users").update({ ultimo_login: new Date().toISOString() }).eq("id", data.id);
  return { id: data.id, email: data.email, nombre: data.nombre, rol: data.rol, activo: data.activo };
}

export async function crearSesion(user: PrUser) {
  const token = await new SignJWT({ sub: user.id, email: user.email, rol: user.rol })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DIAS}d`)
    .sign(secreto());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DIAS * 24 * 60 * 60,
  });
}

export async function cerrarSesion() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function sesionActual(): Promise<PrUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secreto());
    const sb = prSupabase();
    const { data } = await sb
      .from("pr_users")
      .select("id,email,nombre,rol,activo")
      .eq("id", payload.sub as string)
      .maybeSingle();
    return data && data.activo ? (data as PrUser) : null;
  } catch {
    return null;
  }
}

export function puedeAprobar(user: PrUser | null): boolean {
  return !!user && (user.rol === "owner" || user.rol === "editor");
}
