"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, Loader2, Sparkles } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";

import { useDemo } from "@/lib/demo-store";
type Activity = { id:string; type:string; status:string; scheduledFor:string; estimatedMinutes:number; configuration:{title?:string;description?:string;href?:string} };
type Plan = { periodStart:string; periodEnd:string; dailyBudgetMinutes:number; rationale:{message?:string}; activities:Activity[] };
const dayName = new Intl.DateTimeFormat("pl-PL",{weekday:"long",day:"numeric",month:"long"});
const shortDate = new Intl.DateTimeFormat("pl-PL",{day:"numeric",month:"short"});

export default function LearningPlanPage(){
  const [plan,setPlan]=useState<Plan|null>(null);
  const [error,setError]=useState("");
  const {learningLanguage}=useDemo();
  const [saving,setSaving]=useState("");
  useEffect(()=>{setPlan(null);setError("");api.get<Plan>("/learning-plan/current").then(setPlan).catch((e:ApiError)=>setError(e.message));},[learningLanguage]);
  async function complete(id:string){
    setSaving(id); setError("");
    try{await api.post("/learning-plan/activities/"+id+"/complete");setPlan(current=>current?{...current,activities:current.activities.map(a=>a.id===id?{...a,status:"COMPLETED"}:a)}:current);}
    catch(e){setError(e instanceof ApiError?e.message:"Nie udało się zapisać zadania.");}finally{setSaving("");}
  }
  if(!plan&&!error)return <div className="page"><div className="card review-card"><Loader2 className="spin"/><p>Układam Twój plan…</p></div></div>;
  if(!plan)return <div className="page"><div className="card"><h1>Nie udało się pobrać planu</h1><p role="alert">{error}</p></div></div>;
  const completed=plan.activities.filter(a=>a.status==="COMPLETED").length;
  return <div className="page">
    <div className="page-head"><div><p className="eyebrow">Plan {shortDate.format(new Date(plan.periodStart))}–{shortDate.format(new Date(plan.periodEnd))}</p><h1>Twój tydzień nauki</h1><p className="subtitle">{completed} z {plan.activities.length} zadań wykonanych. Plan dopasowuje się do celu ustawionego w profilu.</p></div><span className="pill"><Clock3 size={14}/> {plan.dailyBudgetMinutes} min dziennie</span></div>
    <div className="card" style={{marginBottom:18}}><span className="pill" style={{color:"var(--primary)"}}><Sparkles size={14}/> Dlaczego ten plan?</span><p style={{lineHeight:1.6,marginBottom:0}}>{plan.rationale.message??"Łączymy rozmowę, wymowę i inteligentne powtórki."}</p></div>
    <div className="grid">{plan.activities.map((activity,index)=>{
      const done=activity.status==="COMPLETED"; const href=activity.configuration.href??"/conversation";
      return <div className="card flat" key={activity.id}>
        <div className="section-head"><h2 style={{textTransform:"capitalize"}}><CalendarDays size={19}/> {dayName.format(new Date(activity.scheduledFor))}</h2><span className="pill">{activity.estimatedMinutes} min</span></div>
        <div className="lesson-list"><div className="lesson"><div className="lesson-icon">{done?<Check/>:<span>{index+1}</span>}</div><div><h3>{activity.configuration.title??"Ćwiczenie"}</h3><p>{activity.configuration.description}</p></div></div></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}><Link className="button primary" href={href}>{done?"Ćwicz ponownie":"Rozpocznij"}</Link><button className="button ghost" disabled={done||saving===activity.id} onClick={()=>void complete(activity.id)}>{saving===activity.id?<Loader2 className="spin" size={15}/>:<Check size={15}/>} {done?"Wykonane":"Oznacz jako wykonane"}</button></div>
      </div>;
    })}</div>
    {error&&<p role="alert" style={{color:"var(--danger)",marginTop:16}}>{error}</p>}
  </div>;
}
