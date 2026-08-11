import { BadGatewayException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ActorType, ConversationStatus, DataOrigin, ErrorCategory, SkillType, TurnStatus } from "@prisma/client";
import { createHash } from "node:crypto";
import { ContentCryptoService } from "../../infrastructure/crypto/content-crypto.service";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { AI_PROVIDER, AiProviderAdapter, AssistanceKind, MentorAnswer, MentorMessage } from "../ai/mentor.types";
import { RewardsService } from "../rewards/rewards.service";

const SAFE_COMPLETION = "I can help you practise English, but I can't continue with that content. Let's return to a safe, everyday topic. What would you like to practise?";

@Injectable()
export class ConversationService {
  constructor(
    private readonly db: PrismaService,
    private readonly crypto: ContentCryptoService,
    @Inject(AI_PROVIDER) private readonly ai: AiProviderAdapter,
    private readonly rewards: RewardsService
  ) {}

  async submitTurn(userId: string, sessionId: string, content: string) {
    const session = await this.db.conversationSession.findFirst({
      where: { id: sessionId, userId, deletedAt: null },
      include: {
        scenario: { select: { slug: true, title: true } },
        turns: {
          where: { status: TurnStatus.COMPLETED, deletedAt: null },
          orderBy: { sequence: "desc" }, take: 16,
          select: { actor: true, contentRedacted: true }
        }
      }
    });
    if (!session) throw new NotFoundException({ code: "CONVERSATION_NOT_FOUND" });
    if (session.status !== ConversationStatus.ACTIVE) throw new ConflictException({ code: "STATE_CONFLICT", message: "Conversation is not active." });

    const encrypted = this.crypto.encrypt(content);
    const moderation = await this.ai.moderate(content);
    const userTurn = await this.appendTurn(sessionId, ActorType.USER, moderation.flagged ? TurnStatus.MODERATED : TurnStatus.COMPLETED, encrypted, redact(content));

    if (moderation.flagged) {
      const mentorTurn = await this.appendTurn(sessionId, ActorType.MENTOR, TurnStatus.COMPLETED, this.crypto.encrypt(SAFE_COMPLETION), SAFE_COMPLETION);
      return { userTurnId: userTurn.id, mentorTurnId: mentorTurn.id, answer: { reply: SAFE_COMPLETION, corrections: [], encouragement: "Let's keep practising safely.", nextQuestion: "What everyday situation would you like to practise?" }, moderated: true, moderationCategories: moderation.categories };
    }

    try {
      const history: MentorMessage[] = session.turns.reverse().flatMap(turn => {
        if (!turn.contentRedacted || (turn.actor !== ActorType.USER && turn.actor !== ActorType.MENTOR)) return [];
        return [{ actor: turn.actor === ActorType.USER ? "user" : "assistant", content: turn.contentRedacted }];
      });
      const generation = await this.ai.generateMentorAnswer({
        learningLanguage: sessionLanguage(session.policySnapshot),
        level: session.targetLevel,
        scenario: session.scenario.slug,
        mentorStyle: session.mentorStyle,
        correctionIntensity: session.correctionIntensity,
        history,
        message: content
      });
      const completeText = `${generation.answer.reply}\n\n${generation.answer.nextQuestion}`;
      const outputModeration = await this.ai.moderate(completeText);
      const answer = outputModeration.flagged ? safeAnswer() : generation.answer;
      const storedText = outputModeration.flagged ? SAFE_COMPLETION : completeText;
      const mentorTurn = await this.appendTurn(sessionId, ActorType.MENTOR, TurnStatus.COMPLETED, this.crypto.encrypt(storedText), redact(storedText), generation.metadata.outputTokens);
      await this.saveObservations(userId, userTurn.id, answer, sessionLanguage(session.policySnapshot));
      return {
        userTurnId: userTurn.id,
        mentorTurnId: mentorTurn.id,
        answer,
        moderated: outputModeration.flagged,
        usage: { provider: generation.metadata.provider, model: generation.metadata.model }
      };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) throw error;
      throw new BadGatewayException({ code: "AI_PROVIDER_ERROR", message: "The mentor service could not complete this turn. You can safely retry." });
    }
  }

  async normalizeTranscript(userId: string, sessionId: string, content: string) {
    const session = await this.db.conversationSession.findFirst({ where: { id: sessionId, userId, status: ConversationStatus.ACTIVE, deletedAt: null }, select: { id: true, policySnapshot: true } });
    if (!session) throw new NotFoundException({ code: "CONVERSATION_NOT_FOUND" });
    const input = content.trim();
    const moderation = await this.ai.moderate(input);
    if (moderation.flagged) return { text: formatTranscriptLocally(input), normalized: false };
    try {
      const text = await this.ai.normalizeTranscript(input, sessionLanguage(session.policySnapshot));
      const outputModeration = await this.ai.moderate(text);
      return { text: outputModeration.flagged ? formatTranscriptLocally(input) : text, normalized: !outputModeration.flagged };
    } catch {
      return { text: formatTranscriptLocally(input), normalized: false };
    }
  }
  async getAssistance(userId: string, sessionId: string, kind: AssistanceKind, draft?: string) {
    const session = await this.db.conversationSession.findFirst({
      where: { id: sessionId, userId, deletedAt: null },
      include: {
        scenario: { select: { slug: true } },
        turns: { where: { actor: ActorType.MENTOR, status: TurnStatus.COMPLETED, deletedAt: null }, orderBy: { sequence: "desc" }, take: 1, select: { contentRedacted: true } }
      }
    });
    if (!session) throw new NotFoundException({ code: "CONVERSATION_NOT_FOUND" });
    if (session.status !== ConversationStatus.ACTIVE) throw new ConflictException({ code: "STATE_CONFLICT", message: "Conversation is not active." });
    if (kind === "TRANSLATE" && !draft?.trim()) throw new ConflictException({ code: "DRAFT_REQUIRED", message: "Wpisz po polsku, co chcesz powiedzieć, a mentor to przetłumaczy." });
    const source = draft?.trim() || session.turns[0]?.contentRedacted || "";
    if (source) {
      const inputModeration = await this.ai.moderate(source);
      if (inputModeration.flagged) return { kind, text: "Nie mogę przygotować podpowiedzi do tej treści. Wróćmy do bezpiecznego tematu nauki języka." };
    }
    const text = await this.ai.generateAssistance({ kind, learningLanguage: sessionLanguage(session.policySnapshot), level: session.targetLevel, scenario: session.scenario.slug, context: session.turns[0]?.contentRedacted ?? undefined, draft: draft?.trim() || undefined });
    const outputModeration = await this.ai.moderate(text);
    return { kind, text: outputModeration.flagged ? "Spróbujmy prostszej, neutralnej wypowiedzi związanej z tematem lekcji." : text };
  }
  async finishSession(userId: string, sessionId: string) {
    const session = await this.db.conversationSession.findFirst({
      where: { id: sessionId, userId, deletedAt: null },
      include: {
        turns: {
          where: { actor: ActorType.USER, deletedAt: null },
          select: { observations: { select: { evidenceEncrypted: true, errorCategory: true } } }
        }
      }
    });
    if (!session) throw new NotFoundException({ code: "CONVERSATION_NOT_FOUND" });
    if (session.status === ConversationStatus.CREATED || session.status === ConversationStatus.ABANDONED || session.status === ConversationStatus.DELETED) {
      throw new ConflictException({ code: "STATE_CONFLICT", message: "Conversation cannot be completed in its current state." });
    }
    if (session.status === ConversationStatus.COMPLETED) {
      const existing = await this.db.assessment.findFirst({ where: { sessionId, type: "SESSION_FEEDBACK", status: "COMPLETED" }, orderBy: { createdAt: "desc" } });
      if (existing?.result) return { status: "COMPLETED", summary: existing.result };
    }

    const corrections: Array<{ original: string; corrected: string; explanation: string; category: string }> = [];
    for (const turn of session.turns) {
      for (const observation of turn.observations) {
        if (!observation.evidenceEncrypted) continue;
        try {
          const decoded = JSON.parse(this.crypto.decrypt(observation.evidenceEncrypted)) as { original?: unknown; corrected?: unknown; explanation?: unknown; category?: unknown };
          if (typeof decoded.original === "string" && typeof decoded.corrected === "string" && typeof decoded.explanation === "string") {
            corrections.push({ original: decoded.original, corrected: decoded.corrected, explanation: decoded.explanation, category: typeof decoded.category === "string" ? decoded.category : String(observation.errorCategory ?? "OTHER") });
          }
        } catch { /* Ignore malformed historical evidence. */ }
      }
    }
    const unique = corrections.filter((item, index, all) => all.findIndex(candidate => candidate.original === item.original && candidate.corrected === item.corrected) === index);
    const mostCommonCategory = unique.reduce<Record<string, number>>((counts, item) => ({ ...counts, [item.category]: (counts[item.category] ?? 0) + 1 }), {});
    const focus = Object.entries(mostCommonCategory).sort((a, b) => b[1] - a[1])[0]?.[0];
    const summary = {
      turnCount: session.turns.length,
      correctionCount: unique.length,
      strengths: session.turns.length === 0 ? ["Rozpoczęcie sesji i gotowość do nauki."] : unique.length === 0 ? ["Swobodna komunikacja bez istotnych błędów.", "Dobra realizacja celu rozmowy."] : ["Aktywne budowanie wypowiedzi.", "Wykorzystanie informacji zwrotnej w praktyce."],
      priorities: unique.slice(0, 3),
      nextAction: focus ? `W następnej sesji skupimy się na obszarze: ${categoryLabel(focus)}.` : "W następnej sesji utrwalimy nowe zwroty w innym kontekście.",
      completedAt: new Date().toISOString()
    };
    await this.db.$transaction(async tx => {
      await tx.conversationSession.update({ where: { id: sessionId }, data: { status: ConversationStatus.COMPLETED, endedAt: new Date(), version: { increment: 1 } } });
      const existing = await tx.assessment.findFirst({ where: { sessionId, type: "SESSION_FEEDBACK" } });
      const data = { status: "COMPLETED" as const, result: summary, confidence: 1, completedAt: new Date() };
      if (existing) await tx.assessment.update({ where: { id: existing.id }, data });
      else await tx.assessment.create({ data: { userId, sessionId, type: "SESSION_FEEDBACK", rubricVersion: "deterministic-v1", ...data } });
    });
    await this.rewards.award(userId, 50, "CONVERSATION_COMPLETED", "CONVERSATION", sessionId);
    return { status: "COMPLETED", summary };
  }
  async reportTurn(userId: string, sessionId: string, turnId: string, reason: import("@prisma/client").ReportReason, comment?: string) {
    const turn = await this.db.conversationTurn.findFirst({ where: { id: turnId, sessionId, session: { userId } } });
    if (!turn) throw new NotFoundException({ code: "TURN_NOT_FOUND" });
    return this.db.moderationReport.create({
      data: {
        userId, sessionId, turnId, reason,
        commentEncrypted: comment ? this.crypto.encrypt(comment) : undefined,
        contentSnapshotEncrypted: turn.contentEncrypted
      },
      select: { id: true, status: true, createdAt: true }
    });
  }
  private appendTurn(sessionId: string, actor: ActorType, status: TurnStatus, encrypted: Uint8Array<ArrayBuffer>, redacted: string, tokenCount?: number) {
    return this.db.$transaction(async tx => {
      const session = await tx.conversationSession.update({ where: { id: sessionId }, data: { lastSequence: { increment: 1 }, version: { increment: 1 } }, select: { lastSequence: true } });
      return tx.conversationTurn.create({
        data: { sessionId, sequence: session.lastSequence, actor, status, contentEncrypted: encrypted, contentRedacted: redacted, language: "en", tokenCount, completedAt: new Date() }
      });
    });
  }

  private async saveObservations(userId: string, turnId: string, answer: MentorAnswer, language: "en" | "de") {
    if (!answer.corrections.length) return;
    await this.db.$transaction(async tx => {
      await tx.learnerObservation.createMany({
        data: answer.corrections.map(correction => ({
          userId, turnId,
          skill: correction.category === "VOCABULARY" ? SkillType.VOCABULARY : SkillType.WRITING,
          skillKey: `correction:\${correction.category.toLowerCase()}`,
          origin: DataOrigin.AI_INFERRED,
          value: 0, weight: 0.5, confidence: 0.7,
          errorCategory: correction.category as ErrorCategory,
          algorithmVersion: "mentor-correction-v1",
          observedAt: new Date(),
          evidenceEncrypted: this.crypto.encrypt(JSON.stringify(correction))
        }))
      });
      for (const correction of answer.corrections) {
        const canonicalKey = contentHash(`${language}|${correction.original}|${correction.corrected}`);
        await tx.learningItem.upsert({
          where: { userId_type_canonicalKey: { userId, type: "ERROR_PATTERN", canonicalKey } },
          create: {
            language,
            userId, type: "ERROR_PATTERN", canonicalKey,
            contentEncrypted: this.crypto.encrypt(JSON.stringify(correction)),
            sourceType: "CONVERSATION_TURN", sourceId: turnId,
            dueAt: new Date(), algorithmVersion: "fluentia-review-v1"
          },
          update: {
            language,
            active: true, priority: { increment: 0.05 },
            contentEncrypted: this.crypto.encrypt(JSON.stringify(correction))
          }
        });
      }
    });
  }
}

function safeAnswer(): MentorAnswer {
  return { reply: SAFE_COMPLETION, corrections: [], encouragement: "Let's keep practising safely.", nextQuestion: "What everyday situation would you like to practise?" };
}

function sessionLanguage(snapshot: unknown): "en" | "de" {
  if (snapshot && typeof snapshot === "object" && "learningLanguage" in snapshot) {
    return (snapshot as { learningLanguage?: unknown }).learningLanguage === "de" ? "de" : "en";
  }
  return "en";
}

export function redact(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "[phone]")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[payment-card]")
    .trim();
}

export function contentHash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function categoryLabel(category: string): string {
  const labels: Record<string, string> = { GRAMMAR: "gramatyka", VOCABULARY: "słownictwo", WORD_ORDER: "szyk zdania", AGREEMENT: "zgodność form", TENSE: "czasy", ARTICLE: "przedimki", PREPOSITION: "przyimki", REGISTER: "styl i rejestr", NATURALNESS: "naturalne brzmienie", OTHER: "precyzja wypowiedzi" };
  return labels[category] ?? labels.OTHER;
}

export function formatTranscriptLocally(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return "";
  const capitalized = text.charAt(0).toLocaleUpperCase("en") + text.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : capitalized + ".";
}