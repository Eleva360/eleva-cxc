"use client";

import { useState, useMemo, useTransition } from "react";
import { Printer, Check } from "lucide-react";
import type { Interno, Cliente, Servicio } from "@/lib/types";
import { numeroALetras } from "@/lib/numero";
import { MESES, textoPeriodo, TipoPeriodo } from "@/lib/periodo";
import { crearCxc } from "../../actions";
import CxcDocumento from "../CxcDocumento";

export default function GenerarForm({
  interno,
  clientes,
  servicios,
}: {
  interno: Interno;
  clientes: Cliente[];
  servicios: Servicio[];
}) {
  const hoy = new Date();
  const [clienteId, setClienteId] = useState(clientes[0]?.id || "");
  const [servicioId, setServicioId] = useState(servicios[0]?.id || "");
  const [tipoPeriodo, setTipoPeriodo] = useState<TipoPeriodo>("mensual");
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [valor, setValor] = useState(1000000);
  const [fecha, setFecha] = useState(hoy.toISOString().slice(0, 10));
  const [consec, setConsec] = useState(interno.consecutivo);
  const [extra, setExtra] = useState("");
  const [guardado, setGuardado] = useState("");
  const [pending, startTransition] = useTransition();

  const cliente = clientes.find((c) => c.id === clienteId);
  const servicio = servicios.find((s) => s.id === servicioId);
  const periodo = textoPeriodo(tipoPeriodo, mes, anio);
  const numeroCXC = `${interno.prefijo}-${String(consec).padStart(3, "0")}`;

  const concepto = useMemo(() => {
    return (
      (servicio ? servicio.nombre : "") +
      (periodo ? ` — periodo ${periodo}` : "") +
      (extra ? `. ${extra}` : "")
    );
  }, [servicio, periodo, extra]);

  const guardar = () => {
    setGuardado("");
    const fd = new FormData();
    fd.set("cliente_id", clienteId);
    fd.set("servicio_id", servicioId);
    fd.set("valor", String(valor));
    fd.set("fecha", fecha);
    fd.set("concepto", concepto);
    fd.set("periodo", periodo);
    fd.set("consecutivo", String(consec));
    startTransition(async () => {
      const r = await crearCxc(fd);
      if (r?.numero) {
        setGuardado(r.numero);
        setConsec((c) => c + 1);
        // Esperar a que el número quede registrado y luego imprimir
        setTimeout(() => window.print(), 300);
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-2 space-y-4 print:hidden">
        <h2 className="text-lg font-semibold text-slate-800">Datos de la cuenta de cobro</h2>

        <Campo label="Emisor (tú)">
          <input
            disabled
            value={`${interno.nombre} · ${interno.prefijo}`}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
          />
        </Campo>

        <div className="grid grid-cols-2 gap-3">
          <Campo label="N° CXC">
            <div className="flex items-center gap-1">
              <span className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm">
                {interno.prefijo}-
              </span>
              <input
                type="number"
                value={consec}
                onChange={(e) => setConsec(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
              />
            </div>
          </Campo>
          <Campo label="Fecha de elaboración">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </Campo>
        </div>

        <Campo label="Cliente / Proveedor">
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none bg-white"
          >
            {clientes.length === 0 && <option value="">— Agrega un cliente primero —</option>}
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.razon_social}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Servicio">
          <select
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none bg-white"
          >
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Periodo">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {([["mensual", "Mensual"], ["q1", "1ª quincena"], ["q2", "2ª quincena"]] as const).map(
              ([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTipoPeriodo(v)}
                  className={`py-2 rounded-lg text-sm border transition ${
                    tipoPeriodo === v
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white border-slate-300 text-slate-600 hover:border-emerald-400"
                  }`}
                >
                  {l}
                </button>
              )
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-slate-300 outline-none bg-white capitalize"
            >
              {MESES.map((m, i) => (
                <option key={i} value={i} className="capitalize">
                  {m}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-slate-300 outline-none"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">→ {periodo}</p>
        </Campo>

        <Campo label="Detalle adicional (opcional)">
          <input
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="Texto extra para el concepto"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none"
          />
        </Campo>

        <Campo label="Valor">
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 outline-none text-lg font-semibold"
          />
          <p className="text-xs text-slate-500 mt-1">{numeroALetras(valor)}</p>
        </Campo>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={guardar}
            disabled={pending}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Check className="w-4 h-4" /> {pending ? "Guardando..." : "Generar y guardar"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4" /> Solo imprimir
          </button>
        </div>
        {guardado && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
            Cuenta de cobro {guardado} guardada en tu historial.
          </p>
        )}
      </div>

      {/* Vista previa */}
      <div className="lg:col-span-3">
        <div className="sticky top-4">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide print:hidden">Vista previa</p>
          <CxcDocumento
            interno={interno}
            cliente={cliente}
            concepto={concepto}
            valor={valor}
            fecha={fecha}
            numeroCXC={numeroCXC}
          />
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
