ALTER TABLE "learning_plans" ADD COLUMN "language" VARCHAR(5) NOT NULL DEFAULT 'en';

DROP INDEX "learning_plans_user_id_period_start_status_key";
CREATE UNIQUE INDEX "learning_plans_user_id_language_period_start_status_key"
  ON "learning_plans"("user_id", "language", "period_start", "status");
CREATE INDEX "learning_plans_user_id_language_status_period_start_idx"
  ON "learning_plans"("user_id", "language", "status", "period_start" DESC);
