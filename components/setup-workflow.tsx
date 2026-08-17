"use client";

import { useEffect, useMemo, useState } from "react";
import { createCategory, deleteCategory, loadSetup, saveCategories, savePortfolio, type SetupCategory, type SetupIngredient, type SetupProduct } from "@/lib/data/normalise";

export function SetupWorkflow({ datasetId, onComplete }: { datasetId: string; onComplete: () => void }) {
  const [products, setProducts] = useState<SetupProduct[]>([]);
  const [ingredients, setIngredients] = useState<SetupIngredient[]>([]);
  const [categories, setCategories] = useState<SetupCategory[]>([]);
  const [portfolioIds,setPortfolioIds]=useState<string[]>([]);
  const [company, setCompany] = useState(""); const [busy, setBusy] = useState(true); const [message, setMessage] = useState("");
  const corporations = useMemo(() => [...new Set(products.map((item) => item.corporation).filter(Boolean))] as string[], [products]);
  useEffect(() => { loadSetup(datasetId).then((data) => { setProducts(data.products); setIngredients(data.ingredients); setCategories(data.categories); setPortfolioIds(data.products.filter((p)=>p.is_portfolio).map((p)=>p.id)); const own = data.products.find((p) => p.is_portfolio)?.corporation; if (own) setCompany(own); }).catch((e) => setMessage(e.message)).finally(() => setBusy(false)); }, [datasetId]);
  async function persist() {
    if (!company || ingredients.some((item) => !item.categoryId)) { setMessage("Select your company and assign every ingredient before continuing."); return; }
    setBusy(true);
    try { await savePortfolio(datasetId, portfolioIds); await saveCategories(datasetId, categories, ingredients); setMessage("Portfolio and category definitions saved."); onComplete(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not save setup."); }
    finally { setBusy(false); }
  }
  if (busy && !products.length) return <section className="card p-6"><p className="text-sm text-[var(--muted)]">Loading normalized market…</p></section>;
  return <section className="card" id="categorisation">
    <div className="p-6 border-b border-[var(--line)]"><div className="eyebrow">Step 3 · Structure</div><h2 className="text-2xl font-semibold mt-2">Define your portfolio and market</h2><p className="text-sm text-[var(--muted)] mt-1">Your choices update the analysis denominator and every downstream signal.</p></div>
    <div className="grid lg:grid-cols-[.8fr_1.2fr]">
      <div className="p-6 border-r border-[var(--line)]"><label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">This is our company</label><select className="input mt-2" value={company} onChange={(e) => {const value=e.target.value;setCompany(value);setPortfolioIds(products.filter((p)=>p.corporation===value).map((p)=>p.id));}}><option value="">Select corporation…</option>{corporations.map((name) => <option key={name}>{name}</option>)}</select><div className="mt-5 text-sm"><span className="font-semibold">{portfolioIds.length}</span> products selected. Adjust exceptions below.</div><div className="mt-4 max-h-56 overflow-auto space-y-2">{products.filter((p) => p.corporation === company || portfolioIds.includes(p.id)).slice(0,50).map((p) => <label key={p.id} className="rounded-lg bg-[#f3f6f4] px-3 py-2 text-xs flex gap-2"><input type="checkbox" checked={portfolioIds.includes(p.id)} onChange={()=>setPortfolioIds((current)=>current.includes(p.id)?current.filter((id)=>id!==p.id):[...current,p.id])}/>{p.name}</label>)}</div></div>
      <div className="p-6"><div className="flex justify-between gap-3"><label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Ingredient categories</label><button className="btn-secondary text-xs" onClick={async()=>{try{const created=await createCategory(datasetId);setCategories((current)=>[...current,created]);}catch(e){setMessage(e instanceof Error?e.message:"Could not add category");}}}>+ Add category</button></div><div className="mt-4 grid gap-4 sm:grid-cols-2">{categories.map((category, categoryIndex) => <div key={category.id} className="rounded-xl border border-[var(--line)] p-4"><div className="flex gap-2"><input className="input font-semibold" value={category.name} onChange={(e) => setCategories((current) => current.map((item, index) => index === categoryIndex ? {...item, name: e.target.value} : item))}/><button className="text-red-700 px-2" title="Delete category" onClick={async()=>{if(ingredients.some((i)=>i.categoryId===category.id)){setMessage("Move this category's ingredients before deleting it.");return;}await deleteCategory(datasetId,category.id);setCategories((current)=>current.filter((item)=>item.id!==category.id));}}>×</button></div><div className="mt-3 space-y-2">{ingredients.filter((item) => item.categoryId === category.id).map((ingredient) => <div key={ingredient.id} className="rounded-lg bg-[var(--mint)] p-2"><div className="text-xs font-semibold">{ingredient.name}</div><select className="mt-1 w-full bg-transparent text-[11px] text-[var(--muted)]" value={ingredient.categoryId ?? ""} onChange={(e) => setIngredients((current) => current.map((item) => item.id === ingredient.id ? {...item, categoryId: e.target.value} : item))}>{categories.map((target) => <option key={target.id} value={target.id}>{target.name}</option>)}</select></div>)}</div></div>)}</div>
      {message && <div className="mt-4 rounded-lg bg-[#eef5f1] px-4 py-3 text-sm">{message}</div>}<button className="btn-primary mt-5" onClick={persist} disabled={busy}>Approve categories & analyse</button></div>
    </div>
  </section>;
}
