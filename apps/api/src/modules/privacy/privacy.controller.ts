import { Body, Controller, Get, Param, ParseEnumPipe, Post, Put } from "@nestjs/common";
import { ConsentType, RequestStatus } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { CreatePrivacyRequestDto, SetConsentDto } from "./privacy.dto";
@ApiTags("Privacy") @Controller("me")
export class PrivacyController {
  constructor(private readonly db: PrismaService) {}
  @Get("consents") async list(@CurrentUser() user: AuthenticatedUser) { const all = await this.db.consentRecord.findMany({ where: { userId: user.id }, orderBy: { recordedAt: "desc" } }); const latest = new Map<ConsentType, (typeof all)[number]>(); for (const record of all) if (!latest.has(record.type)) latest.set(record.type, record); return [...latest.values()]; }
  @Put("consents/:type") async set(@CurrentUser() user: AuthenticatedUser, @Param("type", new ParseEnumPipe(ConsentType)) type: ConsentType, @Body() dto: SetConsentDto) { return this.db.consentRecord.create({ data: { userId: user.id, type, granted: dto.granted, policyVersion: dto.policyVersion, source: "settings", withdrawnAt: dto.granted ? null : new Date() } }); }
  @Post("privacy-requests") async request(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePrivacyRequestDto) { const existing = await this.db.privacyRequest.findFirst({ where: { userId: user.id, type: dto.type, status: { in: [RequestStatus.PENDING, RequestStatus.VERIFYING, RequestStatus.IN_PROGRESS] } } }); return existing ?? this.db.privacyRequest.create({ data: { userId: user.id, type: dto.type } }); }
  @Get("privacy-requests/:id") async status(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return this.db.privacyRequest.findFirstOrThrow({ where: { id, userId: user.id }, select: { id: true, type: true, status: true, requestedAt: true, completedAt: true, failureCode: true } }); }
}
