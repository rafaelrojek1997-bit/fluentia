import { Body, Controller, Get, Headers, HttpCode, HttpException, Param, Post, Query } from "@nestjs/common";
import { CefrLevel, ConversationStatus } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { ConversationService } from "./conversation.service";
import { ConversationAssistanceDto, CreateConversationDto, NormalizeTranscriptDto, ReportContentDto, SubmitTurnDto } from "./conversation.dto";

@ApiTags("Conversation") @Controller()
export class ConversationController {
  constructor(private readonly db: PrismaService, private readonly conversations: ConversationService) {}
  @Get("scenarios") async scenarios() { return this.db.scenario.findMany({ where: { status: "ACTIVE" }, select: { id: true, slug: true, version: true, title: true, description: true, supportedLevels: true, supportedModes: true, learningObjectives: true } }); }
  @Post("conversations") async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateConversationDto, @Headers("x-learning-language") requestedLanguage?: string) {
    const scenario = await this.db.scenario.findFirstOrThrow({ where: { id: dto.scenarioId, status: "ACTIVE" } });
    return this.db.conversationSession.create({ data: { userId: user.id, scenarioId: scenario.id, planActivityId: dto.planActivityId, mode: dto.mode, targetLevel: dto.targetLevel ?? CefrLevel.B1, mentorStyle: "supportive", correctionIntensity: 2, policySnapshot: { scenarioVersion: scenario.version, aiEnabled: true, learningLanguage: dto.learningLanguage ?? (requestedLanguage === "de" ? "de" : "en") } } });
  }
  @Get("conversations") async list(@CurrentUser() user: AuthenticatedUser, @Query("limit") raw = "20") { const limit = Math.min(Math.max(Number(raw) || 20, 1), 100); const items = await this.db.conversationSession.findMany({ where: { userId: user.id, deletedAt: null }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: limit }); return { items, pageInfo: { nextCursor: null, hasNextPage: items.length === limit } }; }
  @Get("conversations/:id") async get(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return this.db.conversationSession.findFirstOrThrow({ where: { id, userId: user.id, deletedAt: null }, include: { turns: { select: { id: true, sequence: true, actor: true, status: true, contentRedacted: true, createdAt: true }, orderBy: { sequence: "asc" } } } }); }
  @Post("conversations/:id/start") async start(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { const session = await this.db.conversationSession.findFirstOrThrow({ where: { id, userId: user.id } }); if (session.status !== ConversationStatus.CREATED) throw new HttpException({ code: "STATE_CONFLICT" }, 409); return this.db.conversationSession.update({ where: { id }, data: { status: ConversationStatus.ACTIVE, startedAt: new Date(), version: { increment: 1 } } }); }
  @Post("conversations/:id/turns") async turn(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: SubmitTurnDto) { return this.conversations.submitTurn(user.id, id, dto.content); }
  @HttpCode(200) @Post("conversations/:id/transcript/normalize") async normalizeTranscript(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: NormalizeTranscriptDto) { return this.conversations.normalizeTranscript(user.id, id, dto.content); }
  @HttpCode(200) @Post("conversations/:id/hints") async assist(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: ConversationAssistanceDto) { return this.conversations.getAssistance(user.id, id, dto.kind, dto.draft); }
  @HttpCode(201) @Post("conversations/:id/turns/:turnId/report") async report(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Param("turnId") turnId: string, @Body() dto: ReportContentDto) { return this.conversations.reportTurn(user.id, id, turnId, dto.reason, dto.comment); }
  @HttpCode(200) @Post("conversations/:id/finish") async finish(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return this.conversations.finishSession(user.id, id); }
}
