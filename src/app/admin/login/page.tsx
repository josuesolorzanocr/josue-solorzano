"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "No se pudo entrar."); return; }
      router.push("/admin/pr-autopilot");
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form onSubmit={entrar} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-white">PR Auto-Pilot</h1>
        <p className="text-sm text-neutral-400">Panel privado.</p>
        <input
          type="email" required value={email} autoComplete="username"
          onChange={(e) => setEmail(e.target.value)} placeholder="Correo"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
        />
        <input
          type="password" required value={password} autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit" disabled={cargando}
          className="w-full rounded-lg bg-white px-4 py-3 font-medium text-neutral-950 disabled:opacity-50"
        >
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
