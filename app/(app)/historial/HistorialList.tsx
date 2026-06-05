"use client";

import { useState } from "react";
import { Printer, X, FileText } from "lucide-react";
import { formatCOP } from "@/lib/numero";
import { fechaCorta } from "@/lib/periodo";
import CxcDocumento from "../CxcDocumento";

type Row = {
  id: string;
  numero: string;
  concepto: string;
  valor: number;
  fecha: string;
  snapshot: { interno: any; cliente: any } | null;
  internos?: { nombre: string } | null;
  clientes?: { razon_social: string } | null;
};

export default function HistorialList({
  cuentas,
  esAdmin,
}: {
  cuentas: Row[];
  esAdmin: boolean;
}) {
  const [sel, setSel] = useState<Row | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Historial de cuentas de cobro</h2>
        {esAdmin && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
            Vista de administrador: ves todas
          </span>
        )}
      </div>

      {cuentas.length === 0 ? (
        <p className="text-sm text-slate-400">Aún no hay cuentas de cobro generadas.</p>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">N°</th>
                <th className="px-4 py-2 font-medium">Fecha</th>
                {esAdmin && <th className="px-4 py-2 font-medium">Generada por</th>}
                <th className="px-4 py-2 font-medium">Cliente</th>
                <th className="px-4 py-2 font-medium text-right">Valor</th>
                <th className="px-4 py-2 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 font-semibold">{c.numero}</td>
                  <td className="px-4 py-2 text-slate-600">{fechaCorta(c.fecha)}</td>
                  {esAdmin && (
                    <td className="px-4 py-2 text-slate-600">
                      {c.internos?.nombre?.split(" ").slice(0, 2).join(" ") || "—"}
                    </td>
                  )}
                  <td className="px-4 py-2 text-slate-600">{c.clientes?.razon_social || "—"}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatCOP(c.valor)}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => setSel(c)}
                      className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 text-sm"
                    >
                      <FileText className="w-3.5 h-3.5" /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de reimpresión */}
      {sel && sel.snapshot && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-auto p-4 print:bg-white print:p-0">
          <div className="w-full max-w-2xl">
            <div className="flex justify-between items-center mb-2 print:hidden">
              <span className="text-white text-sm">CXC {sel.numero}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" /> Imprimir
                </button>
                <button
                  onClick={() => setSel(null)}
                  className="bg-white hover:bg-slate-100 text-slate-700 text-sm px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Cerrar
                </button>
              </div>
            </div>
            <CxcDocumento
              interno={sel.snapshot.interno}
              cliente={sel.snapshot.cliente}
              concepto={sel.concepto}
              valor={sel.valor}
              fecha={sel.fecha}
              numeroCXC={sel.numero}
            />
          </div>
        </div>
      )}
    </div>
  );
}
