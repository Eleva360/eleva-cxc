export type Interno = {
  id: string;
  nombre: string;
  cedula: string;
  prefijo: string;
  responsable_iva: boolean;
  direccion: string;
  ciudad: string;
  celular: string;
  email: string;
  banco: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  titular_cuenta: string;
  profesion: string;
  declarante_renta: boolean;
  es_admin: boolean;
  consecutivo: number;
  created_at?: string;
};

export type Cliente = {
  id: string;
  razon_social: string;
  nit: string;
  direccion: string;
  ciudad: string;
  created_at?: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  created_at?: string;
};

export type CuentaCobro = {
  id: string;
  numero: string;
  interno_id: string | null;
  cliente_id: string | null;
  servicio_id: string | null;
  concepto: string;
  periodo: string;
  valor: number;
  valor_letras: string;
  fecha: string;
  snapshot: unknown;
  created_at?: string;
};

export function perfilCompleto(i: Interno): boolean {
  return Boolean(i.direccion && i.email && i.numero_cuenta && i.banco);
}
