import { createClient } from "@/lib/supabase/client";
import { synthesiseInsights } from "@/lib/ai/synthesise-insights";
import type { AnalyticsResult } from "@/lib/analytics/engine";

export async function refreshInsights(datasetId:string,data:AnalyticsResult) {
  const db=createClient(); const insights=synthesiseInsights(data);
  const {error:clearError}=await db.from("insights").delete().eq("dataset_id",datasetId); if(clearError) throw clearError;
  if(insights.length){const {error}=await db.from("insights").insert(insights.map((item)=>({dataset_id:datasetId,type:item.type,summary:item.summary,evidence:{...item.evidence,signal:item.signal,interpretation:item.interpretation,investigation:item.investigation},source:"engine-grounded",confidence:item.confidence,review_status:"unreviewed"})));if(error)throw error;}
  return insights;
}
