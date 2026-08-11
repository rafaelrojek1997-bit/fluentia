"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Clock3, Loader2, Sparkles, Target, Trophy } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useDemo } from "@/lib/demo-store";

type Activity={id:string;type:string;status:string;estimatedMinutes:number;configuration:{title?:string;description?:string;href?:string}};
type DailyMission={date:string;language:"en"|"de";level:string;mission:Activity|null;isToday:boolean;completed:number;total:number;allDone:boolean};

export default function MissionsPage(){
 const {learningLanguage,notify}=useDemo();const language=learningLanguage==="de"?"de":"en";
 const [data,setData]=useState<DailyMission|null>(null);const [saving,setSaving]=useState(false);const [error,setError]=useState("");
 useEffect(()=>{setData(null);setError("");api.get<DailyMission>("/learning-plan/daily").then(setData).catch((e:ApiError)=>setError(e.message))},[language]);
 async function complete(){if(!data?.mission||saving||data.mission.status==="COMPLETED")return;setSaving(true);setError("");try{await api.post("/learning-plan/activities/"+data.mission.id+"/complete");setData({...data,completed:Math.min(data.total,data.completed+1),allDone:data.completed+1>=data.total,mission:{...data.mission,status:"COMPLETED"}});notify("Misja ukończona · +20 XP")}catch(e){setError(e instanceof ApiError?e.message:"Nie udało się ukończyć misji.")}finally{setSaving(false)}}
 if(!data&&!error)return <div className="page"><div className="card review-card"><Loader2 className="spin"/><p>Wybieram dzisiejszą misję…</p></div></div>;
 if(!data)return <div className="page"><div className="card"><h1>Nie udało się przygotować misji</h1><p role="alert">{error}</p></div></div>;
 const mission=data.mission;const done=mission?.status==="COMPLETED";const percent=Math.round(data.completed/Math.max(1,data.total)*100);
 return <div className="page">
  <div className="page-head"><div><p className="eyebrow">Misje dzienne · {language==="de"?"niemiecki":"angielski"}</p><h1>Jeden konkretny krok każdego dnia</h1><p className="subtitle">Poziom {data.level} · misja dobrana z Twojego aktywnego planu i celu czasowego.</p></div><span className="pill"><Target size={14}/> {data.completed} z {data.total} w tym tygodniu</span></div>
  <div className="grid" style={{gridTemplateColumns:"minmax(0,1.25fr) minmax(280px,.75fr)",alignItems:"start"}}>
   <section className={"card hero"+(done?" done":"")} style={done?{background:"linear-gradient(135deg,var(--teal),#268a78)"}:undefined}>
    <div className="hero-copy"><span className="pill">{done?<><Check size={14}/> Ukończona</>:<><Sparkles size={14}/> {data.isToday?"Misja na dziś":"Najlepsza misja do wykonania"}</>}</span>
     {mission?<><h2 style={{fontSize:"clamp(1.7rem,4vw,2.6rem)",marginTop:20}}>{mission.configuration.title??"Codzienna praktyka"}</h2><p>{mission.configuration.description??"Wykonaj krótką aktywność dopasowaną do Twojego poziomu."}</p><div className="hero-actions"><Link className="button white" href={mission.configuration.href??"/conversation"}>{done?"Ćwicz ponownie":"Rozpocznij misję"}</Link><button className="button ghost" style={{color:"white"}} onClick={()=>void complete()} disabled={done||saving}>{saving?<Loader2 className="spin" size={16}/>:<Check size={16}/>} {done?"Wykonane":"Oznacz jako wykonaną"}</button></div></>:<><h2>Plan ukończony</h2><p>Wszystkie misje na ten tydzień są wykonane.</p></>}
    </div>
   </section>
   <aside className="grid">
    <div className="card"><div className="section-head"><h2>Postęp tygodnia</h2><span className="pill">{percent}%</span></div><div className="progress"><span style={{width:percent+"%"}}/></div><p className="muted">{data.completed} ukończonych misji z {data.total} zaplanowanych.</p></div>
    <div className="card"><div className="lesson-icon"><Trophy/></div><h2 style={{marginTop:18}}>Nagroda za misję</h2><p className="muted">Każde ukończone zadanie daje 20 XP i przybliża Cię do tygodniowego celu.</p>{mission&&<span className="pill"><Clock3 size={14}/> około {mission.estimatedMinutes} min</span>}</div>
    <Link className="button secondary" href="/learning-plan">Zobacz cały plan</Link>
   </aside>
  </div>
  {error&&<p className="error" role="alert">{error}</p>}
 </div>;
}
