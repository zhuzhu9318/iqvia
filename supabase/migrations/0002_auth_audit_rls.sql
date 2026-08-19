-- Sprint 5: owner isolation, read-only demo, and database-enforced audit trail.
alter table datasets add column if not exists is_demo boolean not null default false;
alter table datasets alter column user_id set default auth.uid();
update datasets set is_demo=true where id='a0000000-0000-0000-0000-000000000001';

alter table dataset_columns add column if not exists user_id uuid default auth.uid();
alter table ingredients add column if not exists user_id uuid default auth.uid();
alter table products add column if not exists user_id uuid default auth.uid();
alter table categories add column if not exists user_id uuid default auth.uid();
alter table category_mappings add column if not exists user_id uuid default auth.uid();
alter table sales_observations add column if not exists user_id uuid default auth.uid();
alter table opportunity_scores add column if not exists user_id uuid default auth.uid();
alter table insights add column if not exists user_id uuid default auth.uid();

update dataset_columns c set user_id=d.user_id from datasets d where c.dataset_id=d.id and c.user_id is null;
update ingredients c set user_id=d.user_id from datasets d where c.dataset_id=d.id and c.user_id is null;
update products c set user_id=d.user_id from datasets d where c.dataset_id=d.id and c.user_id is null;
update categories c set user_id=d.user_id from datasets d where c.dataset_id=d.id and c.user_id is null;
update sales_observations c set user_id=d.user_id from datasets d where c.dataset_id=d.id and c.user_id is null;
update opportunity_scores c set user_id=d.user_id from datasets d where c.dataset_id=d.id and c.user_id is null;
update insights c set user_id=d.user_id from datasets d where c.dataset_id=d.id and c.user_id is null;
update category_mappings m set user_id=c.user_id from categories c where m.category_id=c.id and m.user_id is null;

create table if not exists audit_logs(
  id uuid primary key default gen_random_uuid(), user_id uuid default auth.uid(), action text not null,
  actor text not null, tool text not null, dataset_id uuid references datasets(id) on delete cascade,
  detail jsonb not null default '{}'::jsonb, timestamp timestamptz not null default now()
);
alter table audit_logs enable row level security;

do $$ declare t text; begin
  foreach t in array array['datasets','dataset_columns','ingredients','products','categories','category_mappings','sales_observations','opportunity_scores','insights'] loop
    execute format('drop policy if exists %I on %I',t||'_v1_read',t);
    execute format('drop policy if exists %I on %I',t||'_v1_write',t);
    execute format('drop policy if exists %I on %I',t||'_owner_all',t);
    execute format('create policy %I on %I for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid())',t||'_owner_all',t);
  end loop;
end $$;

create policy datasets_demo_read on datasets for select to anon,authenticated using(is_demo);
create policy dataset_columns_demo_read on dataset_columns for select to anon,authenticated using(exists(select 1 from datasets d where d.id=dataset_id and d.is_demo));
create policy ingredients_demo_read on ingredients for select to anon,authenticated using(exists(select 1 from datasets d where d.id=dataset_id and d.is_demo));
create policy products_demo_read on products for select to anon,authenticated using(exists(select 1 from datasets d where d.id=dataset_id and d.is_demo));
create policy categories_demo_read on categories for select to anon,authenticated using(exists(select 1 from datasets d where d.id=dataset_id and d.is_demo));
create policy category_mappings_demo_read on category_mappings for select to anon,authenticated using(exists(select 1 from categories c join datasets d on d.id=c.dataset_id where c.id=category_id and d.is_demo));
create policy sales_observations_demo_read on sales_observations for select to anon,authenticated using(exists(select 1 from datasets d where d.id=dataset_id and d.is_demo));
create policy opportunity_scores_demo_read on opportunity_scores for select to anon,authenticated using(exists(select 1 from datasets d where d.id=dataset_id and d.is_demo));
create policy insights_demo_read on insights for select to anon,authenticated using(exists(select 1 from datasets d where d.id=dataset_id and d.is_demo));
create policy audit_logs_owner_read on audit_logs for select to authenticated using(user_id=auth.uid());

create or replace function audit_state_change() returns trigger language plpgsql security definer set search_path=public as $$
declare did uuid; uid uuid; payload jsonb;
begin
  payload=case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end;
  uid=coalesce((payload->>'user_id')::uuid,auth.uid());
  if tg_table_name='datasets' then did=case when tg_op='DELETE' then null else (payload->>'id')::uuid end;
  elsif tg_table_name='category_mappings' then select dataset_id into did from categories where id=(payload->>'category_id')::uuid;
  else did=(payload->>'dataset_id')::uuid; end if;
  insert into audit_logs(user_id,action,actor,tool,dataset_id,detail) values(uid,lower(tg_op),coalesce(auth.uid()::text,'system'),tg_table_name,did,jsonb_build_object('record_id',payload->>'id'));
  return case when tg_op='DELETE' then old else new end;
end $$;

do $$ declare t text; begin
  foreach t in array array['datasets','dataset_columns','ingredients','products','categories','category_mappings','sales_observations','opportunity_scores','insights'] loop
    execute format('drop trigger if exists audit_%I on %I',t,t);
    execute format('create trigger audit_%I after insert or update or delete on %I for each row execute function audit_state_change()',t,t);
  end loop;
end $$;
