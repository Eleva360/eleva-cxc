"use client";

import type { Interno, Cliente } from "@/lib/types";
import { numeroALetras, formatCOP } from "@/lib/numero";
import { fechaCorta } from "@/lib/periodo";

export default function CxcDocumento({
  interno,
  cliente,
  concepto,
  valor,
  fecha,
  numeroCXC,
}: {
  interno: Interno;
  cliente?: Cliente | null;
  concepto: string;
  valor: number;
  fecha: string;
  numeroCXC: string;
}) {
  return (
    <div
      id="cxc-print"
      className="bg-white shadow-lg rounded-lg p-8 text-sm text-slate-800 leading-relaxed"
    >
      <div className="text-xs leading-tight">
        <p className="font-bold">{interno.nombre}</p>
        <p>NIT/C.C. {Number(interno.cedula).toLocaleString("es-CO")}</p>
        <p>{interno.responsable_iva ? "Responsable de IVA" : "No Responsable de IVA"}</p>
        <p>Dirección: {interno.direccion}</p>
        <p>Celular: {interno.celular}</p>
        <p>Email: {interno.email}</p>
      </div>

      <hr className="my-4 border-slate-300" />

      <p className="font-bold text-center text-base tracking-wide">CXC {numeroCXC}</p>
      <p className="mt-2">Fecha elaboración: {fechaCorta(fecha)}</p>

      <p className="mt-4 font-bold">COMPAÑÍA</p>
      <p>{cliente?.razon_social || ""}</p>
      <p>Identificación: NIT. {cliente?.nit || ""}</p>
      <p>{cliente?.direccion || ""}</p>

      <div className="mt-4 text-center">
        <p className="font-bold">DEBE LA SUMA DE:</p>
        <p className="text-lg font-bold">{formatCOP(valor)} /cte</p>
        <p className="italic">({numeroALetras(valor)})</p>

        <p className="mt-4 font-bold">POR CONCEPTO DE:</p>
        <p>{concepto}</p>

        {!interno.declarante_renta && (
          <div className="mt-4 text-xs space-y-1 text-slate-600">
            <p>
              Para efectos de lo establecido en el parágrafo 2 del Artículo 383 del E.T., modificado por
              el Artículo 17 de la Ley 1819 de 2016,
            </p>
            <p>
              1. Manifiesto que no he contratado o vinculado dos (2) personas o más trabajadores que
              estén asociados a la actividad que desarrollo.
            </p>
            <p>2. En el año gravable anterior mis ingresos o mis ventas no superaron las 3300 UVT.</p>
            <p>3. No soy declarante de renta.</p>
            <p className="font-bold text-slate-800 mt-2">NO HACER RETENCIÓN EN LA FUENTE</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <p className="font-bold">Formas de pago: Transferencia bancaria</p>
        <p>Banco: {interno.banco}</p>
        <p>Tipo de Cuenta: {interno.tipo_cuenta}</p>
        <p>A nombre de: {interno.titular_cuenta}</p>
        <p>
          Cuenta {interno.tipo_cuenta?.toLowerCase()}: {interno.numero_cuenta}
        </p>
      </div>

      <div className="mt-10">
        <p className="font-bold">{interno.nombre}</p>
        {interno.profesion && <p>{interno.profesion}</p>}
      </div>
    </div>
  );
}
