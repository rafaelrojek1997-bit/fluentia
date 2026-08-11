import type { EnglishLevel } from "./levels";

export type PlacementQuestion = {
  id: string;
  difficulty: number;
  skill: "grammar" | "vocabulary" | "reading" | "communication";
  prompt: string;
  context?: string;
  answers: string[];
  correct: number;
};

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: "a1-1", difficulty: 0, skill: "grammar", prompt: "Choose the correct sentence.", answers: ["I am Rafał.", "I is Rafał.", "I be Rafał."], correct: 0 },
  { id: "a1-2", difficulty: 0, skill: "vocabulary", prompt: "You want water. What do you say?", answers: ["Water yesterday.", "Can I have some water, please?", "I water."], correct: 1 },
  { id: "a2-1", difficulty: 1, skill: "grammar", prompt: "Complete: She ___ to work every day.", answers: ["go", "goes", "going"], correct: 1 },
  { id: "a2-2", difficulty: 1, skill: "communication", prompt: "Your train is late. Ask for information.", answers: ["Where train?", "Could you tell me when the train arrives?", "Train was arrive?"], correct: 1 },
  { id: "b1-1", difficulty: 2, skill: "grammar", prompt: "Complete: If it rains, we ___ at home.", answers: ["stay", "will stay", "stayed"], correct: 1 },
  { id: "b1-2", difficulty: 2, skill: "reading", context: "The meeting has been moved forward by thirty minutes.", prompt: "What happened?", answers: ["It starts 30 minutes earlier.", "It lasts 30 minutes longer.", "It was cancelled."], correct: 0 },
  { id: "b2-1", difficulty: 3, skill: "vocabulary", prompt: "Choose the most natural phrase.", answers: ["We need to make a decision.", "We need to do a decision.", "We need to create decision."], correct: 0 },
  { id: "b2-2", difficulty: 3, skill: "communication", prompt: "Politely disagree in a business meeting.", answers: ["You're wrong.", "I see your point, but I interpret the data differently.", "No, this is bad."], correct: 1 },
  { id: "c1-1", difficulty: 4, skill: "grammar", prompt: "Complete: Rarely ___ such a compelling proposal.", answers: ["I have heard", "have I heard", "I heard have"], correct: 1 },
  { id: "c1-2", difficulty: 4, skill: "vocabulary", prompt: "What does “a tentative agreement” mean?", answers: ["A final legal judgment", "A provisional agreement that may change", "A disagreement without a solution"], correct: 1 },
  { id: "c2-1", difficulty: 5, skill: "reading", context: "Her ostensibly conciliatory response did little to allay their misgivings.", prompt: "What is implied?", answers: ["Her response fully reassured them.", "Her response appeared calming but did not reduce their doubts.", "She openly rejected every concern."], correct: 1 },
  { id: "c2-2", difficulty: 5, skill: "communication", prompt: "Choose the most nuanced reformulation: “The plan might fail.”", answers: ["The plan is bad.", "The plan is doomed.", "The plan is not without its vulnerabilities."], correct: 2 }
];

export const GERMAN_PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: "de-a1-1", difficulty: 0, skill: "grammar", prompt: "Wähle den richtigen Satz.", answers: ["Ich heiße Rafał.", "Ich heißen Rafał.", "Ich bist Rafał."], correct: 0 },
  { id: "de-a1-2", difficulty: 0, skill: "vocabulary", prompt: "Du möchtest Wasser. Was sagst du?", answers: ["Ich hätte gern Wasser, bitte.", "Wasser gestern.", "Ich Wasser."], correct: 0 },
  { id: "de-a2-1", difficulty: 1, skill: "grammar", prompt: "Ergänze: Sie ___ jeden Tag zur Arbeit.", answers: ["fahren", "fährt", "gefahren"], correct: 1 },
  { id: "de-a2-2", difficulty: 1, skill: "communication", prompt: "Dein Zug hat Verspätung. Frage höflich nach.", answers: ["Wo Zug?", "Können Sie mir sagen, wann der Zug kommt?", "Zug war kommen?"], correct: 1 },
  { id: "de-b1-1", difficulty: 2, skill: "grammar", prompt: "Ergänze: Wenn es regnet, ___ wir zu Hause.", answers: ["bleiben", "blieben", "geblieben"], correct: 0 },
  { id: "de-b1-2", difficulty: 2, skill: "reading", context: "Die Besprechung wurde um dreißig Minuten vorverlegt.", prompt: "Was ist passiert?", answers: ["Sie beginnt 30 Minuten früher.", "Sie dauert 30 Minuten länger.", "Sie wurde abgesagt."], correct: 0 },
  { id: "de-b2-1", difficulty: 3, skill: "vocabulary", prompt: "Welche Formulierung klingt natürlich?", answers: ["eine Entscheidung machen", "eine Entscheidung treffen", "eine Entscheidung bauen"], correct: 1 },
  { id: "de-b2-2", difficulty: 3, skill: "communication", prompt: "Widersprich höflich in einer Besprechung.", answers: ["Das ist falsch.", "Ich verstehe Ihren Standpunkt, sehe die Daten jedoch etwas anders.", "Nein, schlecht."], correct: 1 },
  { id: "de-c1-1", difficulty: 4, skill: "grammar", prompt: "Ergänze: Kaum ___ er angekommen, begann die Sitzung.", answers: ["war", "ist", "hat"], correct: 0 },
  { id: "de-c1-2", difficulty: 4, skill: "vocabulary", prompt: "Was bedeutet „eine vorläufige Einigung“?", answers: ["Eine endgültige Entscheidung", "Eine Einigung, die sich noch ändern kann", "Ein ungelöster Streit"], correct: 1 },
  { id: "de-c2-1", difficulty: 5, skill: "reading", context: "Seine vermeintlich versöhnliche Antwort vermochte ihre Bedenken kaum zu zerstreuen.", prompt: "Was wird angedeutet?", answers: ["Alle waren beruhigt.", "Die Antwort wirkte versöhnlich, beseitigte die Zweifel aber nicht.", "Er lehnte alles offen ab."], correct: 1 },
  { id: "de-c2-2", difficulty: 5, skill: "communication", prompt: "Wähle die nuancierteste Formulierung: Der Plan könnte scheitern.", answers: ["Der Plan ist schlecht.", "Der Plan ist zum Scheitern verurteilt.", "Der Plan ist nicht frei von gewissen Risiken."], correct: 2 }
];

export type PlacementState = { ability: number; answered: string[]; correct: number; history: { skill: PlacementQuestion["skill"]; correct: boolean }[] };
export const initialPlacementState = (): PlacementState => ({ ability: 2, answered: [], correct: 0, history: [] });

export function selectNextQuestion(state: PlacementState, language: "en" | "de" = "en"): PlacementQuestion | null {
  const questions = language === "de" ? GERMAN_PLACEMENT_QUESTIONS : PLACEMENT_QUESTIONS;
  const available = questions.filter(question => !state.answered.includes(question.id));
  if (!available.length || state.answered.length >= 10) return null;
  return [...available].sort((a, b) => Math.abs(a.difficulty - state.ability) - Math.abs(b.difficulty - state.ability) || a.id.localeCompare(b.id))[0];
}

export function answerQuestion(state: PlacementState, question: PlacementQuestion, answer: number): PlacementState {
  const correct = answer === question.correct;
  const expected = 1 / (1 + Math.exp(question.difficulty - state.ability));
  const ability = Math.max(0, Math.min(5, state.ability + 0.9 * ((correct ? 1 : 0) - expected)));
  return { ability, answered: [...state.answered, question.id], correct: state.correct + (correct ? 1 : 0), history: [...state.history, { skill: question.skill, correct }] };
}

export function calculateCefr(state: PlacementState): EnglishLevel {
  const levels: EnglishLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return levels[Math.max(0, Math.min(5, Math.round(state.ability)))];
}
