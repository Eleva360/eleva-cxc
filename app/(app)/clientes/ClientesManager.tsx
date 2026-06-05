"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, Check } from "lucide-react";
import type { Cliente } from "@/lib/types";
import { guardarCliente, eliminarCliente } from "../../actions";

const vacio: Cliente = { id: "", razon_social: "", nit: "", direccion: "", ciudad: "" };

export default function ClientesManager({ clientes }: { clientes: Cliente[] }) {
  const [edit, setEdit] = useState<Cliente | null>(null);

  if (edit) {
    return (
      <div className="max-w-xl">
        <button
          onClick={() => setEdit(null)}
          className="text-sm text-slate-500 flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {edit.id ? "Editar cliente" : "Nuevo cliente"}
        </h2>
        <form
          action={async (fd) => {
            await guardarCliente(fd);
            setEdit(null);
          }}
          className="bg-white rounded-lg border border-slate-200 p-5 space-y-3"
        >
          <input type="hidden" name="id" value={edit.id} />
          <In label="Razón social" name="razon_social" def={edit.razon_social} />
          <In label="NIT" name="nit" def={edit.nit} />
          <In label="Dirección" name="direccion" def={edit.direccion} />
          <In label="Ciudad" name="ciudad" def={edit.ciudad} />
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-1">
            <Check className="w-4 h-4" /> Guardar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Clientes / Proveedores</h2>
        <button
          onClick={() => setEdit({ ...vacio })}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>
      <div className="space-y-2">
        {clientes.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{c.razon_social}</p>
              <p className="text-xs text-slate-500">
                NIT {c.nit} · {c.direccion}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setEdit({ ...c })} className="text-slate-400 hover:text-emerald-600">
                <Pencil className="w-4 h-4" />
              </button>
              <form action={eliminarCliente}>
                <input type="hidden" name="id" value={c.id} />
                <button className="text-slate-400 hover:text-red-600 flex">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
        {clientes.length === 0 && (
          <p className="text-sm text-slate-400">Aún no hay clientes. Agrega el primero.</p>
        )}
      </div>
    </div>
  );
}

function In({ label, name, def }: { label: string; name: string; def: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        name={name}
        defaultValue={def}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
      />
    </div>
  );
}
