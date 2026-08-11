# Docelowa struktura katalogów — AI English Mentor

## 1. Cel

Dokument definiuje jednoznaczny szkielet monorepo wynikający z [architektury](./ARCHITECTURE.md). Struktura wspiera modularny monolit NestJS, aplikację Next.js, niezależne workery, współdzielone kontrakty oraz infrastrukturę bez mieszania domen i szczegółów dostawców.

Na tym etapie katalogi są specyfikacją docelową. Fizyczne utworzenie kodowego szkieletu nastąpi razem z pierwszą implementacją po zatwierdzeniu schematu danych i API, aby nie wprowadzać pustych atrap ani pakietów, których kontrakty nie są jeszcze znane.

## 2. Założenia monorepo

- Menedżer pakietów: `pnpm` z workspace.
- Orkiestracja zadań: Turborepo.
- Język: TypeScript w trybie strict.
- Aplikacje wdrażalne znajdują się wyłącznie w `apps/`.
- Biblioteki współdzielone znajdują się w `packages/`.
- Kod domenowy backendu pozostaje w aplikacji API, dopóki moduł nie jest faktycznie współdzielony lub wydzielany.
- `packages/` nie może stać się katalogiem przypadkowych helperów.
- Każdy katalog wdrażalny i pakiet ma jawne publiczne API oraz właściciela.
- Testy są kolokowane z kodem; testy przekrojowe mają dedykowane katalogi.

## 3. Drzewo główne

```text
ai-english-mentor/
├─ apps/
│  ├─ web/
│  ├─ api/
│  └─ worker/
├─ packages/
│  ├─ api-contracts/
│  ├─ config/
│  ├─ observability/
│  ├─ test-kit/
│  ├─ ui/
│  └─ validation/
├─ tooling/
│  ├─ eslint-config/
│  ├─ typescript-config/
│  └─ scripts/
├─ infrastructure/
│  ├─ docker/
│  ├─ terraform/
│  ├─ monitoring/
│  └─ environments/
├─ tests/
│  ├─ e2e/
│  ├─ performance/
│  ├─ security/
│  ├─ resilience/
│  └─ ai-evals/
├─ docs/
│  ├─ architecture/
│  ├─ api/
│  ├─ product/
│  ├─ operations/
│  ├─ security/
│  └─ decisions/
├─ .github/
│  ├─ workflows/
│  ├─ ISSUE_TEMPLATE/
│  ├─ CODEOWNERS
│  └─ pull_request_template.md
├─ .changeset/
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.json
├─ compose.yaml
├─ .editorconfig
├─ .gitignore
├─ .env.example
├─ LICENSE
├─ SECURITY.md
├─ CONTRIBUTING.md
└─ README.md
```

## 4. Aplikacja webowa

```text
apps/web/
├─ public/
│  ├─ icons/
│  ├─ images/
│  └─ manifest.webmanifest
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/
│  │  │  ├─ page.tsx
│  │  │  ├─ pricing/
│  │  │  ├─ scenarios/
│  │  │  └─ legal/
│  │  ├─ (auth)/
│  │  │  ├─ sign-in/
│  │  │  ├─ sign-up/
│  │  │  ├─ verify-email/
│  │  │  ├─ forgot-password/
│  │  │  ├─ reset-password/
│  │  │  └─ oauth/callback/
│  │  ├─ (app)/
│  │  │  ├─ onboarding/
│  │  │  ├─ dashboard/
│  │  │  ├─ learn/
│  │  │  ├─ conversations/
│  │  │  ├─ review/
│  │  │  ├─ pronunciation/
│  │  │  ├─ progress/
│  │  │  ├─ subscription/
│  │  │  └─ settings/
│  │  ├─ (admin)/
│  │  │  └─ admin/
│  │  │     ├─ users/
│  │  │     ├─ subscriptions/
│  │  │     ├─ prompts/
│  │  │     ├─ moderation/
│  │  │     ├─ ai-usage/
│  │  │     ├─ audit/
│  │  │     └─ flags/
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  └─ health/
│  │  ├─ error.tsx
│  │  ├─ global-error.tsx
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  ├─ not-found.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ onboarding/
│  │  ├─ dashboard/
│  │  ├─ conversation/
│  │  ├─ speech/
│  │  ├─ feedback/
│  │  ├─ review/
│  │  ├─ learning-plan/
│  │  ├─ progress/
│  │  ├─ billing/
│  │  ├─ privacy/
│  │  └─ admin/
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ feedback/
│  │  └─ accessibility/
│  ├─ lib/
│  │  ├─ api-client/
│  │  ├─ auth/
│  │  ├─ realtime/
│  │  ├─ analytics/
│  │  ├─ feature-flags/
│  │  ├─ errors/
│  │  └─ browser/
│  ├─ providers/
│  ├─ hooks/
│  ├─ styles/
│  ├─ instrumentation.ts
│  └─ middleware.ts
├─ tests/
│  ├─ accessibility/
│  └─ visual/
├─ next.config.ts
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ vitest.config.ts
├─ tsconfig.json
└─ package.json
```

### 4.1 Organizacja feature

Każdy katalog `features/<feature>/` może zawierać tylko potrzebne elementy:

```text
features/conversation/
├─ api/
│  ├─ conversation.queries.ts
│  └─ conversation.mutations.ts
├─ components/
├─ hooks/
├─ model/
│  ├─ conversation.types.ts
│  └─ conversation.machine.ts
├─ schemas/
├─ utils/
├─ conversation.constants.ts
├─ conversation.test.tsx
└─ index.ts
```

Reguły:

- Trasa składa ekran z feature'ów, ale nie zawiera logiki biznesowej.
- Feature nie importuje prywatnych plików innego feature; używa jego `index.ts`.
- Komponenty używane tylko przez feature pozostają w nim.
- `src/components/` zawiera wyłącznie kompozycje przekrojowe, nie elementy domenowe.
- Prymitywy wizualne pochodzą z `@mentor/ui`.
- Server-only i client-only są oznaczane jawnie i nie mogą przeciekać między bundle'ami.
- Hook nie zastępuje modułu domenowego; stan serwerowy pozostaje w React Query.

### 4.2 Admin jako granica

Admin ma osobny layout, menu, error boundary, telemetrię i kontrolę roli. Komponenty admina pozostają w `features/admin/`; nie są ładowane do zwykłego bundle aplikacji. Sprawdzenie dostępu następuje również w API.

## 5. Aplikacja API

```text
apps/api/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  ├─ seed/
│  └─ scripts/
├─ src/
│  ├─ bootstrap/
│  │  ├─ app.bootstrap.ts
│  │  ├─ security.bootstrap.ts
│  │  ├─ openapi.bootstrap.ts
│  │  └─ observability.bootstrap.ts
│  ├─ modules/
│  │  ├─ identity/
│  │  ├─ privacy/
│  │  ├─ learner-profile/
│  │  ├─ learning-plan/
│  │  ├─ conversation/
│  │  ├─ assessment/
│  │  ├─ learning-engine/
│  │  ├─ speech/
│  │  ├─ ai-platform/
│  │  ├─ billing/
│  │  ├─ gamification/
│  │  ├─ administration/
│  │  ├─ moderation/
│  │  ├─ notifications/
│  │  └─ analytics/
│  ├─ shared/
│  │  ├─ domain/
│  │  ├─ application/
│  │  ├─ infrastructure/
│  │  └─ interface/
│  ├─ health/
│  ├─ app.module.ts
│  └─ main.ts
├─ test/
│  ├─ integration/
│  ├─ contract/
│  ├─ fixtures/
│  └─ setup/
├─ nest-cli.json
├─ vitest.config.ts
├─ tsconfig.json
└─ package.json
```

### 5.1 Szablon modułu backendowego

```text
modules/conversation/
├─ domain/
│  ├─ entities/
│  ├─ value-objects/
│  ├─ events/
│  ├─ policies/
│  ├─ repositories/
│  ├─ services/
│  ├─ errors/
│  └─ conversation.aggregate.ts
├─ application/
│  ├─ commands/
│  │  ├─ start-session/
│  │  │  ├─ start-session.command.ts
│  │  │  ├─ start-session.handler.ts
│  │  │  └─ start-session.handler.spec.ts
│  │  ├─ submit-turn/
│  │  └─ finish-session/
│  ├─ queries/
│  ├─ ports/
│  ├─ dto/
│  ├─ mappers/
│  └─ process-managers/
├─ infrastructure/
│  ├─ persistence/
│  │  ├─ prisma-conversation.repository.ts
│  │  └─ conversation.persistence-mapper.ts
│  ├─ cache/
│  ├─ messaging/
│  └─ providers/
├─ interface/
│  ├─ http/
│  │  ├─ conversation.controller.ts
│  │  └─ conversation.presenter.ts
│  ├─ realtime/
│  ├─ consumers/
│  └─ schedulers/
├─ conversation.module.ts
├─ conversation.public.ts
└─ index.ts
```

### 5.2 Zasady warstw

- `domain` nie importuje NestJS, Prisma, Redis, Stripe ani SDK AI.
- `application` może importować domenę i abstrakcyjne porty.
- `infrastructure` implementuje porty, ale nie jest importowana przez domenę.
- `interface` tłumaczy protokół na use case i prezentuje wynik.
- Kontroler nie zawiera reguł biznesowych ani bezpośrednich wywołań Prisma.
- Repozytorium jednej domeny nie zwraca encji innej domeny.
- `conversation.public.ts` jest jedynym publicznym API modułu dla innych modułów.
- Zdarzenia integracyjne są osobne od wewnętrznych zdarzeń domenowych.

### 5.3 `shared/` — dozwolony zakres

`shared/` zawiera tylko stabilne elementy techniczne lub semantyczne używane przez wiele modułów:

- `EntityId`, `Result`, `DomainError`, `Clock`, `Transaction`, pagination,
- middleware correlation ID, redakcję logów i wspólne guards,
- bazowe porty outbox/inbox i idempotency,
- standard Problem Details.

Nie wolno umieszczać tam encji `User`, `Subscription`, `Conversation`, uniwersalnych repozytoriów ani „common service” łączącego domeny.

## 6. Aplikacja workerów

```text
apps/worker/
├─ src/
│  ├─ bootstrap/
│  ├─ processors/
│  │  ├─ feedback/
│  │  ├─ learning-events/
│  │  ├─ learning-plan/
│  │  ├─ speech-analysis/
│  │  ├─ text-to-speech/
│  │  ├─ notifications/
│  │  ├─ stripe-webhooks/
│  │  ├─ privacy-requests/
│  │  └─ analytics/
│  ├─ schedulers/
│  ├─ reconciliation/
│  ├─ worker.module.ts
│  └─ main.ts
├─ test/
│  ├─ integration/
│  └─ fixtures/
├─ vitest.config.ts
├─ tsconfig.json
└─ package.json
```

Worker używa publicznych use case'ów/modułów backendowych, a nie duplikuje logiki. Docelowo wspólny kod backendu może zostać przeniesiony do prywatnych pakietów domenowych tylko wtedy, gdy ograniczenia narzędziowe uniemożliwiają bezpieczne współdzielenie między `api` i `worker`. Nie tworzymy osobnej implementacji domeny.

Proces workera przyjmuje profil kolejki przez konfigurację, dzięki czemu ten sam artefakt może działać jako `worker-feedback`, `worker-speech` lub `worker-notifications` z niezależnym skalowaniem.

## 7. Pakiety współdzielone

### 7.1 `packages/api-contracts`

```text
packages/api-contracts/
├─ src/
│  ├─ identity/
│  ├─ learner-profile/
│  ├─ learning-plan/
│  ├─ conversation/
│  ├─ assessment/
│  ├─ learning-engine/
│  ├─ speech/
│  ├─ billing/
│  ├─ administration/
│  ├─ events/
│  ├─ problem-details.ts
│  └─ index.ts
├─ test/
├─ package.json
└─ tsconfig.json
```

Zawiera schematy transportowe, typy generowane z tych schematów, identyfikatory endpointów i wersjonowane eventy klienta. Nie zawiera encji domenowych, logiki use case ani kodu Prisma. Jest bezpieczny dla przeglądarki.

### 7.2 `packages/ui`

```text
packages/ui/
├─ src/
│  ├─ components/
│  ├─ primitives/
│  ├─ patterns/
│  ├─ tokens/
│  ├─ styles/
│  ├─ hooks/
│  └─ index.ts
├─ stories/
├─ test/
├─ package.json
└─ tsconfig.json
```

Zawiera dostępne prymitywy, tokeny i neutralne wzorce UI. Nie zna conversation, billing ani innych domen. Wzorce domenowe pozostają w `apps/web/src/features`.

### 7.3 `packages/config`

Schematy konfiguracji środowiskowej, walidacja startowa i typowane ustawienia. Eksporty są rozdzielone na `server`, `browser` i `test`, aby sekret nie trafił do bundla klienta.

### 7.4 `packages/observability`

Inicjalizacja OpenTelemetry, typowane metryki, redakcja logów i propagation correlation context. Nie zapisuje treści rozmów ani PII.

### 7.5 `packages/validation`

Neutralne refinements i formaty, np. identyfikatory, locale, strefa czasu, cursor i bezpieczne limity tekstu. Reguły domenowe nie trafiają do tego pakietu.

### 7.6 `packages/test-kit`

Builders, fake clock, fake ID generator, provider fakes, kontenery testowe, narzędzia accessibility i syntetyczne fixtures. Pakiet jest dev-only i nie może być zależnością runtime.

## 8. AI Platform — struktura wewnętrzna

```text
modules/ai-platform/
├─ domain/
│  ├─ tasks/
│  ├─ capabilities/
│  ├─ policies/
│  └─ usage/
├─ application/
│  ├─ execute-task/
│  ├─ stream-task/
│  ├─ route-task/
│  ├─ validate-output/
│  └─ ports/
├─ infrastructure/
│  ├─ providers/
│  │  ├─ openai/
│  │  ├─ anthropic/
│  │  ├─ gemini/
│  │  ├─ openrouter/
│  │  └─ local/
│  ├─ prompts/
│  │  ├─ conversation-turn/
│  │  ├─ session-feedback/
│  │  ├─ diagnostic-assessment/
│  │  ├─ memory-extraction/
│  │  └─ learning-plan/
│  ├─ routing/
│  ├─ moderation/
│  └─ redaction/
├─ interface/
│  ├─ admin/
│  └─ consumers/
├─ ai-platform.module.ts
└─ ai-platform.public.ts
```

Każdy prompt ma katalog zawierający szablon, schemat wejścia/wyjścia, fixtures, golden cases, changelog i manifest z wersją. Nazwa modelu nie występuje w modułach produktowych.

## 9. Prisma i migracje

```text
apps/api/prisma/
├─ schema.prisma
├─ models/
│  ├─ identity.prisma
│  ├─ privacy.prisma
│  ├─ learner-profile.prisma
│  ├─ learning-plan.prisma
│  ├─ conversation.prisma
│  ├─ assessment.prisma
│  ├─ learning-engine.prisma
│  ├─ speech.prisma
│  ├─ ai-platform.prisma
│  ├─ billing.prisma
│  ├─ administration.prisma
│  └─ platform.prisma
├─ migrations/
│  └─ YYYYMMDDHHMM_description/
│     ├─ migration.sql
│     ├─ verify.sql
│     └─ rollback-notes.md
├─ seed/
│  ├─ development/
│  ├─ test/
│  └─ reference/
└─ scripts/
   ├─ verify-migration.ts
   ├─ check-drift.ts
   └─ sanitize-fixture.ts
```

Jeżeli używana wersja Prisma nie wspiera natywnie wieloplikowego schematu w wymaganym zakresie, `models/` pozostaje źródłem logicznego podziału, a kontrolowany build scala go do `schema.prisma`. Nie tworzymy własnego parsera, jeśli oficjalna funkcja Prisma wystarcza.

Reguły migracji:

- migracje są niemutowalne po zastosowaniu na współdzielonym środowisku,
- nazwa opisuje zmianę biznesową,
- każda ryzykowna migracja ma `verify.sql` i opis rollbacku,
- usunięcia używają expand/contract w kilku wydaniach,
- backfill jest osobnym, wznawialnym jobem, nie długą transakcją migracji,
- seed produkcyjny obejmuje tylko wersjonowane dane referencyjne,
- fixtures testowe nie zawierają danych rzeczywistych.

## 10. Testy

### 10.1 Kolokowane

- `*.spec.ts` — test jednostkowy klasy/use case/polityki.
- `*.test.tsx` — test komponentu lub feature UI.
- Test znajduje się przy pliku, jeśli bada jego publiczne zachowanie.

### 10.2 Integracyjne i kontraktowe

- `apps/api/test/integration` — baza, Redis, transakcje i moduły.
- `apps/api/test/contract` — adaptery zewnętrzne i OpenAPI.
- `apps/worker/test/integration` — idempotencja, retry, DLQ i joby.
- Każdy provider AI/STT/TTS uruchamia wspólny contract test suite.

### 10.3 Przekrojowe

```text
tests/
├─ e2e/
│  ├─ specs/
│  │  ├─ auth/
│  │  ├─ onboarding/
│  │  ├─ conversation/
│  │  ├─ speech/
│  │  ├─ review/
│  │  ├─ billing/
│  │  └─ admin/
│  ├─ fixtures/
│  ├─ pages/
│  └─ playwright.config.ts
├─ ai-evals/
│  ├─ datasets/
│  ├─ evaluators/
│  ├─ rubrics/
│  ├─ runners/
│  └─ reports/
├─ performance/
│  ├─ api/
│  ├─ streaming/
│  ├─ websocket/
│  └─ queues/
├─ security/
│  ├─ authorization/
│  ├─ abuse/
│  └─ uploads/
└─ resilience/
   ├─ provider-failures/
   ├─ duplicate-events/
   └─ interrupted-streams/
```

Fixtures AI są syntetyczne, wersjonowane i opisują oczekiwany slice (CEFR, język ojczysty, typ błędu). Raporty generowane nie są commitowane, poza zatwierdzonymi baseline'ami.

## 11. Infrastruktura

```text
infrastructure/
├─ docker/
│  ├─ web.Dockerfile
│  ├─ api.Dockerfile
│  ├─ worker.Dockerfile
│  └─ migration.Dockerfile
├─ terraform/
│  ├─ modules/
│  │  ├─ network/
│  │  ├─ compute/
│  │  ├─ postgres/
│  │  ├─ redis/
│  │  ├─ object-storage/
│  │  ├─ secrets/
│  │  ├─ observability/
│  │  └─ edge/
│  └─ stacks/
│     ├─ staging/
│     └─ production/
├─ environments/
│  ├─ local/
│  ├─ preview/
│  ├─ staging/
│  └─ production/
├─ monitoring/
│  ├─ dashboards/
│  ├─ alerts/
│  ├─ slos/
│  └─ synthetics/
└─ policies/
   ├─ retention/
   ├─ access/
   └─ lifecycle/
```

Kod infrastruktury nie zawiera sekretów ani backend state. Stan Terraform jest zdalny, szyfrowany i blokowany. Moduły są małe, wersjonowane i nie odwołują się bezpośrednio do danych środowiska; kompozycja następuje w `stacks/`.

## 12. Dokumentacja

```text
docs/
├─ product/
│  ├─ product-analysis.md
│  ├─ roadmap.md
│  └─ metrics-catalog.md
├─ architecture/
│  ├─ system.md
│  ├─ repository-structure.md
│  ├─ database.md
│  ├─ api.md
│  ├─ ai-platform.md
│  └─ diagrams/
├─ decisions/
│  ├─ ADR-001-modular-monolith.md
│  └─ ADR-NNN-title.md
├─ operations/
│  ├─ deployment.md
│  ├─ rollback.md
│  ├─ backup-restore.md
│  ├─ incident-response.md
│  └─ runbooks/
├─ security/
│  ├─ threat-model.md
│  ├─ data-classification.md
│  ├─ privacy.md
│  └─ vendor-register.md
└─ api/
   ├─ openapi.json
   └─ events.md
```

Obecne dokumenty główne pozostają w katalogu root do czasu fizycznego scaffoldingu; wtedy zostaną przeniesione bez utraty historii, a README otrzyma stabilne odnośniki.

Dokumentacja generowana (`openapi.json`, diagram ERD) jest weryfikowana w CI pod kątem driftu, ale jej źródłem pozostają schematy i kod. Runbooki są traktowane jako część funkcji operacyjnej.

## 13. Konwencje nazw

### 13.1 Pliki i katalogi

- Katalogi oraz zwykłe pliki: `kebab-case`.
- Klasy/typy: `PascalCase`; funkcje/zmienne: `camelCase`.
- Sufiks roli jest obowiązkowy: `.controller.ts`, `.handler.ts`, `.repository.ts`, `.adapter.ts`, `.policy.ts`, `.schema.ts`.
- Test jednostkowy: `.spec.ts`; UI: `.test.tsx`; E2E: `.e2e.spec.ts`.
- Brak plików `utils.ts`, `helpers.ts`, `common.ts` bez zawężonej nazwy odpowiedzialności.

### 13.2 Moduły i importy

- Alias aplikacji: `@api/*` i `@web/*` wyłącznie wewnątrz odpowiedniej aplikacji.
- Pakiety: `@mentor/api-contracts`, `@mentor/ui`, `@mentor/config` itd.
- Importy względne są preferowane w obrębie jednego feature/modułu.
- Deep import do innego pakietu/modułu jest zabroniony przez `exports` i lint.
- Nie tworzymy barrel files na każdym poziomie; publiczny barrel tylko na granicy modułu/pakietu.

### 13.3 Nazwy domenowe

- Nazwa odzwierciedla język produktu, np. `LearningPlan`, `ReviewItem`, `LearnerObservation`.
- Nie używamy ogólnych nazw `Data`, `Manager`, `Processor` lub `Service` bez znaczenia domenowego.
- Transportowe DTO są odróżnione od komend i encji.
- Event jest w czasie przeszłym: `ConversationSessionCompleted`.
- Komenda jest imperatywem: `StartConversationSession`.

## 14. Publiczne API modułów

Każdy moduł eksportuje minimalny zestaw:

- token/interfejs use case potrzebny innym modułom,
- publiczne komendy lub query contracts,
- wersjonowane zdarzenia integracyjne,
- identyfikatory i typy wartości wymagane na granicy.

Nie eksportuje:

- encji persistence i modeli Prisma,
- prywatnych handlerów,
- kontrolerów,
- adapterów dostawców,
- konfiguracji promptów,
- wewnętrznych zdarzeń domenowych.

Test architektury analizuje graf importów i blokuje naruszenia w CI.

## 15. Konfiguracja i zmienne środowiskowe

```text
packages/config/src/
├─ browser.schema.ts
├─ server.schema.ts
├─ worker.schema.ts
├─ test.schema.ts
├─ load-browser-config.ts
├─ load-server-config.ts
└─ index.ts
```

- Wszystkie zmienne są walidowane przy starcie.
- Publiczne zmienne mają jawny allowlist i prefiks frameworka.
- `.env.example` zawiera nazwy, bezpieczne przykłady i komentarze, nigdy sekret.
- Produkcja pobiera sekrety z managera; `.env` nie jest artefaktem deploymentu.
- Flagi funkcji i routing modeli nie są mieszane z sekretami.
- Testy ustawiają konfigurację przez kontrolowany builder, nie przez modyfikację globalnego środowiska w losowych plikach.

## 16. Własność i CODEOWNERS

Minimalna macierz własności:

| Obszar | Właściciel główny | Wymagana dodatkowa recenzja |
|---|---|---|
| Identity, privacy | Backend/Security | Security/Privacy |
| AI Platform, evals | AI/Learning | Security dla zmian danych |
| Learning Engine | Learning/Backend | Product/Learning expert |
| Speech | Realtime/AI | Privacy + QA |
| Billing | Backend/Commerce | Security/Finance ops |
| UI package | Design systems | Accessibility |
| Admin/moderation | Platform | Security/Privacy |
| Infrastructure | Platform/SRE | Security |
| Migrations | Backend owner | DBA/Platform dla ryzykownych zmian |

Zmiany w promptach produkcyjnych, politykach retencji, auth, billing i Terraform wymagają co najmniej dwóch zatwierdzeń zgodnie z odpowiedzialnością.

## 17. Kontrola zależności

Do egzekwowania struktury służą:

- `package.json exports` ograniczające publiczne ścieżki,
- ESLint boundaries/import rules,
- TypeScript project references,
- test grafu modułów backendowych,
- dependency cycle detection,
- CI check zakazujący SDK dostawców poza adapterami,
- CI check zakazujący Prisma poza `infrastructure/persistence` i kontrolowanymi skryptami,
- bundle analyzer wykrywający zależności serwerowe w kliencie.

Dozwolony kierunek frontendowy:

```text
app routes → features → ui/api-contracts/lib
```

Dozwolony kierunek backendowy:

```text
interface → application → domain
infrastructure → application/domain
bootstrap → wszystkie warstwy przez composition root
```

## 18. Pliki generowane

Generowane artefakty mają nagłówek i nie są edytowane ręcznie:

- klient OpenAPI, jeśli zostanie przyjęty,
- `openapi.json`,
- Prisma Client,
- migracyjny snapshot/ERD,
- typy tokenów design systemu,
- raporty coverage i evals (zwykle poza Git).

Źródło generatora, wersja narzędzia i komenda są zapisane w repozytorium. CI odtwarza artefakt i wykrywa drift.

## 19. Zasady dodawania nowej funkcji

1. Wskaż domenę będącą właścicielem danych i reguł.
2. Dodaj/zmień kontrakt transportowy tylko, jeśli przekracza granicę procesu.
3. Zaimplementuj use case w module, nie w kontrolerze lub komponencie.
4. Dodaj adapter infrastrukturalny za portem, jeśli potrzebna jest integracja.
5. UI umieść w jednym feature i eksportuj minimalne publiczne elementy.
6. Dodaj testy na najniższym sensownym poziomie oraz krytyczny E2E.
7. Dodaj telemetrię, flagę, dokumentację i rollback.
8. Jeśli funkcja wymaga importów omijających granice, najpierw zaktualizuj ADR — nie twórz skrótu.

## 20. Antywzorce zabronione

- Jeden globalny `services/`, `models/`, `controllers/` lub `utils/` dla całej aplikacji.
- Wspólne encje Prisma używane jako modele API i domeny.
- Import SDK OpenAI/Stripe/S3 bezpośrednio w use case.
- Logika uprawnień wyłącznie w frontendzie.
- Pakiet `shared` zawierający większość produktu.
- Duplikowanie typów API ręcznie po obu stronach.
- Testy zależne od kolejności lub wspólnego produkcyjnego konta.
- Puste moduły, nieaktywne kontrolki i placeholdery udające zakres przyszłego wydania.
- Sekrety, rzeczywiste transkrypcje lub nagrania w fixtures.
- Folder `legacy` lub `misc` jako trwałe miejsce nieprzypisanego kodu.

## 21. Minimalny scaffold pierwszego przyrostu

Pierwszy fizyczny scaffold powinien utworzyć tylko elementy potrzebne do fazy fundamentu:

```text
apps/web
apps/api
apps/worker
packages/api-contracts
packages/config
packages/observability
packages/test-kit
packages/ui
packages/validation
tooling/eslint-config
tooling/typescript-config
infrastructure/docker
tests/e2e
tests/ai-evals
docs
```

Pozostałe katalogi powstają wraz z pierwszym realnym plikiem. Repozytorium nie używa `.gitkeep` do materializowania całego przyszłego drzewa. Dokument jest źródłem planowanej struktury, a architekturalne testy pilnują jej po rozpoczęciu implementacji.

## 22. Kryteria ukończenia etapu

Etap struktury katalogów jest ukończony, gdy:

- istnieje jednoznaczne drzewo aplikacji, pakietów, testów, infrastruktury i dokumentacji,
- opisano szablon modułu backendowego i feature frontendowego,
- określono dozwolone kierunki zależności oraz publiczne API,
- ustalono lokalizację Prisma, migracji, promptów, providerów i workerów,
- zdefiniowano konwencje nazw, konfiguracji, testów i plików generowanych,
- wskazano mechanizmy automatycznego egzekwowania granic,
- zdefiniowano własność i zabronione antywzorce,
- kolejny etap może zaprojektować schemat bazy bez niejasności co do lokalizacji i własności modeli.

## 23. Następny etap

Następnym etapem jest kompletny schemat bazy danych: encje, relacje, klucze, indeksy, ograniczenia, retencja, audyt, outbox/inbox, idempotencja, modele pamięci i mastery oraz strategia migracji. Wynikiem będzie dokument modelu danych, diagram ERD i produkcyjny schemat Prisma przygotowany do późniejszego scaffoldingu.
