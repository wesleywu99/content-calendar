create extension if not exists pgcrypto;

create type platform        as enum ('xiaohongshu','instagram','facebook');
create type insight_source  as enum ('social','competitor','trend','internal');
create type content_status  as enum ('idea','draft','review','approved');
create type asset_status    as enum ('none','queued','generating','ready','failed');
create type asset_type      as enum ('image','video');
create type flow_run_status as enum ('pending','running','succeeded','failed');

create table insights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source insight_source not null,
  summary text,
  llm_insight text,
  topics text[] default '{}',
  source_url text,
  fingerprint text unique not null,
  captured_at timestamptz,
  created_at timestamptz default now()
);

create table content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform platform not null,
  publish_date date,
  caption text,
  content_status content_status not null default 'draft',
  asset_status asset_status not null default 'none',
  insight_id uuid references insights(id) on delete set null,
  fingerprint text unique not null,
  owner text,
  generated_by text,
  human_edited boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on content_items (publish_date);
create index on content_items (content_status);

create table assets (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  type asset_type not null default 'image',
  url text not null,
  prompt text,
  meta jsonb default '{}',
  fingerprint text unique not null,
  generated_by text,
  created_at timestamptz default now()
);
create index on assets (content_item_id);

create table flow_runs (
  id uuid primary key default gen_random_uuid(),
  flow_key text not null,
  triggered_by text not null,
  cost numeric,
  status flow_run_status not null default 'pending',
  request_meta jsonb default '{}',
  result_meta jsonb default '{}',
  error text,
  started_at timestamptz default now(),
  finished_at timestamptz
);

-- updated_at 自動維護
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger trg_touch before update on content_items
  for each row execute function touch_updated_at();
