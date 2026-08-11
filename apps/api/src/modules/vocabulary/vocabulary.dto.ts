import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateVocabularyEntryDto {
  @IsIn(["en", "de"]) language: "en" | "de";
  @IsString() @MinLength(1) @MaxLength(120) term: string;
  @IsString() @MinLength(1) @MaxLength(240) translation: string;
  @IsOptional() @IsString() @MaxLength(500) example?: string;
  @IsOptional() @IsString() @MaxLength(500) notes?: string;
  @IsOptional() @IsString() @MaxLength(32) sourceType?: string;
}
