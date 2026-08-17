import { createClient } from "@/lib/supabase/client";
import type { DetectedColumn } from "@/lib/parsing/schema";

export type DatasetSummary = { id: string; filename: string; row_count: number; column_count: number; status: string; created_at: string };

export async function listDatasets() {
  const { data, error } = await createClient().from("datasets").select("id,filename,row_count,column_count,status,created_at").order("created_at", { ascending: false });
  if (error) throw error;
  return data as DatasetSummary[];
}

export async function createDataset(filename: string, rows: number, columns: DetectedColumn[]) {
  const periods = columns.map((c) => c.period).filter(Boolean).sort();
  const db = createClient();
  const { data: dataset, error } = await db.from("datasets").insert({
    filename, row_count: rows, column_count: columns.length,
    period_start: periods[0] ?? null, period_end: periods.at(-1) ?? null, status: "detected",
  }).select().single();
  if (error) throw error;
  const { error: columnError } = await db.from("dataset_columns").insert(columns.map((column) => ({
    dataset_id: dataset.id, source_column: column.sourceColumn, detected_role: column.role,
    confidence: column.confidence, source: "heuristic", review_status: column.confidence >= .85 ? "reviewed" : "unreviewed",
    confirmed_by_user: column.confidence >= .85,
  })));
  if (columnError) throw columnError;
  return dataset as DatasetSummary;
}

export async function saveMappings(datasetId: string, columns: DetectedColumn[]) {
  const db = createClient();
  for (const column of columns) {
    const { error } = await db.from("dataset_columns").update({
      detected_role: column.role, confidence: 1, source: "user", review_status: "reviewed", confirmed_by_user: true,
    }).eq("dataset_id", datasetId).eq("source_column", column.sourceColumn);
    if (error) throw error;
  }
}
