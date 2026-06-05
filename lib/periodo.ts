export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function diasMes(mes: number, anio: number): number {
  return new Date(anio, mes + 1, 0).getDate();
}

export type TipoPeriodo = "mensual" | "q1" | "q2";

export function textoPeriodo(tipo: TipoPeriodo, mes: number, anio: number): string {
  const m = MESES[mes];
  if (tipo === "mensual") return `1 al ${diasMes(mes, anio)} de ${m} de ${anio}`;
  if (tipo === "q1") return `1 al 15 de ${m} de ${anio}`;
  if (tipo === "q2") return `16 al ${diasMes(mes, anio)} de ${m} de ${anio}`;
  return "";
}

export function fechaCorta(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}
