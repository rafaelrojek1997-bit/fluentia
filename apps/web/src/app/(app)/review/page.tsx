"use client";

import { FormEvent, useEffect, useState } from "react";
import { Brain, CheckCircle2, Loader2, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";

import { useDemo } from "@/lib/demo-store";
type ReviewItem = {
  id: string;
  original: string;
  corrected: string;
  explanation?: string;
  category?: string;
  state: string;
  reviewCount: number;
};
type Queue = { items: ReviewItem[]; total: number };
type Rating = "AGAIN" | "HARD" | "GOOD" | "EASY";

const categoryLabels: Record<string, string> = {
  GRAMMAR: "Gramatyka", VOCABULARY: "Słownictwo", WORD_ORDER: "Szyk zdania",
  TENSE: "Czasy", ARTICLE: "Przedimki", PREPOSITION: "Przyimki",
  REGISTER: "Styl wypowiedzi", NATURALNESS: "Naturalne brzmienie", OTHER: "Korekta z rozmowy"
};

export default function ReviewPage() {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const { learningLanguage } = useDemo();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setQueue(null);
    setIndex(0);
    api.get<Queue>("/review/queue?limit=20")
      .then(setQueue)
      .catch((e: ApiError) => setError(e.message));
  }, [learningLanguage]);

  const item = queue?.items[index];

  function moveNext() {
    setIndex(value => value + 1);
    setAnswer("");
    setError("");
  }

  async function rate(rating: Rating) {
    if (!item || sending) return;
    setSending(true);
    setError("");
    try {
      await api.post("/review/attempts", {
        learningItemId: item.id, answer, rating
      });
      setTimeout(moveNext, 850);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Nie udało się zapisać odpowiedzi.");
    } finally { setSending(false); }
  }

  function check(event: FormEvent) {
    event.preventDefault();
    if (!answer.trim() || !item) return;
    setChecked(true);
  }

  if (!queue && !error) return <div className="page"><div className="card review-card"><Loader2 className="spin" /><p>Przygotowuję Twoje powtórki…</p></div></div>;

  if (!item) return <div className="page">
    <div className="page-head"><div><p className="eyebrow">Inteligentne powtórki</p><h1>Wszystko powtórzone</h1><p className="subtitle">Nowe ćwiczenia pojawią się po kolejnych korektach mentora albo gdy nadejdzie termin powtórki.</p></div></div>
    <div className="card review-card"><CheckCircle2 size={44} color="var(--success)" /><h2>Dobra robota!</h2><p className="muted">Wróć do rozmowy z mentorem, aby zebrać kolejne ćwiczenia dopasowane do Twoich błędów.</p><a className="button primary" href="/conversation">Rozpocznij rozmowę</a></div>
  </div>;

  const remaining = queue.items.length - index;
  const locallyCorrect = normalizeAnswer(answer, learningLanguage) === normalizeAnswer(item.corrected, learningLanguage);
  const ratingOptions: [string, Rating][] = locallyCorrect
    ? [["Jeszcze raz", "AGAIN"], ["Trudne", "HARD"], ["Dobrze", "GOOD"], ["Łatwe", "EASY"]]
    : [["Powtórzę później", "AGAIN"]];
  return <div className="page">
    <div className="page-head"><div><p className="eyebrow">Inteligentne powtórki</p><h1>{remaining} {remaining === 1 ? "element czeka" : "elementów czeka"} na Ciebie</h1><p className="subtitle">Ćwiczysz prawdziwe korekty zapisane podczas Twoich rozmów.</p></div><span className="pill"><Brain size={14}/> około {Math.max(1, Math.ceil(remaining / 2))} min</span></div>
    <div className="card review-card">
      <span className="pill"><Sparkles size={13}/> {categoryLabels[item.category ?? ""] ?? "Korekta z rozmowy"}</span>
      <p className="muted" style={{ marginTop: 26 }}>Popraw to zdanie po {learningLanguage === "de" ? "niemiecku" : "angielsku"}:</p>
      <div className="review-word" style={{ fontSize: "clamp(1.35rem, 3vw, 2rem)" }}>{item.original}</div>
      <form onSubmit={check} style={{ width: "100%", maxWidth: 680, margin: "24px auto 0" }}>
        <input className="input" style={{ width: "100%" }} value={answer} onChange={e => { setAnswer(e.target.value); setChecked(false); }} placeholder="Wpisz poprawną wersję…" autoFocus disabled={sending} aria-label="Poprawiona wersja zdania" />
        {!checked && <button className="button primary" style={{ marginTop: 14 }} disabled={!answer.trim() || sending}>{sending ? <Loader2 className="spin" size={16}/> : null} Sprawdź</button>}
      </form>
      {checked && <div className="coach-tip" style={{ marginTop: 22, textAlign: "left", width: "100%", maxWidth: 680 }}>
        <b style={{ display: "flex", alignItems: "center", gap: 7 }}>{locallyCorrect ? <CheckCircle2 size={18}/> : <XCircle size={18}/>} {locallyCorrect ? "Świetnie, odpowiedź jest poprawna." : "Jeszcze nie — zobacz poprawną wersję."}</b>
        <p style={{ marginBottom: 6 }}><strong>{item.corrected}</strong></p>
        {item.explanation && <p className="muted" style={{ margin: 0 }}>{item.explanation}</p>}
      </div>}
      {checked && <>
        <p className="muted" style={{ fontSize: 12, marginTop: 22 }}>{locallyCorrect ? "Jak trudna była ta poprawka?" : "Ta karta wróci za około 10 minut."}</p>
        <div className="rating-row">
          {ratingOptions.map(([label, rating]) =>
            <button key={rating} className="rating" disabled={sending} onClick={() => void rate(rating)}>{label}</button>
          )}
        </div>
      </>}      {!checked && <button className="button ghost" style={{ marginTop: 18 }} onClick={moveNext}><RotateCcw size={15}/> Pomiń na teraz</button>}
      {error && <p role="alert" style={{ color: "var(--danger)", marginTop: 16 }}>{error}</p>}
    </div>
  </div>;
}


function normalizeAnswer(value: string, language: "en" | "de" = "en") {
  return value.toLocaleLowerCase(language).replace(/[’‘]/g, "'").replace(/[^\p{L}0-9'\s]/gu, " ").replace(/\s+/g, " ").trim();
}
