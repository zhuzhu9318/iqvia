# Agentic Layer

## Risk Levels

### Low — Auto-execute
- **Schema detection**: AI proposes column mappings (confidence-tagged, user confirms low-confidence only)
- **Ingredient parsing**: split multi-ingredient text fields
- **Category suggestion**: AI proposes ingredient→category groupings
- **Insight drafting**: AI writes summary from computed metrics
- **Opportunity tagging**: auto-label categories as attractive/underpenetrated

### Medium — Draft then approve
- **Category finalisation**: user reviews/edits AI-suggested categories before analytics run
- **Portfolio selection**: user confirms which products are own-company
- **Insight publication**: drafted insights surface for user review before display

### High — Always approval
- **Dataset deletion**: removing uploaded data permanently
- **Category override**: manually reassigning ingredients (changes all downstream analytics)

### Critical — Human-only
- **Strategic decision export**: no autonomous distribution of recommendations outside the platform

## Named Tools
- `detect_schema(columns[]) → mapping` (low)
- `suggest_categories(ingredients[]) → categories` (low)
- `draft_insight(metrics{}) → insight` (low)
- `normalise_data(dataset_id) → rows` (medium — requires mapped columns)
- `compute_analytics(dataset_id) → scores` (medium — requires categorisation)
- `delete_dataset(dataset_id)` (high)

## Audit-Log Fields
`action` text · `actor` text (user_id or system) · `tool` text · `dataset_id` uuid · `detail` jsonb · `timestamp` timestamptz

## v1 vs Later
- v1: all low + medium actions above
- Later: scheduled re-analysis, alert generation, insight distribution (high/critical)
