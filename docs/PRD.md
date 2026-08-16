# IQVIA Market Intelligence & Opportunity Platform — PRD

## Problem
IQVIA sales datasets (Excel/XLSX, ~56 columns, ~4k rows, quarterly) are rich but analysed manually: column identification, cleaning, product grouping, ingredient classification, pivot tables, market-share math, competitor comparison — repeated every export. No automation exists.

## Target User
Pharmaceutical / healthcare market analyst who uploads IQVIA exports and needs structured market intelligence, competitive analysis, and strategic opportunity identification.

## Core Objects
- **Dataset** — uploaded file + detected schema mapping
- **Product** → **Ingredient** — normalized products and their molecule composition
- **Category** — strategic comparison group (ingredient-based)
- **Sales Observation** — entity × period × value/units/CU/DU
- **Corporation** / **Channel** — company and market-channel dimensions
- **Portfolio** — products flagged as the user's own
- **Opportunity Score** — calculated attractiveness + penetration gap
- **Insight** — AI-generated evidence-backed strategic observation

## MVP (v1) Checklist
- [ ] Excel/XLSX upload + header detection
- [ ] Semantic column detection (product, ingredient, company, period, sales metrics) with confidence flags
- [ ] Manual mapping correction for low-confidence fields
- [ ] Data normalisation into structured model
- [ ] Ingredient extraction + AI category suggestion + user review/edit
- [ ] Portfolio selection (own products vs competitors)
- [ ] Deterministic analytics: market size, QoQ/YoY growth, market share, share change, growth contribution, ranking
- [ ] Opportunity scoring (attractiveness × penetration gap)
- [ ] Interactive dashboard: category, ingredient, product, company, channel analysis
- [ ] Competitive intelligence: winners/losers, threat detection
- [ ] AI insights grounded in computed metrics (no invented numbers)
- [ ] Evidence traceability for every insight

## Non-Goals (v1)
- Forecasting, prescriptive ML, CRM integration, real-time monitoring, automated reporting/PowerPoint, multi-tenant enterprise admin, mobile-native, external IQVIA API, automated competitor scraping.

## Success Criteria
A real IQVIA workbook completes **Upload → Detect → Categorise → Analyse → Dashboard → Insight** end-to-end without external spreadsheet work. Every insight cites a computed metric; the analyst can correct category mappings and re-run analytics.
