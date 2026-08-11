"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookMarked, BookOpen, Brain, ChartNoAxesColumnIncreasing, ClipboardList, Flame, LayoutDashboard, MessageCircle, Moon, Settings, Sparkles, Sun, Target, Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import { api } from "@/lib/api-client";
import { useDemo } from "@/lib/demo-store";

const links = [
  ["/dashboard","Dzisiaj",LayoutDashboard], ["/missions","Misje",Target], ["/conversation","Rozmowa",MessageCircle], ["/review","Powtórki",Brain],
  ["/pronunciation","Wymowa",Volume2], ["/progress","Postęp",ChartNoAxesColumnIncreasing], ["/weekly-report","Raport",ClipboardList], ["/vocabulary","Mój słownik",BookMarked], ["/library","Biblioteka",BookOpen], ["/settings","Ustawienia",Settings]
] as const;

export function AppShell({children}:{children:React.ReactNode}){
  const path=usePathname(); const {theme,setTheme}=useTheme(); const [account,setAccount]=useState({name:"Użytkownik",level:"A1",streak:0});
  const {learningLanguage,changeLearningLanguage,level:activeLanguageLevel}=useDemo();
  useEffect(()=>{api.get<{learner:{name:string;level:string};stats:{streakDays:number}}>("/me/dashboard").then(data=>setAccount({name:data.learner.name,level:activeLanguageLevel,streak:data.stats.streakDays})).catch(()=>{})},[path,activeLanguageLevel]);
  const {name,level,streak}=account;
  return <div className="app-shell app-bg">
    <aside className="sidebar">
      <Link className="brand" href="/dashboard"><span className="brand-mark"><Sparkles size={20}/></span>Fluentia</Link>
      <label className="field" style={{margin:"4px 0 14px"}}><span style={{fontSize:12,fontWeight:700}}>Język nauki</span><select className="select" value={learningLanguage} onChange={event=>changeLearningLanguage(event.target.value as "en"|"de")}><option value="en">🇬🇧 Angielski</option><option value="de">🇩🇪 Niemiecki</option></select></label>
      <nav className="nav" aria-label="Główna nawigacja">{links.map(([href,label,Icon])=><Link key={href} href={href} className={`nav-link ${path.startsWith(href)?"active":""}`} aria-current={path.startsWith(href)?"page":undefined}><Icon size={19}/><span>{label}</span></Link>)}</nav>
      <div className="sidebar-foot"><div className="pill"><Flame size={15} color="#f0a832"/> {streak} dni z rzędu</div><div className="mini-profile"><div className="avatar">{name[0]}</div><div><b style={{fontSize:13}}>{name}</b><div className="muted" style={{fontSize:11}}>Poziom {level}</div></div></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><Link className="mobile-brand" href="/dashboard"><span className="brand-mark" style={{width:34,height:34}}><Sparkles size={17}/></span>Fluentia</Link><div className="muted" style={{fontSize:13}}>Codziennie trochę pewniej.</div><div className="top-actions"><span className="pill"><Flame size={15} color="#f0a832"/>{streak} dni</span><button className="icon-btn" onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Zmień motyw">{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button></div></header>
      {children}
    </main>
  </div>;
}
