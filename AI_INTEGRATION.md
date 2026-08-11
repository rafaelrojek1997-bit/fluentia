# AI mentor integration

The conversation runtime uses a provider port (`AiProviderAdapter`) and an OpenAI adapter. Provider-specific code is isolated from conversation orchestration, persistence, encryption, and safety controls.

## Runtime flow

1. Authenticate the learner and verify ownership of an active session.
2. Encrypt the original message with AES-256-GCM and redact direct identifiers from operational context.
3. Moderate input using `omni-moderation-latest`.
4. Generate a schema-constrained mentor response through the Responses API.
5. Validate the response locally with Zod and moderate the final learner-visible text.
6. Persist both turns and encrypted correction evidence.
7. Allow the learner to report a specific output from inside the application.

The API fails closed when either the AI provider key or encryption key is missing. It never substitutes demo text for a provider response.

## Local configuration

Set `OPENAI_API_KEY` in `apps/api/.env`. `DATA_ENCRYPTION_KEY` must contain a base64-encoded 32-byte key. `OPENAI_MODEL` defaults to `gpt-5.6-terra` for a quality/cost balance and can be changed without modifying code.

After PostgreSQL is available, apply migrations and load scenarios:

```powershell
pnpm --filter @mentor/api prisma migrate deploy
pnpm --filter @mentor/api prisma:seed
pnpm --filter @mentor/api start:dev
```

Swagger is available at `http://localhost:3001/docs`.
