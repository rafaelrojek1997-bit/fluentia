import { Injectable, NotFoundException } from "@nestjs/common";
import { MasteryState, ReviewRating } from "@prisma/client";
import { ContentCryptoService } from "../../infrastructure/crypto/content-crypto.service";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { RewardsService } from "../rewards/rewards.service";

type CorrectionContent = { original: string; corrected: string; explanation?: string; category?: string };

@Injectable()
export class ReviewService {
  constructor(private readonly db: PrismaService, private readonly crypto: ContentCryptoService, private readonly rewards: RewardsService) {}

  async library(userId: string, language: "en" | "de" = "en") {
    const [rows, scenarios] = await Promise.all([
      this.db.learningItem.findMany({ where: { userId, language, active: true }, orderBy: { updatedAt: "desc" }, take: 100 }),
      this.db.scenario.findMany({ where: { status: "ACTIVE" }, orderBy: { publishedAt: "desc" }, select: { id: true, slug: true, title: true, description: true, supportedLevels: true } })
    ]);
    const personal = rows.flatMap(row => {
      try {
        const content = JSON.parse(this.crypto.decrypt(row.contentEncrypted)) as CorrectionContent;
        if (!content.corrected) return [];
        return [{ id: row.id, kind: "PERSONAL", title: content.corrected, original: content.original, description: content.explanation, category: content.category, state: row.state, reviewCount: row.reviewCount }];
      } catch { return []; }
    });
    return { personal, scenarios };
  }
  async queue(userId: string, rawLimit: string, language: "en" | "de" = "en") {
    const limit = Math.min(Math.max(Number(rawLimit) || 10, 1), 30);
    const now = new Date();
    const rows = await this.db.learningItem.findMany({
      where: { userId, language, active: true, OR: [{ dueAt: null }, { dueAt: { lte: now } }] },
      orderBy: [{ priority: "desc" }, { dueAt: "asc" }, { createdAt: "desc" }], take: limit
    });
    const items = rows.flatMap(row => {
      try {
        const content = JSON.parse(this.crypto.decrypt(row.contentEncrypted)) as CorrectionContent;
        if (!content.original || !content.corrected) return [];
        return [{ id: row.id, ...content, state: row.state, reviewCount: row.reviewCount, dueAt: row.dueAt }];
      } catch { return []; }
    });
    const total = await this.db.learningItem.count({ where: { userId, language, active: true, OR: [{ dueAt: null }, { dueAt: { lte: now } }] } });
    return { items, total };
  }

  async submit(userId: string, learningItemId: string, answer: string, rating: ReviewRating, responseTimeMs?: number) {
    const item = await this.db.learningItem.findFirst({ where: { id: learningItemId, userId, active: true } });
    if (!item) throw new NotFoundException({ code: "REVIEW_ITEM_NOT_FOUND" });
    const content = JSON.parse(this.crypto.decrypt(item.contentEncrypted)) as CorrectionContent;
    const correct = normalizeReviewAnswer(answer) === normalizeReviewAnswer(content.corrected);
    const effectiveRating = correct ? rating : ReviewRating.AGAIN;
    const schedule = reviewSchedule(effectiveRating, item.reviewCount);
    const previousState = { state: item.state, stability: Number(item.stability), difficulty: Number(item.difficulty), dueAt: item.dueAt };
    const next = {
      state: schedule.state, stability: schedule.stability, difficulty: schedule.difficulty,
      dueAt: schedule.dueAt, lastReviewedAt: new Date(), reviewCount: { increment: 1 },
      lapseCount: effectiveRating === ReviewRating.AGAIN ? { increment: 1 } : undefined,
      algorithmVersion: "fluentia-review-v1", version: { increment: 1 }
    };
    await this.db.$transaction(async tx => {
      await tx.reviewAttempt.create({ data: {
        userId, learningItemId, rating: effectiveRating,
        responseEncrypted: this.crypto.encrypt(answer), responseTimeMs,
        previousState, resultingState: { state: schedule.state, stability: schedule.stability, difficulty: schedule.difficulty, dueAt: schedule.dueAt },
        algorithmVersion: "fluentia-review-v1", reviewedAt: new Date()
      } });
      await tx.learningItem.update({ where: { id: learningItemId }, data: next });
    });
    await this.rewards.award(userId, 10, "REVIEW_COMPLETED_" + (item.reviewCount + 1), "LEARNING_ITEM", learningItemId);
    return { correct, expectedAnswer: content.corrected, explanation: content.explanation, effectiveRating, nextDueAt: schedule.dueAt };
  }
}

export function normalizeReviewAnswer(value: string) {
  return value.toLocaleLowerCase().replace(/[’‘]/g, "'").replace(/[^\p{L}0-9'\s]/gu, " ").replace(/\s+/g, " ").trim();
}

export function reviewSchedule(rating: ReviewRating, reviewCount: number, now = new Date()) {
  const hours = rating === ReviewRating.AGAIN ? 0.17 : rating === ReviewRating.HARD ? 24 : rating === ReviewRating.GOOD ? Math.max(72, 72 * (reviewCount + 1)) : Math.max(168, 168 * (reviewCount + 1));
  const state = rating === ReviewRating.AGAIN ? MasteryState.LAPSED : rating === ReviewRating.HARD ? MasteryState.LEARNING : rating === ReviewRating.GOOD ? MasteryState.REVIEWING : MasteryState.STABLE;
  const stability = rating === ReviewRating.AGAIN ? 0.2 : rating === ReviewRating.HARD ? 1 : rating === ReviewRating.GOOD ? 3 * (reviewCount + 1) : 7 * (reviewCount + 1);
  const difficulty = rating === ReviewRating.AGAIN ? 0.8 : rating === ReviewRating.HARD ? 0.65 : rating === ReviewRating.GOOD ? 0.45 : 0.3;
  return { dueAt: new Date(now.getTime() + hours * 3600000), state, stability, difficulty };
}
