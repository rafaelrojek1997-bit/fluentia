ALTER TABLE "learner_profiles"
  ADD COLUMN "english_level" "CefrLevel",
  ADD COLUMN "german_level" "CefrLevel";

UPDATE "learner_profiles"
SET "english_level" = COALESCE("current_level", "self_assessed_level", 'A1'::"CefrLevel")
WHERE "english_level" IS NULL;

ALTER TABLE "learning_items" ADD COLUMN "language" VARCHAR(5) NOT NULL DEFAULT 'en';
CREATE INDEX "learning_items_user_id_language_active_due_at_idx" ON "learning_items"("user_id", "language", "active", "due_at");
