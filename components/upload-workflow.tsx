"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { COLUMN_ROLES, detectSchema, type DetectedColumn } from "@/lib/parsing/schema";
import { createDataset, deleteDataset, listDatasets, saveMappings, type DatasetSummary } from "@/lib/data/datasets";
import { normaliseDataset } from "@/lib/data/normalise";
import { SetupWorkflow } from "./setup-workflow";
import { MarketDashboard } from "./market-dashboard";

type Row = Record<string, string | number | boolean | null>;

export function UploadWorkflow() {
  const [file, setFile] = useState<File>();
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<DetectedColumn[]>([]);
  const [dataset, setDataset] = useState<DatasetSummary>();
  const [history, setHistory] = useState<DatasetSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [normalised, setNormalised] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [selectedDataset,setSelectedDataset]=useState<DatasetSummary>();
  const [message, setMessage] = useState("");
  const criticalReady = useMemo(() => ["product_name", "ingredient"].every((role) => columns.some((c) => c.role === role)), [columns]);

  useEffect(() => { listDatasets().then(setHistory).catch((e) => setMessage(e.message)); }, []);

  async function inspect(selected: File) {
    setBusy(true); setMessage(""); setDataset(undefined);
    try {
      if (!/\.(xlsx|xls)$/i.test(selected.name)) throw new Error("Choose an Excel .xlsx or .xls workbook.");
      const workbook = XLSX.read(await selected.arrayBuffer(), { type: "array" });
      const sheetName = workbook.SheetNames.find((name) => XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }).length > 1);
      if (!sheetName) throw new Error("No worksheet with a usable table was found.");
      const parsed = XLSX.utils.sheet_to_json<Row>(workbook.Sheets[sheetName], { defval: null, raw: true });
      if (!parsed.length) throw new Error("The selected worksheet has headers but no data rows.");
      const headers = Object.keys(parsed[0]);
      setFile(selected); setRows(parsed); setColumns(detectSchema(headers));
      setMessage(`Detected ${headers.length} columns and ${parsed.length.toLocaleString()} rows in ${sheetName}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Workbook parsing failed."); }
    finally { setBusy(false); }
  }

  async function persist() {
    if (!file) return;
    setBusy(true);
    try {
      const created = await createDataset(file.name, rows.length, columns);
      setDataset(created); setHistory(await listDatasets()); setMessage("Dataset and detected schema saved. Review uncertain fields, then confirm.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save dataset."); }
    finally { setBusy(false); }
  }

  async function confirm() {
    if (!dataset) return;
    setBusy(true);
    try { await saveMappings(dataset.id, columns); const result = await normaliseDataset(dataset.id, rows, columns); setNormalised(true); setMessage(`Normalized ${result.productCount} products, ${result.ingredientCount} ingredients and ${result.observationCount} observations.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not save mappings."); }
    finally { setBusy(false); }
  }

  return <div className="mt-9 space-y-6">
    <section className="card p-6" id="datasets">
      <div className="flex flex-wrap justify-between gap-5 items-start">
        <div><div className="eyebrow">Step 1 · Upload</div><h2 className="text-2xl font-semibold mt-2">Bring your IQVIA workbook</h2><p className="text-sm text-[var(--muted)] mt-1">The file stays in your browser while its table is inspected.</p></div>
        <label className="btn-primary inline-flex items-center gap-2">{busy ? "Working…" : "Choose workbook"}<input className="hidden" type="file" accept=".xlsx,.xls" disabled={busy} onChange={(e) => e.target.files?.[0] && inspect(e.target.files[0])}/></label>
      </div>
      {message && <div className="mt-5 rounded-lg bg-[#eef5f1] px-4 py-3 text-sm text-[#245547]">{message}</div>}
      {rows.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-4"><Stat label="Rows" value={rows.length.toLocaleString()}/><Stat label="Columns" value={columns.length.toString()}/><Stat label="Mapped" value={columns.filter(c => c.role !== "unknown").length.toString()}/><Stat label="Needs review" value={columns.filter(c => c.confidence < .85).length.toString()}/></div>}
      {rows.length > 0 && !dataset && <button className="btn-primary mt-5" onClick={persist} disabled={busy || !criticalReady}>Save detected schema</button>}
      {!criticalReady && rows.length > 0 && <p className="text-xs text-amber-700 mt-2">Map at least Product and Ingredient before saving.</p>}
    </section>

    {columns.length > 0 && <section className="card" id="mapping">
      <div className="p-6 border-b border-[var(--line)]"><div className="eyebrow">Step 2 · Understand</div><div className="flex flex-wrap gap-4 justify-between items-end"><div><h2 className="text-2xl font-semibold mt-2">Review detected fields</h2><p className="text-sm text-[var(--muted)]">Amber mappings need your judgement. Any mapping can be overridden.</p></div>{dataset && <button className="btn-primary" onClick={confirm} disabled={busy || !criticalReady}>Confirm & continue</button>}</div></div>
      <div className="table-wrap"><table><thead><tr><th>Source column</th><th>Detected role</th><th>Confidence</th><th>Status</th></tr></thead><tbody>{columns.map((column, index) => <tr key={column.sourceColumn}><td className="font-semibold">{column.sourceColumn}<div className="text-[11px] font-normal text-[var(--muted)] mt-1">{rows.slice(0,2).map(r => String(r[column.sourceColumn] ?? "—")).join(" · ")}</div></td><td><select className="input min-w-44" value={column.role} onChange={(e) => setColumns((current) => current.map((c,i) => i === index ? {...c, role: e.target.value as DetectedColumn["role"], confidence: 1} : c))}>{COLUMN_ROLES.map(role => <option key={role} value={role}>{role.replaceAll("_", " ")}</option>)}</select></td><td>{Math.round(column.confidence * 100)}%</td><td><span className={`status-pill ${column.confidence >= .85 ? "status-good" : "status-warn"}`}>{column.confidence >= .85 ? "Confident" : "Review"}</span></td></tr>)}</tbody></table></div>
    </section>}

    {dataset && normalised && !setupComplete && <SetupWorkflow datasetId={dataset.id} onComplete={() => setSetupComplete(true)}/>}
    {setupComplete && dataset && <MarketDashboard datasetId={dataset.id}/>}

    <section className="card p-6"><div className="flex justify-between items-center"><div><div className="eyebrow">Recent datasets</div><h2 className="text-xl font-semibold mt-1">Analysis workspace</h2></div><span className="text-xs text-[var(--muted)]">{history.length} total</span></div><div className="mt-4 divide-y divide-[var(--line)]">{history.slice(0,8).map(item => <div key={item.id} className="py-3 flex flex-wrap justify-between gap-3"><div><div className="font-semibold text-sm">{item.filename}</div><div className="text-xs text-[var(--muted)] mt-1">{item.row_count.toLocaleString()} rows · {item.column_count} columns</div></div><div className="flex items-center gap-2"><span className="status-pill status-good">{item.status}</span>{["normalised","analysed"].includes(item.status)&&<button className="btn-secondary text-xs" onClick={()=>setSelectedDataset(item)}>Open</button>}<button className="btn-secondary text-xs text-red-700" onClick={async()=>{if(!window.confirm(`Delete ${item.filename} and all derived analysis?`))return;try{await deleteDataset(item.id);setHistory(await listDatasets());if(selectedDataset?.id===item.id)setSelectedDataset(undefined);}catch(e){setMessage(e instanceof Error?e.message:"Delete failed");}}}>Delete</button></div></div>)}</div></section>
    {selectedDataset?.status==="normalised"&&<SetupWorkflow datasetId={selectedDataset.id} onComplete={()=>setSelectedDataset({...selectedDataset,status:"analysed"})}/>}
    {selectedDataset?.status==="analysed"&&<MarketDashboard datasetId={selectedDataset.id} title={selectedDataset.filename}/>}
  </div>;
}

function Stat({label,value}:{label:string;value:string}) { return <div className="rounded-xl border border-[var(--line)] p-4"><div className="text-xs text-[var(--muted)]">{label}</div><div className="text-2xl font-semibold mt-1">{value}</div></div> }
