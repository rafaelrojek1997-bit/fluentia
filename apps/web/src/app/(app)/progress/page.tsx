"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Brain, CheckCircle2, Flame, Loader2, MessageCircle, Target, TrendingUp } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useDemo } from "@/lib/demo-store";

type ProgressData={
 level:string; weeklyMinutes:number;
 totals:{completedSessions:number;learnerTurns:number;corrections:number;reviewAttempts:number;masteredItems:number;completedActivities:number;xp:number};
 streak:{currentDays:number;longestDays:number};
 competencies:{skill:string;score:number;confidence:number;observationCount:number}[];
 correctionCategories:{category:string|null;count:number}[];
 activity30Days:{date:string;sessions:number}[];
};
const skillLabels:Record<string,string>={SPEAKING:"Mówienie",WRITING:"Pisanie",VOCABULARY:"Słownictwo",GRAMMAR:"Gramatyka",PRONUNCIATION:"Wymowa",FLUENCY:"Płynność",LISTENING:"Słuchanie",READING:"Czytanie"};
const categoryLabels:Record<string,string>={GRAMMAR:"gramatyka",VOCABULARY:"słownictwo",WORD_ORDER:"szyk zdań",TENSE:"czasy",ARTICLE:"przedimki",PREPOSITION:"przyimki",NATURALNESS:"naturalne brzmienie",REGISTER:"styl wypowiedzi",OTHER:"precyzja"};

export default function ProgressPage(){
 const {learningLanguage}=useDemo();
 const [data,setData]=useState<ProgressData|null>(null);const [error,setError]=useState("");
 useEffect(()=>{setData(null);setError("");api.get<ProgressData>("/me/language-progress").then(setData).catch((e:ApiError)=>setError(e.message));},[learningLanguage]);
 if(!data&&!error)return <div className="page"><div className="card review-card"><Loader2 className="spin"/><p>Obliczam Twój postęp…</p></div></div>;
 if(!data)return <div className="page"><div className="card"><h1>Nie udało się pobrać postępów</h1><p role="alert">{error}</p></div></div>;
 const activeDays=data.activity30Days.filter(day=>day.sessions>0).length;
 const maxSessions=Math.max(1,...data.activity30Days.map(day=>day.sessions));
 const topCategory=data.correctionCategories[0];
 return <div className="page" data-learning-language={learningLanguage}>
  <div className="page-head"><div><p className="eyebrow">Twój rozwój</p><h1>Postęp oparty na Twojej pracy</h1><p className="subtitle">Wszystkie liczby pochodzą z zapisanych rozmów, powtórek i zadań.</p></div><span className="pill"><TrendingUp size={14}/> {activeDays} aktywnych dni w ostatnich 30 dniach</span></div>
  <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))"}}>
   <Stat icon={<Target/>} label="Aktualny poziom" value={data.level} detail={"Cel tygodniowy: "+data.weeklyMinutes+" min"}/>
   <Stat icon={<MessageCircle/>} label="Rozmowy ukończone" value={String(data.totals.completedSessions)} detail={data.totals.learnerTurns+" Twoich wypowiedzi"}/>
   <Stat icon={<Brain/>} label="Wykonane powtórki" value={String(data.totals.reviewAttempts)} detail={data.totals.masteredItems+" elementów opanowanych"}/>
   <Stat icon={<Flame/>} label="Regularność" value={data.streak.currentDays+" dni"} detail={"Najdłuższa seria: "+data.streak.longestDays}/>
  </div>
  <div className="grid" style={{gridTemplateColumns:"minmax(0,1.2fr) minmax(280px,.8fr)",marginTop:18}}>
   <div className="card"><div className="section-head"><h2>Aktywność w ostatnich 30 dniach</h2><span className="pill">{data.totals.completedActivities} zadań planu ukończonych</span></div>
    <div style={{display:"flex",alignItems:"end",gap:4,height:130,marginTop:24}}>{data.activity30Days.map(day=><div key={day.date} title={new Date(day.date).toLocaleDateString("pl-PL")+": "+day.sessions+" sesji"} style={{flex:1,minWidth:3,height:Math.max(5,(day.sessions/maxSessions)*100)+"%",background:day.sessions?"var(--primary)":"var(--border)",borderRadius:"4px 4px 0 0"}}/>)}</div>
    <p className="muted" style={{fontSize:12}}>Każdy słupek oznacza liczbę rozpoczętych sesji danego dnia.</p>
   </div>
   <div className="card"><h2>Dowody postępu</h2><div className="lesson-list">
    <Evidence text={data.totals.learnerTurns+" samodzielnych wypowiedzi w rozmowach"}/>
    <Evidence text={data.totals.reviewAttempts+" odpowiedzi w inteligentnych powtórkach"}/>
    <Evidence text={data.totals.masteredItems+" korekt osiągnęło stabilny poziom"}/>
   </div></div>
  </div>
  <div className="grid" style={{gridTemplateColumns:"minmax(0,1.2fr) minmax(280px,.8fr)",marginTop:18}}>
   <div className="card"><div className="section-head"><h2>Profil kompetencji</h2><span className="pill">tylko zebrane próbki</span></div>
    {data.competencies.length?<div className="grid">{data.competencies.map(skill=><div key={skill.skill}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:7}}><b>{skillLabels[skill.skill]??skill.skill}</b><span className="muted">{skill.score}% · {skill.observationCount} próbek</span></div><div className="progress"><span style={{width:Math.max(0,Math.min(100,skill.score))+"%"}}/></div></div>)}</div>:<p className="muted">Zbieramy jeszcze próbki. Profil pojawi się po większej liczbie rozmów i ocen.</p>}
   </div>
   <div className="card"><h2>Najczęstszy obszar korekt</h2>{topCategory?<><h3 style={{fontSize:24,marginBottom:8,textTransform:"capitalize"}}>{categoryLabels[topCategory.category??""]??"precyzja wypowiedzi"} <ArrowUpRight color="var(--teal)"/></h3><p className="muted">{topCategory.count} zapisanych wskazówek. Znajdziesz je w inteligentnych powtórkach.</p></>:<p className="muted">Mentor nie zapisał jeszcze żadnych korekt.</p>}</div>
  </div>
 </div>;
}
function Stat({icon,label,value,detail}:{icon:React.ReactNode;label:string;value:string;detail:string}){return <div className="card"><span className="muted" style={{display:"flex",gap:7,alignItems:"center"}}>{icon}{label}</span><h2 style={{fontSize:34,margin:"12px 0 5px"}}>{value}</h2><p className="muted" style={{fontSize:13}}>{detail}</p></div>}
function Evidence({text}:{text:string}){return <div style={{display:"flex",gap:10,padding:"12px 0",borderBottom:"1px solid var(--border)",fontSize:13,lineHeight:1.5}}><CheckCircle2 size={18} color="var(--teal)" style={{flex:"0 0 auto"}}/>{text}</div>}
