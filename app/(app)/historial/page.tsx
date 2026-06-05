import { redirect } from "next/navigation";
import { getSessionInterno } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import HistorialList from "./HistorialList";

export default async function HistorialPage() {
  const interno = await getSessionInterno();
  if (!interno) redirect("/");

  let query = supabaseAdmin
    .from("cuentas_cobro")
    .select("*, internos(nombre), clientes(razon_social)")
    .order("created_at", { ascending: false });

  // Si no es admin, solo ve las suyas
  if (!interno.es_admin) {
    query = query.eq("interno_id", interno.id);
  }

  const { data } = await query;

  return <HistorialList cuentas={data || []} esAdmin={interno.es_admin} />;
}
