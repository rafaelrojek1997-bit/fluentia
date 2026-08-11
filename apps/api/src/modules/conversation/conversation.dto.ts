import { CefrLevel, ReportReason, SessionMode } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateConversationDto {
  @IsUUID() scenarioId: string;
  @IsEnum(SessionMode) mode: SessionMode;
  @IsOptional() @IsUUID() planActivityId?: string;
  @IsOptional() @IsEnum(CefrLevel) targetLevel?: CefrLevel;
  @IsOptional() @IsIn(["en", "de"]) learningLanguage?: "en" | "de";
}

export class SubmitTurnDto { @IsString() @MaxLength(8000) content: string; }

export class ConversationAssistanceDto {
  @IsIn(["HINT", "TRANSLATE", "SIMPLIFY", "VOCABULARY"]) kind: "HINT" | "TRANSLATE" | "SIMPLIFY" | "VOCABULARY";
  @IsOptional() @IsString() @MaxLength(2000) draft?: string;
}

export class ReportContentDto {
  @IsEnum(ReportReason) reason: ReportReason;
  @IsOptional() @IsString() @MaxLength(2000) comment?: string;
}
export class NormalizeTranscriptDto { @IsString() @MaxLength(4000) content: string; }
