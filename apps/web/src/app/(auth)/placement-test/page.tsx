"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/lib/demo-store";
import { api } from "@/lib/api-client";
import { ENGLISH_LEVELS, type EnglishLevel } from "@/lib/levels";
import { answerQuestion, calculateCefr, initialPlacementState, selectNextQuestion } from "@/lib/placement-test";

const skillNames = { grammar: "Gramatyka", vocabulary: "Słownictwo", reading: "Czytanie", communication: "Praktyczna komunikacja" };

export default function PlacementTestPage() {
  const [state, setState] = useState(initialPlacementState);
  const [result, setResult] = useState<EnglishLevel | null>(null);
  const { changeLevel, learningLanguage, notify } = useDemo();
  const router = useRouter();
  const question = selectNextQuestion(state, learningLanguage);

  const choose = (answer: number) => {
    if (!question) return;
    const next = answerQuestion(state, question, answer);
    setState(next);
    if (!selectNextQuestion(next, learningLanguage)) setResult(calculateCefr(next));
  };

  const save = async () => {
    if (!result) return;
    changeLevel(result);
    try { await api.put("/learner-profile/level", { language: learningLanguage, level: result }); } catch { /* Poziom pozostaje zapisany lokalnie dla trybu demonstracyjnego. */ }
    notify(`Poziom ${result} dla ${learningLanguage === "de" ? "niemieckiego" : "angielskiego"} został zapisany`);
    router.push("/dashboard");
  };

  if (result) {
    const details = ENGLISH_LEVELS.find(level => level.value === result)!;
    return <main className="onboarding app-bg"><div className="onboarding-box"><div className="brand"><span className="brand-mark"><Sparkles /></span>Fluentia</div><section className="card" style={{ padding: 34, textAlign: "center" }}><CheckCircle2 size={52} color="var(--teal)" style={{ margin: "0 auto 16px" }}/><p className="eyebrow">Diagnoza zakończona</p><h1>Twój poziom to {result}</h1><h2 style={{ marginTop: 10 }}>{details.title}</h2><p className="subtitle" style={{ margin: "12px auto 24px", maxWidth: 520 }}>{details.description}</p><div className="stat-row" style={{ marginBottom: 24 }}><div className="stat"><span>Poprawne odpowiedzi</span><b>{state.correct}/10</b></div><div className="stat"><span>Sprawdzone obszary</span><b>4</b></div></div><button className="button primary" onClick={save}>Zapisz poziom i utwórz plan <ArrowRight size={17}/></button><button className="button ghost" style={{ marginTop: 10 }} onClick={() => { setState(initialPlacementState()); setResult(null); }}>Powtórz test</button></section></div></main>;
  }

  if (!question) return null;
  return <main className="onboarding app-bg"><div className="onboarding-box"><div className="brand"><span className="brand-mark"><Sparkles /></span>Fluentia</div><div className="onboarding-progress">{Array.from({ length: 10 }, (_, index) => <span className={index < state.answered.length ? "done" : ""} key={index}/>)}</div><section className="card" style={{ padding: 32 }}><div className="section-head"><p className="eyebrow">Pytanie {state.answered.length + 1} z 10</p><span className="pill">{skillNames[question.skill]}</span></div>{question.context && <div className="coach-tip" style={{ marginBottom: 20 }}>{question.context}</div>}<h1 style={{ fontSize: "clamp(1.45rem,3vw,2.15rem)" }}>{question.prompt}</h1><div className="choice-grid" style={{ marginTop: 26 }}>{question.answers.map((answer, index) => <button className="choice" key={answer} onClick={() => choose(index)}><b>{answer}</b></button>)}</div><p className="muted" style={{ textAlign: "center", fontSize: 12, marginTop: 24 }}>Trudność kolejnego pytania dopasuje się automatycznie. Nie używaj tłumacza.</p></section></div></main>;
}
