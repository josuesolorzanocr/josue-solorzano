import { redirect } from "next/navigation";
import { sesionActual } from "@/lib/pr/auth";
import { prSupabase, type PrQuery } from "@/lib/pr/supabase";
import PanelQueries from "./PanelQueries";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "PR Auto-Pilot" }, robots: { index: false, follow: false } };

export default async function PrAutopilotPage() {
  const user = await sesionActual();
  if (!user) redirect("/admin/login");

  const sb = prSupabase();
  const { data: queries } = await sb
    .from("pr_queries")
    .select("*")
    .order("estado", { ascending: true })
    .order("score", { ascending: false, nullsFirst: false })
    .limit(100);

  const { data: stats } = await sb
    .from("pr_stats").select("*").order("fecha", { ascending: false }).limit(30);

  const lista = (queries || []) as PrQuery[];
  const total = (k: keyof NonNullable<typeof stats>[number]) =>
    (stats || []).reduce((a, s) => a + (Number(s[k]) || 0), 0);

  const tarjetas = [
    { etq: "Recibidas (30 d)", n: total("recibidas") },
    { etq: "Score 70+", n: total("score_alto") },
    { etq: "Respuestas enviadas", n: total("respuestas") },
    { etq: "Menciones logradas", n: total("menciones") },
    { etq: "Pendientes ahora", n: lista.filter((q) => q.estado === "pendiente").length },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">PR Auto-Pilot</h1>
            <p className="text-sm text-neutral-400">
              {user.nombre || user.email} · {user.rol}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {tarjetas.map((t) => (
            <div key={t.etq} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="text-2xl font-semibold tabular-nums">{t.n}</div>
              <div className="mt-1 text-xs text-neutral-400">{t.etq}</div>
            </div>
          ))}
        </section>

        <PanelQueries queries={lista} puedeAprobar={user.rol !== "viewer"} />
      </div>
    </main>
  );
}
