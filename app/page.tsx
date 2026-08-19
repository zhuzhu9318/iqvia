import { Sidebar } from "@/components/sidebar";
import { AuthWorkspace } from "@/components/auth-workspace";

export default function Home() {
  return <div className="app-shell"><Sidebar/><main className="main-content"><div className="eyebrow">Market intelligence workspace</div><h1 className="page-title">From raw workbook<br/>to market clarity.</h1><p className="lede">Upload an unfamiliar IQVIA export, confirm what each field means, and move directly into normalized, evidence-backed analysis.</p><AuthWorkspace/></main></div>;
}
