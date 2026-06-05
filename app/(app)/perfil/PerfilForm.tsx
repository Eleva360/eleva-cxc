"use client";

import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import type { Interno } from "@/lib/types";
import { actualizarPerfil } from "../../actions";

export default function PerfilForm({
  interno,
  avisoIncompleto,
}: {
  interno: Interno;
  avisoIncompleto: boolean;
}) {
  const [ok, setOk] = useState(false);

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold mb-1">Mi perfil</h2>
      <p className="text-sm text-slate-500 mb-4">
        {interno.nombre} · C.C. {Number(interno.cedula).toLocaleString("es-CO")} · Prefijo{" "}
        {interno.prefijo}
      </p>

      {avisoIncompleto && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Completa tus datos (dirección, email, banco y cuenta) para poder generar cuentas de cobro.
          </span>
        </div>
      )}

      <form
        action={async (fd) => {
          await actualizarPerfil(fd);
          setOk(true);
          setTimeout(() => setOk(false), 3000);
        }}
        className="bg-white rounded-lg border border-slate-200 p-5 grid sm:grid-cols-2 gap-3"
      >
        <In label="Dirección" name="direccion" def={interno.direccion} full />
        <In label="Ciudad" name="ciudad" def={interno.ciudad} />
        <In label="Celular" name="celular" def={interno.celular} />
        <In label="Email" name="email" def={interno.email} />
        <In label="Banco" name="banco" def={interno.banco} />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de cuenta</label>
          <select
            name="tipo_cuenta"
            defaultValue={interno.tipo_cuenta}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none"
          >
            <option>Ahorros</option>
            <option>Corriente</option>
          </select>
        </div>
        <In label="N° de cuenta" name="numero_cuenta" def={interno.numero_cuenta} />
        <In label="Titular de la cuenta" name="titular_cuenta" def={interno.titular_cuenta} />
        <In label="Profesión" name="profesion" def={interno.profesion} />

        <Check2 label="Responsable de IVA" name="responsable_iva" def={interno.responsable_iva} />
        <Check2
          label="Soy declarante de renta (oculta el bloque del Art. 383)"
          name="declarante_renta"
          def={interno.declarante_renta}
        />

        <div className="sm:col-span-2 flex items-center gap-3 pt-2">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-1">
            <Check className="w-4 h-4" /> Guardar
          </button>
          {ok && <span className="text-sm text-emerald-700">Guardado.</span>}
        </div>
      </form>
    </div>
  );
}

function In({
  label,
  name,
  def,
  full,
}: {
  label: string;
  name: string;
  def: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        name={name}
        defaultValue={def}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
      />
    </div>
  );
}

function Check2({
  label,
  name,
  def,
  onToggle,
}: {
  label: string;
  name: string;
  def: boolean;
  onToggle?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={def}
        onChange={(e) => onToggle?.(e.target.checked)}
        className="w-4 h-4 rounded text-emerald-600"
      />
      {label}
    </label>
  );
}
