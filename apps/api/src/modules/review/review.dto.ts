import { ReviewRating } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export class SubmitReviewDto {
  @IsUUID() learningItemId: string;
  @IsString() @MaxLength(2000) answer: string;
  @IsEnum(ReviewRating) rating: ReviewRating;
  @IsOptional() @IsInt() @Min(0) @Max(600000) responseTimeMs?: number;
}
