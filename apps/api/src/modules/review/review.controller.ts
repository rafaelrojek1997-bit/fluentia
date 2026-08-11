import { Body, Controller, Get, Headers, HttpCode, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { SubmitReviewDto } from "./review.dto";
import { ReviewService } from "./review.service";

@ApiTags("Review") @Controller("review")
export class ReviewController {
  constructor(private readonly reviews: ReviewService) {}
  @Get("library") library(@CurrentUser() user: AuthenticatedUser, @Headers("x-learning-language") language = "en") { return this.reviews.library(user.id, language === "de" ? "de" : "en"); }
  @Get("queue") queue(@CurrentUser() user: AuthenticatedUser, @Query("limit") limit = "10", @Headers("x-learning-language") language = "en") { return this.reviews.queue(user.id, limit, language === "de" ? "de" : "en"); }
  @HttpCode(200) @Post("attempts") submit(@CurrentUser() user: AuthenticatedUser, @Body() dto: SubmitReviewDto) { return this.reviews.submit(user.id, dto.learningItemId, dto.answer, dto.rating, dto.responseTimeMs); }
}
