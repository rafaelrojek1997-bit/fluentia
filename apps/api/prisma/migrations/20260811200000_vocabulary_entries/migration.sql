CREATE TABLE "vocabulary_entries" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "language" VARCHAR(5) NOT NULL,
  "term_encrypted" BYTEA NOT NULL,
  "translation_encrypted" BYTEA NOT NULL,
  "example_encrypted" BYTEA,
  "notes_encrypted" BYTEA,
  "source_type" VARCHAR(32) NOT NULL DEFAULT 'MANUAL',
  "source_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "deleted_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "vocabulary_entries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vocabulary_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "vocabulary_entries_user_id_language_deleted_at_created_at_idx" ON "vocabulary_entries"("user_id", "language", "deleted_at", "created_at" DESC);
