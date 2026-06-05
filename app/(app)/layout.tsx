import { redirect } from "next/navigation";
import { getSessionInterno } from "@/lib/session";
import Nav from "./Nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const interno = await getSessionInterno();
  if (!interno) redirect("/");

  return (
    <div className="min-h-screen bg-slate-100">
      <Nav
        nombre={interno.nombre.split(" ").slice(0, 2).join(" ")}
        prefijo={interno.prefijo}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
