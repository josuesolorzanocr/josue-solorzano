import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con service-role para el PR Auto-Pilot.
 * Se crea por demanda a propósito: si se creara al cargar el módulo,
 * `next build` fallaría cuando la variable de entorno no está puesta.
 * (Lección 3 del DAB v2.0: verificar SIEMPRE con `vercel env pull`.)
 */
let cliente: SupabaseClient | null = null;

export function prSupabase(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. " +
      "Verificá con `vercel env pull` que no estén vacías."
    );
  }

  cliente = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

export type EstadoQuery = "pendiente" | "aprobada" | "enviada" | "rechazada" | "vencida";

export interface PrQuery {
  id: string;
  user_id: string | null;
  plataforma: string;
  medio: string | null;
  periodista: string | null;
  asunto: string | null;
  cuerpo: string | null;
  deadline: string | null;
  score: number | null;
  score_motivo: string | null;
  draft: string | null;
  draft_editado: string | null;
  estado: EstadoQuery;
  aprobada_por: string | null;
  aprobada_en: string | null;
  enviada_en: string | null;
  mencion_url: string | null;
  creado_en: string;
}

export interface PrUser {
  id: string;
  email: string;
  nombre: string | null;
  rol: "owner" | "editor" | "viewer";
  activo: boolean;
}
