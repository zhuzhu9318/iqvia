# Security

## Secret Handling
- Supabase service-role key and LLM API keys: server-side only (server actions / route handlers). Never exposed to client.
- Client uses anon key with RLS enforcement.

## Permission Model
- v1 (demo): permissive RLS — anonymous users can view and interact with seeded demo data.
- Lock-down: per-user isolation — `auth.uid() = user_id` on all tables. Datasets and all derived objects are owner-scoped.
- Agent inherits the uploading user's permissions; cannot access other users' datasets.

## Approved-Tools Rule
- AI may only call named, server-side functions listed in the agentic layer.
- No raw `run_any` / `send_any` / arbitrary code execution.
- LLM receives computed metrics as JSON context; it returns structured text. It cannot query the database directly.

## Audit Principle
- Every state-changing action (upload, mapping confirmation, categorisation, analytics run, insight generation, deletion) writes an audit log row with actor, tool, dataset_id, detail, timestamp.
- Insights carry evidence JSONb referencing the specific computed metrics they cite — 100% numerical traceability.

## Data Handling
- Uploaded Excel files are parsed in-memory; raw file not persisted after normalisation.
- No PII assumed in IQVIA data; if detected in future, restrict accordingly.
