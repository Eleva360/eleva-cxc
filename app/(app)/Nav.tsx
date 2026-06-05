"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, User, Building2, Briefcase } from "lucide-react";
import { logout } from "../actions";

const tabs = [
  { href: "/generar", label: "Generar CXC", icon: FileText },
  { href: "/perfil", label: "Mi perfil", icon: User },
  { href: "/clientes", label: "Clientes", icon: Building2 },
  { href: "/servicios", label: "Servicios", icon: Briefcase },
];

export default function Nav({ nombre, prefijo }: { nombre: string; prefijo: string }) {
  const path = usePathname();
  return (
    <header className="bg-slate-900 text-white print:hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">
              E
            </div>
            <span className="font-bold tracking-tight">eleva</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300 hidden sm:inline">{nombre}</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">{prefijo}</span>
            <form action={logout}>
              <button className="text-slate-400 hover:text-white text-xs">Salir</button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((t) => {
            const active = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm whitespace-nowrap border-b-2 transition ${
                  active
                    ? "border-emerald-400 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
