-- =====================================================================
-- SCHEMA DO SALÃO. Rode no Supabase: SQL Editor > New query > Run.
-- =====================================================================
create extension if not exists btree_gist;
create extension if not exists pgcrypto;

create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome varchar(120) not null,
  telefone varchar(20) not null unique,
  criado_em timestamptz not null default now()
);

create table profissionais (
  id uuid primary key default gen_random_uuid(),
  nome varchar(120) not null,
  descricao text not null default '',
  especialidades text not null default '',
  foto_url text,
  ativo boolean not null default true
);

create table servicos (
  id uuid primary key default gen_random_uuid(),
  nome varchar(120) not null,
  descricao text not null default '',
  preco numeric(10,2) not null check (preco >= 0),
  duracao_minutos integer not null check (duracao_minutos between 10 and 480),
  ativo boolean not null default true
);

create table profissional_servicos (
  profissional_id uuid not null references profissionais(id) on delete cascade,
  servico_id uuid not null references servicos(id) on delete cascade,
  primary key (profissional_id, servico_id)
);

create table expediente (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  dia_semana integer not null check (dia_semana between 0 and 6), -- 0=domingo
  abertura time not null,
  fechamento time not null,
  ativo boolean not null default true,
  check (fechamento > abertura)
);

create table bloqueios (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id) on delete cascade,
  data date not null,
  horario_inicio time not null,
  horario_fim time not null,
  motivo text,
  check (horario_fim > horario_inicio)
);

create table agendamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id),
  profissional_id uuid not null references profissionais(id),
  servico_id uuid not null references servicos(id),
  data date not null,
  horario_inicio time not null,
  horario_fim time not null,
  status varchar(20) not null default 'pendente'
    check (status in ('pendente','confirmado','cancelado')),
  origem varchar(20) not null default 'site'
    check (origem in ('site','whatsapp','admin')),
  criado_em timestamptz not null default now(),
  check (horario_fim > horario_inicio),
  -- BLOQUEIA SOBREPOSIÇÃO, mesmo com reservas simultâneas:
  constraint sem_sobreposicao exclude using gist (
    profissional_id with =,
    tsrange(data + horario_inicio, data + horario_fim) with &&
  ) where (status <> 'cancelado')
);

create table admins (user_id uuid primary key references auth.users(id) on delete cascade);

create index on agendamentos (data, profissional_id);
create index on expediente (profissional_id, dia_semana);
create index on bloqueios (profissional_id, data);

-- ---------- Função de reserva (roda no servidor, de forma atômica) ----------
create or replace function criar_agendamento(
  p_nome text, p_telefone text, p_profissional uuid, p_servico uuid,
  p_data date, p_inicio time
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_dur int; v_fim time; v_cliente uuid; v_id uuid;
begin
  select duracao_minutos into v_dur from servicos where id = p_servico and ativo;
  if v_dur is null then raise exception 'SERVICO_INVALIDO'; end if;
  if not exists (select 1 from profissionais where id = p_profissional and ativo)
     or not exists (select 1 from profissional_servicos where profissional_id = p_profissional and servico_id = p_servico)
  then raise exception 'PROFISSIONAL_INVALIDO'; end if;

  v_fim := p_inicio + make_interval(mins => v_dur);
  if v_fim <= p_inicio then raise exception 'HORARIO_INVALIDO'; end if;

  if not exists (
    select 1 from expediente
    where profissional_id = p_profissional and ativo
      and dia_semana = extract(dow from p_data)::int
      and p_inicio >= abertura and v_fim <= fechamento
  ) then raise exception 'FORA_DO_EXPEDIENTE'; end if;

  if exists (
    select 1 from bloqueios
    where profissional_id = p_profissional and data = p_data
      and p_inicio < horario_fim and v_fim > horario_inicio
  ) then raise exception 'HORARIO_BLOQUEADO'; end if;

  insert into clientes (nome, telefone) values (p_nome, p_telefone)
  on conflict (telefone) do update set nome = excluded.nome
  returning id into v_cliente;

  begin
    insert into agendamentos (cliente_id, profissional_id, servico_id, data, horario_inicio, horario_fim)
    values (v_cliente, p_profissional, p_servico, p_data, p_inicio, v_fim)
    returning id into v_id;
  exception when exclusion_violation then
    raise exception 'HORARIO_OCUPADO';
  end;
  return v_id;
end $$;

revoke all on function criar_agendamento from public, anon, authenticated;
grant execute on function criar_agendamento to service_role;

-- ---------- RLS ----------
create or replace function is_admin() returns boolean
language sql security definer set search_path = public stable as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

alter table clientes enable row level security;
alter table profissionais enable row level security;
alter table servicos enable row level security;
alter table profissional_servicos enable row level security;
alter table expediente enable row level security;
alter table bloqueios enable row level security;
alter table agendamentos enable row level security;
alter table admins enable row level security;

-- Público: só lê o catálogo ativo
create policy "publico le servicos" on servicos for select using (ativo);
create policy "publico le profissionais" on profissionais for select using (ativo);
create policy "publico le vinculos" on profissional_servicos for select using (true);
create policy "publico le expediente" on expediente for select using (ativo);

-- Admin: acesso total
create policy "admin servicos" on servicos for all using (is_admin()) with check (is_admin());
create policy "admin profissionais" on profissionais for all using (is_admin()) with check (is_admin());
create policy "admin vinculos" on profissional_servicos for all using (is_admin()) with check (is_admin());
create policy "admin expediente" on expediente for all using (is_admin()) with check (is_admin());
create policy "admin bloqueios" on bloqueios for all using (is_admin()) with check (is_admin());
create policy "admin clientes" on clientes for all using (is_admin()) with check (is_admin());
create policy "admin agendamentos" on agendamentos for all using (is_admin()) with check (is_admin());
create policy "admin le o proprio registro" on admins for select using (user_id = auth.uid());
-- clientes, agendamentos e bloqueios NÃO têm política pública: ficam invisíveis ao público.
