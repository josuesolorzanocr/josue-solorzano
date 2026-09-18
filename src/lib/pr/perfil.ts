import { prSupabase } from "./supabase";

/**
 * El perfil es lo ÚNICO que Claude sabe de la persona. Todo lo que no esté
 * aquí lo trata como algo que no sabe. Vive en la base (`pr_perfil`), no en el
 * código, para que cada dueño del tablero lo edite sin tocar nada técnico.
 *
 * A propósito NO hay perfil de respaldo en el código: si uno de ejemplo se
 * colara en la instalación de un cliente, sus borradores saldrían firmados
 * por otra persona. Sin perfil, la calificación falla y el correo queda
 * guardado para revisarlo a mano.
 */
export interface Perfil {
  id: string;
  texto: string;
  firma_es: string;
  firma_en: string;
  creado_en: string;
}

export const LIMITES = {
  texto: { min: 50, max: 4000 },
  firma: { min: 5, max: 300 },
} as const;

export async function perfilVigente(): Promise<Perfil> {
  const { data, error } = await prSupabase()
    .from("pr_perfil")
    .select("id,texto,firma_es,firma_en,creado_en")
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("No se pudo leer el perfil: " + error.message);
  if (!data) throw new Error("No hay perfil. Créelo en el tablero, pestaña «Mi perfil».");
  return data as Perfil;
}

export async function historialPerfil(cuantas = 10): Promise<Perfil[]> {
  const { data } = await prSupabase()
    .from("pr_perfil")
    .select("id,texto,firma_es,firma_en,creado_en")
    .order("creado_en", { ascending: false })
    .limit(cuantas);
  return (data || []) as Perfil[];
}
