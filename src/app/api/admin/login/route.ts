import { NextResponse } from "next/server";
import { verificarCredenciales, crearSesion, cerrarSesion } from "@/lib/pr/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Faltan credenciales." }, { status: 400 });
  }
  const user = await verificarCredenciales(String(email), String(password));
  if (!user) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }
  await crearSesion(user);
  return NextResponse.json({ ok: true, rol: user.rol });
}

export async function DELETE() {
  await cerrarSesion();
  return NextResponse.json({ ok: true });
}
