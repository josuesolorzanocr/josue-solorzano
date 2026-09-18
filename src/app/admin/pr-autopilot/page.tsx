import Link from "next/link";
import { redirect } from "next/navigation";
import { sesionActual } from "@/lib/pr/auth";
import { prSupabase, type PrQuery } from "@/lib/pr/supabase";
import { vencimiento, type Vencimiento } from "@/lib/pr/fechas";
import PanelQueries from "./PanelQueries";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "PR Auto-Pilot" }, robots: { index: false, follow: false } };

/**
 * Cuatro vistas, un solo criterio: cada consulta está en UNA de ellas.
 * "Para responder" es lo que Claude recomienda (score 40+) y todavía está a
 * tiempo. Claude no aprueba nada: califica y redacta. Aprobar es de Josué.
 */
const VISTAS = {
  responder: "Para responder",
  enviadas: "Contestadas",
  vencidas: "Vencidas",
  descartadas: "Descartadas",
} as const;
type Vista = keyof typeof VISTAS;

function filtro(vista: Vista, ahora: string): string {
  const aTiempo = `or(deadline.is.null,deadline.gt.${ahora})`;
  switch (vista) {
    case "responder":
      return `and(estado.eq.pendiente,or(score.gte.40,score.is.null),${aTiempo})`;
    case "enviadas":
      return "estado.eq.enviada";
    case "vencidas":
      return `estado.eq.vencida,and(estado.eq.pendiente,deadline.lte.${ahora})`;
    case "descartadas":
      return `estado.eq.rechazada,and(estado.eq.pendiente,score.lt.40,${aTiempo})`;
  }
}

export default async function PrAutopilotPage({
  searchParams,
}: { searchParams: Promise<{ ver?: string }> }) {
  const user = await sesionActual();
  if (!user) redirect("/admin/login");

  const { ver } = await searchParams;
  const vista: Vista = ver && ver in VISTAS ? (ver as Vista) : "responder";
  const ahora = new Date().toISOString();
  const sb = prSupabase();

  let consulta = sb.from("pr_queries").select("*").or(filtro(vista, ahora));
  consulta = vista === "enviadas"
    ? consulta.order("enviada_en", { ascending: false })
    : consulta.order("score", { ascending: false, nullsFirst: false })
              .order("deadline", { ascending: true, nullsFirst: false });
  const { data: queries } = await consulta.limit(100);

  // Los contadores salen de la tabla, no de una estadística aparte: la
  // tarjeta de "respuestas enviadas" leía un contador que nadie sumaba.
  const contar = async (f: string) =>
    (await sb.from("pr_queries").select("id", { count: "exact", head: true }).or(f)).count ?? 0;
  const [nResponder, nEnviadas, nVencidas, nDescartadas, nMenciones] = await Promise.all([
    contar(filtro("responder", ahora)),
    contar(filtro("enviadas", ahora)),
    contar(filtro("vencidas", ahora)),
    contar(filtro("descartadas", ahora)),
    contar("mencion_url.not.is.null"),
  ]);
  const cuantas: Record<Vista, number> = {
    responder: nResponder, enviadas: nEnviadas, vencidas: nVencidas, descartadas: nDescartadas,
  };

  const { data: stats } = await sb
    .from("pr_stats").select("recibidas,score_alto").order("fecha", { ascending: false }).limit(30);
  const suma = (k: "recibidas" | "score_alto") =>
    (stats || []).reduce((a, s) => a + (Number(s[k]) || 0), 0);

  const lista = (queries || []) as PrQuery[];
  const vencimientos: Record<string, Vencimiento | null> = {};
  for (const q of lista) vencimientos[q.id] = vencimiento(q.deadline);

  const tarjetas = [
    { etq: "Recibidas (30 d)", n: suma("recibidas") },
    { etq: "Score 70+ (30 d)", n: suma("score_alto") },
    { etq: "Para responder ahora", n: nResponder },
    { etq: "Contestadas", n: nEnviadas },
    { etq: "Menciones logradas", n: nMenciones },
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

        <nav className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
          {(Object.keys(VISTAS) as Vista[]).map((v) => (
            <Link
              key={v}
              href={`/admin/pr-autopilot?ver=${v}`}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                v === vista ? "bg-white text-neutral-950" : "text-neutral-400 hover:bg-neutral-900"
              }`}
            >
              {VISTAS[v]} <span className="tabular-nums opacity-70">{cuantas[v]}</span>
            </Link>
          ))}
        </nav>

        <PanelQueries
          queries={lista}
          vencimientos={vencimientos}
          vista={vista}
          puedeAprobar={user.rol !== "viewer"}
        />
      </div>
    </main>
  );
}
