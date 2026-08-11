"use client";
import { useEffect, useState } from "react";
import { BookMarked, Brain, CheckCircle2, Clock3, Loader2, MessageCircle, Sparkles, Target, Trophy } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useDemo } from "@/lib/demo-store";

type Report={language:"en"|"de";level:string;periodStart:string;periodEnd:string;goalPercent:number;summary:string;totals:{practiceMinutes:number;weeklyGoalMinutes:number;completedSessions:number;learnerTurns:number;corrections:number;reviewAttempts:number;newVocabulary:number;completedMissions:number;xp:number};topError:null|{category:string;label:string;count:number};correctionCategories:Array<{category:string;label:string;count:number}>;recommendations:string[];activity:Array<{date:string;sessions:number}>};
const shortDate=new Intl.DateTimeFormat("pl-PL",{day:"numeric",month:"short"});
const dayName=new Intl.DateTimeFormat("pl-PL",{weekday:"short"});

export default function WeeklyReportPage(){
 const {learningLanguage}=useDemo();const language=learningLanguage==="de"?"de":"en";
 const [report,setReport]=useState<Report|null>(null);const [error,setError]=useState("");
 useEffect(()=>{setReport(null);setError("");api.get<Report>("/me/weekly-report").then(setReport).catch((e:ApiError)=>setError(e.message))},[language]);
 if(!report&&!error)return <div className="page"><div className="card review-card"><Loader2 className="spin"/><p>Analizuję Twój tydzień…</p></div></div>;
 if(!report)return <div className="page"><div className="card"><h1>Nie udało się przygotować raportu</h1><p role="alert">{error}</p></div></div>;
 const maxSessions=Math.max(1,...report.activity.map(item=>item.sessions));
 return <div className="page">
  <div className="page-head"><div><p className="eyebrow">Raport {shortDate.format(new Date(report.periodStart))}–{shortDate.format(new Date(report.periodEnd))} · {language==="de"?"niemiecki":"angielski"}</p><h1>Twój tydzień w Fluentia</h1><p className="subtitle">Poziom {report.level} · analiza oparta na Twoich rozmowach, korektach, powtórkach i słowniku.</p></div><span className="pill"><Sparkles size={14}/> {report.totals.xp} XP w tym tygodniu</span></div>
  <section className="card hero" style={{marginBottom:18}}><div className="hero-copy"><span className="pill"><Target size={14}/> Realizacja celu: {report.goalPercent}%</span><h2 style={{fontSize:"clamp(1.7rem,4vw,2.5rem)",marginTop:18}}>{report.summary}</h2><div className="progress" style={{background:"rgba(255,255,255,.25)"}}><span style={{width:report.goalPercent+"%",background:"white"}}/></div><p><b>{report.totals.practiceMinutes} min</b> z {report.totals.weeklyGoalMinutes} min zaplanowanej nauki.</p></div></section>
  <div className="stat-row" style={{marginBottom:18}}><Stat icon={<MessageCircle/>} label="Rozmowy" value={report.totals.completedSessions} detail={report.totals.learnerTurns+" Twoich wypowiedzi"}/><Stat icon={<Brain/>} label="Powtórki" value={report.totals.reviewAttempts} detail={report.totals.corrections+" zapisanych błędów"}/><Stat icon={<BookMarked/>} label="Nowe zwroty" value={report.totals.newVocabulary} detail={report.totals.completedMissions+" ukończonych misji"}/></div>
  <div className="grid" style={{gridTemplateColumns:"minmax(0,1.1fr) minmax(300px,.9fr)",alignItems:"start"}}>
   <section className="grid">
    <div className="card"><div className="section-head"><h2>Aktywność w tym tygodniu</h2><Clock3 size={19}/></div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:10,alignItems:"end",height:180,marginTop:20}}>{report.activity.map(item=><div key={item.date} style={{display:"grid",gap:7,justifyItems:"center",height:"100%",gridTemplateRows:"1fr auto auto"}}><div style={{width:"100%",display:"flex",alignItems:"end"}}><div style={{width:"100%",minHeight:item.sessions?18:4,height:Math.max(4,item.sessions/maxSessions*120),borderRadius:"8px 8px 3px 3px",background:item.sessions?"linear-gradient(var(--primary),var(--teal))":"var(--surface-2)"}}/></div><b>{item.sessions}</b><span className="muted" style={{fontSize:11}}>{dayName.format(new Date(item.date)).replace(".","")}</span></div>)}</div></div>
    <div className="card"><div className="section-head"><h2>Najczęstsze obszary korekt</h2><Brain size={19}/></div>{report.correctionCategories.length?<div className="grid">{report.correctionCategories.slice(0,5).map((item,index)=><div key={item.category}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><b>{item.label}</b><span className="muted">{item.count}</span></div><div className="progress"><span style={{width:Math.max(10,100-index*18)+"%"}}/></div></div>)}</div>:<div className="empty"><CheckCircle2 size={34}/><h3>Brak zapisanych błędów</h3><p>Ukończ rozmowę, aby nauczyciel mógł przygotować diagnozę.</p></div>}</div>
   </section>
   <aside className="grid">
    <div className="card"><span className="pill" style={{background:"var(--teal-soft)",color:"var(--teal)"}}><Trophy size={14}/> Wniosek nauczyciela AI</span><h2 style={{marginTop:18}}>{report.topError?"Najważniejszy obszar: "+report.topError.label:"Zacznij od krótkiej rozmowy"}</h2><p className="muted">{report.topError?`Ten obszar pojawił się w korektach ${report.topError.count} razy. Skupienie jednej sesji na tym problemie da największy efekt.`:"Potrzebujemy pierwszej próbki Twojej wypowiedzi, aby wskazać najbardziej opłacalny kierunek nauki."}</p></div>
    <div className="card"><h2>Plan na kolejny krok</h2><div className="lesson-list">{report.recommendations.map((text,index)=><div className="lesson" key={text}><div className="lesson-icon">{index+1}</div><div><p style={{margin:0}}>{text}</p></div></div>)}</div></div>
   </aside>
  </div>
 </div>;
}
function Stat({icon,label,value,detail}:{icon:React.ReactNode;label:string;value:number;detail:string}){return <div className="stat"><span style={{display:"flex",alignItems:"center",gap:6}}>{icon}{label}</span><b>{value}</b><div className="muted" style={{fontSize:11,marginTop:5}}>{detail}</div></div>}
