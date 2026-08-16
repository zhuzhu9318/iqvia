# Product Requirements Document

## IQVIA Market Intelligence & Opportunity Platform

**Version:** 1.0  
**Status:** Draft for Product Development  
**Product Type:** Web-based Market Intelligence & Decision-Support Platform  
**Primary Data Source:** User-uploaded IQVIA datasets  
**Initial Data Format:** Excel / XLSX, with CSV support recommended  
**PRD Date:** August 2026

---

# 1. Executive Summary

The IQVIA Market Intelligence & Opportunity Platform is a web-based analytics platform designed to transform uploaded IQVIA sales datasets into structured market intelligence, interactive dashboards, competitive analysis, penetration opportunities, and AI-assisted strategic insights.

The platform addresses a common problem with IQVIA data: although the dataset contains substantial market information, meaningful analysis often requires repeated manual work involving Excel cleaning, column identification, product grouping, ingredient classification, pivot tables, market-share calculations, competitor comparisons, and interpretation.

The platform will automate this workflow.

The intended experience is:

```text
Upload IQVIA Dataset
        ↓
Automatically Understand Dataset
        ↓
Detect Product / Ingredient / Company / Period / Sales Fields
        ↓
Normalise Data
        ↓
Identify User's Portfolio
        ↓
AI Categorises Ingredients
        ↓
User Reviews Categories
        ↓
Select 2–5 Comparison Categories
        ↓
Analytics Engine
        ↓
Interactive Dashboard
        ↓
Market Opportunity Analysis
        ↓
Penetration Analysis
        ↓
Competitive Intelligence
        ↓
AI Strategic Insights
```

The platform's central business question is:

> **Where should we focus to grow our existing products, penetrate attractive market segments, and respond to competitive threats?**

AI will assist with semantic interpretation, categorisation, pattern explanation, and strategic synthesis.

However, AI will **not** be the source of truth for numerical calculations.

All sales, growth, share, ranking, contribution, and scoring calculations must be performed deterministically by the analytics engine before being provided to the AI insight layer.

---

# 2. Product Foundation

## 2.1 What Are We Building?

A market intelligence platform that accepts different IQVIA sales-data exports, automatically understands their structure, categorises products based primarily on ingredient/molecule information, calculates market-performance metrics, and generates dashboards and strategic insights.

### Current State

IQVIA datasets are analysed manually using spreadsheets, pivot tables, charts, filters, and analyst interpretation.

### Painful / Repetitive Problem

Users repeatedly need to:

- Understand the structure of each IQVIA export
- Identify relevant columns
- Clean data
- Identify products
- Identify ingredients
- Group products into meaningful categories
- Separate own products from competitors
- Calculate market size
- Calculate growth
- Calculate market share
- Compare quarters
- Identify market winners and losers
- Analyse channels
- Analyse competitors
- Identify penetration opportunities
- Build dashboards
- Interpret results
- Translate analysis into strategic recommendations

### Proposed Product

A platform automating the journey from:

**Raw IQVIA data → structured market → analytics → opportunity identification → strategic insight**

### One-Sentence Product Definition

> **We are building an intelligent market analytics platform that transforms uploaded IQVIA datasets into automatically structured market categories, interactive dashboards, competitive intelligence, and evidence-based recommendations about where existing products should focus and penetrate.**

---

# 3. Who Uses It Day-to-Day?

## Primary User

A person responsible for analysing pharmaceutical, healthcare, consumer-health, or related market performance using IQVIA data.

Typical activities include:

- Uploading datasets
- Reviewing product categorisation
- Selecting own portfolio
- Comparing market segments
- Reviewing dashboards
- Identifying opportunities
- Investigating competitors
- Generating strategic insights

## Secondary Users

Managers or decision-makers reviewing market opportunities and competitive performance.

## Future Users

Potential future user groups may include:

- Product teams
- Brand teams
- Commercial teams
- Market intelligence teams
- Strategy teams
- Sales leadership
- Business development teams

V1 will not depend on role-specific workflows.

---

# 4. What "Things" Does the Platform Track?

The core conceptual model is:

```text
Dataset
   │
   ├── Market
   │
   ├── Channel
   │      └── Sub-channel
   │
   ├── Category
   │      └── Ingredient / Molecule
   │             └── Product
   │                    └── Pack
   │
   ├── Corporation
   │      └── Manufacturer
   │
   └── Sales Observation
          ├── Period
          ├── Value
          ├── Units
          ├── CU
          └── DU
```

## Core Entities

| Entity | Purpose |
|---|---|
| Dataset | Represents each uploaded IQVIA dataset |
| Dataset Schema | Stores detected column mappings |
| Product | Individual marketed product |
| Pack | Product-pack presentation |
| Ingredient | Molecule/ingredient composition |
| Category | AI/user-defined strategic comparison group |
| ATC | Existing therapeutic classification |
| NFC | Product/form classification |
| Corporation | Commercial owner |
| Manufacturer | Manufacturer information |
| Channel | High-level market channel |
| Sub-channel | Detailed market segment |
| Period | Quarter/time period |
| Sales Observation | Sales metrics for entity-period combinations |
| Portfolio | Products identified as belonging to the user's organisation |
| Competitor | Non-portfolio companies/products |
| Category Mapping | Ingredient-to-category relationship |
| Insight | Generated analytical observation |
| Recommendation | Strategic recommendation/investigation |
| Opportunity Score | Calculated market opportunity measure |

---

# 5. Reference Dataset

The supplied reference IQVIA workbook contains approximately:

- 4,307 data rows
- 56 columns
- Quarterly observations from Q4 2023 through Q3 2025

Example dimensions include:

- Channel
- Sub Channel
- ATC1–ATC4
- NFC1–NFC3
- Ethical Status
- Generic Flag
- Product launch information
- Molecule/ingredient
- Pack form
- Pack size
- Pack strength
- Corporation
- Product
- Pack
- Manufacturer

Example quarterly metrics include:

- Units
- CU
- DU
- Value (LC)

This schema is a **reference example only**.

The product must not assume future IQVIA files use identical column names, ordering, period ranges, or metric availability.

---

# 6. Core Product Principle

The product must separate:

## Deterministic Analytics

Responsible for:

- Aggregation
- Sales calculations
- Growth calculations
- Market share
- Share change
- Ranking
- Contribution
- Opportunity scoring
- Trend calculations

from:

## AI Intelligence

Responsible for:

- Schema interpretation
- Semantic column identification
- Ingredient interpretation
- Category suggestions
- Pattern explanation
- Insight summarisation
- Strategic interpretation

The LLM must never independently calculate or invent market numbers when deterministic values are available.

---

# 7. One Core End-to-End Workflow

If only one workflow works completely in V1, it must be:

```text
Upload IQVIA File
        ↓
System Understands Dataset
        ↓
System Maps Required Columns
        ↓
User Confirms Ambiguous Mapping
        ↓
Data Normalised
        ↓
User Identifies Own Portfolio
        ↓
AI Analyses Ingredients
        ↓
AI Suggests Categories
        ↓
User Reviews / Corrects Categories
        ↓
System Calculates Market Metrics
        ↓
Dashboard Generated
        ↓
Opportunity Analysis Generated
        ↓
Competitive Analysis Generated
        ↓
AI Explains Key Findings
```

---

# 8. Product Objectives

## Objective 1 — Reduce Manual Analysis

Reduce repetitive spreadsheet work required to convert IQVIA exports into market analysis.

## Objective 2 — Universal IQVIA Ingestion

Support IQVIA datasets with different column names and structures through intelligent schema detection.

## Objective 3 — Intelligent Market Structuring

Automatically organise products into commercially meaningful categories using ingredients as the primary classification signal.

## Objective 4 — Opportunity Identification

Identify attractive market categories and segments.

## Objective 5 — Penetration Analysis

Identify where existing products are underrepresented relative to market opportunity.

## Objective 6 — Competitive Intelligence

Identify competitors gaining or losing market position.

## Objective 7 — Strategic Interpretation

Convert analytical findings into concise, evidence-based strategic insights.

---

# 9. Success Metrics

## 9.1 One-Week Prototype Success

The prototype succeeds if a real IQVIA workbook can move through:

**Upload → Detect → Categorise → Analyse → Dashboard → Insight**

without manually rebuilding the dataset externally.

## 9.2 Functional Success

- File successfully ingested
- Required dimensions identified
- Quarterly periods identified
- Sales metrics identified
- Ingredients identified
- Categories generated
- User can correct categorisation
- Dashboard generated
- Market metrics calculated correctly
- Own products distinguished from competitors
- Strategic insights reference calculated evidence

## 9.3 Quality Metrics

Initial targets:

- ≥95% successful ingestion for supported IQVIA templates after configuration
- ≥95% correct identification of high-confidence standard fields
- 100% numerical traceability for generated insights
- 0 unsupported numerical claims presented as facts
- 100% low-confidence schema mappings surfaced for user review

These targets should be validated during development.

---

# 10. Scope

## P0 — V1 Must Have

- Excel upload
- Dataset inspection
- Header detection
- Semantic column detection
- Quarterly-period detection
- Metric detection
- Mapping confidence
- Manual mapping correction
- Data validation
- Data normalisation
- Ingredient identification
- AI category generation
- Category review/editing
- Saved category mapping
- Own-company/portfolio selection
- Competitor identification
- 2–5 category comparison
- Market overview dashboard
- Category analysis
- Ingredient analysis
- Product analysis
- Company analysis
- Channel analysis
- Sub-channel analysis
- Quarterly trend analysis
- QoQ calculations
- YoY calculations where sufficient history exists
- Market-share calculations
- Share-change calculations
- Growth-contribution calculations
- Market attractiveness
- Penetration opportunity
- Competitive threat analysis
- AI insights
- Evidence traceability

## P1 — Should Have

- CSV support
- Saved analyses
- Multiple dataset history
- Reusable organisation portfolio
- Advanced filtering
- Export tables
- Export charts
- Insight history
- Comparison between uploads
- Saved dashboard views

## P2 — Later

- Automated reporting
- PowerPoint generation
- PDF executive reports
- Collaboration
- Comments
- Scheduled analyses
- Automated alerts
- Email distribution
- Custom scoring models

---

# 11. Explicitly Out of Scope for V1

V1 will NOT include:

- Sales forecasting
- Demand forecasting
- Autonomous business decisions
- Autonomous product-launch recommendations
- CRM integration
- Sales-force automation
- Territory/HCP-level targeting
- External IQVIA API integration
- Mobile native application
- Complex enterprise permissions
- Multi-tenant enterprise administration
- Automated PowerPoint generation
- Prescriptive clinical recommendations
- Complex predictive ML models
- Automated promotional-budget allocation
- Automated competitor scraping
- Real-time market monitoring

These features must not be introduced into V1 by the AI development process unless scope is explicitly changed.

---

# 12. Functional Architecture

The product should consist conceptually of six engines:

```text
1. DATA INGESTION ENGINE
          ↓
2. SCHEMA INTELLIGENCE ENGINE
          ↓
3. MARKET STRUCTURING ENGINE
          ↓
4. ANALYTICS ENGINE
          ↓
5. OPPORTUNITY ENGINE
          ↓
6. AI INSIGHT ENGINE
```

---

# 13. Feature 1 — Data Upload

## Purpose

Allow users to upload IQVIA datasets without manually reformatting them into a predefined template.

## Functional Requirements

**FR-001** — The system shall allow users to upload supported spreadsheet files.

**FR-002** — The system shall preserve the original uploaded file for audit/reference purposes where permitted.

**FR-003** — The system shall inspect available worksheets.

**FR-004** — The system shall identify likely data-containing worksheets.

**FR-005** — The system shall identify the probable header row.

**FR-006** — The system shall detect blank, duplicate, malformed, or unsupported files.

**FR-007** — The system shall display upload-processing status.

**FR-008** — The system shall provide actionable error messages when ingestion fails.

---

# 14. Feature 2 — IQVIA Schema Intelligence Engine

## Purpose

Understand different IQVIA export structures without relying on fixed column names.

## Target Concepts

The engine should attempt to identify:

- Product
- Pack
- Ingredient/molecule
- Corporation/company
- Manufacturer
- Channel
- Sub-channel
- ATC hierarchy
- NFC hierarchy
- Product form
- Strength
- Pack size
- Launch date
- Generic/branded status
- Period
- Units
- Value
- CU
- DU

## Detection Signals

Schema detection may use:

1. Column-name semantics
2. Data type
3. Sample values
4. Uniqueness/cardinality
5. Known IQVIA terminology
6. Historical mappings
7. Pattern recognition
8. AI semantic classification

## Confidence

Every semantic mapping must have a confidence score.

Example:

| Concept | Detected Column | Confidence |
|---|---|---:|
| Ingredient | PACK MOLECULE STRING | 99% |
| Product | PRODUCT | 99% |
| Corporation | Corporation | 98% |
| Sales Value | *_Val(LC) | 98% |

## Functional Requirements

**FR-009** — The system shall automatically infer the semantic meaning of columns.

**FR-010** — The system shall not require fixed column positions.

**FR-011** — The system shall assign confidence to inferred mappings.

**FR-012** — High-confidence mappings may be automatically accepted subject to configurable thresholds.

**FR-013** — Low-confidence critical mappings shall require user confirmation.

**FR-014** — Users shall be able to override any detected mapping.

**FR-015** — Confirmed mappings shall be stored for future matching where appropriate.

**FR-016** — The system shall detect quarterly fields even when naming conventions differ.

---

# 15. Feature 3 — Time-Series Detection

The platform must transform wide quarterly data into a standard analytical structure.

Example input:

```text
Q42023_Val(LC)
Q12024_Val(LC)
Q22024_Val(LC)
...
Q32025_Val(LC)
```

Normalised representation:

```text
Product | Period | Metric | Value
A       | 2024Q1 | Sales  | X
A       | 2024Q2 | Sales  | Y
```

## Functional Requirements

**FR-017** — The system shall detect quarter and year from recognised time-series columns.

**FR-018** — The system shall identify metric type associated with each quarterly field.

**FR-019** — The system shall support datasets containing different numbers of quarters.

**FR-020** — The system shall not assume every dataset contains all metric types.

**FR-021** — Missing periods shall be explicitly represented rather than assumed to be zero.

---

# 16. Feature 4 — Data Validation

Before analysis, the platform must run validation.

Checks should include:

- Missing critical columns
- Invalid numeric data
- Duplicate records
- Missing ingredient values
- Missing product values
- Invalid periods
- Negative values where unexpected
- Unmapped metrics
- Inconsistent categories
- Missing portfolio identifiers

The user should see:

**Ready / Warning / Requires Action**

rather than technical errors wherever possible.

---

# 17. Feature 5 — Portfolio Identification

## Purpose

Distinguish the user's own products from competitors.

## Workflow

```text
Dataset Processed
      ↓
Corporations Identified
      ↓
User Selects Own Corporation(s)
      ↓
Products Identified
      ↓
User Reviews Portfolio
      ↓
Portfolio Saved
```

## Functional Requirements

**FR-022** — The system shall list corporations detected in the dataset.

**FR-023** — The user shall be able to select one or more corporations representing their organisation.

**FR-024** — Products associated with selected corporations shall be provisionally classified as own products.

**FR-025** — Users shall be able to manually include/exclude products.

**FR-026** — Remaining relevant products shall be classified as competitors for comparative analysis.

---

# 18. Feature 6 — AI Category Engine

## Purpose

Create commercially meaningful comparison categories primarily from ingredient information.

## Inputs

AI may use:

- Ingredient/molecule
- ATC1–ATC4
- NFC1–NFC3
- Product
- Form
- Strength
- Existing category mappings
- User-defined category rules

## Core Rule

Ingredient/molecule is the primary signal.

ATC and other fields provide supporting context.

## Output

AI should recommend between **2 and 5 relevant categories when sufficient distinct groupings exist**.

The system must not force a minimum number of artificial categories when the dataset does not support them.

## Workflow

```text
Ingredients
     ↓
AI evaluates similarity
     ↓
Category suggestions
     ↓
Rationale
     ↓
User review
     ↓
Approve / Edit / Move
     ↓
Save mapping
```

## Functional Requirements

**FR-027** — AI shall suggest commercially meaningful ingredient-based categories.

**FR-028** — AI shall provide a short rationale for each category.

**FR-029** — Users shall be able to rename categories.

**FR-030** — Users shall be able to move ingredients between categories.

**FR-031** — Users shall be able to merge categories.

**FR-032** — Users shall be able to create manual categories.

**FR-033** — Approved mappings shall be reusable.

**FR-034** — User-approved mapping shall override AI suggestions.

---

# 19. Category Knowledge Base

The system should progressively build:

```text
Ingredient
     ↓
Approved Category
     ↓
Supporting ATC
     ↓
User/Organisation
     ↓
Mapping Version
```

This allows the platform to become more consistent over time.

AI should first check approved mappings before generating a new classification.

---

# 20. Dashboard Architecture

V1 should provide five primary analytical views.

---

# 21. Dashboard 1 — Executive Market Overview

## Business Question

> **What is happening in the market?**

## Core KPIs

Where supported by data:

- Total market value
- Latest-quarter value
- QoQ growth
- YoY growth
- Market trend
- Own portfolio value
- Own portfolio share
- Own portfolio growth
- Competitor growth
- Top category
- Fastest-growing category

## Visualisations

Recommended:

- KPI cards
- Quarterly market trend
- Category contribution
- Market-share distribution
- Growth ranking
- Top gainers
- Top decliners

## Filters

- Period
- Category
- Ingredient
- Product
- Company
- Channel
- Sub-channel
- ATC
- NFC

---

# 22. Dashboard 2 — Category Opportunity

## Business Question

> **Which market categories should we prioritise?**

Each selected category should show:

- Market value
- Market share
- QoQ growth
- YoY growth
- Absolute growth
- Growth contribution
- Momentum
- Own-product share
- Competitor share
- Market concentration
- Opportunity score

## Core Visual

### Market Opportunity Matrix

```text
                    HIGH GROWTH
                         ↑
                         │
       EMERGING          │        PRIORITY
       OPPORTUNITY       │        OPPORTUNITY
                         │
LOW SIZE ────────────────┼────────────── HIGH SIZE
                         │
       LOW PRIORITY      │        MATURE /
                         │        DEFEND
                         ↓
                     LOW GROWTH
```

---

# 23. Dashboard 3 — Product Penetration

## Business Question

> **Where are our existing products underpenetrated?**

Analyse:

```text
Category
   ↓
Channel
   ↓
Sub-channel
   ↓
Ingredient
   ↓
Product
```

Metrics:

- Market size
- Market growth
- Our sales
- Our growth
- Our share
- Competitor share
- Share gap
- Growth gap
- Penetration opportunity

Example interpretation:

> The category is growing rapidly in Clinic, while our product holds relatively low share and is growing slower than the category.

This should trigger investigation as a potential penetration opportunity.

---

# 24. Dashboard 4 — Competitive Intelligence

## Business Question

> **Who is winning, losing, or threatening our position?**

Analyse:

- Corporation
- Manufacturer
- Product
- Ingredient
- Category
- Channel
- Sub-channel

Metrics:

- Sales
- Share
- Growth
- Share change
- Rank
- Rank change
- Growth contribution
- Channel strength

## Competitive Signals

The system should identify:

### Share Gainer

Competitor materially gaining share.

### Growth Leader

Competitor growing substantially faster than market.

### Emerging Competitor

Smaller competitor demonstrating sustained acceleration.

### Declining Leader

Large competitor losing momentum/share.

### Channel Threat

Competitor disproportionately strong or accelerating in a channel relevant to the user's portfolio.

---

# 25. Dashboard 5 — Strategic Insights

## Business Question

> **Where should we focus and why?**

The page should rank strategic opportunities.

Example:

### #1 — PENETRATE: Clinic

**Priority:** High

**Evidence**

- Market size: X
- Category growth: +X%
- Our growth: +X%
- Our share: X%
- Share change: X pp
- Leading competitor: X
- Competitor growth: +X%

**Interpretation**

Explain why the pattern matters.

**Recommended Investigation**

Describe what the user should investigate next.

---

# 26. Analytics Engine

The analytics engine must calculate numerical metrics independently from the LLM.

---

# 27. Core Metric — Sales Value

For selected dimension \(d\) and period \(t\):

\[
Sales_{d,t} = \sum Value_{i,t}
\]

---

# 28. Quarter-over-Quarter Growth

\[
QoQ =
\frac{CurrentQuarter-PreviousQuarter}
{PreviousQuarter}
\times100
\]

If the previous quarter is zero or missing, the system must not produce misleading infinite growth.

Instead display:

**N/A / New / Insufficient baseline**, depending on business rule.

---

# 29. Year-over-Year Growth

\[
YoY =
\frac{CurrentQuarter-SameQuarterPreviousYear}
{SameQuarterPreviousYear}
\times100
\]

YoY shall only be calculated where a comparable prior-year quarter exists.

---

# 30. Market Share

\[
MarketShare =
\frac{EntitySales}
{RelevantMarketSales}
\times100
\]

The denominator must always reflect the active analytical context and filters.

---

# 31. Share Change

\[
ShareChange =
CurrentShare-PreviousComparableShare
\]

Display as percentage points (pp).

---

# 32. Absolute Growth

\[
AbsoluteGrowth =
CurrentSales-PreviousComparableSales
\]

---

# 33. Growth Contribution

\[
GrowthContribution =
\frac{EntityAbsoluteGrowth}
{TotalMarketAbsoluteGrowth}
\]

The system must handle negative or zero market growth carefully and avoid misleading interpretation.

---

# 34. Market Attractiveness Score

V1 should use a transparent weighted scoring system.

Candidate factors:

- Market size
- Growth
- Growth consistency
- Share momentum
- Absolute growth contribution
- Competitive intensity

Conceptually:

\[
MAS =
w_1(Size)+
w_2(Growth)+
w_3(Momentum)+
w_4(GrowthContribution)+
w_5(CompetitiveOpportunity)
\]

All components should be normalised before weighting.

Weights must be configurable in future versions.

V1 may use product-defined defaults.

---

# 35. Penetration Opportunity Score

Purpose:

> Identify attractive markets where our portfolio has relatively weak penetration.

Candidate factors:

- Market attractiveness
- Our current share
- Share gap
- Category growth
- Our growth vs category growth
- Channel opportunity

Conceptually:

\[
POS =
MarketAttractiveness
\times
Underpenetration
\times
RelativeGrowthOpportunity
\]

Exact formula requires validation using real datasets before production release.

---

# 36. Competitive Threat Score

Candidate factors:

- Competitor share
- Competitor share gain
- Competitor growth
- Growth contribution
- Momentum
- Channel overlap with our portfolio

Output:

**Low / Medium / High / Critical**

---

# 37. Strategic Priority

Combine the three analytical perspectives:

```text
Market Attractiveness
        +
Penetration Opportunity
        +
Competitive Threat
        ↓
Strategic Priority
```

Possible strategic labels:

### PENETRATE
Attractive market + low own penetration.

### INVEST
Strong market + favourable existing position + further upside.

### DEFEND
Strong current position but meaningful competitive threat.

### MONITOR
Potential opportunity without sufficient current evidence.

### DEPRIORITISE
Weak market attractiveness and limited strategic upside.

These labels represent commercial analytical signals, not autonomous business decisions.

---

# 38. AI Insight Engine

## Purpose

Transform calculated analytical facts into concise strategic interpretation.

## AI Input

The LLM should receive structured analytical data such as:

```text
Category: X
Latest Sales: X
QoQ Growth: X
YoY Growth: X
Market Share: X
Share Change: X
Our Share: X
Our Growth: X
Leading Competitor: X
Competitor Growth: X
Opportunity Score: X
```

The AI should NOT need to calculate these metrics from raw rows.

---

# 39. AI Output Structure

Every strategic insight should contain:

### Observation

What happened?

### Evidence

Which numbers prove it?

### Interpretation

Why might it matter?

### Strategic Signal

Invest / Penetrate / Defend / Monitor / Deprioritise.

### Recommended Investigation

What should the user investigate next?

---

# 40. AI Safety / Reliability Rules

**AIR-001** — AI shall not invent sales values.

**AIR-002** — AI shall not invent growth rates.

**AIR-003** — AI shall not invent market shares.

**AIR-004** — Numerical statements must originate from the analytics engine.

**AIR-005** — AI shall distinguish facts from interpretations.

**AIR-006** — AI shall not claim causation from sales patterns alone.

**AIR-007** — AI shall indicate insufficient evidence where applicable.

**AIR-008** — Recommendations shall be framed as strategic recommendations/investigations rather than guaranteed outcomes.

**AIR-009** — AI shall not provide clinical recommendations based solely on commercial data.

**AIR-010** — AI-generated categories must remain user-editable.

---

# 41. Evidence Traceability

This should be a major differentiator.

Every AI insight should provide an expandable:

**Why am I seeing this?**

Example:

```text
Recommendation
     ↓
Supporting Metrics
     ↓
Dashboard Segment
     ↓
Underlying Aggregation
     ↓
Dataset
```

Users should be able to verify why an insight was generated.

---

# 42. User Stories

### US-001

As a user, I want to upload an IQVIA spreadsheet without reformatting it so that I can start analysis quickly.

### US-002

As a user, I want the system to identify relevant columns automatically so that I do not need to configure every dataset manually.

### US-003

As a user, I want uncertain mappings highlighted so that incorrect assumptions do not contaminate my analysis.

### US-004

As a user, I want products categorised based on ingredients so that meaningful competitor groups can be compared.

### US-005

As a user, I want to edit AI-generated categories so that I retain control over market definitions.

### US-006

As a user, I want to identify my portfolio so that the platform can compare my products with competitors.

### US-007

As a user, I want to compare 2–5 categories so that I can understand which markets are most attractive.

### US-008

As a user, I want to see where my products are underpenetrated so that I can identify potential growth areas.

### US-009

As a user, I want competitor movements highlighted so that I can identify emerging threats.

### US-010

As a user, I want AI to explain important market patterns so that I can move from data to decision faster.

### US-011

As a user, I want evidence behind every recommendation so that I can validate the analysis before acting on it.

---

# 43. Acceptance Criteria

## AC-001 — Flexible Upload

**Given** a supported IQVIA workbook has different column ordering from previous uploads  
**When** the user uploads the workbook  
**Then** the system analyses the workbook semantically rather than rejecting it because columns are in different positions.

## AC-002 — Ingredient Detection

**Given** an uploaded dataset contains an ingredient field  
**When** schema detection completes  
**Then** the system identifies the most probable ingredient column and provides a confidence score.

## AC-003 — Low Confidence

**Given** two columns could reasonably represent the same semantic concept  
**When** confidence falls below the configured threshold  
**Then** the system asks the user to confirm the correct mapping before dependent analysis proceeds.

## AC-004 — Quarterly Detection

**Given** a dataset contains quarterly sales columns  
**When** ingestion completes  
**Then** the system identifies year, quarter, and metric type and converts the fields into the internal time-series model.

## AC-005 — Portfolio

**Given** corporations have been identified  
**When** the user selects their corporation  
**Then** associated products are classified as own portfolio and relevant remaining products as competitors.

## AC-006 — Category Generation

**Given** ingredient data is available  
**When** the user starts categorisation  
**Then** AI recommends commercially relevant comparison categories with rationale.

## AC-007 — Category Control

**Given** AI has proposed categories  
**When** the user changes an ingredient's category  
**Then** subsequent analysis uses the user-approved mapping.

## AC-008 — Dashboard

**Given** the dataset has passed validation  
**When** processing completes  
**Then** the system generates dashboards using calculated dataset values.

## AC-009 — Insight Grounding

**Given** an AI insight states a numerical fact  
**When** the user inspects its evidence  
**Then** the stated number can be traced to a deterministic analytical result.

## AC-010 — Penetration Opportunity

**Given** a market segment is growing and the user's portfolio has materially lower penetration  
**When** opportunity scoring runs  
**Then** the segment may be surfaced as a penetration opportunity with supporting evidence.

---

# 44. UX/UI Requirements

## Screen 1 — Upload

Components:

- Drag-and-drop upload
- Browse file
- Supported format indicator
- Upload history
- Processing state

Primary CTA:

**Analyse Dataset**

---

# 45. Screen 2 — Dataset Understanding

Show:

| Detected Concept | Mapped Column | Confidence | Status |
|---|---|---:|---|
| Ingredient | PACK MOLECULE STRING | 99% | Confirmed |
| Product | PRODUCT | 99% | Confirmed |
| Company | Corporation | 98% | Confirmed |
| Channel | Channel | 99% | Confirmed |

Allow dropdown override.

Primary CTA:

**Confirm & Continue**

---

# 46. Screen 3 — Portfolio Setup

Show detected corporations.

User selects:

**This is our company**

Then display detected products for review.

---

# 47. Screen 4 — Category Builder

Recommended interface:

```text
CATEGORY A
[Ingredient A]
[Ingredient B]
[Ingredient C]

CATEGORY B
[Ingredient D]
[Ingredient E]

CATEGORY C
[Ingredient F]
```

Support drag/drop where practical.

Actions:

- Rename
- Move
- Merge
- Add
- Delete
- Regenerate suggestion

Primary CTA:

**Approve Categories**

---

# 48. Screen 5 — Executive Dashboard

Navigation:

```text
Overview
Categories
Penetration
Competitors
Insights
```

Global filters should remain consistent across dashboard pages.

---

# 49. Screen 6 — Strategic Insights

Recommended presentation:

```text
#1 PENETRATE
Private Clinic

HIGH OPPORTUNITY

Why?
Market Growth       +XX%
Our Growth          +XX%
Our Share            XX%
Competitor Share     XX%

[View Evidence]
[Explore Segment]
```

Avoid presenting AI insights as untraceable chat responses.

---

# 50. Roles & Permissions

V1 may use a simple model.

| Capability | User | Admin |
|---|---:|---:|
| Upload dataset | Yes | Yes |
| Analyse dataset | Yes | Yes |
| Edit categories | Yes | Yes |
| Select portfolio | Yes | Yes |
| View dashboards | Yes | Yes |
| View insights | Yes | Yes |
| Manage system configuration | No | Yes |
| Manage users | No | Yes |

Advanced RBAC is outside V1.

---

# 51. Data Requirements

## Dataset

- Dataset ID
- Filename
- Upload date
- User
- Processing status
- Schema version
- Mapping status

## Product

- Product ID
- Product name
- Ingredient
- Corporation
- Manufacturer
- Pack
- Form
- Strength
- ATC
- NFC
- Portfolio status

## Category

- Category ID
- Category name
- Description
- Source: AI/User
- Approval status
- Version

## Sales Observation

- Product
- Period
- Metric
- Value
- Channel
- Sub-channel

---

# 52. Data Normalisation

The internal analytics layer should not depend on IQVIA's original wide format.

The ingestion process should convert source data into a standard canonical model.

Conceptually:

```text
SOURCE IQVIA
Q12025_Value
Q22025_Value
Q32025_Value

       ↓

CANONICAL MODEL

Product | Period | Metric | Value
A       | 2025Q1 | Value  | X
A       | 2025Q2 | Value  | Y
A       | 2025Q3 | Value  | Z
```

This is critical to supporting different IQVIA file formats.

---

# 53. Business Rules

**BR-001** — User-confirmed mappings override AI mappings.

**BR-002** — User-approved category mappings override generated categories.

**BR-003** — Missing observations must not automatically be interpreted as zero.

**BR-004** — YoY calculations require a comparable prior-year period.

**BR-005** — Market-share denominators must follow active analytical filters.

**BR-006** — Numerical insights must use analytics-engine outputs.

**BR-007** — AI must not create strategic recommendations when required evidence is unavailable.

**BR-008** — Strategic categories should normally contain logically comparable ingredients.

**BR-009** — Category count should generally support 2–5 comparison groups, but the system must not manufacture categories solely to reach this range.

**BR-010** — Portfolio classification must be confirmed by the user before penetration analysis.

---

# 54. Error Handling

| Condition | Behaviour |
|---|---|
| Unsupported file | Explain supported format |
| No valid table | Ask user to choose sheet/header |
| Ingredient not detected | Request mapping |
| Period not detected | Request mapping |
| Sales metric not detected | Request mapping |
| Missing quarter | Mark missing |
| AI unavailable | Continue deterministic analytics |
| Category AI fails | Allow manual categories |
| Analytics fails | Do not generate AI interpretation |
| Zero denominator | Return N/A rather than invalid ratio |

The platform should degrade gracefully.

**AI failure must never prevent basic deterministic analytics where the underlying data is valid.**

---

# 55. Non-Functional Requirements

## Performance

Initial target:

- Standard workbook upload feedback within seconds
- Analysis progress visibly displayed
- Dashboard interactions responsive after processing

Exact SLA should be established after representative file-size testing.

## Security

- Encryption in transit
- Encryption at rest
- Authenticated access
- Least-privilege data access
- Secure file storage
- Secure deletion mechanism
- No public dataset exposure

## Privacy / Commercial Confidentiality

IQVIA and internal portfolio data may be commercially sensitive.

The platform should support:

- Data isolation
- Access controls
- Audit logs
- Retention controls
- Dataset deletion

Any third-party AI processing of uploaded information requires explicit architecture/security review.

## Reliability

Failure in the AI layer should not corrupt underlying analytical data.

## Auditability

Important actions should be logged:

- Upload
- Schema mapping
- Mapping changes
- Portfolio changes
- Category changes
- Analysis run
- Insight generation

---

# 56. Analytics Events

Suggested telemetry:

```text
dataset_uploaded
dataset_processed
schema_detected
schema_mapping_changed
portfolio_selected
category_generated
category_changed
category_approved
dashboard_viewed
filter_applied
opportunity_viewed
competitor_viewed
insight_generated
evidence_viewed
```

---

# 57. Key Product Metrics

## Activation

Percentage of uploaded datasets reaching a usable dashboard.

## Time-to-Insight

Time from upload to first strategic insight.

## Mapping Accuracy

Percentage of semantic mappings accepted without correction.

## Category Acceptance

Percentage of AI category suggestions accepted without substantial modification.

## Insight Engagement

Percentage of analyses where users open strategic insights.

## Evidence Engagement

Percentage of recommendations where supporting evidence is inspected.

## Repeat Usage

Percentage of users returning with another dataset.

---

# 58. Dependencies

Potential dependencies include:

- Spreadsheet parser
- Database
- Analytical processing framework
- Charting/dashboard library
- LLM provider
- Authentication
- File storage
- Background processing
- Application hosting

Architecture should avoid unnecessary vendor lock-in where practical.

---

# 59. Key Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Different IQVIA schemas | High | High | Semantic schema engine + confirmation |
| Incorrect ingredient mapping | High | Medium | Confidence + user validation |
| Poor AI categories | High | Medium | Editable categories + saved mappings |
| AI hallucinated numbers | High | Medium | Deterministic analytics only |
| Wrong market denominator | High | Medium | Explicit filter/context logic |
| Commercially sensitive data exposure | High | Low/Medium | Security architecture + access controls |
| Overconfident recommendations | High | Medium | Evidence + recommendation language |
| Scope creep | High | High | Strict P0/P1/P2 boundary |
| Large workbook performance | Medium | Medium | Background processing + optimisation |
| Different IQVIA definitions | Medium | High | Flexible canonical model |
| User trusts score without understanding it | Medium | Medium | Explain score components |

---

# 60. Assumptions

The PRD currently assumes:

1. IQVIA datasets contain product-level sales information.
2. Most relevant datasets contain an ingredient/molecule field, although its name may vary.
3. Data primarily contains quarterly observations.
4. Own products and competitor products coexist in the dataset.
5. Corporation/manufacturer information is normally available.
6. Channel/sub-channel may be available and should be used when present.
7. Category generation is primarily ingredient-driven.
8. Users want commercially meaningful categories rather than simply reproducing ATC classification.
9. Users retain final authority over category definitions.
10. The platform is decision-support rather than autonomous decision-making.

---

# 61. Open Product Decisions

These decisions do not block an initial prototype but should be resolved before production.

### OP-001 — Market Definition

Should users explicitly define the market universe before category generation, or should AI propose it?

**Recommendation:** AI proposes; user confirms.

### OP-002 — Opportunity Weights

What weights should Market Attractiveness, Penetration, and Competitive Threat use?

**Recommendation:** Begin transparent and configurable rather than claiming a scientifically optimal formula.

### OP-003 — Historical Comparison

Should the system compare uploaded datasets across different dates?

**Recommendation:** P1.

### OP-004 — Category Knowledge Scope

Should mappings be global, organisation-specific, or dataset-specific?

**Recommendation:** Organisation-specific mapping with dataset override.

### OP-005 — Currency

Should multi-country/multi-currency IQVIA files eventually be supported?

**Recommendation:** Design canonical schema to support currency metadata, but defer conversion logic.

---

# 62. Release Readiness Criteria

V1 is ready when:

- A representative IQVIA workbook uploads successfully.
- Dataset structure is detected.
- Ingredient column is correctly identified or easily corrected.
- Quarterly sales metrics are detected.
- Data normalises correctly.
- User can identify own portfolio.
- AI generates usable ingredient-based categories.
- Categories are editable.
- User can compare 2–5 relevant categories.
- Dashboard calculations reconcile with independently validated calculations.
- Market share is correct.
- QoQ/YoY growth is correct.
- Opportunity analysis works.
- Penetration analysis works.
- Competitive analysis works.
- AI insights use only validated metrics.
- Evidence can be traced.
- AI failure does not break deterministic dashboards.
- Critical security requirements pass.
- No P0 defects remain.

---

# 63. Proposed Development Sequence

## Week 1 — Prove the Core Loop

Build:

```text
Upload
→ Detect
→ Map
→ Normalise
→ Portfolio
→ Categorise
→ Calculate
→ Dashboard
→ Insight
```

Use the supplied IQVIA workbook as the initial validation dataset.

## Phase 2 — Strengthen Intelligence

Add:

- Better category knowledge
- Opportunity scoring
- Penetration heatmaps
- Competitor movement
- Saved analysis
- Better evidence drill-down

## Phase 3 — Productise

Add:

- User management
- Analysis history
- Reporting
- Exports
- Collaboration
- Enterprise security

## Phase 4 — Advanced Intelligence

Potentially add:

- Forecasting
- Scenario modelling
- Cross-dataset comparison
- Automated executive reporting
- Opportunity alerts
- Advanced portfolio strategy

These should only be introduced after the descriptive and diagnostic analytics are trusted.

---

# 64. North-Star User Experience

The desired final interaction should feel like this:

```text
USER
uploads an IQVIA workbook

        ↓

SYSTEM
"I understand this dataset."

        ↓

SYSTEM
"These are the products, ingredients,
companies, channels and quarterly metrics."

        ↓

AI
"Based on the ingredients, I recommend
these four comparison categories."

        ↓

USER
confirms / modifies them

        ↓

SYSTEM
"Here is what is happening in the market."

        ↓

SYSTEM
"Here is where your products are strong."

        ↓

SYSTEM
"Here is where you are underpenetrated."

        ↓

SYSTEM
"Here are the competitors gaining ground."

        ↓

AI
"These are the three areas I recommend
you investigate first — and here is the
data supporting each recommendation."
```

The product should therefore move the user from:

**DATA → UNDERSTANDING → OPPORTUNITY → DECISION**

rather than simply:

**DATA → CHARTS**

---

# 65. Product North Star

The defining success criterion for this platform is:

> **A user should be able to upload an unfamiliar IQVIA sales dataset and, with minimal manual configuration, understand what the market is doing, where their existing products are underpenetrated, which competitors are gaining ground, and which opportunities deserve further strategic investigation — with every recommendation traceable back to the underlying data.**

---

# 66. Final V1 Product Boundary

## Build Now

**Upload → Understand → Categorise → Compare → Analyse → Prioritise → Explain**

## Build Later

**Predict → Automate → Distribute → Integrate → Execute**

This boundary should remain explicit throughout product development to prevent the MVP from becoming an oversized business-intelligence platform before the core intelligence workflow has been validated.