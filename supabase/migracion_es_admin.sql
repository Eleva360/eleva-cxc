-- ============================================================
-- MIGRACIÓN: agregar columna es_admin (administrador)
-- Pega esto en Supabase > SQL Editor > New query > Run
-- ============================================================

alter table internos
  add column if not exists es_admin boolean not null default false;

-- Marca a Odair (rep. legal) como administrador
update internos set es_admin = true where cedula = '1235044301';
