import { Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Headers } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/current-user.decorator";
import { LearningPlanService } from "./learning-plan.service";
@ApiTags("Learning plan") @Controller("learning-plan")
export class LearningPlanController {
  constructor(private readonly plans: LearningPlanService) {}
  @Get("current") current(@CurrentUser() user: AuthenticatedUser, @Headers("x-learning-language") language = "en") { return this.plans.current(user.id, language === "de" ? "de" : "en"); }
  @Get("daily") daily(@CurrentUser() user: AuthenticatedUser, @Headers("x-learning-language") language = "en") { return this.plans.daily(user.id, language === "de" ? "de" : "en"); }
  @HttpCode(200) @Post("activities/:id/complete") complete(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return this.plans.complete(user.id, id); }
}
