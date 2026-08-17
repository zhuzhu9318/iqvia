import type { DetectedColumn } from "./schema";

export type SourceRow = Record<string, string | number | boolean | null>;
export type NormalisedProduct = {
  key: string; name: string; ingredientNames: string[]; corporation: string | null;
  manufacturer: string | null; channel: string | null; sub_channel: string | null;
  atc1: string | null; atc2: string | null; atc3: string | null; atc4: string | null;
  nfc1: string | null; nfc2: string | null; nfc3: string | null;
};
export type NormalisedObservation = { productKey: string; period: string; value?: number; units?: number; cu?: number; du?: number };

const text = (value: unknown) => value == null ? null : String(value).trim() || null;
const number = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  const parsed = Number(String(value ?? "").replace(/[, $€£]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function normaliseRows(rows: SourceRow[], columns: DetectedColumn[]) {
  const source = (role: DetectedColumn["role"]) => columns.find((column) => column.role === role)?.sourceColumn;
  const productColumn = source("product_name");
  const ingredientColumn = source("ingredient");
  if (!productColumn || !ingredientColumn) throw new Error("Product and ingredient mappings are required.");
  const dimensions = ["corporation", "manufacturer", "channel", "sub_channel", "atc1", "atc2", "atc3", "atc4", "nfc1", "nfc2", "nfc3"] as const;
  const products = new Map<string, NormalisedProduct>();
  const observations = new Map<string, NormalisedObservation>();
  for (const row of rows) {
    const name = text(row[productColumn]);
    if (!name) continue;
    const ingredientNames = (text(row[ingredientColumn]) ?? "Unspecified").split(/[;+\/]/).map((item) => item.trim()).filter(Boolean);
    const values = Object.fromEntries(dimensions.map((role) => [role, text(row[source(role) ?? ""])])) as Record<(typeof dimensions)[number], string | null>;
    const key = [name, values.corporation, values.channel, values.sub_channel].join("|");
    if (!products.has(key)) products.set(key, { key, name, ingredientNames, ...values });
    for (const column of columns.filter((item) => item.period && item.role.endsWith("_metric"))) {
      const observationKey = `${key}|${column.period}`;
      const observation = observations.get(observationKey) ?? { productKey: key, period: column.period! };
      const metric = column.role.replace("_metric", "") as "sales" | "units" | "cu" | "du";
      const metricKey = metric === "sales" ? "value" : metric;
      const parsed = number(row[column.sourceColumn]);
      if (parsed !== undefined) observation[metricKey] = (observation[metricKey] ?? 0) + parsed;
      observations.set(observationKey, observation);
    }
  }
  return { products: [...products.values()], observations: [...observations.values()].filter((item) => item.value !== undefined || item.units !== undefined || item.cu !== undefined || item.du !== undefined) };
}
