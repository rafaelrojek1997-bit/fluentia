"use client";
import Link from "next/link";
import { BookOpen, Loader2, MessageCircle, Search, Sparkles, Volume2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useWebSpeech } from "@/lib/use-web-speech";
import { useDemo } from "@/lib/demo-store";

type Personal={id:string;kind:"PERSONAL";title:string;original?:string;description?:string;category?:string;state:string;reviewCount:number};
type Scenario={id:string;slug:string;title:Record<string,string>;description:Record<string,string>;supportedLevels:string[]};
type LibraryData={personal:Personal[];scenarios:Scenario[]};
type Filter="ALL"|"PERSONAL"|"SCENARIOS";
const categoryLabels:Record<string,string>={GRAMMAR:"Gramatyka",VOCABULARY:"Słownictwo",WORD_ORDER:"Szyk zdania",TENSE:"Czasy",ARTICLE:"Przedimki",PREPOSITION:"Przyimki",NATURALNESS:"Naturalne brzmienie",REGISTER:"Styl",OTHER:"Korekta"};

export default function LibraryPage(){
 const [data,setData]=useState<LibraryData|null>(null);const [query,setQuery]=useState("");const [filter,setFilter]=useState<Filter>("ALL");const [error,setError]=useState("");
 const {learningLanguage}=useDemo();const language=learningLanguage==="de"?"de":"en";
 const speech=useWebSpeech(()=>{},language);
 useEffect(()=>{setData(null);setError("");api.get<LibraryData>("/review/library").then(setData).catch((e:ApiError)=>setError(e.message));},[language]);
 const items=useMemo(()=>{
  const q=query.trim().toLocaleLowerCase("pl");
  const personal=(filter==="ALL"||filter==="PERSONAL"?data?.personal??[]:[]).filter(item=>!q||[item.title,item.original,item.description].some(value=>value?.toLocaleLowerCase("pl").includes(q)));
  const scenarios=(filter==="ALL"||filter==="SCENARIOS"?data?.scenarios??[]:[]).filter(item=>{const title=item.title[language]??item.title.en??item.slug;const description=item.description[language]??item.description.en??"";return !q||(title+" "+description).toLocaleLowerCase("pl").includes(q)});
  return {personal,scenarios};
 },[data,query,filter,language]);
 if(!data&&!error)return <div className="page"><div className="card review-card"><Loader2 className="spin"/><p>Otwieram Twoją bibliotekę…</p></div></div>;
 if(!data)return <div className="page"><div className="card"><h1>Nie udało się pobrać biblioteki</h1><p role="alert">{error}</p></div></div>;
 const count=items.personal.length+items.scenarios.length;
 return <div className="page">
  <div className="page-head"><div><p className="eyebrow">Biblioteka praktyki</p><h1>Twoje materiały i scenariusze</h1><p className="subtitle">Wracaj do korekt z własnych rozmów i ćwicz je w nowych sytuacjach.</p></div><span className="pill"><BookOpen size={14}/> {data.personal.length} osobistych elementów</span></div>
  <div className="card flat" style={{marginBottom:18}}>
   <div className="field"><label htmlFor="search">Znajdź materiał</label><div style={{position:"relative"}}><Search size={18} style={{position:"absolute",left:13,top:13,color:"var(--muted)"}}/><input id="search" className="input" style={{paddingLeft:41}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Zwrot, błąd lub sytuacja…"/></div></div>
   <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>{([["Wszystko","ALL"],["Moje korekty","PERSONAL"],["Scenariusze","SCENARIOS"]] as [string,Filter][]).map(([label,value])=><button key={value} className={"button "+(filter===value?"primary":"secondary")} onClick={()=>setFilter(value)}>{label}</button>)}</div>
  </div>
  {items.personal.length>0&&<><div className="section-head"><h2>Zwroty z Twoich rozmów</h2><Link href="/review" className="muted">Przejdź do powtórek →</Link></div><div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>{items.personal.map(item=><article className="card" key={item.id}>
   <div className="lesson-icon"><Sparkles/></div><span className="pill" style={{marginTop:20}}>{categoryLabels[item.category??""]??"Korekta"} · {item.state==="STABLE"?"Opanowane":"W nauce"}</span>
   <h2 style={{margin:"14px 0 8px"}}>{item.title}</h2>{item.original&&item.original!==item.title&&<p className="muted"><s>{item.original}</s></p>}<p className="muted">{item.description}</p>
   <div style={{display:"flex",gap:8}}><button className="button secondary" onClick={()=>speech.speak(item.title,0.9)} disabled={!speech.synthesisSupported}><Volume2 size={16}/> Posłuchaj</button><Link className="button primary" href="/review">Powtórz</Link></div>
  </article>)}</div></>}
  {items.scenarios.length>0&&<><div className="section-head" style={{marginTop:24}}><h2>Scenariusze rozmów</h2></div><div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>{items.scenarios.map(item=>{const title=item.title[language]??item.title.en??item.slug;return <article className="card" key={item.id}>
   <div className="lesson-icon"><MessageCircle/></div><span className="pill" style={{marginTop:20}}>{item.supportedLevels.join(" · ")}</span><h2 style={{margin:"14px 0 8px"}}>{title}</h2><p className="muted">{item.description[language]??item.description.en}</p><Link className="button primary" style={{width:"100%"}} href="/conversation"><MessageCircle size={16}/> Rozpocznij rozmowę</Link>
  </article>})}</div></>}
  {!count&&<div className="empty"><BookOpen size={34}/><h2>Brak pasujących materiałów</h2><p>{query?"Spróbuj innego hasła lub filtra.":"Po pierwszej korekcie mentora pojawią się tutaj Twoje osobiste zwroty."}</p></div>}
 </div>;
}
