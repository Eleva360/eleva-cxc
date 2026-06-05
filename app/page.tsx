import { redirect } from "next/navigation";
import { getSessionId } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (getSessionId()) redirect("/generar");

  // Pistas de demo: primer nombre de cada interno (no expone cédulas).
  const { data } = await supabaseAdmin.from("internos").select("nombre").order("created_at");
  const nombres = (data || []).map((d) => d.nombre.split(" ")[0]);

  return <LoginForm nombres={nombres} />;
}
