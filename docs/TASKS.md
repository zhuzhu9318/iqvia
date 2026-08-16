# Tasks & Sprints

## Sprint 1 — Ingest & Schema Detection
**Goal**: Upload an IQVIA XLSX, detect columns, persist schema mapping.
- [ ] Create DB schema (migration)
- [ ] `lib/data/` — typed queries for datasets + dataset_columns
- [ ] Upload UI: file picker, parse with SheetJS, show headers + sample rows
- [ ] `lib/ai/detect_schema` — LLM + heuristic column-role detection with confidence
- [ ] Mapping review UI: green (high-confidence), amber (low-confidence, editable)
- [ ] Persist confirmed mappings to dataset_columns
- [ ] Seed demo dataset (4k-row IQVIA-like) with detected columns
**DoD**: Uploaded file appears with detected column roles; user can correct low-confidence mappings and save.

## Sprint 2 — Normalise & Categorise
**Goal**: Structured data in DB; AI-suggested ingredient categories, user-reviewed.
- [ ] `lib/parsing/normalise` — map rows to products, ingredients, sales_observations
- [ ] Ingredient extraction (split multi-molecule text)
- [ ] `lib/ai/suggest_categories` — group ingredients into 2–5 comparison categories
- [ ] Category review UI: edit category names, reassign ingredients, save
- [ ] Portfolio selection UI: flag own products → `is_portfolio`
- [ ] Persist categories, category_mappings, product.is_portfolio
**DoD**: Normalised products/ingredients/sales in DB; categories reviewed and saved; portfolio flagged.

## Sprint 3 — Analytics Engine & Dashboard  ← **v1 FUNCTIONAL MILESTONE (partial)**
**Goal**: Deterministic metrics computed; interactive dashboard renders.
- [ ] `lib/analytics/` — market size, QoQ growth, YoY growth, market share, share change, growth contribution, ranking per category/ingredient/product/corporation/channel
- [ ] Opportunity scoring (attractiveness × penetration gap)
- [ ] Dashboard UI: category overview, ingredient drilldown, product table, company comparison, channel split, quarterly trend charts (Recharts)
- [ ] Opportunity ranking view (sorted by opportunity_score)
**DoD**: Dashboard shows computed metrics from normalised data; every number is deterministic and traceable.

## Sprint 4 — Competitive Intelligence & AI Insights  ← **v1 FUNCTIONAL MILESTONE (complete)**
**Goal**: Competitive analysis + grounded AI insights; full end-to-end works.
- [ ] Competitive view: share-change winners/losers per category
- [ ] Threat detection: competitors gaining share in portfolio categories
- [ ] `lib/ai/synthesise_insights` — LLM writes insights from computed metrics + evidence JSONb
- [ ] Insight list UI with evidence traceability badges
- [ ] End-to-end: Upload → Detect → Categorise → Analyse → Dashboard → Insight
**DoD**: Full success scenario completes; every insight cites computed metric evidence.

## Sprint 5 — Lock It Down
**Goal**: Auth + per-user RLS; app ready for real users.
- [ ] Supabase auth (email/OAuth)
- [ ] Replace permissive RLS with `auth.uid() = user_id` policies
- [ ] User_id populated on all inserts
- [ ] Audit-log enforcement on all state changes
- [ ] Remove demo seed or gate behind demo flag
**DoD**: Anonymous access blocked; each user sees only own datasets; RLS verified.

## Gantt
```
S1: Ingest & Schema      ████
S2: Normalise & Categorise   ████
S3: Analytics & Dashboard        ████
S4: Competitive & Insights          ████
S5: Lock Down                            ████
```
