alter table insights      enable row level security;
alter table content_items enable row level security;
alter table assets        enable row level security;
alter table flow_runs     enable row level security;

-- 已登入使用者（authenticated）可讀寫全部；服務金鑰（n8n flow）繞過 RLS
create policy "auth read content"  on content_items for select to authenticated using (true);
create policy "auth write content" on content_items for all    to authenticated using (true) with check (true);
create policy "auth read insights" on insights      for select to authenticated using (true);
create policy "auth read assets"   on assets        for select to authenticated using (true);
create policy "auth read runs"     on flow_runs     for select to authenticated using (true);
create policy "auth write runs"    on flow_runs     for all    to authenticated using (true) with check (true);
