-- ============================================================
-- ELEVA — Cuentas de Cobro · Esquema Supabase
-- Pega TODO esto en Supabase > SQL Editor > New query > Run
-- ============================================================

-- 1) PERSONAL INTERNO (emisores, datos personales y bancarios)
create table if not exists internos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cedula text not null unique,
  prefijo text not null,
  responsable_iva boolean not null default false,
  direccion text not null default '',
  ciudad text not null default '',
  celular text not null default '',
  email text not null default '',
  banco text not null default '',
  tipo_cuenta text not null default 'Ahorros',
  numero_cuenta text not null default '',
  titular_cuenta text not null default '',
  profesion text not null default '',
  declarante_renta boolean not null default false,
  es_admin boolean not null default false,
  consecutivo integer not null default 1,
  created_at timestamptz not null default now()
);

-- 2) CLIENTES / PROVEEDORES (a quién se cobra)
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  razon_social text not null,
  nit text not null default '',
  direccion text not null default '',
  ciudad text not null default '',
  created_at timestamptz not null default now()
);

-- 3) CATÁLOGO DE SERVICIOS
create table if not exists servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null default '',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4) CUENTAS DE COBRO GENERADAS (historial con snapshot)
create table if not exists cuentas_cobro (
  id uuid primary key default gen_random_uuid(),
  numero text not null,
  interno_id uuid references internos(id) on delete set null,
  cliente_id uuid references clientes(id) on delete set null,
  servicio_id uuid references servicios(id) on delete set null,
  concepto text not null,
  periodo text not null default '',
  valor bigint not null,
  valor_letras text not null,
  fecha date not null,
  snapshot jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SEGURIDAD: RLS activado y SIN políticas para el rol anónimo.
-- Todo el acceso pasa por el servidor (service role key), nunca
-- desde el navegador. La clave de servicio jamás se expone.
-- ============================================================
alter table internos       enable row level security;
alter table clientes       enable row level security;
alter table servicios      enable row level security;
alter table cuentas_cobro  enable row level security;

-- ============================================================
-- DATOS SEMILLA
-- ============================================================
insert into internos (nombre, cedula, prefijo, direccion, ciudad, celular, email,
                      banco, tipo_cuenta, numero_cuenta, titular_cuenta, profesion,
                      declarante_renta, es_admin, consecutivo)
values
  ('ODAIR JOSE GUZMAN PARRA', '1235044301', 'EO', 'Olaya Herrera Kr 52B #38A-51',
   'Medellín', '3104606834', 'odaguzman99@gmail.com', 'Bancolombia', 'Ahorros',
   '787-000031-30', 'Odair Jose Guzman Parra', 'Contador Público', false, true, 1),
  ('PAOLA RIVERA RUEDA', '21482705', 'EP', '', 'Cartagena', '', '',
   '', 'Ahorros', '', 'Paola Rivera Rueda', '', false, false, 1),
  ('KATERINE BALLESTAS ALVAREZ', '1007120952', 'EK', '', 'Cartagena', '', '',
   '', 'Ahorros', '', 'Katerine Ballestas Alvarez', '', false, false, 1),
  ('ANGIE SIMANCAS LARA', '1148948498', 'EA', '', 'Cartagena', '', '',
   '', 'Ahorros', '', 'Angie Simancas Lara', '', false, false, 1)
on conflict (cedula) do nothing;

insert into clientes (razon_social, nit, direccion, ciudad)
values ('THE BOSS CARIBBEAN TRAVEL S.A.S', '901886018-2', 'CR 47 36 A 62 ED INVERSO AP 801', 'Medellín')
on conflict do nothing;

insert into servicios (nombre, descripcion) values
  ('Comercialización y representación de destino', 'Promoción y venta del destino ante agencias y operadores, incluyendo visitas comerciales, presentación de portafolio y cierre de alianzas.'),
  ('Gestión comercial y captación de clientes', 'Búsqueda, contacto y vinculación de nuevas agencias y clientes, con prospección en plaza y en otras ciudades.'),
  ('Desarrollo de canal de distribución', 'Identificación y activación de aliados comerciales para ampliar la red de ventas del destino.'),
  ('Gestión de reservas y conectividad', 'Administración de reservas en línea, apertura y configuración de plataformas de distribución, mapeo de inventario y conexión entre sistemas.'),
  ('Administración de canales de distribución online', 'Configuración, carga y mantenimiento de tarifas e inventario en OTAs y plataformas de venta.'),
  ('Revenue management y gestión de distribución', 'Optimización de tarifas, control de inventario y gestión de canales para maximizar ocupación y utilidad.'),
  ('Asesoría y consultoría', 'Servicio genérico, fiscalmente neutro. Opción por defecto recomendada para CXC personales.')
on conflict do nothing;
