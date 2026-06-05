"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { setSession, clearSession, getSessionId } from "@/lib/session";
import { numeroALetras } from "@/lib/numero";

/* ---------- AUTENTICACIÓN ---------- */
export async function login(_prev: unknown, formData: FormData) {
  const cedula = String(formData.get("cedula") || "").replace(/\D/g, "");
  if (!cedula) return { error: "Ingresa tu cédula." };

  const { data, error } = await supabaseAdmin
    .from("internos")
    .select("id")
    .eq("cedula", cedula)
    .maybeSingle();

  if (error) return { error: "Error de conexión. Intenta de nuevo." };
  if (!data) return { error: "Cédula no registrada en el personal interno." };

  setSession(data.id);
  redirect("/generar");
}

export async function logout() {
  clearSession();
  redirect("/");
}

/* ---------- PERFIL (cada quien edita lo suyo) ---------- */
export async function actualizarPerfil(formData: FormData) {
  const id = getSessionId();
  if (!id) redirect("/");

  const payload = {
    direccion: String(formData.get("direccion") || ""),
    ciudad: String(formData.get("ciudad") || ""),
    celular: String(formData.get("celular") || ""),
    email: String(formData.get("email") || ""),
    banco: String(formData.get("banco") || ""),
    tipo_cuenta: String(formData.get("tipo_cuenta") || "Ahorros"),
    numero_cuenta: String(formData.get("numero_cuenta") || ""),
    titular_cuenta: String(formData.get("titular_cuenta") || ""),
    profesion: String(formData.get("profesion") || ""),
    responsable_iva: formData.get("responsable_iva") === "on",
    declarante_renta: formData.get("declarante_renta") === "on",
  };

  await supabaseAdmin.from("internos").update(payload).eq("id", id);
  revalidatePath("/perfil");
  revalidatePath("/generar");
}

/* ---------- CLIENTES (compartidos) ---------- */
export async function guardarCliente(formData: FormData) {
  if (!getSessionId()) redirect("/");
  const id = String(formData.get("id") || "");
  const payload = {
    razon_social: String(formData.get("razon_social") || ""),
    nit: String(formData.get("nit") || ""),
    direccion: String(formData.get("direccion") || ""),
    ciudad: String(formData.get("ciudad") || ""),
  };
  if (id) await supabaseAdmin.from("clientes").update(payload).eq("id", id);
  else await supabaseAdmin.from("clientes").insert(payload);
  revalidatePath("/clientes");
  revalidatePath("/generar");
}

export async function eliminarCliente(formData: FormData) {
  if (!getSessionId()) redirect("/");
  const id = String(formData.get("id") || "");
  if (id) await supabaseAdmin.from("clientes").delete().eq("id", id);
  revalidatePath("/clientes");
}

/* ---------- SERVICIOS ---------- */
export async function guardarServicio(formData: FormData) {
  if (!getSessionId()) redirect("/");
  const id = String(formData.get("id") || "");
  const payload = {
    nombre: String(formData.get("nombre") || ""),
    descripcion: String(formData.get("descripcion") || ""),
  };
  if (id) await supabaseAdmin.from("servicios").update(payload).eq("id", id);
  else await supabaseAdmin.from("servicios").insert(payload);
  revalidatePath("/servicios");
  revalidatePath("/generar");
}

export async function eliminarServicio(formData: FormData) {
  if (!getSessionId()) redirect("/");
  const id = String(formData.get("id") || "");
  if (id) await supabaseAdmin.from("servicios").delete().eq("id", id);
  revalidatePath("/servicios");
}

/* ---------- CREAR CUENTA DE COBRO ---------- */
export async function crearCxc(formData: FormData) {
  const internoId = getSessionId();
  if (!internoId) redirect("/");

  const { data: interno } = await supabaseAdmin
    .from("internos").select("*").eq("id", internoId).single();
  if (!interno) redirect("/");

  const clienteId = String(formData.get("cliente_id") || "");
  const servicioId = String(formData.get("servicio_id") || "");
  const valor = Number(formData.get("valor") || 0);
  const fecha = String(formData.get("fecha") || "");
  const concepto = String(formData.get("concepto") || "");
  const periodo = String(formData.get("periodo") || "");
  const consecutivo = Number(formData.get("consecutivo") || interno.consecutivo);

  const { data: cliente } = await supabaseAdmin
    .from("clientes").select("*").eq("id", clienteId).maybeSingle();

  const numero = `${interno.prefijo}-${String(consecutivo).padStart(3, "0")}`;

  await supabaseAdmin.from("cuentas_cobro").insert({
    numero,
    interno_id: internoId,
    cliente_id: clienteId || null,
    servicio_id: servicioId || null,
    concepto,
    periodo,
    valor,
    valor_letras: numeroALetras(valor),
    fecha,
    snapshot: { interno, cliente },
  });

  // Avanzar el consecutivo de la persona
  await supabaseAdmin
    .from("internos")
    .update({ consecutivo: consecutivo + 1 })
    .eq("id", internoId);

  revalidatePath("/generar");
  return { numero };
}
