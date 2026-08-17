"use client";

const items = ["Datasets", "Categorisation", "Dashboard", "Competitive", "Insights"];

export function Sidebar({ active = "Datasets" }: { active?: string }) {
  return <aside className="sidebar">
    <div className="flex items-center gap-3 mb-10"><div className="brand-mark">IQ</div><div><div className="font-bold">IQVIA</div><div className="text-[10px] text-emerald-200 tracking-[.16em]">MARKET INTELLIGENCE</div></div></div>
    <nav className="space-y-1">{items.map((item, index) => <a key={item} href={`#${item.toLowerCase()}`} className={`nav-item ${active === item ? "active" : ""}`}><span className="w-5 text-center opacity-70">{["▣","◫","◉","↗","✦"][index]}</span>{item}</a>)}</nav>
    <div className="sidebar-copy absolute bottom-7 left-6 right-6 text-xs text-emerald-100/60 leading-relaxed">Deterministic metrics.<br/>Evidence behind every signal.</div>
  </aside>;
}
