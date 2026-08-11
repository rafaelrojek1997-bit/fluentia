import { PrismaClient, ScenarioStatus, SessionMode, CefrLevel } from "@prisma/client";

const db = new PrismaClient();
const scenarios = [
  ["airport", "At the airport", "Check in, pass security and solve travel problems."],
  ["hotel", "At the hotel", "Check in, ask about services and handle room issues."],
  ["job-interview", "Job interview", "Describe your experience, strengths and motivation."],
  ["restaurant", "At a restaurant", "Order naturally, ask questions and resolve mistakes."],
  ["business", "Business meeting", "Share opinions, clarify details and agree next steps."],
  ["date", "Meeting someone", "Have a respectful, relaxed conversation and show interest."],
  ["doctor", "At the doctor", "Describe symptoms and understand practical advice."],
  ["phone-call", "Phone call", "Open, manage and close a clear telephone conversation."],
  ["small-talk", "Small talk", "Start and sustain friendly everyday conversation."],
  ["presentation", "Presentation", "Introduce, structure and conclude a short presentation."],
  ["travel", "Travel problem", "Ask for help and adapt when plans unexpectedly change."]
];
const germanScenarioCopy = {
  airport: ["Am Flughafen", "Einchecken, die Sicherheitskontrolle passieren und Reiseprobleme lösen."],
  hotel: ["Im Hotel", "Einchecken, nach Leistungen fragen und Probleme mit dem Zimmer klären."],
  "job-interview": ["Vorstellungsgespräch", "Über Erfahrung, Stärken und Motivation sprechen."],
  restaurant: ["Im Restaurant", "Natürlich bestellen, Fragen stellen und Fehler freundlich klären."],
  business: ["Geschäftsbesprechung", "Meinungen äußern, Details klären und nächste Schritte vereinbaren."],
  date: ["Jemanden kennenlernen", "Ein respektvolles, entspanntes Gespräch führen und Interesse zeigen."],
  doctor: ["Beim Arzt", "Symptome beschreiben und praktische Empfehlungen verstehen."],
  "phone-call": ["Telefongespräch", "Ein klares Telefongespräch beginnen, führen und beenden."],
  "small-talk": ["Smalltalk", "Ein freundliches Alltagsgespräch beginnen und aufrechterhalten."],
  presentation: ["Präsentation", "Eine kurze Präsentation einleiten, strukturieren und abschließen."],
  travel: ["Problem auf Reisen", "Um Hilfe bitten und reagieren, wenn sich Pläne unerwartet ändern."]
};


try {
  for (const [slug, title, description] of scenarios) {
    const [deTitle, deDescription] = germanScenarioCopy[slug];
    await db.scenario.upsert({
      where: { slug_version: { slug, version: 1 } },
      update: { status: ScenarioStatus.ACTIVE, title: { en: title, de: deTitle }, description: { en: description, de: deDescription } },
      create: {
        slug, version: 1, status: ScenarioStatus.ACTIVE,
        title: { en: title, de: deTitle }, description: { en: description, de: deDescription },
        supportedLevels: [CefrLevel.A1, CefrLevel.A2, CefrLevel.B1, CefrLevel.B2, CefrLevel.C1, CefrLevel.C2],
        supportedModes: [SessionMode.TEXT, SessionMode.VOICE, SessionMode.MIXED],
        learningObjectives: ["communicative-confidence", "practical-vocabulary", "natural-responses"],
        successRubric: { turnCompletion: 0.4, clarity: 0.3, taskFulfilment: 0.3 },
        configuration: { maximumTurns: 24, language: "en", safetyProfile: "standard-adult-v1" },
        publishedAt: new Date()
      }
    });
  }
} finally {
  await db.$disconnect();
}
