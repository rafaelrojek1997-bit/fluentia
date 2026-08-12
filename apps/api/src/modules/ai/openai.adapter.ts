import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { AiProviderAdapter, AssistanceRequest, MentorGeneration, MentorRequest, ModerationResult, mentorAnswerSchema } from "./mentor.types";
import { buildMentorInstructions } from "./mentor.prompt";

const answerJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "corrections", "encouragement", "nextQuestion"],
  properties: {
    reply: { type: "string" },
    corrections: {
      type: "array",
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["original", "corrected", "explanation", "category"],
        properties: {
          original: { type: "string" }, corrected: { type: "string" }, explanation: { type: "string" },
          category: { type: "string", enum: ["GRAMMAR", "VOCABULARY", "WORD_ORDER", "AGREEMENT", "TENSE", "ARTICLE", "PREPOSITION", "REGISTER", "NATURALNESS", "OTHER"] }
        }
      }
    },
    encouragement: { type: "string" },
    nextQuestion: { type: "string" }
  }
} as const;

@Injectable()
export class OpenAiAdapter implements AiProviderAdapter {
  constructor(private readonly config: ConfigService) {}

  async moderate(content: string): Promise<ModerationResult> {
    const response = await this.client().moderations.create({ model: "omni-moderation-latest", input: content });
    const result = response.results[0];
    if (!result) throw new ServiceUnavailableException({ code: "AI_INVALID_RESPONSE", message: "Moderation returned no result." });
    const categories = Object.entries(result.categories).filter(([, active]) => active).map(([name]) => name);
    return { flagged: result.flagged, categories };
  }

  async generateMentorAnswer(request: MentorRequest): Promise<MentorGeneration> {
    const model = this.config.get<string>("OPENAI_MODEL") ?? "gpt-5-mini";
    const history = request.history.map(message => ({ role: message.actor, content: message.content }));
    const response = await this.client().responses.create({
      model,
      store: false,
      reasoning: { effort: "low" },
      instructions: buildMentorInstructions(request.level, request.scenario, request.mentorStyle, request.correctionIntensity, request.learningLanguage),
      input: [...history, { role: "user", content: request.message }],
      text: { format: { type: "json_schema", name: "mentor_answer", strict: true, schema: answerJsonSchema } }
    });
    let decoded: unknown;
    try { decoded = JSON.parse(response.output_text); } catch { throw new ServiceUnavailableException({ code: "AI_INVALID_RESPONSE", message: "AI returned malformed structured output." }); }
    const answer = mentorAnswerSchema.parse(decoded);
    return {
      answer,
      metadata: {
        provider: "OPENAI", model, requestId: response.id,
        inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens
      }
    };
  }

  async generateAssistance(request: AssistanceRequest): Promise<string> {
    const model = this.config.get<string>("OPENAI_MODEL") ?? "gpt-5-mini";
    const targetLanguage = request.learningLanguage === "de" ? "German" : "English";
    const task = request.kind === "VOCABULARY"
      ? `Translate the learner's selected ${targetLanguage} word or phrase into concise, natural Polish. Return only the Polish translation, without quotation marks, explanations or headings.`
      : request.kind === "HINT"
      ? `Give one practical hint for what the learner can say next. Include a ready-to-use ${targetLanguage} sentence starter.`
      : request.kind === "TRANSLATE"
        ? `Translate the learner's Polish draft into natural, level-appropriate ${targetLanguage}. Briefly explain one useful phrase in Polish.`
        : `Rewrite the latest mentor message in simpler ${targetLanguage} and explain its meaning briefly in Polish.`;
    const languagePolicy = request.level === "A1" || request.level === "A2"
      ? `Use clear Polish guidance and very simple ${targetLanguage}.`
      : request.level === "B1"
        ? `Use mainly ${targetLanguage} with a short Polish explanation.`
        : `Use natural ${targetLanguage}; add Polish only when needed for clarity.`;
    const response = await this.client().responses.create({
      model, store: false, reasoning: { effort: "low" }, max_output_tokens: 300,
      instructions: `You are an exceptional Polish teacher of ${targetLanguage}. ${languagePolicy} ${task} Be concise, supportive and concrete. Return only the learner-facing assistance, without headings about internal policy.`,
      input: `Scenario: ${request.scenario}\nCEFR: ${request.level}\nRecent context: ${request.context ?? "No previous mentor message."}\nLearner draft: ${request.draft ?? "No draft."}`
    });
    const text = response.output_text.trim();
    if (!text) throw new ServiceUnavailableException({ code: "AI_INVALID_RESPONSE", message: "AI returned an empty assistance response." });
    return text;
  }
  async normalizeTranscript(content: string, learningLanguage: "en" | "de" = "en"): Promise<string> {
    const model = this.config.get<string>("OPENAI_MODEL") ?? "gpt-5-mini";
    const response = await this.client().responses.create({
      model, store: false, reasoning: { effort: "low" }, max_output_tokens: 300,
      instructions: `You edit ${learningLanguage === "de" ? "German" : "English"} speech-recognition transcripts. Return polished standard ${learningLanguage === "de" ? "German" : "English"} only. Add capitalization and natural punctuation. Correct obvious spelling, transcription, and grammar errors while preserving the speaker's exact meaning, intent, tense, names, and level of detail. Never add facts, explanations, translations, quotation marks, or commentary. If uncertain, preserve the original wording.`,
      input: content
    });
    const text = response.output_text.trim();
    if (!text) throw new ServiceUnavailableException({ code: "AI_INVALID_RESPONSE", message: "AI returned an empty transcript." });
    return text;
  }
  private client(): OpenAI {
    const apiKey = this.config.get<string>("OPENAI_API_KEY");
    if (!apiKey) throw new ServiceUnavailableException({ code: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY is not configured." });
    return new OpenAI({ apiKey, timeout: 45_000, maxRetries: 2 });
  }
}
