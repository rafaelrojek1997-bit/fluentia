# Testing strategy

## Test layers

- Unit tests validate DTOs, environment rules, encryption, authentication rotation, AI response validation, conversation safety, privacy and profile behavior.
- API E2E tests boot the NestJS application with production middleware and verify HTTP validation, problem details, security headers, authentication boundaries and refresh-cookie scope.
- Browser E2E tests run in desktop Chrome and a Pixel 7 viewport. They verify navigation, conversation input, keyboard submission, mentor feedback and theme accessibility.
- Production builds are required for both applications.

AI tests use a deterministic provider double. CI never sends learner data to an external model and never consumes paid OpenAI tokens.

## Commands

```powershell
pnpm test:all
pnpm test:coverage
```

Individual commands:

```powershell
pnpm --filter @mentor/api test
pnpm --filter @mentor/api test:coverage
pnpm --filter @mentor/web test
pnpm --filter @mentor/web test:e2e
pnpm --filter @mentor/web test:coverage
```

Vitest enforces at least 90% line coverage in both workspaces. Playwright retains traces, screenshots and videos when a browser test fails.

## Current verified baseline

- API: 40 tests, 91.3% line coverage.
- Web unit: 9 tests, 100% line coverage for instrumented client modules.
- Browser E2E: 8 tests across desktop and mobile Chromium.
