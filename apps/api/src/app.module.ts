import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { validateEnvironment } from "./config/environment";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { CryptoModule } from "./infrastructure/crypto/crypto.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { ConversationModule } from "./modules/conversation/conversation.module";
import { HealthModule } from "./modules/health/health.module";
import { MeModule } from "./modules/me/me.module";
import { PrivacyModule } from "./modules/privacy/privacy.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { ReviewModule } from "./modules/review/review.module";
import { LearningPlanModule } from "./modules/learning-plan/learning-plan.module";
import { VocabularyModule } from "./modules/vocabulary/vocabulary.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]), PrismaModule, CryptoModule, AuthModule, HealthModule, MeModule, ProfileModule, PrivacyModule, ConversationModule, ReviewModule, LearningPlanModule, VocabularyModule],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, { provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
