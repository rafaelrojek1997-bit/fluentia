"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { EnglishLevel } from "./levels";

export type ChatMessage = { id: string; actor: "mentor" | "user"; text: string; time: string };
type DemoState = {
  name: string; level: EnglishLevel; xp: number; streak: number; completed: number;
  learningLanguage?: "en" | "de";
  englishLevel?: EnglishLevel; germanLevel?: EnglishLevel;
  onboardingDone: boolean; messages: ChatMessage[]; reviewIndex: number;
  consents: Record<string, boolean>; memories: { id: string; text: string }[];
};
type DemoContextType = DemoState & {
  completeOnboarding(name: string, level: EnglishLevel): void;
  changeLevel(level: EnglishLevel): void;
  changeLearningLanguage(language: "en" | "de"): void;
  sendMessage(text: string): Promise<void>;
  rateReview(): void; toggleConsent(key: string): void; deleteMemory(id: string): void;
  reset(): void; isReplying: boolean; toast: string; notify(text: string): void;
};

const initial: DemoState = {
  name: "Rafał", level: "B1", englishLevel: "B1", germanLevel: "A1", xp: 1240, streak: 12, completed: 3, onboardingDone: true, reviewIndex: 0,
  consents: { personalization: true, analytics: false, audio: false, marketing: false },
  memories: [{ id: "m1", text: "Pracujesz w branży technologicznej" }, { id: "m2", text: "Chcesz swobodniej prowadzić spotkania" }, { id: "m3", text: "Interesują Cię podróże i produkt cyfrowy" }],
  messages: [
    { id: "1", actor: "mentor", text: "Hi Rafał! Today we'll practise opening a project meeting. Imagine I'm a new client. Start by welcoming me and setting a clear agenda.", time: "10:32" }
  ]
};
const Ctx = createContext<DemoContextType | null>(null);
const key = "fluentia-demo-v1";

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initial); const [isReplying, setReplying] = useState(false); const [toast, setToast] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { try { const saved = localStorage.getItem(key); if (saved) setState({ ...initial, ...JSON.parse(saved) }); } catch {} }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [state]);
  const notify = useCallback((text:string) => { setToast(text); window.setTimeout(() => setToast(""), 2800); }, []);
  const completeOnboarding = (name:string, level:EnglishLevel) => setState(s => ({ ...s, name, level, englishLevel:level, onboardingDone:true }));
  const changeLevel = (level: EnglishLevel) => setState(s => ({ ...s, level, ...(s.learningLanguage==="de"?{germanLevel:level}:{englishLevel:level}) }));
  const changeLearningLanguage = (learningLanguage: "en" | "de") => { setState(s => ({ ...s, learningLanguage })); try { const saved=JSON.parse(localStorage.getItem(key)??"{}"); localStorage.setItem(key,JSON.stringify({...saved,learningLanguage})); window.dispatchEvent(new CustomEvent("fluentia-language-change",{detail:learningLanguage})); } catch {} };
  const sendMessage = async (text:string) => {
    if (!text.trim() || isReplying) return;
    setState(s => ({ ...s, messages:[...s.messages,{ id:crypto.randomUUID(),actor:"user",text:text.trim(),time:new Date().toLocaleTimeString("pl",{hour:"2-digit",minute:"2-digit"}) }] }));
    setReplying(true); await new Promise(r => setTimeout(r, 850));
    const reply = text.toLowerCase().includes("agenda") ? "Great opening — clear and professional. A more natural version would be: “I'd like to walk you through today's agenda.” Now ask me whether there's anything I'd like to add." : "Nice — your meaning is clear. Try making it a little more natural: “Thanks for joining us today. Before we begin, is there anything you'd like to add to the agenda?”";
    setState(s => ({ ...s, messages:[...s.messages,{ id:crypto.randomUUID(),actor:"mentor",text:reply,time:new Date().toLocaleTimeString("pl",{hour:"2-digit",minute:"2-digit"}) }], xp:s.xp+15 })); setReplying(false);
  };
  const rateReview = () => setState(s => ({...s,reviewIndex:s.reviewIndex+1,xp:s.xp+8}));
  const toggleConsent = (k:string) => setState(s => ({...s,consents:{...s.consents,[k]:!s.consents[k]}}));
  const deleteMemory = (id:string) => { setState(s => ({...s,memories:s.memories.filter(m=>m.id!==id)})); notify("Pamięć została usunięta"); };
  const reset = () => { setState(initial); notify("Dane demonstracyjne zostały przywrócone"); };
  const learningLanguage=state.learningLanguage??"en"; const activeLevel=learningLanguage==="de"?(state.germanLevel??"A1"):(state.englishLevel??state.level);
  const value = {...state,level:activeLevel,learningLanguage,completeOnboarding,changeLevel,changeLearningLanguage,sendMessage,rateReview,toggleConsent,deleteMemory,reset,isReplying,toast,notify};
  return <Ctx.Provider value={value}>{children}{toast&&<div className="toast" role="status">{toast}</div>}</Ctx.Provider>;
}
export function useDemo(){ const ctx=useContext(Ctx); if(!ctx) throw new Error("useDemo outside provider"); return ctx; }
