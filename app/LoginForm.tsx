"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Lock, LogIn, X } from "lucide-react";
import { login } from "./actions";

function Boton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
    >
      <LogIn className="w-4 h-4" /> {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export default function LoginForm({ nombres }: { nombres: string[] }) {
  const [state, formAction] = useFormState(login, { error: "" } as { error?: string });

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 opacity-90" />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-xl">
              E
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">eleva</span>
          </div>
          <p className="text-slate-400 text-sm mt-3">Generador de cuentas de cobro</p>
        </div>

        <form action={formAction} className="bg-white rounded-2xl shadow-2xl p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Ingresa tu cédula</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              name="cedula"
              autoFocus
              inputMode="numeric"
              placeholder="Número de cédula"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
          </div>
          {state?.error ? (
            <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
              <X className="w-3 h-3" />
              {state.error}
            </p>
          ) : null}
          <Boton />
          {nombres.length > 0 && (
            <p className="text-xs text-slate-400 mt-4">
              Personal registrado: {nombres.join(", ")}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
