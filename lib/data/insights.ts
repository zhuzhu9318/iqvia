import { createClient } from "@/lib/supabase/client";
import { synthesiseInsights, type GroundedInsight } from "@/lib/ai/synthesise-insights";
import type { AnalyticsResult } from "@/lib/analytics/engine";

export async function refreshInsights(datasetId:string,data:AnalyticsResult) {
  const db=createClient();
  const {data:existing,error:loadError}=await db.from("insights").select("id,type,summary,evidence,confidence,review_status").eq("dataset_id",datasetId).order("created_at"); if(loadError)throw loadError;
  if(existing?.length)return existing.map((row)=>{const evidence=row.evidence as Record<string,string|number|null>;return{id:row.id,type:row.type,summary:row.summary,confidence:Number(row.confidence),reviewStatus:row.review_status,signal:String(evidence.signal??"MONITOR"),interpretation:String(evidence.interpretation??""),investigation:String(evidence.investigation??""),evidence:Object.fromEntries(Object.entries(evidence).filter(([key])=>!["signal","interpretation","investigation"].includes(key)))} as GroundedInsight;});
  const insights=synthesiseInsights(data);
  if(!insights.length)return insights;
  const {data:created,error}=await db.from("insights").insert(insights.map((item)=>({dataset_id:datasetId,type:item.type,summary:item.summary,evidence:{...item.evidence,signal:item.signal,interpretation:item.interpretation,investigation:item.investigation},source:"engine-grounded",confidence:item.confidence,review_status:"unreviewed"}))).select("id");if(error)throw error;
  return insights.map((item,index)=>({...item,id:created?.[index]?.id,reviewStatus:"unreviewed" as const}));
}

export async function reviewInsight(id:string){const {error}=await createClient().from("insights").update({review_status:"reviewed"}).eq("id",id);if(error)throw error;}
export async function dismissInsight(id:string){const {error}=await createClient().from("insights").delete().eq("id",id);if(error)throw error;}
