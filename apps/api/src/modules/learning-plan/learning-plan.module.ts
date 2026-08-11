import { Module } from "@nestjs/common";
import { RewardsModule } from "../rewards/rewards.module";
import { LearningPlanController } from "./learning-plan.controller";
import { LearningPlanService } from "./learning-plan.service";
@Module({ imports: [RewardsModule], controllers: [LearningPlanController], providers: [LearningPlanService] })
export class LearningPlanModule {}
