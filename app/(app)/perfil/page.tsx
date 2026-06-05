import { redirect } from "next/navigation";
import { getSessionInterno } from "@/lib/session";
import { perfilCompleto } from "@/lib/types";
import PerfilForm from "./PerfilForm";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: { incompleto?: string };
}) {
  const interno = await getSessionInterno();
  if (!interno) redirect("/");
  const incompleto = searchParams.incompleto === "1" || !perfilCompleto(interno);

  return <PerfilForm interno={interno} avisoIncompleto={incompleto} />;
}
