import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL no está configurada. Revisa tu archivo .env.");
}
if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada. Revisa tu archivo .env.");
}

/**
 * Cliente de Supabase con la Service Role key: se salta Row Level Security
 * y tiene acceso total a la base. Por eso este módulo es `server-only` — jamás
 * debe importarse desde un componente cliente ni exponerse al navegador.
 * La autorización la sigue haciendo requireSession() en cada Server Action.
 */
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const TABLES = {
  user: "User_seguimiento",
  proyecto: "Proyecto_seguimiento",
  frente: "Frente_seguimiento",
  actividad: "Actividad_seguimiento",
} as const;
