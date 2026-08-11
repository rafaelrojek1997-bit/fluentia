import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { RewardsModule } from "../rewards/rewards.module";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
@Module({ imports: [AiModule, RewardsModule], controllers: [ConversationController], providers: [ConversationService] })
export class ConversationModule {}
