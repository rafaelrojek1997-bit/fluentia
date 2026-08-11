import { BadGatewayException, ConflictException, NotFoundException } from "@nestjs/common";
import { ActorType, ConversationStatus, TurnStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConversationService } from "./conversation.service";

describe("ConversationService", () => {
  let db: any;
  let ai: any;
  let service: ConversationService;
  let sequence: number;
  const activeSession = {
    id: "session-1", status: ConversationStatus.ACTIVE, targetLevel: "B1", mentorStyle: "supportive", correctionIntensity: 2,
    scenario: { slug: "business", title: { en: "Business" } },
    turns: [{ actor: ActorType.MENTOR, contentRedacted: "Welcome" }]
  };

  beforeEach(() => {
    sequence = 0;
    db = {
      conversationSession: { findFirst: vi.fn(async () => activeSession) },
      learnerObservation: { createMany: vi.fn() },
      moderationReport: { create: vi.fn(async () => ({ id: "report-1", status: "OPEN", createdAt: new Date() })) },
      conversationTurn: { findFirst: vi.fn() },
      learningItem: { upsert: vi.fn() },
      $transaction: vi.fn(async (callback: any) => callback({
        conversationSession: { update: vi.fn(async () => ({ lastSequence: ++sequence })) },
        conversationTurn: { create: vi.fn(async ({ data }: any) => ({ id: `turn-${sequence}`, ...data })) },
        learnerObservation: db.learnerObservation,
        learningItem: db.learningItem
      }))
    };
    ai = {
      moderate: vi.fn(async () => ({ flagged: false, categories: [] })),
      generateMentorAnswer: vi.fn(async () => ({
        answer: { reply: "Good opening.", corrections: [{ original: "I welcome you", corrected: "Welcome", explanation: "More natural", category: "NATURALNESS" }], encouragement: "Well done.", nextQuestion: "Shall we review the agenda?" },
        metadata: { provider: "OPENAI", model: "gpt-test", outputTokens: 30 }
      }))
    };
    const crypto = { encrypt: vi.fn((value: string) => Uint8Array.from(Buffer.from(value))), decrypt: vi.fn() };
    service = new ConversationService(db, crypto as any, ai, { award: vi.fn() } as any);
  });

  it("moderates both directions, stores turns and saves correction evidence", async () => {
    const result = await service.submitTurn("user-1", "session-1", "I welcome you");
    expect(ai.moderate).toHaveBeenCalledTimes(2);
    expect(ai.generateMentorAnswer).toHaveBeenCalledWith(expect.objectContaining({ level: "B1", scenario: "business", message: "I welcome you" }));
    expect(db.$transaction).toHaveBeenCalledTimes(3);
    expect(db.learnerObservation.createMany).toHaveBeenCalled();
    expect(db.learningItem.upsert).toHaveBeenCalled();
    expect(result.answer.corrections).toHaveLength(1);
  });

  it("blocks flagged input before generation and returns a safe completion", async () => {
    ai.moderate.mockResolvedValueOnce({ flagged: true, categories: ["violence"] });
    const result = await service.submitTurn("user-1", "session-1", "unsafe input");
    expect(ai.generateMentorAnswer).not.toHaveBeenCalled();
    expect(result.moderated).toBe(true);
    expect(result.moderationCategories).toEqual(["violence"]);
  });

  it("replaces flagged model output with a safe completion", async () => {
    ai.moderate.mockResolvedValueOnce({ flagged: false, categories: [] }).mockResolvedValueOnce({ flagged: true, categories: ["hate"] });
    const result = await service.submitTurn("user-1", "session-1", "hello");
    expect(result.moderated).toBe(true);
    expect(result.answer.corrections).toHaveLength(0);
  });

  it("rejects missing and inactive sessions", async () => {
    db.conversationSession.findFirst.mockResolvedValueOnce(null);
    await expect(service.submitTurn("user-1", "missing", "hello")).rejects.toBeInstanceOf(NotFoundException);
    db.conversationSession.findFirst.mockResolvedValueOnce({ ...activeSession, status: ConversationStatus.COMPLETED });
    await expect(service.submitTurn("user-1", "session-1", "hello")).rejects.toBeInstanceOf(ConflictException);
  });

  it("converts unexpected provider failures to a retryable gateway error", async () => {
    ai.generateMentorAnswer.mockRejectedValue(new Error("network"));
    await expect(service.submitTurn("user-1", "session-1", "hello")).rejects.toBeInstanceOf(BadGatewayException);
  });

  it("creates encrypted in-app reports only for owned turns", async () => {
    db.conversationTurn.findFirst.mockResolvedValueOnce({ id: "turn-1", contentEncrypted: Uint8Array.of(1, 2) });
    await expect(service.reportTurn("user-1", "session-1", "turn-1", "OFFENSIVE", "Not appropriate")).resolves.toMatchObject({ id: "report-1" });
    expect(db.moderationReport.create).toHaveBeenCalled();
    db.conversationTurn.findFirst.mockResolvedValueOnce(null);
    await expect(service.reportTurn("user-1", "session-1", "missing", "OTHER")).rejects.toBeInstanceOf(NotFoundException);
  });
});
