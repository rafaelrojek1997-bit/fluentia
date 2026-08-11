ALTER TABLE "learner_profiles"
  ADD COLUMN "english_weekly_minutes" INTEGER NOT NULL DEFAULT 75,
  ADD COLUMN "german_weekly_minutes" INTEGER NOT NULL DEFAULT 75;

UPDATE "learner_profiles" SET "english_weekly_minutes" = "weekly_minutes", "german_weekly_minutes" = "weekly_minutes";
