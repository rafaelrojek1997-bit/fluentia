import { CefrLevel } from "@prisma/client";
import { IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
export class UpdateProfileDto {
  @IsString() @MaxLength(35) nativeLanguage: string;
  @IsString() @MaxLength(35) explanationLanguage: string;
  @IsOptional() @IsEnum(CefrLevel) selfAssessedLevel?: CefrLevel;
  @IsInt() @Min(10) @Max(840) weeklyMinutes: number;
  @IsString() @MaxLength(32) mentorStyle: string;
  @IsInt() @Min(1) @Max(3) correctionIntensity: number;
  @IsArray() @IsString({ each: true }) interests: string[];
  @IsOptional() @IsString() @MaxLength(160) occupation?: string;
}

export class UpdateLanguageLevelDto {
  @IsIn(["en", "de"]) language: "en" | "de";
  @IsEnum(CefrLevel) level: CefrLevel;
}

export class UpdateLanguageGoalDto {
  @IsIn(["en", "de"]) language: "en" | "de";
  @IsInt() @Min(10) @Max(840) weeklyMinutes: number;
}
