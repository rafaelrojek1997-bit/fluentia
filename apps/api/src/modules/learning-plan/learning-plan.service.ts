import { Injectable, NotFoundException } from "@nestjs/common";
import { ActivityStatus, ActivityType, PlanStatus } from "@prisma/client";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { RewardsService } from "../rewards/rewards.service";

const templates = [
  { type: ActivityType.CONVERSATION, title: "Rozmowa z mentorem", description: "Przećwicz praktyczną sytuację tekstowo lub głosowo.", href: "/conversation" },
  { type: ActivityType.REVIEW, title: "Powtórka własnych korekt", description: "Utrwal poprawne wersje zdań z wcześniejszych rozmów.", href: "/review" },
  { type: ActivityType.PRONUNCIATION, title: "Trening wymowy", description: "Posłuchaj wzorca i powtórz angielskie zwroty na głos.", href: "/pronunciation" },
  { type: ActivityType.CONVERSATION, title: "Rozmowa utrwalająca", description: "Wykorzystaj poznane zwroty w nowym kontekście.", href: "/conversation" },
  { type: ActivityType.REVIEW, title: "Podsumowanie tygodnia", description: "Powtórz najważniejsze korekty z całego tygodnia.", href: "/review" }
];
const germanTemplates = [
  { type: ActivityType.CONVERSATION, title: "Alltagsspräch mit Lukas", description: "Przećwicz praktyczną sytuację po niemiecku tekstowo lub głosowo.", href: "/conversation" },
  { type: ActivityType.REVIEW, title: "Powtórka niemieckich korekt", description: "Utrwal rodzajniki, szyk zdań i naturalne niemieckie zwroty.", href: "/review" },
  { type: ActivityType.PRONUNCIATION, title: "Wymowa niemiecka", description: "Ćwicz głoski ch, r, ü, ö i ä oraz rytm zdania.", href: "/pronunciation" },
  { type: ActivityType.CONVERSATION, title: "Niemiecki w praktyce", description: "Wykorzystaj nowe zwroty w scenariuszu życia w Niemczech.", href: "/conversation" },
  { type: ActivityType.REVIEW, title: "Podsumowanie tygodnia", description: "Powtórz najważniejsze niemieckie korekty i słownictwo.", href: "/review" }
];


@Injectable()
export class LearningPlanService {
  constructor(private readonly db: PrismaService, private readonly rewards: RewardsService) {}
  async current(userId: string, language: "en" | "de" = "en") {
    const { start, end } = currentWeek();
    let plan = await this.db.learningPlan.findFirst({ where: { userId, language, periodStart: start, status: PlanStatus.ACTIVE }, include: { activities: { orderBy: [{ scheduledFor: "asc" }, { priority: "asc" }] } } });
    if (!plan) {
      const profile = await this.db.learnerProfile.findUnique({ where: { userId }, select: { weeklyMinutes: true, englishWeeklyMinutes: true, germanWeeklyMinutes: true, englishLevel: true, germanLevel: true, currentLevel: true, selfAssessedLevel: true } });
      const weeklyMinutes = (language === "de" ? profile?.germanWeeklyMinutes : profile?.englishWeeklyMinutes) ?? profile?.weeklyMinutes ?? 75;
      const dailyBudgetMinutes = Math.max(10, Math.ceil(weeklyMinutes / 5));
      const level = (language === "de" ? profile?.germanLevel : profile?.englishLevel) ?? profile?.currentLevel ?? profile?.selfAssessedLevel ?? "A1";
      const selectedTemplates = language === "de" ? germanTemplates : templates;
      plan = await this.db.learningPlan.create({
        data: {
          userId, language, status: PlanStatus.ACTIVE, periodStart: start, periodEnd: end, dailyBudgetMinutes,
          rationale: { language, level, weeklyMinutes, message: `Plan ${language === "de" ? "niemieckiego" : "angielskiego"} łączy aktywne mówienie, wymowę i powtórki dopasowane do poziomu ${level}.` },
          algorithmVersion: "fluentia-weekly-v2", activatedAt: new Date(),
          activities: { create: selectedTemplates.map((template, index) => ({
            type: template.type, status: index === 0 ? ActivityStatus.AVAILABLE : ActivityStatus.PLANNED,
            scheduledFor: addDays(start, index), estimatedMinutes: dailyBudgetMinutes, priority: index + 1,
            configuration: { title: template.title, description: template.description, href: template.href },
            reason: { source: index === 1 || index === 4 ? "learner_corrections" : "balanced_weekly_practice" }
          })) }
        }, include: { activities: { orderBy: [{ scheduledFor: "asc" }, { priority: "asc" }] } }
      });
    }
    return plan;
  }
  async daily(userId: string, language: "en" | "de" = "en") {
    const plan = await this.current(userId, language);
    const today = new Date(); const todayKey = today.toISOString().slice(0, 10);
    const exact = plan.activities.find(activity => activity.scheduledFor.toISOString().slice(0, 10) === todayKey);
    const mission = exact ?? plan.activities.find(activity => activity.status !== ActivityStatus.COMPLETED) ?? plan.activities.at(-1) ?? null;
    const rationale = plan.rationale && typeof plan.rationale === "object" ? plan.rationale as { level?: string } : {};
    return {
      date: todayKey, language, level: rationale.level ?? "A1", mission,
      isToday: Boolean(exact && mission?.id === exact.id),
      completed: plan.activities.filter(activity => activity.status === ActivityStatus.COMPLETED).length,
      total: plan.activities.length,
      allDone: plan.activities.every(activity => activity.status === ActivityStatus.COMPLETED)
    };
  }
  async complete(userId: string, activityId: string) {
    const activity = await this.db.planActivity.findFirst({ where: { id: activityId, plan: { userId, status: PlanStatus.ACTIVE } } });
    if (!activity) throw new NotFoundException({ code: "PLAN_ACTIVITY_NOT_FOUND" });
    if (activity.status === ActivityStatus.COMPLETED) return activity;
    const completed = await this.db.planActivity.update({ where: { id: activityId }, data: { status: ActivityStatus.COMPLETED, completedAt: new Date() } });
    await this.rewards.award(userId, 20, "PLAN_ACTIVITY_COMPLETED", "PLAN_ACTIVITY", activityId);
    return completed;
  }
}
export function currentWeek(now = new Date()) {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  const start = addDays(date, -mondayOffset);
  return { start, end: addDays(start, 6) };
}
function addDays(date: Date, days: number) { const result = new Date(date); result.setUTCDate(result.getUTCDate() + days); return result; }
