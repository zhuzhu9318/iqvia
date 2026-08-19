"use client";

import { useEffect,useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { UploadWorkflow } from "./upload-workflow";
import { MarketDashboard } from "./market-dashboard";

export function AuthWorkspace(){
  const [user,setUser]=useState<User|null>(null);const [ready,setReady]=useState(false);const [mode,setMode]=useState<"signin"|"signup">("signin");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
  useEffect(()=>{const db=createClient();db.auth.getUser().then(({data})=>{setUser(data.user);setReady(true);});const {data:{subscription}}=db.auth.onAuthStateChange((_event,session)=>{setUser(session?.user??null);setReady(true);});return()=>subscription.unsubscribe();},[]);
  async function submit(){setBusy(true);setMessage("");const db=createClient();const result=mode==="signin"?await db.auth.signInWithPassword({email,password}):await db.auth.signUp({email,password});if(result.error)setMessage(result.error.message);else if(mode==="signup"&&!result.data.session)setMessage("Check your email to confirm your account, then sign in.");setBusy(false);}
  return <>
    {!ready?<section className="card p-6 mt-9 text-sm text-[var(--muted)]">Loading secure workspace…</section>:user?<><div className="auth-userbar mt-7 flex justify-between items-center rounded-xl border border-[var(--line)] bg-white p-4"><div><div className="text-xs text-[var(--muted)]">Signed in</div><div className="text-sm font-semibold">{user.email}</div></div><button className="btn-secondary" onClick={()=>createClient().auth.signOut()}>Sign out</button></div><UploadWorkflow/></>:<section className="card p-6 mt-9"><div className="grid md:grid-cols-[1fr_.9fr] gap-8 items-center"><div><div className="eyebrow">Secure analyst workspace</div><h2 className="text-2xl font-semibold mt-2">Sign in to analyse your workbook</h2><p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">Uploads and saved market definitions are private to your account. The public demo below remains read-only.</p></div><div><div className="auth-tabs flex gap-2 mb-4"><button className={mode==="signin"?"btn-primary":"btn-secondary"} onClick={()=>setMode("signin")}>Sign in</button><button className={mode==="signup"?"btn-primary":"btn-secondary"} onClick={()=>setMode("signup")}>Create account</button></div><label className="text-xs font-bold">Email</label><input className="input mt-1 mb-3" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" inputMode="email"/><label className="text-xs font-bold">Password</label><input className="input mt-1" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete={mode==="signin"?"current-password":"new-password"}/>{message&&<p className="text-xs text-amber-700 mt-3">{message}</p>}<button className="btn-primary mt-4 w-full" onClick={submit} disabled={busy||!email||password.length<6}>{busy?"Working…":mode==="signin"?"Sign in":"Create account"}</button></div></div></section>}
    <div className="my-12 border-t border-[var(--line)]"/><MarketDashboard datasetId="a0000000-0000-0000-0000-000000000001" title="Demo market pulse" readOnly/>
  </>;
}
