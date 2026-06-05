import { supabaseAdmin } from "@/lib/supabase";
import type { Servicio } from "@/lib/types";
import ServiciosManager from "./ServiciosManager";

export default async function ServiciosPage() {
  const { data } = await supabaseAdmin.from("servicios").select("*").order("created_at");
  return <ServiciosManager servicios={(data || []) as Servicio[]} />;
}
