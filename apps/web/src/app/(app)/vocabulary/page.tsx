"use client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BookMarked, Loader2, Plus, Search, Trash2, Volume2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useDemo } from "@/lib/demo-store";
import { useWebSpeech } from "@/lib/use-web-speech";

type Entry={id:string;language:"en"|"de";term:string;translation:string;example?:string;notes?:string;sourceType:string;createdAt:string};
const emptyForm={term:"",translation:"",example:"",notes:""};

export default function VocabularyPage(){
 const {learningLanguage}=useDemo();const language=learningLanguage==="de"?"de":"en";const german=language==="de";
 const [entries,setEntries]=useState<Entry[]>([]);const [form,setForm]=useState(emptyForm);const [query,setQuery]=useState("");const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState("");const [message,setMessage]=useState("");
 const transcript=useCallback(()=>{},[]);const speech=useWebSpeech(transcript,language);
 useEffect(()=>{let active=true;setLoading(true);setError("");api.get<Entry[]>("/vocabulary").then(items=>{if(active)setEntries(items)}).catch((e:ApiError)=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[language]);
 const filtered=useMemo(()=>{const value=query.trim().toLocaleLowerCase(german?"de":"en");return entries.filter(entry=>!value||[entry.term,entry.translation,entry.example,entry.notes].some(text=>text?.toLocaleLowerCase(german?"de":"en").includes(value)))},[entries,query,german]);
 async function add(event:FormEvent){event.preventDefault();if(!form.term.trim()||!form.translation.trim())return;setSaving(true);setError("");setMessage("");try{const created=await api.post<Entry>("/vocabulary",{language,...form});setEntries(items=>[created,...items]);setForm(emptyForm);setMessage("Wpis został zapisany w osobistym słowniku.")}catch(e){setError(e instanceof ApiError?e.message:"Nie udało się zapisać wpisu.")}finally{setSaving(false)}}
 async function remove(id:string){setError("");try{await api.delete("/vocabulary/"+id);setEntries(items=>items.filter(item=>item.id!==id));setMessage("Wpis został usunięty.")}catch(e){setError(e instanceof ApiError?e.message:"Nie udało się usunąć wpisu.")}}
 return <div className="page" data-learning-language={language}>
  <div className="page-head"><div><p className="eyebrow">Osobisty słownik · {german?"niemiecki":"angielski"}</p><h1>Zapisuj słowa, które naprawdę wykorzystasz</h1><p className="subtitle">Dodawaj pojedyncze słowa i całe zwroty wraz z tłumaczeniem, kontekstem oraz własną notatką.</p></div><span className="pill"><BookMarked size={14}/> {entries.length} {entries.length===1?"wpis":"wpisów"}</span></div>
  {(error||message)&&<div className="card flat" role="status" style={{marginBottom:16,color:error?"var(--danger)":"var(--teal)"}}>{error||message}</div>}
  <div className="grid" style={{gridTemplateColumns:"minmax(280px,.75fr) minmax(0,1.25fr)",alignItems:"start"}}>
   <form className="card form" onSubmit={add}>
    <div><p className="eyebrow">Nowy materiał</p><h2 style={{marginTop:5}}>Dodaj słowo lub zwrot</h2></div>
    <div className="field"><label htmlFor="term">{german?"Po niemiecku":"Po angielsku"}</label><input id="term" className="input" value={form.term} onChange={e=>setForm({...form,term:e.target.value})} placeholder={german?"np. sich auf etwas freuen":"np. look forward to"} maxLength={120} required/></div>
    <div className="field"><label htmlFor="translation">Tłumaczenie po polsku</label><input id="translation" className="input" value={form.translation} onChange={e=>setForm({...form,translation:e.target.value})} placeholder={german?"cieszyć się na coś":"oczekiwać z niecierpliwością"} maxLength={240} required/></div>
    <div className="field"><label htmlFor="example">Przykład użycia</label><textarea id="example" className="textarea" value={form.example} onChange={e=>setForm({...form,example:e.target.value})} placeholder={german?"Ich freue mich auf das Wochenende.":"I'm looking forward to the weekend."} maxLength={500}/></div>
    <div className="field"><label htmlFor="notes">Moja notatka</label><input id="notes" className="input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Skojarzenie, gramatyka lub sytuacja…" maxLength={500}/></div>
    <button className="button primary" disabled={saving||!form.term.trim()||!form.translation.trim()}>{saving?<Loader2 className="spin" size={16}/>:<Plus size={16}/>} Zapisz w słowniku</button>
   </form>
   <section>
    <div className="card flat" style={{marginBottom:16}}><div className="field"><label htmlFor="vocabulary-search">Znajdź wpis</label><div style={{position:"relative"}}><Search size={18} style={{position:"absolute",left:13,top:13,color:"var(--muted)"}}/><input id="vocabulary-search" className="input" style={{paddingLeft:41}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Słowo, tłumaczenie lub notatka…"/></div></div></div>
    {loading?<div className="card review-card"><Loader2 className="spin"/><p>Otwieram Twój słownik…</p></div>:filtered.length?<div className="grid">{filtered.map(entry=><article className="card" key={entry.id}>
     <div className="section-head"><span className="pill">{entry.sourceType==="CHAT"?"Z rozmowy":"Własny wpis"}</span><div style={{display:"flex",gap:6}}><button className="icon-btn" onClick={()=>speech.speak(entry.term,0.9)} disabled={!speech.synthesisSupported} aria-label={"Odsłuchaj "+entry.term}><Volume2 size={16}/></button><button className="icon-btn" onClick={()=>void remove(entry.id)} aria-label={"Usuń "+entry.term}><Trash2 size={16}/></button></div></div>
     <h2 style={{fontSize:26,margin:"10px 0 5px"}}>{entry.term}</h2><p style={{fontSize:17,marginTop:0}}>{entry.translation}</p>
     {entry.example&&<div className="coach-tip"><b>Przykład</b><br/>{entry.example}</div>}{entry.notes&&<p className="muted" style={{marginBottom:0}}><b>Notatka:</b> {entry.notes}</p>}
    </article>)}</div>:<div className="empty card"><BookMarked size={38}/><h2>{query?"Brak pasujących wpisów":"Twój słownik jest jeszcze pusty"}</h2><p>{query?"Spróbuj krótszego hasła.":"Dodaj pierwsze słowo lub zwrot za pomocą formularza."}</p></div>}
   </section>
  </div>
 </div>;
}
