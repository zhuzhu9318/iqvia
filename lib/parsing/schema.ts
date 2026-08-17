export const COLUMN_ROLES = [
  "unknown", "product_name", "ingredient", "corporation", "manufacturer",
  "channel", "sub_channel", "atc1", "atc2", "atc3", "atc4", "nfc1",
  "nfc2", "nfc3", "sales_metric", "units_metric", "cu_metric", "du_metric",
] as const;

export type ColumnRole = (typeof COLUMN_ROLES)[number];
export type DetectedColumn = {
  sourceColumn: string;
  role: ColumnRole;
  confidence: number;
  period?: string;
};

const clean = (value: string) => value.toLowerCase().replace(/[_().\-/]+/g, " ").replace(/\s+/g, " ").trim();

function periodFrom(header: string) {
  const qFirst = header.match(/q\s*([1-4])\D*(20\d{2})/i);
  const yearFirst = header.match(/(20\d{2})\D*q\s*([1-4])/i);
  if (qFirst) return `Q${qFirst[1]}-${qFirst[2]}`;
  if (yearFirst) return `Q${yearFirst[2]}-${yearFirst[1]}`;
}

export function detectColumn(header: string): DetectedColumn {
  const h = clean(header);
  const period = periodFrom(header);
  const exact: Array<[RegExp, ColumnRole, number]> = [
    [/^(product|product name|brand)$/, "product_name", .98],
    [/^(molecule|ingredient|pack molecule string|molecule composition)$/, "ingredient", .98],
    [/^(corporation|company|corp)$/, "corporation", .96],
    [/^manufacturer$/, "manufacturer", .96], [/^channel$/, "channel", .97],
    [/^sub channel$/, "sub_channel", .96], [/^atc 1$/, "atc1", .98],
    [/^atc 2$/, "atc2", .98], [/^atc 3$/, "atc3", .98], [/^atc 4$/, "atc4", .98],
    [/^nfc 1$/, "nfc1", .98], [/^nfc 2$/, "nfc2", .98], [/^nfc 3$/, "nfc3", .98],
  ];
  for (const [pattern, role, confidence] of exact) if (pattern.test(h)) return { sourceColumn: header, role, confidence };
  if (period) {
    if (/unit|standard unit/.test(h)) return { sourceColumn: header, role: "units_metric", confidence: .92, period };
    if (/(value|val|sales|lc)/.test(h)) return { sourceColumn: header, role: "sales_metric", confidence: .9, period };
    if (/(^| )cu( |$)/.test(h)) return { sourceColumn: header, role: "cu_metric", confidence: .88, period };
    if (/(^| )du( |$)/.test(h)) return { sourceColumn: header, role: "du_metric", confidence: .88, period };
  }
  if (/product|brand/.test(h)) return { sourceColumn: header, role: "product_name", confidence: .72 };
  if (/molecule|ingredient/.test(h)) return { sourceColumn: header, role: "ingredient", confidence: .78 };
  if (/corp|company/.test(h)) return { sourceColumn: header, role: "corporation", confidence: .72 };
  return { sourceColumn: header, role: "unknown", confidence: .3 };
}

export function detectSchema(headers: string[]) { return headers.map(detectColumn); }
