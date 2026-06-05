"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, Check } from "lucide-react";
import type { Servicio } from "@/lib/types";
import { guardarServicio, eliminarServicio } from "../../actions";

const vacio: Servicio = { id: "", nombre: "", descripcion: "", activo: true };

export default function ServiciosManager({ servicios }: { servicios: Servicio[] }) {
  const [edit, setEdit] = useState<Servicio | null>(null);

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
          {edit.id ? "Editar servicio" : "Nuevo servicio"}
        </h2>
        <form
          action={async (fd) => {
            await guardarServicio(fd);
            setEdit(null);
          }}
          className="bg-white rounded-lg border border-slate-200 p-5 space-y-3"
        >
          <input type="hidden" name="id" value={edit.id} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              name="nombre"
              defaultValue={edit.nombre}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={edit.descripcion}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </div>
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
        <h2 className="text-lg font-semibold">Catálogo de servicios</h2>
        <button
          onClick={() => setEdit({ ...vacio })}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>
      <div className="space-y-2">
        {servicios.map((s) => (
          <div key={s.id} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{s.nombre}</p>
                <p className="text-sm text-slate-500 mt-1">{s.descripcion}</p>
              </div>
              <div className="flex gap-2 items-center flex-shrink-0">
                <button onClick={() => setEdit({ ...s })} className="text-slate-400 hover:text-emerald-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <form action={eliminarServicio}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="text-slate-400 hover:text-red-600 flex">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
