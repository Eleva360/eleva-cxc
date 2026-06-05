import { cookies } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "./supabase";
import type { Interno } from "./types";

const COOKIE = "eleva_session";
const secret = process.env.SESSION_SECRET || "dev-secret-cambiar";

function sign(value: string): string {
  const h = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${h}`;
}

function verify(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  // comparación en tiempo constante
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return crypto.timingSafeEqual(a, b) ? value : null;
}

export function setSession(internoId: string) {
  cookies().set(COOKIE, sign(internoId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas
  });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

export function getSessionId(): string | null {
  const c = cookies().get(COOKIE);
  if (!c) return null;
  return verify(c.value);
}

export async function getSessionInterno(): Promise<Interno | null> {
  const id = getSessionId();
  if (!id) return null;
  const { data, error } = await supabaseAdmin
    .from("internos")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Interno;
}
