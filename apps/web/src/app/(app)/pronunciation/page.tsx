"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Mic, MicOff, RotateCcw, ShieldCheck, Volume2 } from "lucide-react";
import { useWebSpeech } from "@/lib/use-web-speech";
import { pronunciationResult } from "@/lib/pronunciation";

const englishExercises=[
 {text:"Could you say that again, please?",tip:"Zachowaj płynność całego pytania; nie zatrzymuj się po słowie again."},
 {text:"Is there anything you'd like to add?",tip:"W pytaniu tak/nie intonacja zwykle lekko wznosi się pod koniec."},
 {text:"I'd like to walk you through the plan.",tip:"Połącz dźwięki w I'd like to, zamiast wymawiać każde słowo osobno."},
 {text:"Could we move the meeting to Friday?",tip:"Akcent zdaniowy połóż na move, meeting i Friday."},
 {text:"Thank you for keeping me in the loop.",tip:"W słowie thank język delikatnie dotyka przestrzeni między zębami."}
];
const germanExercises=[
 {text:"Könnten Sie das bitte noch einmal sagen?",tip:"Zwróć uwagę na ö w könnten i wyraźnie zakończ bezokolicznikiem sagen."},
 {text:"Ich hätte gern einen Kaffee, bitte.",tip:"Ćwicz miękkie ch w ich oraz ä w hätte; gern powinno brzmieć krótko i naturalnie."},
 {text:"Wie komme ich am besten zum Bahnhof?",tip:"Akcent połóż na besten i Bahnhof, a głoskę h w Bahnhof lekko zaznacz."},
 {text:"Wir können den Termin auf Freitag verschieben.",tip:"Pamiętaj o zaokrąglonym ö w können i płynnym połączeniu auf Freitag."},
 {text:"Vielen Dank für Ihre Unterstützung.",tip:"Ćwicz ü w für i Unterstützung oraz wyraźne końcowe -ung."}
];

export default function PronunciationPage(){
 const [learningLanguage,setLearningLanguage]=useState<"en"|"de">("en");const german=learningLanguage==="de";const exercises=german?germanExercises:englishExercises;
 useEffect(()=>{const read=()=>{try{const saved=JSON.parse(localStorage.getItem("fluentia-demo-v1")??"{}");setLearningLanguage(saved.learningLanguage==="de"?"de":"en")}catch{setLearningLanguage("en")}};read();window.addEventListener("fluentia-language-change",read);return()=>window.removeEventListener("fluentia-language-change",read)},[]);
 const [index,setIndex]=useState(0);const [transcript,setTranscript]=useState("");const exercise=exercises[index];
 const update=useCallback((value:string)=>setTranscript(value),[]);
 const speech=useWebSpeech(update,learningLanguage);
 const result=useMemo(()=>transcript.trim()?pronunciationResult(exercise.text,transcript):null,[exercise.text,transcript]);
 useEffect(()=>{speech.stop();setTranscript("");setIndex(0);},[learningLanguage]);
 function reset(){speech.stop();setTranscript("");}
 function next(){reset();setIndex(value=>(value+1)%exercises.length);}
 return <div className="page">
  <div className="page-head"><div><p className="eyebrow">Trening wymowy · {german?"niemiecki":"angielski"}</p><h1>Mów wyraźnie i naturalnie</h1><p className="subtitle">Celem jest zrozumiałość — nie pozbywanie się Twojego akcentu.</p></div><span className="pill"><ShieldCheck size={14}/> Audio bez zapisu w Fluentia</span></div>
  <div className="grid" style={{gridTemplateColumns:"minmax(0,1.2fr) minmax(280px,.8fr)"}}>
   <div className="card" style={{textAlign:"center",padding:35}}>
    <span className="pill">Zdanie {index+1} z {exercises.length}</span>
    <h2 style={{fontSize:30,margin:"32px 0 12px"}}>{exercise.text}</h2>
    <button className="button secondary" disabled={!speech.synthesisSupported} onClick={()=>speech.speak(exercise.text,0.82)}><Volume2 size={18}/> Posłuchaj wolniej</button>
    <button className="button secondary" style={{marginLeft:8}} disabled={!speech.synthesisSupported} onClick={()=>speech.speak(exercise.text,0.98)}><Volume2 size={18}/> Naturalne tempo</button>
    <div style={{margin:"40px auto 18px",width:110,height:110,borderRadius:"50%",display:"grid",placeItems:"center",background:speech.listening?"#fde9ed":"var(--primary-soft)"}}>
     <button className={"button "+(speech.listening?"danger":"primary")} style={{width:78,height:78,borderRadius:"50%"}} onClick={()=>{if(speech.listening)speech.stop();else{setTranscript("");speech.start();}}} disabled={!speech.recognitionSupported} aria-label={speech.listening?"Zatrzymaj":"Zacznij mówić"}>{speech.listening?<MicOff/>:<Mic/>}</button>
    </div>
    <p className="muted">{speech.listening?"Mów teraz…":`Kliknij mikrofon i przeczytaj zdanie po ${german?"niemiecku":"angielsku"}`}</p>
    {speech.error&&<p className="error" role="alert">{speech.error}</p>}
    {!speech.recognitionSupported&&<p className="error">Ta przeglądarka nie obsługuje rozpoznawania mowy. Nadal możesz korzystać z lektora.</p>}
   </div>
   <div className="card">
    {result?<><div className="section-head"><h2>Zrozumiałość</h2><div className="ring" style={{"--value":result.score+"%"} as React.CSSProperties}><b>{result.score}%</b></div></div>
     <p className="muted">Przeglądarka rozpoznała:</p><p style={{fontSize:18,lineHeight:1.55}}>&ldquo;{transcript}&rdquo;</p>
     {result.missing.length?<div className="coach-tip"><b>Poćwicz wyrazy:</b><br/>{result.missing.join(", ")}</div>:<div className="coach-tip"><CheckCircle2 size={17}/> Wszystkie słowa zostały rozpoznane.</div>}
     <div className="coach-tip" style={{marginTop:10}}><b>Wskazówka nauczyciela</b><br/>{exercise.tip}</div>
     <p className="muted" style={{fontSize:11}}>Wynik porównuje rozpoznane słowa. Nie jest pomiarem akcentu, rytmu ani intonacji i może zależeć od jakości mikrofonu.</p>
     <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button className="button secondary" onClick={reset}><RotateCcw size={16}/> Spróbuj ponownie</button><button className="button primary" onClick={next}>Następne zdanie <ArrowRight size={16}/></button></div>
    </>:<div className="empty"><Mic size={35}/><h2 style={{marginTop:15}}>Twoja próba pojawi się tutaj</h2><p>Po wypowiedzeniu zdania pokażemy rozpoznany tekst, zrozumiałość oraz słowa wymagające powtórzenia.</p></div>}
   </div>
  </div>
 </div>;
}
