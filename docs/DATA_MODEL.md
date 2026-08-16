# Data Model

## datasets
- `id` uuid PK · `user_id` uuid nullable · `filename` text · `row_count` int · `column_count` int · `period_start` text · `period_end` text · `status` text (uploaded/detected/normalised/analysed) · `created_at` timestamptz

## dataset_columns
- `id` uuid PK · `dataset_id` uuid → datasets · `source_column` text · `detected_role` text · `confidence` numeric · `review_status` text default 'unreviewed' · `source` text (ai/heuristic/user) · `confirmed_by_user` bool · `created_at` timestamptz

## ingredients
- `id` uuid PK · `dataset_id` uuid → datasets · `name` text · `source` text · `confidence` numeric · `review_status` text default 'unreviewed'

## products
- `id` uuid PK · `dataset_id` uuid → datasets · `name` text · `ingredient_id` uuid → ingredients · `corporation` text · `manufacturer` text · `channel` text · `sub_channel` text · `atc1`–`atc4` text · `nfc1`–`nfc3` text · `is_portfolio` bool default false

## categories
- `id` uuid PK · `dataset_id` uuid → datasets · `name` text · `description` text · `source` text (ai/user) · `confidence` numeric · `review_status` text default 'unreviewed'

## category_mappings
- `id` uuid PK · `category_id` uuid → categories · `ingredient_id` uuid → ingredients · `review_status` text default 'unreviewed'

## sales_observations
- `id` uuid PK · `dataset_id` uuid → datasets · `product_id` uuid → products · `period` text (e.g. Q4-2023) · `value` numeric · `units` numeric · `cu` numeric · `du` numeric · `created_at` timestamptz

## opportunity_scores
- `id` uuid PK · `dataset_id` uuid → datasets · `category_id` uuid → categories · `market_value` numeric · `market_growth` numeric · `portfolio_share` numeric · `attractiveness_score` numeric · `penetration_gap` numeric · `opportunity_score` numeric · `source` text (engine) · `review_status` text default 'unreviewed'

## insights
- `id` uuid PK · `dataset_id` uuid → datasets · `type` text (opportunity/threat/trend/competitive) · `summary` text · `evidence` jsonb (computed metric references) · `source` text (ai) · `confidence` numeric · `review_status` text default 'unreviewed' · `created_at` timestamptz

## RLS Notes
All tables RLS-enabled. v1: permissive policies (read/write true) for demo. Lock-down sprint: `auth.uid() = user_id`.
