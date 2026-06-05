import { createClient } from "@supabase/supabase-js";

// IMPORTANTE: este cliente usa la SERVICE ROLE KEY y solo debe usarse
// en código de servidor (Server Components, Server Actions, Route Handlers).
// Nunca se importa en componentes "use client".

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Falla temprano y claro si faltan variables de entorno.
  throw new Error(
    "Faltan variables de entorno de Supabase. Revisa NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
