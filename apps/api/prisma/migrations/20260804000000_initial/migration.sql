-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETION_PENDING', 'DELETED');

-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('USER', 'SUPPORT', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD', 'MAGIC_LINK');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('TERMS', 'PRIVACY', 'PERSONALIZATION', 'ANALYTICS', 'AI_PROCESSING', 'AUDIO_RETENTION', 'MODEL_IMPROVEMENT', 'MARKETING');

-- CreateEnum
CREATE TYPE "PrivacyRequestType" AS ENUM ('EXPORT', 'DELETE_ACCOUNT', 'DELETE_CONTENT', 'RECTIFY', 'RESTRICT_PROCESSING');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'VERIFYING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "DataOrigin" AS ENUM ('USER_DECLARED', 'OBSERVED', 'AI_INFERRED', 'SYSTEM_DERIVED');

-- CreateEnum
CREATE TYPE "CefrLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('SPEAKING', 'LISTENING', 'READING', 'WRITING', 'GRAMMAR', 'VOCABULARY', 'PRONUNCIATION', 'FLUENCY', 'INTERACTION', 'FUNCTIONAL');

-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('FACT', 'PREFERENCE', 'INTEREST', 'GOAL', 'CONTEXT', 'SUMMARY');

-- CreateEnum
CREATE TYPE "MemoryStatus" AS ENUM ('CANDIDATE', 'ACTIVE', 'REJECTED', 'EXPIRED', 'DELETED');

-- CreateEnum
CREATE TYPE "ScenarioStatus" AS ENUM ('DRAFT', 'REVIEW', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionMode" AS ENUM ('TEXT', 'VOICE', 'MIXED');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('CREATED', 'ACTIVE', 'FINALIZING', 'COMPLETED', 'ABANDONED', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'MENTOR', 'SYSTEM', 'TOOL');

-- CreateEnum
CREATE TYPE "TurnStatus" AS ENUM ('RECEIVED', 'STREAMING', 'COMPLETED', 'FAILED', 'CANCELLED', 'MODERATED');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('DIAGNOSTIC', 'SESSION_FEEDBACK', 'CONTROL_SAMPLE', 'WRITING', 'PRONUNCIATION', 'REVIEW');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'LOW_CONFIDENCE', 'FAILED', 'INVALIDATED');

-- CreateEnum
CREATE TYPE "ErrorCategory" AS ENUM ('GRAMMAR', 'VOCABULARY', 'WORD_ORDER', 'AGREEMENT', 'TENSE', 'ARTICLE', 'PREPOSITION', 'PRONUNCIATION', 'FLUENCY', 'REGISTER', 'NATURALNESS', 'COMPREHENSION', 'TASK_FULFILLMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "MasteryState" AS ENUM ('NEW', 'LEARNING', 'REVIEWING', 'STABLE', 'LAPSED');

-- CreateEnum
CREATE TYPE "LearningItemType" AS ENUM ('PHRASE', 'COLLOCATION', 'GRAMMAR_PATTERN', 'PRONUNCIATION_PATTERN', 'FUNCTIONAL_SKILL', 'ERROR_PATTERN');

-- CreateEnum
CREATE TYPE "ReviewRating" AS ENUM ('AGAIN', 'HARD', 'GOOD', 'EASY');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'REPLACED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CONVERSATION', 'REVIEW', 'PRONUNCIATION', 'DIAGNOSTIC', 'GRAMMAR', 'WRITING', 'READING', 'LISTENING');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('PLANNED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'REPLACED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SpeechAssetStatus" AS ENUM ('UPLOADING', 'READY', 'QUARANTINED', 'PROCESSING', 'PROCESSED', 'DELETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AiTaskStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AiProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'GEMINI', 'OPENROUTER', 'LOCAL');

-- CreateEnum
CREATE TYPE "ModerationDecision" AS ENUM ('ALLOW', 'BLOCK', 'SAFE_COMPLETE', 'REVIEW');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('OPEN', 'TRIAGED', 'ACTIONED', 'DISMISSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('OFFENSIVE', 'SEXUAL', 'VIOLENCE', 'HATE', 'CHILD_SAFETY', 'ILLEGAL', 'SELF_HARM', 'DECEPTIVE', 'PRIVACY', 'INCORRECT_FEEDBACK', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionProvider" AS ENUM ('STRIPE', 'GOOGLE_PLAY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INCOMPLETE', 'TRIALING', 'ACTIVE', 'GRACE_PERIOD', 'ON_HOLD', 'PAUSED', 'PAST_DUE', 'CANCELLED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "EntitlementStatus" AS ENUM ('ACTIVE', 'GRACE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PurchasePlatform" AS ENUM ('WEB', 'ANDROID');

-- CreateEnum
CREATE TYPE "BillingEventStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'IGNORED', 'FAILED');

-- CreateEnum
CREATE TYPE "UsageUnit" AS ENUM ('AI_INPUT_TOKEN', 'AI_OUTPUT_TOKEN', 'VOICE_SECOND', 'STT_SECOND', 'TTS_CHARACTER', 'STORAGE_BYTE', 'SESSION');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'DEAD_LETTER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320),
    "email_normalized" VARCHAR(320),
    "password_hash" VARCHAR(255),
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "locale" VARCHAR(35) NOT NULL DEFAULT 'pl-PL',
    "time_zone" VARCHAR(64) NOT NULL DEFAULT 'Europe/Warsaw',
    "email_verified_at" TIMESTAMPTZ(3),
    "last_signed_in_at" TIMESTAMPTZ(3),
    "deletion_requested_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_identities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" VARCHAR(32) NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    "email_at_provider" VARCHAR(320),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token_hash" VARCHAR(255) NOT NULL,
    "token_family_id" UUID NOT NULL,
    "replaced_by_session_id" UUID,
    "device_name" VARCHAR(120),
    "user_agent_hash" VARCHAR(128),
    "ip_prefix_encrypted" BYTEA,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "last_used_at" TIMESTAMPTZ(3),
    "revoked_at" TIMESTAMPTZ(3),
    "revoke_reason" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "SystemRole" NOT NULL,
    "granted_by" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "one_time_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "purpose" "TokenPurpose" NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "consumed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "totp_credentials" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "secret_encrypted" BYTEA NOT NULL,
    "enabled_at" TIMESTAMPTZ(3),
    "last_used_step" BIGINT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "totp_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recovery_codes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "used_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recovery_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "ConsentType" NOT NULL,
    "policy_version" VARCHAR(40) NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "source" VARCHAR(32) NOT NULL,
    "jurisdiction" VARCHAR(8),
    "recorded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" TIMESTAMPTZ(3),

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "PrivacyRequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "verification_hash" VARCHAR(255),
    "requested_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMPTZ(3),
    "completed_at" TIMESTAMPTZ(3),
    "export_object_key" VARCHAR(1024),
    "failure_code" VARCHAR(80),
    "manifest" JSONB,

    CONSTRAINT "privacy_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "native_language" VARCHAR(35) NOT NULL,
    "explanation_language" VARCHAR(35) NOT NULL,
    "self_assessed_level" "CefrLevel",
    "current_level" "CefrLevel",
    "weekly_minutes" INTEGER NOT NULL DEFAULT 75,
    "correction_intensity" SMALLINT NOT NULL DEFAULT 2,
    "mentor_style" VARCHAR(32) NOT NULL DEFAULT 'supportive',
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "occupation" VARCHAR(160),
    "onboarding_completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "learner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_goals" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "target_date" DATE,
    "priority" SMALLINT NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "learner_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_competencies" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,
    "skill_key" VARCHAR(120) NOT NULL,
    "level" "CefrLevel",
    "score" DECIMAL(6,4) NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "observation_count" INTEGER NOT NULL DEFAULT 0,
    "algorithm_version" VARCHAR(40) NOT NULL,
    "last_observed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "learner_competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_memories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "MemoryType" NOT NULL,
    "status" "MemoryStatus" NOT NULL DEFAULT 'CANDIDATE',
    "key" VARCHAR(120) NOT NULL,
    "value_encrypted" BYTEA NOT NULL,
    "origin" "DataOrigin" NOT NULL,
    "confidence" DECIMAL(5,4),
    "source_type" VARCHAR(40),
    "source_id" UUID,
    "consent_record_id" UUID,
    "expires_at" TIMESTAMPTZ(3),
    "last_used_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "learner_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ScenarioStatus" NOT NULL DEFAULT 'DRAFT',
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "supported_levels" "CefrLevel"[],
    "supported_modes" "SessionMode"[],
    "learning_objectives" JSONB NOT NULL,
    "success_rubric" JSONB NOT NULL,
    "configuration" JSONB NOT NULL,
    "published_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "scenario_id" UUID NOT NULL,
    "plan_activity_id" UUID,
    "mode" "SessionMode" NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'CREATED',
    "target_level" "CefrLevel" NOT NULL,
    "mentor_style" VARCHAR(32) NOT NULL,
    "correction_intensity" SMALLINT NOT NULL,
    "policy_snapshot" JSONB NOT NULL,
    "started_at" TIMESTAMPTZ(3),
    "ended_at" TIMESTAMPTZ(3),
    "last_sequence" INTEGER NOT NULL DEFAULT 0,
    "failure_code" VARCHAR(80),
    "deleted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "conversation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_turns" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "actor" "ActorType" NOT NULL,
    "status" "TurnStatus" NOT NULL DEFAULT 'RECEIVED',
    "content_encrypted" BYTEA,
    "content_redacted" TEXT,
    "language" VARCHAR(35),
    "parent_turn_id" UUID,
    "ai_run_id" UUID,
    "token_count" INTEGER,
    "completed_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_turns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "session_id" UUID,
    "type" "AssessmentType" NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "rubric_version" VARCHAR(40) NOT NULL,
    "result" JSONB,
    "confidence" DECIMAL(5,4),
    "ai_run_id" UUID,
    "invalidated_at" TIMESTAMPTZ(3),
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_observations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assessment_id" UUID,
    "turn_id" UUID,
    "skill" "SkillType" NOT NULL,
    "skill_key" VARCHAR(120) NOT NULL,
    "origin" "DataOrigin" NOT NULL,
    "value" DECIMAL(6,4) NOT NULL,
    "weight" DECIMAL(5,4) NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "evidence_encrypted" BYTEA,
    "error_category" "ErrorCategory",
    "algorithm_version" VARCHAR(40) NOT NULL,
    "observed_at" TIMESTAMPTZ(3) NOT NULL,
    "invalidated_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learner_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "LearningItemType" NOT NULL,
    "canonical_key" VARCHAR(255) NOT NULL,
    "content_encrypted" BYTEA NOT NULL,
    "context_encrypted" BYTEA,
    "source_type" VARCHAR(40) NOT NULL,
    "source_id" UUID,
    "priority" DECIMAL(5,4) NOT NULL DEFAULT 0.5,
    "state" "MasteryState" NOT NULL DEFAULT 'NEW',
    "stability" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "difficulty" DECIMAL(5,4) NOT NULL DEFAULT 0.5,
    "due_at" TIMESTAMPTZ(3),
    "last_reviewed_at" TIMESTAMPTZ(3),
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "lapse_count" INTEGER NOT NULL DEFAULT 0,
    "algorithm_version" VARCHAR(40) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "learning_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "learning_item_id" UUID NOT NULL,
    "plan_activity_id" UUID,
    "rating" "ReviewRating" NOT NULL,
    "response_encrypted" BYTEA,
    "response_time_ms" INTEGER,
    "previous_state" JSONB NOT NULL,
    "resulting_state" JSONB NOT NULL,
    "algorithm_version" VARCHAR(40) NOT NULL,
    "reviewed_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_plans" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "daily_budget_minutes" INTEGER NOT NULL,
    "rationale" JSONB NOT NULL,
    "algorithm_version" VARCHAR(40) NOT NULL,
    "activated_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "learning_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_activities" (
    "id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "type" "ActivityType" NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduled_for" DATE NOT NULL,
    "estimated_minutes" INTEGER NOT NULL,
    "priority" SMALLINT NOT NULL DEFAULT 1,
    "configuration" JSONB NOT NULL,
    "reason" JSONB NOT NULL,
    "started_at" TIMESTAMPTZ(3),
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "plan_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speech_assets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "session_id" UUID,
    "status" "SpeechAssetStatus" NOT NULL DEFAULT 'UPLOADING',
    "object_key" VARCHAR(1024) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size_bytes" BIGINT,
    "checksum_sha256" CHAR(64),
    "duration_ms" INTEGER,
    "retention_until" TIMESTAMPTZ(3) NOT NULL,
    "consent_record_id" UUID,
    "deleted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speech_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speech_transcripts" (
    "id" UUID NOT NULL,
    "speech_asset_id" UUID NOT NULL,
    "provider" VARCHAR(40) NOT NULL,
    "provider_model" VARCHAR(120) NOT NULL,
    "language" VARCHAR(35) NOT NULL,
    "text_encrypted" BYTEA NOT NULL,
    "confidence" DECIMAL(5,4),
    "segments" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speech_transcripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pronunciation_analyses" (
    "id" UUID NOT NULL,
    "speech_asset_id" UUID NOT NULL,
    "algorithm_version" VARCHAR(40) NOT NULL,
    "signal_quality" DECIMAL(5,4) NOT NULL,
    "intelligibility" DECIMAL(5,4),
    "fluency" DECIMAL(5,4),
    "pace" DECIMAL(7,3),
    "rhythm" DECIMAL(5,4),
    "intonation" DECIMAL(5,4),
    "confidence" DECIMAL(5,4) NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pronunciation_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_definitions" (
    "id" UUID NOT NULL,
    "task_type" VARCHAR(80) NOT NULL,
    "version" INTEGER NOT NULL,
    "status" VARCHAR(24) NOT NULL,
    "template" TEXT NOT NULL,
    "input_schema" JSONB NOT NULL,
    "output_schema" JSONB NOT NULL,
    "manifest" JSONB NOT NULL,
    "checksum" CHAR(64) NOT NULL,
    "created_by" UUID NOT NULL,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_runs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "task_type" VARCHAR(80) NOT NULL,
    "task_version" INTEGER NOT NULL,
    "status" "AiTaskStatus" NOT NULL DEFAULT 'QUEUED',
    "provider" "AiProvider" NOT NULL,
    "model" VARCHAR(160) NOT NULL,
    "prompt_definition_id" UUID NOT NULL,
    "routing_version" VARCHAR(40) NOT NULL,
    "data_region" VARCHAR(32) NOT NULL,
    "input_hash" CHAR(64) NOT NULL,
    "output_hash" CHAR(64),
    "input_tokens" INTEGER,
    "output_tokens" INTEGER,
    "cost_micros" BIGINT,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "latency_ms" INTEGER,
    "first_token_ms" INTEGER,
    "fallback_count" INTEGER NOT NULL DEFAULT 0,
    "validation_result" JSONB,
    "provider_request_id" VARCHAR(255),
    "error_code" VARCHAR(80),
    "started_at" TIMESTAMPTZ(3),
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_reports" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "session_id" UUID,
    "turn_id" UUID,
    "reason" "ReportReason" NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'OPEN',
    "comment_encrypted" BYTEA,
    "content_snapshot_encrypted" BYTEA,
    "assigned_to" UUID,
    "decision" "ModerationDecision",
    "resolution_code" VARCHAR(80),
    "resolved_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" "SubscriptionProvider" NOT NULL,
    "provider_customer_id" VARCHAR(255),
    "provider_subscription_id" VARCHAR(255) NOT NULL,
    "product_key" VARCHAR(80) NOT NULL,
    "base_plan_key" VARCHAR(80),
    "status" "SubscriptionStatus" NOT NULL,
    "current_period_start" TIMESTAMPTZ(3),
    "current_period_end" TIMESTAMPTZ(3),
    "trial_end" TIMESTAMPTZ(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "purchase_token_encrypted" BYTEA,
    "original_transaction_id" VARCHAR(255),
    "country_code" CHAR(2),
    "acknowledged_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entitlements" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "subscription_id" UUID,
    "key" VARCHAR(80) NOT NULL,
    "status" "EntitlementStatus" NOT NULL,
    "valid_from" TIMESTAMPTZ(3) NOT NULL,
    "valid_until" TIMESTAMPTZ(3),
    "source" VARCHAR(40) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "entitlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_events" (
    "id" UUID NOT NULL,
    "provider" "SubscriptionProvider" NOT NULL,
    "provider_event_id" VARCHAR(255) NOT NULL,
    "status" "BillingEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "event_type" VARCHAR(120) NOT NULL,
    "payload_encrypted" BYTEA NOT NULL,
    "occurred_at" TIMESTAMPTZ(3),
    "processed_at" TIMESTAMPTZ(3),
    "error_code" VARCHAR(80),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_ledger" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "unit" "UsageUnit" NOT NULL,
    "quantity" BIGINT NOT NULL,
    "cost_micros" BIGINT,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "source_type" VARCHAR(40) NOT NULL,
    "source_id" UUID,
    "idempotency_key" VARCHAR(160) NOT NULL,
    "recorded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_devices" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "installation_id" UUID NOT NULL,
    "platform" VARCHAR(20) NOT NULL,
    "push_token_encrypted" BYTEA,
    "app_version_code" INTEGER,
    "os_api_level" INTEGER,
    "locale" VARCHAR(35),
    "last_seen_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "template_key" VARCHAR(80) NOT NULL,
    "template_version" INTEGER NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "scheduled_at" TIMESTAMPTZ(3) NOT NULL,
    "sent_at" TIMESTAMPTZ(3),
    "failure_code" VARCHAR(80),
    "idempotency_key" VARCHAR(160) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_streaks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "current_days" INTEGER NOT NULL DEFAULT 0,
    "longest_days" INTEGER NOT NULL DEFAULT 0,
    "last_qualified_date" DATE,
    "freeze_credits" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_ledger" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" VARCHAR(80) NOT NULL,
    "source_type" VARCHAR(40) NOT NULL,
    "source_id" UUID,
    "idempotency_key" VARCHAR(160) NOT NULL,
    "earned_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "actor_type" VARCHAR(24) NOT NULL,
    "action" VARCHAR(120) NOT NULL,
    "resource_type" VARCHAR(80) NOT NULL,
    "resource_id" UUID,
    "subject_user_id" UUID,
    "outcome" VARCHAR(24) NOT NULL,
    "reason" VARCHAR(255),
    "correlation_id" UUID NOT NULL,
    "metadata" JSONB,
    "previous_hash" CHAR(64),
    "entry_hash" CHAR(64) NOT NULL,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "aggregate_type" VARCHAR(80) NOT NULL,
    "aggregate_id" UUID NOT NULL,
    "event_type" VARCHAR(120) NOT NULL,
    "schema_version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "correlation_id" UUID NOT NULL,
    "causation_id" UUID,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL,
    "available_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error_code" VARCHAR(80),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inbox_messages" (
    "id" UUID NOT NULL,
    "consumer" VARCHAR(100) NOT NULL,
    "message_id" UUID NOT NULL,
    "event_type" VARCHAR(120) NOT NULL,
    "schema_version" INTEGER NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'RECEIVED',
    "received_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error_code" VARCHAR(80),

    CONSTRAINT "inbox_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_records" (
    "id" UUID NOT NULL,
    "scope" VARCHAR(80) NOT NULL,
    "key_hash" CHAR(64) NOT NULL,
    "actor_id" UUID,
    "request_hash" CHAR(64) NOT NULL,
    "response_status" INTEGER,
    "response_body" JSONB,
    "resource_id" UUID,
    "locked_until" TIMESTAMPTZ(3),
    "completed_at" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_tombstones" (
    "id" UUID NOT NULL,
    "subject_hash" CHAR(64) NOT NULL,
    "deletion_request_id" UUID NOT NULL,
    "deleted_at" TIMESTAMPTZ(3) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "reason" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_tombstones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_normalized_key" ON "users"("email_normalized");

-- CreateIndex
CREATE INDEX "users_status_created_at_idx" ON "users"("status", "created_at");

-- CreateIndex
CREATE INDEX "auth_identities_user_id_idx" ON "auth_identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_identities_provider_provider_user_id_key" ON "auth_identities"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_refresh_token_hash_key" ON "auth_sessions"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "auth_sessions_user_id_revoked_at_idx" ON "auth_sessions"("user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "auth_sessions_token_family_id_idx" ON "auth_sessions"("token_family_id");

-- CreateIndex
CREATE INDEX "auth_sessions_expires_at_idx" ON "auth_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "user_roles_role_idx" ON "user_roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_key" ON "user_roles"("user_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "one_time_tokens_token_hash_key" ON "one_time_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "one_time_tokens_user_id_purpose_expires_at_idx" ON "one_time_tokens"("user_id", "purpose", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "totp_credentials_user_id_key" ON "totp_credentials"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "recovery_codes_code_hash_key" ON "recovery_codes"("code_hash");

-- CreateIndex
CREATE INDEX "recovery_codes_user_id_used_at_idx" ON "recovery_codes"("user_id", "used_at");

-- CreateIndex
CREATE INDEX "consent_records_user_id_type_recorded_at_idx" ON "consent_records"("user_id", "type", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "privacy_requests_user_id_requested_at_idx" ON "privacy_requests"("user_id", "requested_at" DESC);

-- CreateIndex
CREATE INDEX "privacy_requests_status_requested_at_idx" ON "privacy_requests"("status", "requested_at");

-- CreateIndex
CREATE UNIQUE INDEX "learner_profiles_user_id_key" ON "learner_profiles"("user_id");

-- CreateIndex
CREATE INDEX "learner_goals_user_id_active_priority_idx" ON "learner_goals"("user_id", "active", "priority");

-- CreateIndex
CREATE INDEX "learner_competencies_user_id_score_idx" ON "learner_competencies"("user_id", "score");

-- CreateIndex
CREATE UNIQUE INDEX "learner_competencies_user_id_skill_skill_key_key" ON "learner_competencies"("user_id", "skill", "skill_key");

-- CreateIndex
CREATE INDEX "learner_memories_user_id_status_type_idx" ON "learner_memories"("user_id", "status", "type");

-- CreateIndex
CREATE INDEX "learner_memories_expires_at_idx" ON "learner_memories"("expires_at");

-- CreateIndex
CREATE INDEX "scenarios_status_published_at_idx" ON "scenarios"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "scenarios_slug_version_key" ON "scenarios"("slug", "version");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_sessions_plan_activity_id_key" ON "conversation_sessions"("plan_activity_id");

-- CreateIndex
CREATE INDEX "conversation_sessions_user_id_created_at_idx" ON "conversation_sessions"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "conversation_sessions_status_updated_at_idx" ON "conversation_sessions"("status", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_turns_ai_run_id_key" ON "conversation_turns"("ai_run_id");

-- CreateIndex
CREATE INDEX "conversation_turns_session_id_created_at_idx" ON "conversation_turns"("session_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_turns_session_id_sequence_key" ON "conversation_turns"("session_id", "sequence");

-- CreateIndex
CREATE INDEX "assessments_user_id_created_at_idx" ON "assessments"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "assessments_session_id_type_idx" ON "assessments"("session_id", "type");

-- CreateIndex
CREATE INDEX "learner_observations_user_id_skill_skill_key_observed_at_idx" ON "learner_observations"("user_id", "skill", "skill_key", "observed_at" DESC);

-- CreateIndex
CREATE INDEX "learner_observations_assessment_id_idx" ON "learner_observations"("assessment_id");

-- CreateIndex
CREATE INDEX "learning_items_user_id_active_due_at_idx" ON "learning_items"("user_id", "active", "due_at");

-- CreateIndex
CREATE INDEX "learning_items_user_id_state_idx" ON "learning_items"("user_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "learning_items_user_id_type_canonical_key_key" ON "learning_items"("user_id", "type", "canonical_key");

-- CreateIndex
CREATE INDEX "review_attempts_learning_item_id_reviewed_at_idx" ON "review_attempts"("learning_item_id", "reviewed_at" DESC);

-- CreateIndex
CREATE INDEX "review_attempts_user_id_reviewed_at_idx" ON "review_attempts"("user_id", "reviewed_at" DESC);

-- CreateIndex
CREATE INDEX "learning_plans_user_id_status_period_start_idx" ON "learning_plans"("user_id", "status", "period_start" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "learning_plans_user_id_period_start_status_key" ON "learning_plans"("user_id", "period_start", "status");

-- CreateIndex
CREATE INDEX "plan_activities_plan_id_scheduled_for_status_idx" ON "plan_activities"("plan_id", "scheduled_for", "status");

-- CreateIndex
CREATE UNIQUE INDEX "speech_assets_object_key_key" ON "speech_assets"("object_key");

-- CreateIndex
CREATE INDEX "speech_assets_user_id_created_at_idx" ON "speech_assets"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "speech_assets_retention_until_status_idx" ON "speech_assets"("retention_until", "status");

-- CreateIndex
CREATE UNIQUE INDEX "speech_transcripts_speech_asset_id_key" ON "speech_transcripts"("speech_asset_id");

-- CreateIndex
CREATE INDEX "pronunciation_analyses_speech_asset_id_created_at_idx" ON "pronunciation_analyses"("speech_asset_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "prompt_definitions_task_type_status_idx" ON "prompt_definitions"("task_type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_definitions_task_type_version_key" ON "prompt_definitions"("task_type", "version");

-- CreateIndex
CREATE INDEX "ai_runs_user_id_created_at_idx" ON "ai_runs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "ai_runs_task_type_provider_status_created_at_idx" ON "ai_runs"("task_type", "provider", "status", "created_at");

-- CreateIndex
CREATE INDEX "ai_runs_provider_request_id_idx" ON "ai_runs"("provider_request_id");

-- CreateIndex
CREATE INDEX "moderation_reports_status_created_at_idx" ON "moderation_reports"("status", "created_at");

-- CreateIndex
CREATE INDEX "moderation_reports_user_id_created_at_idx" ON "moderation_reports"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "subscriptions_user_id_status_idx" ON "subscriptions"("user_id", "status");

-- CreateIndex
CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions"("current_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_provider_provider_subscription_id_key" ON "subscriptions"("provider", "provider_subscription_id");

-- CreateIndex
CREATE INDEX "entitlements_user_id_status_valid_until_idx" ON "entitlements"("user_id", "status", "valid_until");

-- CreateIndex
CREATE UNIQUE INDEX "entitlements_user_id_key_source_key" ON "entitlements"("user_id", "key", "source");

-- CreateIndex
CREATE INDEX "billing_events_status_created_at_idx" ON "billing_events"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "billing_events_provider_provider_event_id_key" ON "billing_events"("provider", "provider_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "usage_ledger_idempotency_key_key" ON "usage_ledger"("idempotency_key");

-- CreateIndex
CREATE INDEX "usage_ledger_user_id_recorded_at_idx" ON "usage_ledger"("user_id", "recorded_at");

-- CreateIndex
CREATE INDEX "usage_ledger_unit_recorded_at_idx" ON "usage_ledger"("unit", "recorded_at");

-- CreateIndex
CREATE INDEX "user_devices_user_id_revoked_at_idx" ON "user_devices"("user_id", "revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_devices_user_id_installation_id_key" ON "user_devices"("user_id", "installation_id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_idempotency_key_key" ON "notifications"("idempotency_key");

-- CreateIndex
CREATE INDEX "notifications_status_scheduled_at_idx" ON "notifications"("status", "scheduled_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_streaks_user_id_key" ON "user_streaks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "xp_ledger_idempotency_key_key" ON "xp_ledger"("idempotency_key");

-- CreateIndex
CREATE INDEX "xp_ledger_user_id_earned_at_idx" ON "xp_ledger"("user_id", "earned_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_user_id_occurred_at_idx" ON "audit_logs"("actor_user_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_subject_user_id_occurred_at_idx" ON "audit_logs"("subject_user_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_resource_type_resource_id_idx" ON "audit_logs"("resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "audit_logs_correlation_id_idx" ON "audit_logs"("correlation_id");

-- CreateIndex
CREATE INDEX "outbox_events_status_available_at_idx" ON "outbox_events"("status", "available_at");

-- CreateIndex
CREATE INDEX "outbox_events_aggregate_type_aggregate_id_occurred_at_idx" ON "outbox_events"("aggregate_type", "aggregate_id", "occurred_at");

-- CreateIndex
CREATE INDEX "inbox_messages_status_received_at_idx" ON "inbox_messages"("status", "received_at");

-- CreateIndex
CREATE UNIQUE INDEX "inbox_messages_consumer_message_id_key" ON "inbox_messages"("consumer", "message_id");

-- CreateIndex
CREATE INDEX "idempotency_records_expires_at_idx" ON "idempotency_records"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_records_scope_key_hash_key" ON "idempotency_records"("scope", "key_hash");

-- CreateIndex
CREATE UNIQUE INDEX "data_tombstones_subject_hash_key" ON "data_tombstones"("subject_hash");

-- CreateIndex
CREATE INDEX "data_tombstones_expires_at_idx" ON "data_tombstones"("expires_at");

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "totp_credentials" ADD CONSTRAINT "totp_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_codes" ADD CONSTRAINT "recovery_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_requests" ADD CONSTRAINT "privacy_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_goals" ADD CONSTRAINT "learner_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_competencies" ADD CONSTRAINT "learner_competencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_memories" ADD CONSTRAINT "learner_memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "scenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_plan_activity_id_fkey" FOREIGN KEY ("plan_activity_id") REFERENCES "plan_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_turns" ADD CONSTRAINT "conversation_turns_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_turns" ADD CONSTRAINT "conversation_turns_ai_run_id_fkey" FOREIGN KEY ("ai_run_id") REFERENCES "ai_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_ai_run_id_fkey" FOREIGN KEY ("ai_run_id") REFERENCES "ai_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_observations" ADD CONSTRAINT "learner_observations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_observations" ADD CONSTRAINT "learner_observations_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_observations" ADD CONSTRAINT "learner_observations_turn_id_fkey" FOREIGN KEY ("turn_id") REFERENCES "conversation_turns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_items" ADD CONSTRAINT "learning_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_learning_item_id_fkey" FOREIGN KEY ("learning_item_id") REFERENCES "learning_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_plan_activity_id_fkey" FOREIGN KEY ("plan_activity_id") REFERENCES "plan_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_plans" ADD CONSTRAINT "learning_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_activities" ADD CONSTRAINT "plan_activities_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "learning_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speech_assets" ADD CONSTRAINT "speech_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speech_assets" ADD CONSTRAINT "speech_assets_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speech_transcripts" ADD CONSTRAINT "speech_transcripts_speech_asset_id_fkey" FOREIGN KEY ("speech_asset_id") REFERENCES "speech_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pronunciation_analyses" ADD CONSTRAINT "pronunciation_analyses_speech_asset_id_fkey" FOREIGN KEY ("speech_asset_id") REFERENCES "speech_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_prompt_definition_id_fkey" FOREIGN KEY ("prompt_definition_id") REFERENCES "prompt_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_reports" ADD CONSTRAINT "moderation_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_reports" ADD CONSTRAINT "moderation_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_reports" ADD CONSTRAINT "moderation_reports_turn_id_fkey" FOREIGN KEY ("turn_id") REFERENCES "conversation_turns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_ledger" ADD CONSTRAINT "usage_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_ledger" ADD CONSTRAINT "xp_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
