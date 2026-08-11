import { z } from "zod";

export const mentorAnswerSchema = z.object({
  reply: z.string().min(1).max(4000),
  corrections: z.array(z.object({
    original: z.string().min(1).max(500),
    corrected: z.string().min(1).max(500),
    explanation: z.string().min(1).max(800),
    category: z.enum(["GRAMMAR", "VOCABULARY", "WORD_ORDER", "AGREEMENT", "TENSE", "ARTICLE", "PREPOSITION", "REGISTER", "NATURALNESS", "OTHER"])
  })).max(5),
  encouragement: z.string().min(1).max(500),
  nextQuestion: z.string().min(1).max(500)
});

export type MentorAnswer = z.infer<typeof mentorAnswerSchema>;
export interface MentorMessage { actor: "user" | "assistant"; content: string }
export interface MentorRequest {
  level: string;
  learningLanguage?: "en" | "de";
  scenario: string;
  mentorStyle: string;
  correctionIntensity: number;
  history: MentorMessage[];
  message: string;
}
export interface GenerationMetadata {
  provider: string;
  model: string;
  requestId?: string;
  inputTokens?: number;
  outputTokens?: number;
}
export interface MentorGeneration { answer: MentorAnswer; metadata: GenerationMetadata }
export type AssistanceKind = "HINT" | "TRANSLATE" | "SIMPLIFY" | "VOCABULARY";
export interface AssistanceRequest { kind: AssistanceKind; learningLanguage: "en" | "de"; level: string; scenario: string; context?: string; draft?: string }
export interface ModerationResult { flagged: boolean; categories: string[] }
export const AI_PROVIDER = Symbol("AI_PROVIDER");
export interface AiProviderAdapter {
  generateMentorAnswer(request: MentorRequest): Promise<MentorGeneration>;
  generateAssistance(request: AssistanceRequest): Promise<string>;
  normalizeTranscript(content: string, learningLanguage?: "en" | "de"): Promise<string>;
  moderate(content: string): Promise<ModerationResult>;
}
