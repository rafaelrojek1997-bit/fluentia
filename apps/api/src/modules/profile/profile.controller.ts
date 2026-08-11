import { Body, Controller, Delete, Get, NotFoundException, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { ContentCryptoService } from "../../infrastructure/crypto/content-crypto.service";
import { UpdateLanguageGoalDto, UpdateLanguageLevelDto, UpdateProfileDto } from "./profile.dto";
@ApiTags("Learner") @Controller("learner-profile")
export class ProfileController {
  constructor(private readonly db: PrismaService, private readonly crypto: ContentCryptoService) {}
  @Get() async get(@CurrentUser() user: AuthenticatedUser) { const profile = await this.db.learnerProfile.findUnique({ where: { userId: user.id } }); if (!profile) throw new NotFoundException({ code: "RESOURCE_NOT_FOUND" }); return profile; }
  @Put() async update(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) { return this.db.learnerProfile.upsert({ where: { userId: user.id }, create: { userId: user.id, ...dto }, update: { ...dto, version: { increment: 1 } } }); }
  @Put("level") async updateLanguageLevel(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateLanguageLevelDto) {
    const field = dto.language === "de" ? "germanLevel" : "englishLevel";
    return this.db.learnerProfile.update({
      where: { userId: user.id },
      data: { [field]: dto.level, currentLevel: dto.level, version: { increment: 1 } },
      select: { englishLevel: true, germanLevel: true }
    });
  }
  @Put("goal") async updateLanguageGoal(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateLanguageGoalDto) {
    const field = dto.language === "de" ? "germanWeeklyMinutes" : "englishWeeklyMinutes";
    return this.db.learnerProfile.update({
      where: { userId: user.id },
      data: { [field]: dto.weeklyMinutes, weeklyMinutes: dto.weeklyMinutes, version: { increment: 1 } },
      select: { englishWeeklyMinutes: true, germanWeeklyMinutes: true }
    });
  }
  @Get("competencies") async competencies(@CurrentUser() user: AuthenticatedUser) { return this.db.learnerCompetency.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }); }
  @Delete("memories/:id") async deleteMemory(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { const memory = await this.db.learnerMemory.findFirst({ where: { id, userId: user.id, deletedAt: null } }); if (!memory) throw new NotFoundException({ code: "MEMORY_NOT_FOUND" }); await this.db.learnerMemory.update({ where: { id }, data: { deletedAt: new Date(), status: "REJECTED", version: { increment: 1 } } }); return { deleted: true }; }
  @Get("memories") async memories(@CurrentUser() user: AuthenticatedUser) { const items = await this.db.learnerMemory.findMany({ where: { userId: user.id, deletedAt: null }, orderBy: { createdAt: "desc" } }); return items.map(({ valueEncrypted, ...item }) => ({ ...item, value: this.crypto.decrypt(valueEncrypted) })); }
}
