# Intelligence Layer

## Messy Inputs
- IQVIA XLSX: unknown column names/order, varying period ranges, mixed metric availability.
- Ingredient columns may be free-text (e.g. "Paracetamol; Caffeine; Codeine").

## Auto-Structure Schema (JSON)
```json
{
  "detected_columns": [
    {"source": "Product", "role": "product_name", "confidence": 0.98, "source": "heuristic"},
    {"source": "Molecule", "role": "ingredient", "confidence": 0.95, "source": "ai"},
    {"source": "Corp", "role": "corporation", "confidence": 0.90, "source": "ai"},
    {"source": "Value (LC) Q4 2023", "role": "sales_metric", "sub_role": "value", "period": "Q4-2023", "confidence": 0.88, "source": "ai"}
  ],
  "low_confidence": [{"source": "Col_X", "role": "unknown", "confidence": 0.30}]
}
```

## Events Tracked
- `dataset.uploaded` · `columns.detected` · `mapping.confirmed` · `data.normalised` · `categories.suggested` · `categories.reviewed` · `analytics.computed` · `insight.generated`

## Scoring Rules (deterministic, rule-based v1)
**Attractiveness** = normalised(market_value) × 0.4 + normalised(market_growth) × 0.6
**Penetration Gap** = (1 − portfolio_share) where portfolio_share > 0; = 1.0 where absent
**Opportunity Score** = attractiveness × penetration_gap

## What Gets Ranked
- Categories by opportunity_score (desc)
- Products by market_share within category
- Corporations by share change (winners/losers)

## v1 vs Later
- v1: rule-based scoring, LLM for schema detection + category suggestion + insight synthesis
- Later: trend-prediction, custom scoring weights, cross-dataset comparison
