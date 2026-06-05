import { redirect } from "next/navigation";
import { getSessionInterno } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { perfilCompleto } from "@/lib/types";
import type { Cliente, Servicio } from "@/lib/types";
import GenerarForm from "./GenerarForm";

export default async function GenerarPage() {
  const interno = await getSessionInterno();
  if (!interno) redirect("/");
  if (!perfilCompleto(interno)) redirect("/perfil?incompleto=1");

  const [{ data: clientes }, { data: servicios }] = await Promise.all([
    supabaseAdmin.from("clientes").select("*").order("razon_social"),
    supabaseAdmin.from("servicios").select("*").eq("activo", true).order("created_at"),
  ]);

  return (
    <GenerarForm
      interno={interno}
      clientes={(clientes || []) as Cliente[]}
      servicios={(servicios || []) as Servicio[]}
    />
  );
}
