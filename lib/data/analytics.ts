import { createClient } from "@/lib/supabase/client";
import { computeAnalytics, type AnalyticsRow } from "@/lib/analytics/engine";

export async function loadAnalytics(datasetId: string) {
  const db = createClient();
  const { data, error } = await db.from("sales_observations").select("period,value,products!inner(id,name,corporation,channel,is_portfolio,ingredient_id,category_mappings:ingredients!inner(category_mappings!inner(categories!inner(id,name))))").eq("dataset_id", datasetId);
  if (error) throw error;
  const rows: AnalyticsRow[] = [];
  for (const observation of data ?? []) {
    const product = observation.products as unknown as { id:string;name:string;corporation:string|null;channel:string|null;is_portfolio:boolean;category_mappings:{category_mappings:Array<{categories:{id:string;name:string}}>} };
    const mappings = product.category_mappings?.category_mappings ?? [];
    for (const mapping of mappings) rows.push({ productId:product.id, product:product.name, corporation:product.corporation ?? "Unknown", channel:product.channel ?? "Unspecified", categoryId:mapping.categories.id, category:mapping.categories.name, isPortfolio:product.is_portfolio, period:observation.period, value:Number(observation.value ?? 0) });
  }
  return computeAnalytics(rows);
}

export async function persistAnalytics(datasetId: string, result: Awaited<ReturnType<typeof loadAnalytics>>) {
  const db = createClient();
  const { error: clearError } = await db.from("opportunity_scores").delete().eq("dataset_id", datasetId);
  if (clearError) throw clearError;
  const { error } = await db.from("opportunity_scores").insert(result.categories.map((category) => ({ dataset_id:datasetId, category_id:category.id, market_value:category.value, market_growth:category.growth == null ? null : category.growth*100, portfolio_share:category.portfolioShare, attractiveness_score:category.attractiveness, penetration_gap:category.penetrationGap, opportunity_score:category.opportunityScore, source:"engine", review_status:"reviewed" })));
  if (error) throw error;
  const { error: statusError } = await db.from("datasets").update({status:"analysed"}).eq("id",datasetId);
  if (statusError) throw statusError;
}
