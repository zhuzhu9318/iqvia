create table if not exists datasets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  filename text not null,
  row_count int,
  column_count int,
  period_start text,
  period_end text,
  status text default 'uploaded',
  created_at timestamptz not null default now()
);

create table if not exists dataset_columns (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references datasets(id) on delete cascade,
  source_column text not null,
  detected_role text,
  confidence numeric,
  review_status text default 'unreviewed',
  source text default 'heuristic',
  confirmed_by_user boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references datasets(id) on delete cascade,
  name text not null,
  source text,
  confidence numeric,
  review_status text default 'unreviewed'
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references datasets(id) on delete cascade,
  name text not null,
  ingredient_id uuid references ingredients(id) on delete set null,
  corporation text,
  manufacturer text,
  channel text,
  sub_channel text,
  atc1 text,
  atc2 text,
  atc3 text,
  atc4 text,
  nfc1 text,
  nfc2 text,
  nfc3 text,
  is_portfolio boolean default false
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references datasets(id) on delete cascade,
  name text not null,
  description text,
  source text,
  confidence numeric,
  review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists category_mappings (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists sales_observations (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references datasets(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  period text not null,
  value numeric,
  units numeric,
  cu numeric,
  du numeric,
  created_at timestamptz not null default now()
);

create table if not exists opportunity_scores (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references datasets(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  market_value numeric,
  market_growth numeric,
  portfolio_share numeric,
  attractiveness_score numeric,
  penetration_gap numeric,
  opportunity_score numeric,
  source text default 'engine',
  review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists insights (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references datasets(id) on delete cascade,
  type text,
  summary text,
  evidence jsonb,
  source text default 'ai',
  confidence numeric,
  review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

-- RLS: enable on all tables
alter table datasets enable row level security;
alter table dataset_columns enable row level security;
alter table ingredients enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table category_mappings enable row level security;
alter table sales_observations enable row level security;
alter table opportunity_scores enable row level security;
alter table insights enable row level security;

-- Permissive v1 policies (demo without login)
drop policy if exists "datasets_v1_read" on datasets; create policy "datasets_v1_read" on datasets for select using (true);
drop policy if exists "datasets_v1_write" on datasets; create policy "datasets_v1_write" on datasets for all using (true) with check (true);
drop policy if exists "dataset_columns_v1_read" on dataset_columns; create policy "dataset_columns_v1_read" on dataset_columns for select using (true);
drop policy if exists "dataset_columns_v1_write" on dataset_columns; create policy "dataset_columns_v1_write" on dataset_columns for all using (true) with check (true);
drop policy if exists "ingredients_v1_read" on ingredients; create policy "ingredients_v1_read" on ingredients for select using (true);
drop policy if exists "ingredients_v1_write" on ingredients; create policy "ingredients_v1_write" on ingredients for all using (true) with check (true);
drop policy if exists "products_v1_read" on products; create policy "products_v1_read" on products for select using (true);
drop policy if exists "products_v1_write" on products; create policy "products_v1_write" on products for all using (true) with check (true);
drop policy if exists "categories_v1_read" on categories; create policy "categories_v1_read" on categories for select using (true);
drop policy if exists "categories_v1_write" on categories; create policy "categories_v1_write" on categories for all using (true) with check (true);
drop policy if exists "category_mappings_v1_read" on category_mappings; create policy "category_mappings_v1_read" on category_mappings for select using (true);
drop policy if exists "category_mappings_v1_write" on category_mappings; create policy "category_mappings_v1_write" on category_mappings for all using (true) with check (true);
drop policy if exists "sales_observations_v1_read" on sales_observations; create policy "sales_observations_v1_read" on sales_observations for select using (true);
drop policy if exists "sales_observations_v1_write" on sales_observations; create policy "sales_observations_v1_write" on sales_observations for all using (true) with check (true);
drop policy if exists "opportunity_scores_v1_read" on opportunity_scores; create policy "opportunity_scores_v1_read" on opportunity_scores for select using (true);
drop policy if exists "opportunity_scores_v1_write" on opportunity_scores; create policy "opportunity_scores_v1_write" on opportunity_scores for all using (true) with check (true);
drop policy if exists "insights_v1_read" on insights; create policy "insights_v1_read" on insights for select using (true);
drop policy if exists "insights_v1_write" on insights; create policy "insights_v1_write" on insights for all using (true) with check (true);

-- Seed demo data
insert into datasets (id, filename, row_count, column_count, period_start, period_end, status)
values ('a0000000-0000-0000-0000-000000000001', 'IQVIA_Region_Q4-2023_to_Q3-2025.xlsx', 4307, 56, 'Q4-2023', 'Q3-2025', 'analysed')
on conflict (id) do nothing;

insert into dataset_columns (dataset_id, source_column, detected_role, confidence, source, confirmed_by_user)
select 'a0000000-0000-0000-0000-000000000001', v.source_column, v.detected_role, v.confidence, v.source, true
from (values
  ('a0000000-0000-0000-0000-000000000001', 'Product', 'product_name', 0.98, 'heuristic'),
  ('a0000000-0000-0000-0000-000000000001', 'Molecule', 'ingredient', 0.95, 'ai'),
  ('a0000000-0000-0000-0000-000000000001', 'Corporation', 'corporation', 0.90, 'ai'),
  ('a0000000-0000-0000-0000-000000000001', 'Channel', 'channel', 0.96, 'heuristic'),
  ('a0000000-0000-0000-0000-000000000001', 'Sub Channel', 'sub_channel', 0.92, 'ai'),
  ('a0000000-0000-0000-0000-000000000001', 'ATC1', 'atc1', 0.94, 'heuristic'),
  ('a0000000-0000-0000-0000-000000000001', 'ATC2', 'atc2', 0.93, 'heuristic'),
  ('a0000000-0000-0000-0000-000000000001', 'Value (LC) Q4 2023', 'sales_metric', 0.88, 'ai')
) as v(dataset_id, source_column, detected_role, confidence, source)
where not exists (select 1 from dataset_columns where dataset_id = 'a0000000-0000-0000-0000-000000000001' and source_column = v.source_column);

insert into ingredients (id, dataset_id, name, source, confidence, review_status)
values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Metformin', 'ai', 0.97, 'reviewed'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Sitagliptin', 'ai', 0.95, 'reviewed'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Empagliflozin', 'ai', 0.93, 'reviewed'),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Atorvastatin', 'ai', 0.96, 'reviewed'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Rosuvastatin', 'ai', 0.94, 'reviewed')
on conflict (id) do nothing;

insert into categories (id, dataset_id, name, description, source, confidence, review_status)
values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Diabetes - Oral Antidiabetics', 'Metformin-based and DPP-4/SGLT2 combinations', 'ai', 0.90, 'reviewed'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Lipid Modifiers - Statins', 'HMG-CoA reductase inhibitors', 'ai', 0.88, 'reviewed')
on conflict (id) do nothing;

insert into category_mappings (category_id, ingredient_id, review_status)
values
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'reviewed'),
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'reviewed'),
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'reviewed'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'reviewed'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'reviewed')
on conflict do nothing;

insert into products (id, dataset_id, name, ingredient_id, corporation, manufacturer, channel, sub_channel, is_portfolio)
values
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Glucophage XR', 'b0000000-0000-0000-0000-000000000001', 'Merck', 'Merck Serono', 'Retail', 'Pharmacy Chain', true),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Januvia', 'b0000000-0000-0000-0000-000000000002', 'Merck', 'Merck Sharp Dohme', 'Retail', 'Pharmacy Chain', true),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Jardiance', 'b0000000-0000-0000-0000-000000000003', 'Boehringer', 'Boehringer Ingelheim', 'Retail', 'Independent Pharmacy', false),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Lipitor', 'b0000000-0000-0000-0000-000000000004', 'Pfizer', 'Pfizer Manufacturing', 'Hospital', 'Hospital Pharmacy', false),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Crestor', 'b0000000-0000-0000-0000-000000000005', 'AstraZeneca', 'AstraZeneca AB', 'Retail', 'Pharmacy Chain', false)
on conflict (id) do nothing;

insert into sales_observations (dataset_id, product_id, period, value, units, cu, du)
select 'a0000000-0000-0000-0000-000000000001', p.id, v.period, v.value, v.units, v.cu, v.du
from (values
  ('d0000000-0000-0000-0000-000000000001', 'Q4-2023', 1200000, 80000, 15.0, 12000),
  ('d0000000-0000-0000-0000-000000000001', 'Q1-2024', 1280000, 85000, 15.1, 12750),
  ('d0000000-0000-0000-0000-000000000001', 'Q2-2024', 1350000, 88000, 15.3, 13200),
  ('d0000000-0000-0000-0000-000000000002', 'Q4-2023', 2100000, 42000, 50.0, 8400),
  ('d0000000-0000-0000-0000-000000000002', 'Q1-2024', 2250000, 45000, 50.0, 9000),
  ('d0000000-0000-0000-0000-000000000003', 'Q4-2023', 980000, 14000, 70.0, 2800),
  ('d0000000-0000-0000-0000-000000000003', 'Q1-2024', 1100000, 15500, 71.0, 3100),
  ('d0000000-0000-0000-0000-000000000004', 'Q4-2023', 3400000, 170000, 20.0, 17000),
  ('d0000000-0000-0000-0000-000000000004', 'Q1-2024', 3520000, 175000, 20.1, 17500),
  ('d0000000-0000-0000-0000-000000000005', 'Q4-2023', 2900000, 145000, 20.0, 14500),
  ('d0000000-0000-0000-0000-000000000005', 'Q1-2024', 3050000, 152000, 20.1, 15200)
) as v(product_id, period, value, units, cu, du)
join products p on p.id::text = v.product_id
where not exists (
  select 1 from sales_observations so
  where so.dataset_id = 'a0000000-0000-0000-0000-000000000001'
    and so.product_id = p.id
    and so.period = v.period
);

insert into opportunity_scores (dataset_id, category_id, market_value, market_growth, portfolio_share, attractiveness_score, penetration_gap, opportunity_score)
values
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 9980000, 7.2, 0.354, 0.82, 0.646, 0.53),
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 9970000, 4.8, 0.0, 0.68, 1.0, 0.68)
on conflict do nothing;

insert into insights (dataset_id, type, summary, evidence, source, confidence, review_status)
values
  ('a0000000-0000-0000-0000-000000000001', 'opportunity', 'Lipid Modifiers - Statins category shows strong market value (€9.97M) with zero portfolio presence — highest penetration gap in the dataset.', '{"market_value": 9970000, "portfolio_share": 0, "opportunity_score": 0.68}'::jsonb, 'ai', 0.92, 'reviewed'),
  ('a0000000-0000-0000-0000-000000000001', 'threat', 'Jardiance (Boehringer) gained 12% share in the Diabetes - Oral Antidiabetics category while portfolio products remained flat.', '{"competitor": "Boehringer", "share_change": 0.12, "category": "Diabetes - Oral Antidiabetics"}'::jsonb, 'ai', 0.88, 'reviewed')
on conflict do nothing;