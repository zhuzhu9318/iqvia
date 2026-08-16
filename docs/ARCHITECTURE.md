# Architecture

## Stack
Next.js 15 (App Router) · Supabase (Postgres + RLS) · Vercel · xlsx/SheetJS for Excel parsing · Vercel AI SDK (LLM for schema detection, categorisation, insights) · Recharts for dashboards.

## Layer Plan
1. **Data layer** (`lib/data/`) — all DB reads/writes; typed Supabase queries.
2. **App logic** (`lib/analytics/`) — deterministic engine: aggregation, growth, share, ranking, opportunity scoring. Runs with zero AI.
3. **Intelligence** (`lib/ai/`) — schema detection, ingredient→category suggestion, insight synthesis. Always receives computed values as context; never invents numbers.
4. **UI** (`app/` + `components/`) — screens consume data layer; no inline DB calls.

## Why Core Runs Without AI
The analytics engine is pure deterministic SQL/TS. Schema detection falls back to name-pattern heuristics. Category suggestion degrades to ATC-class fallback. Dashboards render from stored computed metrics.

## Responsive Nav Shell
Left sidebar on desktop (Datasets, Categorisation, Dashboard, Competitive, Insights); collapses to hamburger on mobile. Current section highlighted.

## Key User Action Flow
Upload XLSX → parse headers → AI detects columns (confidence-tagged) → user confirms low-confidence mappings → data normalised into products/ingredients/sales_obs → user selects portfolio products → AI suggests ingredient→category mapping → user reviews/edits → analytics engine computes all metrics → dashboard renders → opportunity + competitive views populate → AI synthesises grounded insights.

## Repo Structure
```
lib/data/          # data-access layer
lib/analytics/     # deterministic engine
lib/ai/            # LLM modules
lib/parsing/       # Excel ingestion
app/datasets/      app/categorisation/  app/dashboard/
app/competitive/   app/insights/
components/        # shared UI
__tests__/          # beside each module
```

## Module Map
| Module | Responsibility | Owns | Build Order |
|---|---|---|---|
| **ingest** | Upload, parse, header detection | datasets, dataset_columns | 1 |
| **schema-map** | AI column detection + user correction | dataset_columns | 1 |
| **normalise** | Persist structured rows | products, ingredients, sales_observations | 2 |
| **categorise** | AI category suggestion + user review | categories, category_mappings | 2 |
| **analytics** | All deterministic calculations | opportunity_scores, stored metrics | 3 |
| **dashboard** | Interactive charts + tables | reads computed metrics | 3 |
| **competitive** | Winner/loser, threat detection | reads analytics outputs | 4 |
| **insights** | AI synthesis from computed values | insights | 4 |
