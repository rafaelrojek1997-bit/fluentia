"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechResultEvent = { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> };
type SpeechErrorEvent = { error: string };
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type RecognitionConstructor = new () => Recognition;
type SpeechWindow = Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };

export function cleanSpeechText(value: string): string {
  return value.replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim();
}


export function formatSpeechTranscript(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return "";
  const capitalized = text.charAt(0).toLocaleUpperCase("en") + text.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : capitalized + ".";
}
export type SpeechSegment = { text: string; lang: "en-GB" | "de-DE" | "pl-PL" };

function isPolish(value: string): boolean {
  if (/[ąćęłńóśźż]/i.test(value)) return true;
  return /\b(po polsku|możesz|odpowiedzieć|spróbuj|powiedz|znaczy|czyli|jak|jest|mam|chcę|chcialbym|chciałbym|dzień dobry|dzien dobry|podpowiedź|wyjaśnienie|poprawnie)\b/i.test(value);
}

export function splitSpeechSegments(value: string, learningLanguage: "en" | "de" = "en"): SpeechSegment[] {
  const parts = value
    .replace(/[*_#`]/g, "")
    .split(/\n+|\s+[—–]\s+|(?<=[.!?])\s+/)
    .map(part => part.trim())
    .filter(Boolean);
  return parts.reduce<SpeechSegment[]>((segments, text) => {
    const lang = isPolish(text) ? "pl-PL" : learningLanguage === "de" ? "de-DE" : "en-GB";
    const previous = segments.at(-1);
    if (previous?.lang === lang) previous.text += ` ${text}`;
    else segments.push({ text, lang });
    return segments;
  }, []);
}
export function useWebSpeech(onTranscript: (value: string) => void, learningLanguage: "en" | "de" = "en") {
  const recognition = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const speechWindow = typeof window === "undefined" ? null : window as SpeechWindow;
  const recognitionSupported = Boolean(speechWindow?.SpeechRecognition ?? speechWindow?.webkitSpeechRecognition);
  const synthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  useEffect(() => {
    return () => { recognition.current?.abort(); window.speechSynthesis?.cancel(); };
  }, []);

  const start = useCallback(() => {
    const speechWindow = window as SpeechWindow;
    const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Constructor) { setError("Rozpoznawanie mowy nie jest dostępne w tej przeglądarce."); return; }
    setError("");
    const instance = new Constructor();
    instance.lang = learningLanguage === "de" ? "de-DE" : "en-US"; instance.continuous = false; instance.interimResults = true; instance.maxAlternatives = 1;
    instance.onresult = event => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) transcript += event.results[index][0].transcript;
      onTranscript(transcript.trim());
    };
    instance.onerror = event => {
      const messages: Record<string, string> = { "not-allowed": "Zezwól aplikacji na użycie mikrofonu.", "no-speech": "Nie wykryto mowy. Spróbuj ponownie.", network: "Usługa rozpoznawania mowy jest chwilowo niedostępna." };
      setError(messages[event.error] ?? "Nie udało się rozpoznać wypowiedzi."); setListening(false);
    };
    instance.onend = () => setListening(false);
    recognition.current = instance;
    try { instance.start(); setListening(true); } catch { setError("Mikrofon jest już używany. Spróbuj ponownie."); }
  }, [onTranscript, learningLanguage]);

  const stop = useCallback(() => { recognition.current?.stop(); setListening(false); }, []);
  const speak = useCallback((value: string, rate = 0.92) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    for (const segment of splitSpeechSegments(value, learningLanguage)) {
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = segment.lang; utterance.rate = segment.lang === "pl-PL" ? Math.min(rate + 0.03, 1) : rate; utterance.pitch = 1;
      const exactLanguage = segment.lang.toLowerCase();
      const languagePrefix = exactLanguage.slice(0, 2);
      utterance.voice = voices.find(voice => voice.lang.toLowerCase() === exactLanguage) ?? voices.find(voice => voice.lang.toLowerCase().startsWith(languagePrefix)) ?? null;
      window.speechSynthesis.speak(utterance);
    }
  }, [learningLanguage]);
  const stopSpeaking = useCallback(() => window.speechSynthesis?.cancel(), []);

  return { recognitionSupported, synthesisSupported, listening, error, start, stop, speak, stopSpeaking };
}
