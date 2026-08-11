import { Controller, Get, Headers } from "@nestjs/common";
import { ConversationStatus } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";

@ApiTags("Account") @Controller("me")
export class MeController {
  constructor(private readonly db: PrismaService) {}

  @Get() async get(@CurrentUser() auth: AuthenticatedUser) {
    return this.db.user.findUniqueOrThrow({ where: { id: auth.id }, select: { id: true, email: true, status: true, locale: true, timeZone: true, emailVerifiedAt: true, createdAt: true, version: true, profile: { select: { onboardingCompletedAt: true } } } });
  }

  @Get("dashboard") async dashboard(@CurrentUser() auth: AuthenticatedUser) {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const [user, activeConversation, completedSessions, completedToday, correctionCount, xp, streak, latestFeedback] = await Promise.all([
      this.db.user.findUniqueOrThrow({ where: { id: auth.id }, select: { email: true, profile: { select: { currentLevel: true, selfAssessedLevel: true, weeklyMinutes: true } } } }),
      this.db.conversationSession.findFirst({ where: { userId: auth.id, status: ConversationStatus.ACTIVE, deletedAt: null }, orderBy: { updatedAt: "desc" }, select: { id: true, targetLevel: true, updatedAt: true, scenario: { select: { slug: true, title: true } } } }),
      this.db.conversationSession.count({ where: { userId: auth.id, status: ConversationStatus.COMPLETED, deletedAt: null } }),
      this.db.conversationSession.count({ where: { userId: auth.id, status: ConversationStatus.COMPLETED, endedAt: { gte: startOfDay }, deletedAt: null } }),
      this.db.learnerObservation.count({ where: { userId: auth.id, invalidatedAt: null, errorCategory: { not: null } } }),
      this.db.xpLedger.aggregate({ where: { userId: auth.id }, _sum: { amount: true } }),
      this.db.userStreak.findUnique({ where: { userId: auth.id }, select: { currentDays: true, longestDays: true } }),
      this.db.assessment.findFirst({ where: { userId: auth.id, type: "SESSION_FEEDBACK", status: "COMPLETED" }, orderBy: { completedAt: "desc" }, select: { result: true, completedAt: true } })
    ]);
    const emailName = user.email?.split("@")[0]?.split(/[._-]/)[0] || "Uczniu";
    return {
      learner: { name: emailName.charAt(0).toUpperCase() + emailName.slice(1), level: user.profile?.currentLevel ?? user.profile?.selfAssessedLevel ?? "A1", weeklyMinutes: user.profile?.weeklyMinutes ?? 75 },
      stats: { completedSessions, completedToday, correctionCount, xp: xp._sum.amount ?? 0, streakDays: streak?.currentDays ?? 0, longestStreakDays: streak?.longestDays ?? 0 },
      activeConversation,
      latestFeedback
    };
  }

  @Get("progress") async progress(@CurrentUser() auth: AuthenticatedUser) {
    const since = new Date(); since.setDate(since.getDate() - 30);
    const [profile, sessions, completedSessions, turns, corrections, reviewAttempts, masteredItems, completedActivities, competencies, streak, xp] = await Promise.all([
      this.db.learnerProfile.findUnique({ where: { userId: auth.id }, select: { currentLevel: true, selfAssessedLevel: true, weeklyMinutes: true } }),
      this.db.conversationSession.findMany({ where: { userId: auth.id, createdAt: { gte: since }, deletedAt: null }, select: { createdAt: true, status: true } }),
      this.db.conversationSession.count({ where: { userId: auth.id, status: "COMPLETED", deletedAt: null } }),
      this.db.conversationTurn.count({ where: { session: { userId: auth.id, deletedAt: null }, actor: "USER" } }),
      this.db.learnerObservation.groupBy({ by: ["errorCategory"], where: { userId: auth.id, invalidatedAt: null, errorCategory: { not: null } }, _count: { _all: true } }),
      this.db.reviewAttempt.count({ where: { userId: auth.id } }),
      this.db.learningItem.count({ where: { userId: auth.id, state: "STABLE", active: true } }),
      this.db.planActivity.count({ where: { plan: { userId: auth.id }, status: "COMPLETED" } }),
      this.db.learnerCompetency.findMany({ where: { userId: auth.id }, select: { skill: true, score: true, confidence: true, observationCount: true } }),
      this.db.userStreak.findUnique({ where: { userId: auth.id }, select: { currentDays: true, longestDays: true } }),
      this.db.xpLedger.aggregate({ where: { userId: auth.id }, _sum: { amount: true } })
    ]);
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (29 - index));
      const next = new Date(date); next.setDate(next.getDate() + 1);
      return { date: date.toISOString(), sessions: sessions.filter(item => item.createdAt >= date && item.createdAt < next).length };
    });
    const correctionTotal = corrections.reduce((sum, item) => sum + item._count._all, 0);
    return {
      level: profile?.currentLevel ?? profile?.selfAssessedLevel ?? "A1",
      weeklyMinutes: profile?.weeklyMinutes ?? 75,
      totals: { completedSessions, learnerTurns: turns, corrections: correctionTotal, reviewAttempts, masteredItems, completedActivities, xp: xp._sum.amount ?? 0 },
      streak: streak ?? { currentDays: 0, longestDays: 0 },
      competencies: competencies.map(item => ({ skill: item.skill, score: Math.round(Number(item.score) * 100), confidence: Number(item.confidence), observationCount: item.observationCount })),
      correctionCategories: corrections.map(item => ({ category: item.errorCategory, count: item._count._all })).sort((a, b) => b.count - a.count),
      activity30Days: days
    };
  }

  @Get("language-progress") async languageProgress(@CurrentUser() auth: AuthenticatedUser, @Headers("x-learning-language") requestedLanguage = "en") {
    const language: "en" | "de" = requestedLanguage === "de" ? "de" : "en";
    const since = new Date(); since.setDate(since.getDate() - 30);
    const allSessions = await this.db.conversationSession.findMany({ where: { userId: auth.id, deletedAt: null }, select: { id: true, createdAt: true, status: true, policySnapshot: true } });
    const languageSessions = allSessions.filter(item => conversationLanguage(item.policySnapshot) === language);
    const sessionIds = languageSessions.map(item => item.id);
    const sessions = languageSessions.filter(item => item.createdAt >= since);
    const [profile, turns, corrections, reviewAttempts, masteredItems, completedActivities, competencies, streak, xp] = await Promise.all([
      this.db.learnerProfile.findUnique({ where: { userId: auth.id }, select: { englishLevel: true, germanLevel: true, currentLevel: true, selfAssessedLevel: true, weeklyMinutes: true, englishWeeklyMinutes: true, germanWeeklyMinutes: true } }),
      this.db.conversationTurn.count({ where: { sessionId: { in: sessionIds }, actor: "USER" } }),
      this.db.learnerObservation.groupBy({ by: ["errorCategory"], where: { userId: auth.id, turn: { sessionId: { in: sessionIds } }, invalidatedAt: null, errorCategory: { not: null } }, _count: { _all: true } }),
      this.db.reviewAttempt.count({ where: { userId: auth.id, learningItem: { language } } }),
      this.db.learningItem.count({ where: { userId: auth.id, language, state: "STABLE", active: true } }),
      this.db.planActivity.count({ where: { plan: { userId: auth.id }, status: "COMPLETED" } }),
      this.db.learnerCompetency.findMany({ where: { userId: auth.id }, select: { skill: true, score: true, confidence: true, observationCount: true } }),
      this.db.userStreak.findUnique({ where: { userId: auth.id }, select: { currentDays: true, longestDays: true } }),
      this.db.xpLedger.aggregate({ where: { userId: auth.id }, _sum: { amount: true } })
    ]);
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (29 - index));
      const next = new Date(date); next.setDate(next.getDate() + 1);
      return { date: date.toISOString(), sessions: sessions.filter(item => item.createdAt >= date && item.createdAt < next).length };
    });
    const correctionTotal = corrections.reduce((sum, item) => sum + item._count._all, 0);
    const level = language === "de" ? profile?.germanLevel : profile?.englishLevel;
    return {
      language,
      level: level ?? profile?.currentLevel ?? profile?.selfAssessedLevel ?? "A1",
      weeklyMinutes: (language === "de" ? profile?.germanWeeklyMinutes : profile?.englishWeeklyMinutes) ?? profile?.weeklyMinutes ?? 75,
      totals: { completedSessions: languageSessions.filter(item => item.status === "COMPLETED").length, learnerTurns: turns, corrections: correctionTotal, reviewAttempts, masteredItems, completedActivities, xp: xp._sum.amount ?? 0 },
      streak: streak ?? { currentDays: 0, longestDays: 0 },
      competencies: competencies.map(item => ({ skill: item.skill, score: Math.round(Number(item.score) * 100), confidence: Number(item.confidence), observationCount: item.observationCount })),
      correctionCategories: corrections.map(item => ({ category: item.errorCategory, count: item._count._all })).sort((a, b) => b.count - a.count),
      activity30Days: days
    };
  }
  @Get("language-dashboard") async languageDashboard(@CurrentUser() auth: AuthenticatedUser, @Headers("x-learning-language") requestedLanguage = "en") {
    const language: "en" | "de" = requestedLanguage === "de" ? "de" : "en";
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(startOfDay); startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
    const [user, allSessions, xp, streak] = await Promise.all([
      this.db.user.findUniqueOrThrow({ where: { id: auth.id }, select: { email: true, profile: { select: { englishLevel: true, germanLevel: true, currentLevel: true, selfAssessedLevel: true, weeklyMinutes: true, englishWeeklyMinutes: true, germanWeeklyMinutes: true } } } }),
      this.db.conversationSession.findMany({ where: { userId: auth.id, deletedAt: null }, orderBy: { updatedAt: "desc" }, select: { id: true, status: true, targetLevel: true, createdAt: true, updatedAt: true, endedAt: true, policySnapshot: true, scenario: { select: { slug: true, title: true } } } }),
      this.db.xpLedger.aggregate({ where: { userId: auth.id }, _sum: { amount: true } }),
      this.db.userStreak.findUnique({ where: { userId: auth.id }, select: { currentDays: true, longestDays: true } })
    ]);
    const sessions = allSessions.filter(item => conversationLanguage(item.policySnapshot) === language);
    const sessionIds = sessions.map(item => item.id);
    const [correctionCount, latestFeedback] = await Promise.all([
      this.db.learnerObservation.count({ where: { userId: auth.id, turn: { sessionId: { in: sessionIds } }, invalidatedAt: null, errorCategory: { not: null } } }),
      this.db.assessment.findFirst({ where: { userId: auth.id, sessionId: { in: sessionIds }, type: "SESSION_FEEDBACK", status: "COMPLETED" }, orderBy: { completedAt: "desc" }, select: { result: true, completedAt: true } })
    ]);
    const activeConversation = sessions.find(item => item.status === ConversationStatus.ACTIVE) ?? null;
    const completed = sessions.filter(item => item.status === ConversationStatus.COMPLETED);
    const level = (language === "de" ? user.profile?.germanLevel : user.profile?.englishLevel) ?? user.profile?.currentLevel ?? user.profile?.selfAssessedLevel ?? "A1";
    const emailName = user.email?.split("@")[0]?.split(/[._-]/)[0] || "Uczniu";
    const weeklyGoalMinutes = (language === "de" ? user.profile?.germanWeeklyMinutes : user.profile?.englishWeeklyMinutes) ?? user.profile?.weeklyMinutes ?? 75;
    const weeklyPracticeMinutes = completed.filter(item => item.endedAt && item.endedAt >= startOfWeek).reduce((sum, item) => {
      return sum + Math.max(1, Math.min(120, Math.round(((item.endedAt?.getTime() ?? item.updatedAt.getTime()) - item.createdAt.getTime()) / 60000)));
    }, 0);
    return {
      language,
      learner: { name: emailName.charAt(0).toUpperCase() + emailName.slice(1), level, weeklyMinutes: weeklyGoalMinutes },
      stats: {
        completedSessions: completed.length,
        completedToday: completed.filter(item => item.endedAt && item.endedAt >= startOfDay).length,
        correctionCount, weeklyPracticeMinutes, weeklyGoalMinutes, xp: xp._sum.amount ?? 0,
        streakDays: streak?.currentDays ?? 0, longestStreakDays: streak?.longestDays ?? 0
      },
      activeConversation,
      latestFeedback
    };
  }
  @Get("weekly-report") async weeklyReport(@CurrentUser() auth: AuthenticatedUser, @Headers("x-learning-language") requestedLanguage = "en") {
    const language: "en" | "de" = requestedLanguage === "de" ? "de" : "en";
    const now = new Date(); const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const end = new Date(start); end.setDate(end.getDate() + 7);
    const [profile, allSessions] = await Promise.all([
      this.db.learnerProfile.findUnique({ where: { userId: auth.id }, select: { englishLevel: true, germanLevel: true, currentLevel: true, selfAssessedLevel: true, weeklyMinutes: true, englishWeeklyMinutes: true, germanWeeklyMinutes: true } }),
      this.db.conversationSession.findMany({ where: { userId: auth.id, deletedAt: null, createdAt: { lt: end } }, select: { id: true, status: true, createdAt: true, updatedAt: true, endedAt: true, policySnapshot: true } })
    ]);
    const sessions = allSessions.filter(item => conversationLanguage(item.policySnapshot) === language && (item.endedAt ?? item.updatedAt) >= start);
    const sessionIds = sessions.map(item => item.id);
    const [learnerTurns, corrections, reviewAttempts, newVocabulary, completedMissions, xp] = await Promise.all([
      this.db.conversationTurn.count({ where: { sessionId: { in: sessionIds }, actor: "USER", createdAt: { gte: start, lt: end } } }),
      this.db.learnerObservation.groupBy({ by: ["errorCategory"], where: { userId: auth.id, turn: { sessionId: { in: sessionIds } }, invalidatedAt: null, errorCategory: { not: null }, observedAt: { gte: start, lt: end } }, _count: { _all: true } }),
      this.db.reviewAttempt.count({ where: { userId: auth.id, learningItem: { language }, reviewedAt: { gte: start, lt: end } } }),
      this.db.vocabularyEntry.count({ where: { userId: auth.id, language, deletedAt: null, createdAt: { gte: start, lt: end } } }),
      this.db.planActivity.count({ where: { plan: { userId: auth.id, language }, status: "COMPLETED", completedAt: { gte: start, lt: end } } }),
      this.db.xpLedger.aggregate({ where: { userId: auth.id, earnedAt: { gte: start, lt: end } }, _sum: { amount: true } })
    ]);
    const completed = sessions.filter(item => item.status === ConversationStatus.COMPLETED && item.endedAt);
    const practiceMinutes = completed.reduce((sum, item) => sum + Math.max(1, Math.min(120, Math.round(((item.endedAt?.getTime() ?? item.updatedAt.getTime()) - item.createdAt.getTime()) / 60000))), 0);
    const weeklyGoalMinutes = (language === "de" ? profile?.germanWeeklyMinutes : profile?.englishWeeklyMinutes) ?? profile?.weeklyMinutes ?? 75;
    const level = (language === "de" ? profile?.germanLevel : profile?.englishLevel) ?? profile?.currentLevel ?? profile?.selfAssessedLevel ?? "A1";
    const sortedCorrections = corrections.map(item => ({ category: item.errorCategory ?? "OTHER", count: item._count._all })).sort((a, b) => b.count - a.count);
    const topError = sortedCorrections[0] ?? null;
    const errorLabel = topError ? reportCategoryLabel(topError.category) : null;
    const recommendations = [
      topError ? `Skup kolejną rozmowę na obszarze „${errorLabel}” — pojawił się ${topError.count} razy.` : "Ukończ rozmowę z mentorem, aby otrzymać pierwszą diagnozę błędów.",
      reviewAttempts < 10 ? `Wykonaj jeszcze ${10 - reviewAttempts} krótkich powtórek zapisanych korekt.` : "Utrzymaj tempo powtórek — w tym tygodniu wykonano ich co najmniej 10.",
      newVocabulary < 5 ? `Dodaj ${5 - newVocabulary} nowych zwrotów z rozmów do osobistego słownika.` : "Wykorzystaj nowe zwroty ze słownika w kolejnej rozmowie."
    ];
    const activity = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start); date.setDate(date.getDate() + index); const next = new Date(date); next.setDate(next.getDate() + 1);
      return { date: date.toISOString(), sessions: completed.filter(item => item.endedAt && item.endedAt >= date && item.endedAt < next).length };
    });
    const goalPercent = Math.min(100, Math.round(practiceMinutes / Math.max(1, weeklyGoalMinutes) * 100));
    return {
      language, level, periodStart: start, periodEnd: end, goalPercent,
      summary: goalPercent >= 100 ? "Cel tygodniowy osiągnięty. Świetna regularność!" : completed.length ? "Budujesz regularność — kolejna krótka sesja wyraźnie przybliży Cię do celu." : "Ten tydzień może zacząć się od jednej krótkiej rozmowy.",
      totals: { practiceMinutes, weeklyGoalMinutes, completedSessions: completed.length, learnerTurns, corrections: sortedCorrections.reduce((sum, item) => sum + item.count, 0), reviewAttempts, newVocabulary, completedMissions, xp: xp._sum.amount ?? 0 },
      topError: topError ? { ...topError, label: errorLabel } : null,
      correctionCategories: sortedCorrections.map(item => ({ ...item, label: reportCategoryLabel(item.category) })),
      recommendations, activity
    };
  }
}

function conversationLanguage(snapshot: unknown): "en" | "de" {
  return snapshot && typeof snapshot === "object" && "learningLanguage" in snapshot && (snapshot as { learningLanguage?: unknown }).learningLanguage === "de" ? "de" : "en";
}

function reportCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    GRAMMAR: "gramatyka", VOCABULARY: "słownictwo", WORD_ORDER: "szyk zdania", TENSE: "czasy",
    ARTICLE: "rodzajniki i przedimki", PREPOSITION: "przyimki", NATURALNESS: "naturalne brzmienie",
    REGISTER: "styl wypowiedzi", PRONUNCIATION: "wymowa", OTHER: "poprawność wypowiedzi"
  };
  return labels[category] ?? category.toLocaleLowerCase("pl");
}
