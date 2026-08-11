import { Module } from "@nestjs/common";
import { RewardsModule } from "../rewards/rewards.module";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
@Module({ imports: [RewardsModule], controllers: [ReviewController], providers: [ReviewService] })
export class ReviewModule {}
