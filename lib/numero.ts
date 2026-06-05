const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho",
  "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis",
  "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós",
  "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete",
  "veintiocho", "veintinueve"];
const DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos",
  "seiscientos", "setecientos", "ochocientos", "novecientos"];

function seccion(n: number): string {
  let t = "";
  const c = Math.floor(n / 100);
  const r = n % 100;
  if (c === 1 && r === 0) t = "cien";
  else if (c > 0) t = CENTENAS[c];
  if (r > 0) {
    if (r <= 29) t += (t ? " " : "") + UNIDADES[r];
    else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      t += (t ? " " : "") + DECENAS[d] + (u > 0 ? " y " + UNIDADES[u] : "");
    }
  }
  return t;
}

export function numeroALetras(num: number): string {
  num = Math.floor(Math.abs(num || 0));
  if (num === 0) return "Cero pesos";
  const millones = Math.floor(num / 1000000);
  const miles = Math.floor((num % 1000000) / 1000);
  const resto = num % 1000;
  const partes: string[] = [];
  if (millones > 0) partes.push(millones === 1 ? "un millón" : seccion(millones) + " millones");
  if (miles > 0) partes.push(miles === 1 ? "mil" : seccion(miles) + " mil");
  if (resto > 0) partes.push(seccion(resto));
  let texto = partes
    .join(" ")
    .replace(/uno mil/g, "ún mil")
    .replace(/uno millones/g, "ún millones");
  const exactoMillones = millones > 0 && miles === 0 && resto === 0;
  texto += exactoMillones ? " de pesos" : " pesos";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatCOP(n: number): string {
  return "$" + Number(n || 0).toLocaleString("es-CO", { maximumFractionDigits: 0 });
}
