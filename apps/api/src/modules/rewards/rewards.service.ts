import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
@Injectable()
export class RewardsService {
  constructor(private readonly db: PrismaService) {}
  async award(userId: string, amount: number, reason: string, sourceType: string, sourceId: string) {
    const idempotencyKey = [userId, sourceType, sourceId, reason].join(":");
    return this.db.$transaction(async tx => {
      const existing = await tx.xpLedger.findUnique({ where: { idempotencyKey } });
      if (existing) return { awarded: false, amount: 0 };
      await tx.xpLedger.create({ data: { userId, amount, reason, sourceType, sourceId, idempotencyKey } });
      const today = startOfUtcDay(new Date());
      const yesterday = new Date(today); yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const streak = await tx.userStreak.findUnique({ where: { userId } });
      if (!streak) await tx.userStreak.create({ data: { userId, currentDays: 1, longestDays: 1, lastQualifiedDate: today } });
      else if (!streak.lastQualifiedDate || startOfUtcDay(streak.lastQualifiedDate).getTime() !== today.getTime()) {
        const currentDays = streak.lastQualifiedDate && startOfUtcDay(streak.lastQualifiedDate).getTime() === yesterday.getTime() ? streak.currentDays + 1 : 1;
        await tx.userStreak.update({ where: { userId }, data: { currentDays, longestDays: Math.max(streak.longestDays, currentDays), lastQualifiedDate: today } });
      }
      return { awarded: true, amount };
    });
  }
}
export function startOfUtcDay(value: Date) { return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())); }
