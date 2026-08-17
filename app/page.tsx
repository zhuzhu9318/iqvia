import { Sidebar } from "@/components/sidebar";
import { UploadWorkflow } from "@/components/upload-workflow";
import { MarketDashboard } from "@/components/market-dashboard";

export default function Home() {
  return <div className="app-shell"><Sidebar/><main className="main-content"><div className="eyebrow">Market intelligence workspace</div><h1 className="page-title">From raw workbook<br/>to market clarity.</h1><p className="lede">Upload an unfamiliar IQVIA export, confirm what each field means, and move directly into normalized, evidence-backed analysis.</p><UploadWorkflow/><div className="my-12 border-t border-[var(--line)]"/><MarketDashboard datasetId="a0000000-0000-0000-0000-000000000001" title="Demo market pulse"/></main></div>;
}
