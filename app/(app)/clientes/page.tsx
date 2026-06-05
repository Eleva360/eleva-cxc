import { supabaseAdmin } from "@/lib/supabase";
import type { Cliente } from "@/lib/types";
import ClientesManager from "./ClientesManager";

export default async function ClientesPage() {
  const { data } = await supabaseAdmin.from("clientes").select("*").order("razon_social");
  return <ClientesManager clientes={(data || []) as Cliente[]} />;
}
