# Eleva — Generador de Cuentas de Cobro

App web para que el personal interno de Eleva genere sus cuentas de cobro (a título personal).
Stack: **Next.js 14 + TypeScript + Supabase + Vercel**.

---

## Cómo funciona

- **Login solo con cédula.** Cada persona entra con su número de cédula.
- **Cada quien edita su propio perfil** (datos personales y bancarios). Nadie ve los datos de las demás.
- **Primer ingreso:** si el perfil está incompleto, la app obliga a completarlo antes de generar cuentas.
- **Consecutivo automático** por persona (EO-001, EP-001, EK-001, EA-001…).
- **Clientes y servicios** son compartidos por todo el equipo.
- **Bloque legal del Art. 383 condicional:** se oculta si la persona marca que es declarante de renta.
- **Imprimir / Guardar PDF** con el formato exacto de la cuenta de cobro.

> **Seguridad:** la base de datos tiene RLS activado SIN acceso anónimo. Todo pasa por el
> servidor con la *service role key*, que nunca llega al navegador. Aun así, recuerda que el
> login es solo por cédula; si más adelante quieres, se agrega un PIN por persona fácilmente.

---

## Despliegue paso a paso

### Paso 1 — Crear la base de datos en Supabase

1. Entra a https://supabase.com y crea un proyecto nuevo (gratis).
2. En el menú lateral abre **SQL Editor → New query**.
3. Copia y pega **todo** el contenido de `supabase/schema.sql` y dale **Run**.
   - Esto crea las 4 tablas, activa la seguridad (RLS) y carga los datos iniciales
     (las 4 personas, el cliente de ejemplo y los 7 servicios).
4. Ve a **Settings → API** y copia dos valores:
   - **Project URL** → será `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (en "Project API keys", el secreto, NO el anon) → será `SUPABASE_SERVICE_ROLE_KEY`

### Paso 2 — Variables de entorno (local)

1. Copia `.env.local.example` a un archivo nuevo llamado `.env.local`.
2. Rellénalo con tus valores de Supabase y un secreto de sesión:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   (la service_role)
SESSION_SECRET=pega-aqui-un-texto-aleatorio-largo
```

Para generar el `SESSION_SECRET` puedes usar cualquier texto largo aleatorio, o en terminal:
`openssl rand -hex 32`

### Paso 3 — Probar localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y entra con una cédula (por ejemplo la de Odair: `1235044301`).

### Paso 4 — Desplegar en Vercel

**Opción A (recomendada, con GitHub):**
1. Sube esta carpeta a un repositorio en GitHub.
2. En https://vercel.com → **Add New → Project** → importa el repo.
3. En **Environment Variables** agrega las 3 variables del Paso 2
   (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`).
4. **Deploy**.

**Opción B (sin GitHub, con la CLI):**
```bash
npm i -g vercel
vercel            # sigue el asistente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SESSION_SECRET
vercel --prod
```

### Paso 5 — Conectar tu dominio de Hostinger

1. En Vercel: **Project → Settings → Domains → Add** y escribe tu dominio.
2. Vercel te mostrará unos registros DNS.
3. En **Hostinger → tu dominio → DNS / Nameservers**, elige una de dos:
   - **Más simple:** agrega los registros que te indica Vercel (un registro `A` para el dominio
     raíz apuntando a la IP de Vercel, y un `CNAME` para `www` apuntando a `cname.vercel-dns.com`).
   - **O** cambia los *nameservers* de Hostinger por los de Vercel.
4. Espera la propagación (minutos a unas horas). El dominio queda comprado en Hostinger
   pero la app vive en Vercel.

---

## Estructura del proyecto

```
app/
  page.tsx + LoginForm.tsx      → login por cédula
  actions.ts                    → todas las acciones de servidor
  (app)/
    layout.tsx + Nav.tsx        → shell con navegación y guardia de sesión
    generar/                    → generar CXC + vista previa en vivo
    perfil/                     → cada quien edita sus datos
    clientes/                   → CRUD de clientes (compartido)
    servicios/                  → catálogo de servicios
lib/
  supabase.ts                   → cliente con service role (solo servidor)
  session.ts                    → sesión por cookie firmada (HMAC)
  numero.ts                     → número a letras (es-CO)
  periodo.ts                    → meses y quincenas
  types.ts                      → tipos TypeScript
supabase/
  schema.sql                    → esquema + datos semilla
```

---

## Pendientes / siguientes pasos

- Reemplazar la marca por la identidad real de Eleva (colores, logo, monograma).
- (Opcional) Agregar PIN por persona al login.
- (Opcional) Pantalla de historial de cuentas de cobro generadas (la tabla `cuentas_cobro`
  ya guarda todo con snapshot).
- Datos bancarios de Paola, Katerine y Angie: cada una los completa al entrar.
