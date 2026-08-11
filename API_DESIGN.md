# Projekt API — AI English Mentor

## 1. Zakres i artefakty

API V1 obsługuje web i Android przez jeden kontrakt domenowy. Specyfikacja bazuje na [architekturze](./ARCHITECTURE.md), [modelu danych](./DATABASE_SCHEMA.md) i wymaganiach [Google Play](./GOOGLE_PLAY_RELEASE_PLAN.md).

Artefakty etapu:

- ten dokument — semantyka, endpointy i protokoły,
- `docs/api/openapi.yaml` — maszynowa specyfikacja REST/SSE,
- przyszłe schematy Zod w `packages/api-contracts` będą generowane/weryfikowane względem OpenAPI podczas implementacji.

## 2. Konwencje

- Base URL: `/api/v1`.
- Format czasu: RFC 3339 UTC; daty kalendarzowe `YYYY-MM-DD`.
- Identyfikatory: UUID jako opaque string.
- Content-Type: `application/json`; błędy: `application/problem+json`.
- Nazwy pól JSON: `camelCase`.
- Maksymalny body zwykłego JSON: 1 MiB; upload audio omija API przez presigned URL.
- Nieznane pola requestu są odrzucane dla komend bezpieczeństwa/płatności, ignorowane tylko w jawnie forward-compatible webhookach.
- `X-Request-Id` może podać klient; serwer zawsze zwraca bezpieczny `X-Correlation-Id`.
- Locale z profilu lub `Accept-Language`; komunikaty błędów klient mapuje z kodu, a tekst serwera jest pomocniczy.

## 3. Uwierzytelnienie i CSRF

- Web: krótki access JWT w pamięci klienta, rotowany refresh token w `HttpOnly; Secure; SameSite=Lax` cookie.
- Android: access i refresh token przechowywane w Android Keystore-backed storage; refresh token nie trafia do WebView ani logów.
- Access JWT: `sub`, `sid`, `roles`, `iat`, `exp`, `iss`, `aud`, `jti`; bez profilu i PII.
- OAuth: Authorization Code + PKCE, state i nonce.
- Komendy wykorzystujące cookie wymagają tokenu CSRF double-submit powiązanego z sesją.
- Endpoint refresh rotuje token; reuse unieważnia całą rodzinę.
- Admin może wymagać step-up (`amr` z MFA) i krótszej sesji.

## 4. Standard błędu

```json
{
  "type": "https://api.example.com/problems/validation-failed",
  "title": "Request validation failed",
  "status": 422,
  "code": "VALIDATION_FAILED",
  "detail": "One or more fields are invalid.",
  "instance": "/api/v1/profile",
  "correlationId": "019...",
  "errors": [{ "path": "weeklyMinutes", "code": "OUT_OF_RANGE" }]
}
```

Kody bazowe:

| HTTP | Kod | Znaczenie |
|---|---|---|
| 400 | MALFORMED_REQUEST | Niepoprawny JSON/protokół |
| 401 | AUTHENTICATION_REQUIRED / TOKEN_REUSED | Brak lub naruszenie sesji |
| 403 | FORBIDDEN / STEP_UP_REQUIRED / CONSENT_REQUIRED | Brak prawa lub zgody |
| 404 | RESOURCE_NOT_FOUND | Brak zasobu albo brak prawa do niego |
| 409 | VERSION_CONFLICT / STATE_CONFLICT / IDEMPOTENCY_CONFLICT | Konflikt stanu |
| 410 | RESOURCE_GONE | Zasób usunięty/expired |
| 413 | PAYLOAD_TOO_LARGE | Przekroczony limit |
| 422 | VALIDATION_FAILED | Błąd semantyczny pól |
| 429 | RATE_LIMITED / QUOTA_EXCEEDED / COST_BUDGET_EXCEEDED | Limit |
| 503 | DEPENDENCY_UNAVAILABLE / CAPABILITY_UNAVAILABLE | Kontrolowana degradacja |

Odpowiedź nie ujawnia istnienia cudzego zasobu, stack trace, providera, promptu ani sekretu.

## 5. Paginacja, filtrowanie i współbieżność

- Listy historii używają opaque cursora: `?limit=20&after=<cursor>`; limit 1–100.
- Odpowiedź: `{ items, pageInfo: { nextCursor, hasNextPage } }`.
- Cursor jest podpisany, wersjonowany i związany z sortowaniem/filtrami.
- Domyślne sortowanie jest stabilne: `createdAt desc, id desc`.
- Mutowalne zasoby zwracają `version` oraz `ETag`; aktualizacja wymaga `If-Match` lub pola `expectedVersion`.
- Brak warunku przy operacji wrażliwej daje `428 PRECONDITION_REQUIRED`.

## 6. Idempotencja

`Idempotency-Key` jest obowiązkowy dla tworzenia sesji, tur AI, uploadów, privacy requests, zakupów/restore, zgłoszeń i operacji administracyjnych powodujących skutki.

- Zakres klucza: użytkownik + endpoint + klucz.
- Ten sam request zwraca ten sam status/body lub identyfikator zasobu.
- Ten sam klucz z innym request hash zwraca `409 IDEMPOTENCY_CONFLICT`.
- Klucz ma 16–160 znaków i wystarczającą entropię.
- Retencja minimum 24 h; billing/privacy dłużej zgodnie z procesem.

## 7. Katalog endpointów REST

### 7.1 Health i konfiguracja publiczna

| Metoda | Ścieżka | Auth | Cel |
|---|---|---|---|
| GET | `/health/live` | public | Liveness bez zależności |
| GET | `/health/ready` | internal | Readiness krytycznych zależności |
| GET | `/config/public` | public | Dozwolone locale, wersje klienta, maintenance i publiczne flagi |

### 7.2 Identity

| Metoda | Ścieżka | Cel |
|---|---|---|
| POST | `/auth/register` | Konto e-mail + hasło, zgody bazowe |
| POST | `/auth/verify-email` | Konsumpcja jednorazowego tokenu |
| POST | `/auth/resend-verification` | Kontrolowana ponowna wysyłka |
| POST | `/auth/login` | Sesja + access/refresh |
| POST | `/auth/refresh` | Rotacja refresh tokenu |
| POST | `/auth/logout` | Unieważnienie bieżącej sesji |
| POST | `/auth/logout-all` | Unieważnienie wszystkich sesji |
| POST | `/auth/password/forgot` | Neutralna odpowiedź anty-enumeration |
| POST | `/auth/password/reset` | Reset i unieważnienie rodzin sesji |
| GET | `/auth/oauth/{provider}/authorize` | PKCE authorization URL |
| POST | `/auth/oauth/{provider}/callback` | Wymiana code i kontrolowane łączenie konta |
| GET | `/auth/sessions` | Aktywne urządzenia/sesje |
| DELETE | `/auth/sessions/{sessionId}` | Unieważnienie sesji |
| POST | `/auth/2fa/totp/setup` | Sekret + QR wrażliwy, krótki TTL |
| POST | `/auth/2fa/totp/confirm` | Aktywacja + recovery codes jednorazowo |
| POST | `/auth/2fa/challenge` | Step-up/login challenge |
| DELETE | `/auth/2fa/totp` | Wyłączenie po step-up |

Login i register mają rate limit per IP/account hash, ochronę credential stuffing i jednolite czasy/komunikaty.

### 7.3 Bieżący użytkownik, zgody i prywatność

| Metoda | Ścieżka | Cel |
|---|---|---|
| GET | `/me` | Minimalne konto, role, locale, onboarding state |
| PATCH | `/me` | Locale, strefa i bezpieczne ustawienia konta |
| GET | `/me/consents` | Aktualne zgody i wersje dokumentów |
| PUT | `/me/consents/{type}` | Udzielenie/wycofanie zgody |
| GET | `/me/privacy-summary` | Kategorie danych, retencja i providerzy |
| POST | `/me/privacy-requests` | Eksport/usunięcie/rectify |
| GET | `/me/privacy-requests/{requestId}` | Status i manifest użytkowy |
| POST | `/me/privacy-requests/{requestId}/verify` | Weryfikacja operacji |
| POST | `/me/privacy-requests/{requestId}/cancel` | Anulowanie, jeśli jeszcze możliwe |
| GET | `/me/export/{downloadToken}` | Jednorazowy, krótki download eksportu |
| GET | `/account-deletion/info` | Publiczne instrukcje/link dla Google Play |
| POST | `/account-deletion/start` | Webowa ścieżka usunięcia bez aplikacji |

Wycofanie AI/audio consent natychmiast blokuje nowe joby; worker sprawdza zgodę ponownie przed wywołaniem providera.

### 7.4 Profil uczącego się i onboarding

| Metoda | Ścieżka | Cel |
|---|---|---|
| GET | `/learner-profile` | Profil i preferencje |
| PUT | `/learner-profile` | Idempotentna aktualizacja z wersją |
| GET | `/learner-profile/goals` | Cele |
| POST | `/learner-profile/goals` | Nowy cel |
| PATCH | `/learner-profile/goals/{goalId}` | Zmiana celu |
| DELETE | `/learner-profile/goals/{goalId}` | Dezaktywacja/usunięcie |
| GET | `/learner-profile/competencies` | Kompetencje, confidence i freshness |
| GET | `/learner-profile/memories` | Pamięć widoczna użytkownikowi |
| PATCH | `/learner-profile/memories/{memoryId}` | Akceptacja/korekta/odrzucenie |
| DELETE | `/learner-profile/memories/{memoryId}` | Usunięcie pamięci |
| GET | `/onboarding/state` | Wznawialny stan |
| PUT | `/onboarding/answers` | Zapis odpowiedzi etapu |
| POST | `/onboarding/diagnostics` | Start diagnozy |
| GET | `/onboarding/diagnostics/{assessmentId}` | Wynik/status |
| POST | `/onboarding/complete` | Finalizacja i generacja planu |

### 7.5 Scenariusze i rozmowy

| Metoda | Ścieżka | Cel |
|---|---|---|
| GET | `/scenarios` | Aktywne scenariusze dostępne dla planu/poziomu |
| GET | `/scenarios/{scenarioId}` | Opis, cele i capabilities bez promptu |
| POST | `/conversations` | Utworzenie sesji (`Idempotency-Key`) |
| GET | `/conversations` | Historia użytkownika |
| GET | `/conversations/{sessionId}` | Stan i bezpieczny transcript |
| POST | `/conversations/{sessionId}/start` | Przejście CREATED→ACTIVE |
| POST | `/conversations/{sessionId}/turns` | Tura użytkownika i uruchomienie streamu |
| GET | `/conversations/{sessionId}/turns` | Stronicowana historia |
| POST | `/conversations/{sessionId}/hints` | Hint/translate/simplify/explain |
| POST | `/conversations/{sessionId}/retry` | Ponowna próba konkretnej intencji |
| POST | `/conversations/{sessionId}/finish` | Idempotentna finalizacja |
| POST | `/conversations/{sessionId}/abandon` | Świadome przerwanie |
| DELETE | `/conversations/{sessionId}` | Usunięcie treści zgodnie z retencją |
| GET | `/conversations/{sessionId}/feedback` | Status lub wynik feedbacku |

`POST turns` zwraca `202` z `turnId`, `streamUrl` i `streamToken`. Tura nie jest przyjmowana, jeśli poprzednia nadal streamuje, chyba że protokół jawnie ją anuluje.

### 7.6 Plan, review i postęp

| Metoda | Ścieżka | Cel |
|---|---|---|
| GET | `/learning-plans/current` | Plan tygodnia + dzisiejsze aktywności |
| POST | `/learning-plans/generate` | Kontrolowane przeliczenie planu |
| POST | `/learning-plans/activities/{id}/start` | Start aktywności |
| POST | `/learning-plans/activities/{id}/complete` | Potwierdzone zakończenie |
| POST | `/learning-plans/activities/{id}/replace` | Zamiana z powodem |
| GET | `/review/queue` | Due items w limicie czasu |
| POST | `/review/attempts` | Odpowiedź + rating + aktualizacja FSRS |
| PATCH | `/review/items/{itemId}` | Znane/aktywne/edycja treści użytkowej |
| DELETE | `/review/items/{itemId}` | Usunięcie elementu |
| GET | `/progress/summary` | Dashboard mastery/streak/goal |
| GET | `/progress/competencies` | Trendy ze stabilną granularnością |
| GET | `/progress/control-samples` | Porównywalne próbki okresowe |
| GET | `/gamification/profile` | XP, streak i achievementy |

Serwer nie przyjmuje dowolnego XP od klienta. XP jest efektem zweryfikowanego zdarzenia domenowego.

### 7.7 Speech

| Metoda | Ścieżka | Cel |
|---|---|---|
| POST | `/speech/uploads` | Presigned upload z typem/rozmiarem/TTL |
| POST | `/speech/uploads/{assetId}/complete` | Finalizacja po checksum/MIME scan |
| DELETE | `/speech/assets/{assetId}` | Usunięcie audio |
| GET | `/speech/assets/{assetId}` | Status i metadata bez publicznego URL |
| GET | `/speech/assets/{assetId}/transcript` | Transkrypcja + confidence |
| POST | `/speech/assets/{assetId}/analyses` | Start analizy wymowy |
| GET | `/speech/assets/{assetId}/analyses/latest` | Wynik lub status |
| POST | `/speech/realtime-tokens` | Jednorazowy token WebSocket |
| POST | `/speech/reference-audio` | Generacja/cached TTS dla tekstu |

Presigned URL ogranicza bucket key, MIME, rozmiar, checksum i TTL. Obiekt pozostaje w kwarantannie do finalizacji.

### 7.8 Billing i entitlements

| Metoda | Ścieżka | Cel |
|---|---|---|
| GET | `/billing/catalog` | Regionalne produkty, ceny i capabilities |
| GET | `/billing/subscription` | Znormalizowany stan i źródło |
| GET | `/billing/entitlements` | Prawa produktu i limity |
| POST | `/billing/stripe/checkout-sessions` | Web checkout, gdy dozwolony |
| POST | `/billing/stripe/portal-sessions` | Portal klienta web |
| POST | `/billing/google-play/purchases/verify` | Weryfikacja purchase token na backendzie |
| POST | `/billing/google-play/purchases/restore` | Reconciliation zakupów konta |
| POST | `/billing/subscription/cancel-intent` | Instrukcja zarządzania właściwa providerowi |
| POST | `/webhooks/stripe` | Podpisany webhook raw body |
| POST | `/webhooks/google-play` | Pub/Sub push/RTDN z weryfikacją OIDC |

Klient nie nadaje entitlement. Purchase token jest przesyłany raz przez TLS, szyfrowany i redagowany z logów. Webhooki są deduplikowane i potwierdzane szybko; właściwe przetwarzanie jest asynchroniczne.

### 7.9 Notifications i urządzenia Android

| Metoda | Ścieżka | Cel |
|---|---|---|
| POST | `/devices` | Rejestracja installation ID i push tokenu |
| PATCH | `/devices/{deviceId}` | App/API/locale/token refresh |
| DELETE | `/devices/{deviceId}` | Wyrejestrowanie przy logout/uninstall signal |
| GET | `/notification-preferences` | Kanały, quiet hours, cele |
| PUT | `/notification-preferences` | Aktualizacja preferencji |
| GET | `/notifications` | In-app inbox |
| POST | `/notifications/{id}/read` | Oznaczenie odczytu |

Push payload nie zawiera transkrypcji, celu wrażliwego ani treści pamięci.

### 7.10 Moderacja i zgłaszanie AI

| Metoda | Ścieżka | Cel |
|---|---|---|
| POST | `/moderation/reports` | Zgłoszenie odpowiedzi bez wyjścia z aplikacji |
| GET | `/moderation/reports/{reportId}` | Status własnego zgłoszenia |
| POST | `/moderation/appeals` | Odwołanie/support |

Request zawiera `turnId`, reason i opcjonalny komentarz. Serwer sam pobiera minimalny snapshot; klient nie wysyła zmodyfikowanej treści jako dowodu.

### 7.11 Admin

Wszystkie endpointy `/admin/*` wymagają roli, MFA step-up, audytu i osobnych limitów.

| Metoda | Ścieżka | Cel |
|---|---|---|
| GET | `/admin/users` | Wyszukiwanie z maskowaniem PII |
| GET | `/admin/users/{id}` | Minimalny widok operacyjny |
| POST | `/admin/users/{id}/suspend` | Zawieszenie z reason |
| POST | `/admin/users/{id}/restore` | Kontrolowane przywrócenie |
| GET | `/admin/moderation/reports` | Kolejka |
| POST | `/admin/moderation/reports/{id}/assign` | Assignment |
| POST | `/admin/moderation/reports/{id}/resolve` | Decyzja i akcje |
| GET | `/admin/prompts` | Wersje bez sekretów |
| POST | `/admin/prompts` | Nowy draft |
| POST | `/admin/prompts/{id}/evaluate` | Eval job |
| POST | `/admin/prompts/{id}/approve` | Four-eyes approval |
| POST | `/admin/prompts/{id}/rollout` | Canary config |
| POST | `/admin/prompts/{id}/rollback` | Natychmiastowy rollback |
| GET | `/admin/ai-usage` | Koszt/latency/quality agregaty |
| GET | `/admin/subscriptions` | Stany rozliczeń |
| POST | `/admin/subscriptions/{id}/reconcile` | Odczyt stanu providera |
| GET | `/admin/audit-logs` | Wąski, immutable audit search |
| GET/PUT | `/admin/feature-flags/{key}` | Wersjonowane flagi |

Brak endpointu „impersonate user” w V1. Dostęp do zaszyfrowanej treści wymaga osobnego break-glass procesu poza zwykłym profilem supportu.

## 8. SSE — streaming tekstu i jobów

Endpoint: `GET /api/v1/streams/{streamId}?token=<one-time>` z `Accept: text/event-stream`.

Token jest krótkotrwały, związany z użytkownikiem, zasobem i jednym rodzajem streamu. Alternatywnie web używa Authorization header, jeśli EventSource zastępuje fetch streaming.

Zdarzenia:

```text
event: started
id: 1
data: {"streamId":"...","resourceId":"...","resumable":true}

event: delta
id: 2
data: {"sequence":1,"text":"Hello"}

event: tool_status
id: 3
data: {"tool":"safety_check","status":"completed"}

event: completed
id: 4
data: {"resourceId":"...","finalVersion":1}
```

Możliwe: `started`, `delta`, `transcript_delta`, `progress`, `tool_status`, `completed`, `failed`, `heartbeat`.

- Każde zdarzenie ma monotoniczne ID.
- Klient wznawia z `Last-Event-ID`; Redis przechowuje ograniczone okno.
- Jeśli okno wygasło, serwer zwraca `409 STREAM_RESUME_EXPIRED`, a klient pobiera finalny zasób REST.
- `failed` zawiera bezpieczny code/retryable, nigdy stack/provider secret.
- Heartbeat co maksymalnie 15 s; proxy buffering jest wyłączony.
- Zamknięcie klienta anuluje generację tylko przez jawny `POST /streams/{id}/cancel`, aby przypadkowa utrata sieci nie niszczyła wyniku.

## 9. WebSocket — rozmowa głosowa

Endpoint: `wss://.../api/v1/speech/realtime`; subprotocol `mentor.voice.v1`.

### Handshake

1. Klient pobiera one-time token przez REST.
2. Łączy się i wysyła `client.hello` z capabilities, codec, sample rate i resume tokenem.
3. Serwer zwraca `server.ready` z limitami i negotiated format.

### Wiadomości sterujące JSON

| Typ klienta | Znaczenie |
|---|---|
| `client.hello` | Capabilities i wersja |
| `audio.start` | Start tury, language, consent snapshot ID |
| `audio.chunk` | Metadata binarnej ramki/sequence |
| `audio.commit` | Koniec wypowiedzi |
| `audio.cancel` | Porzucenie bieżącej tury |
| `mentor.interrupt` | Barage-in |
| `session.finish` | Finalizacja |
| `client.ack` | Ack zdarzenia serwera |
| `ping` | Heartbeat |

| Typ serwera | Znaczenie |
|---|---|
| `server.ready` | Negocjacja i limity |
| `transcript.partial` | Nieutrwalony STT |
| `transcript.final` | Finalny tekst + confidence |
| `mentor.text.delta` | Tekst odpowiedzi |
| `mentor.audio.chunk` | Binarne audio z sequence |
| `turn.completed` | Identyfikator utrwalonej tury |
| `session.state` | Maszyna stanów |
| `warning` | Degradacja, np. low signal |
| `error` | Code/retryable |
| `pong` | Heartbeat |

### Reguły protokołu

- Maksymalny chunk i częstotliwość są negocjowane; przekroczenie zamyka połączenie kodem policy violation.
- Każda rama ma session/turn/sequence; duplikat jest ignorowany, luka powoduje retransmit request lub kontrolowane zakończenie tury.
- Backpressure zatrzymuje przyjmowanie audio przed przeciążeniem pamięci.
- Stan: `CONNECTING → READY → LISTENING → PROCESSING → SPEAKING → READY → ENDED`.
- Resume token ma krótki TTL; serwer odtwarza tylko stan, nie nieskończony audio buffer.
- Brak STT/TTS degraduje do tekstu bez utraty sesji.
- Audio nie jest utrwalane bez aktywnej zgody; cofnięcie zgody zamyka nagrywanie.

## 10. Webhook Stripe

- Endpoint używa raw body i weryfikacji `Stripe-Signature` z tolerancją czasu.
- Sekret jest rotowany; podczas rotacji akceptowane są kontrolowane dwa klucze.
- Event ID trafia do inbox przed odpowiedzią.
- Odpowiedź 2xx oznacza bezpieczne przyjęcie, nie pełne przetworzenie.
- Worker odczytuje bieżący stan Stripe, obsługuje zdarzenia poza kolejnością i aktualizuje subskrypcję/entitlements transakcyjnie.
- Retryable failures zwracają non-2xx tylko przed trwałym przyjęciem; po przyjęciu retry odbywa się wewnętrznie.

## 11. Google Play RTDN i zakup

- RTDN przychodzi przez Google Cloud Pub/Sub push z uwierzytelnieniem OIDC; walidujemy issuer, audience i service account.
- Deduplikacja używa stabilnej tożsamości wiadomości oraz typu/wersji powiadomienia.
- Notification jest sygnałem do pobrania bieżącego stanu przez Google Play Developer API, nie źródłem prawdy samym w sobie.
- `verify purchase` wymaga authenticated user, package name z allowlist, product/basePlan ID z katalogu i purchase token.
- Backend wiąże token z użytkownikiem dopiero po weryfikacji package/product/obfuscated account ID i stanu zakupu.
- Zakup jest acknowledged w wymaganym czasie; retry jest idempotentny.
- Obsługiwane stany: pending, active, grace, on hold, paused, cancelled, expired, refunded/revoked.
- Reconciliation okresowo porównuje aktywne subskrypcje, a entitlement ma bezpieczny okres tolerancji na awarię providera.

## 12. Kontrakty zdarzeń wewnętrznych

Envelope:

```json
{
  "eventId": "uuid",
  "eventType": "ConversationSessionCompleted",
  "schemaVersion": 1,
  "occurredAt": "2026-08-04T12:00:00Z",
  "actorId": "uuid-or-null",
  "aggregateId": "uuid",
  "correlationId": "uuid",
  "causationId": "uuid-or-null",
  "payload": {}
}
```

V1 publikuje co najmniej:

- `UserRegistered`, `EmailVerified`, `UserSuspended`, `AccountDeletionRequested`, `AccountDeleted`,
- `ConsentChanged`, `LearnerProfileCompleted`, `LearnerGoalChanged`,
- `ConversationSessionStarted`, `ConversationTurnCompleted`, `ConversationSessionCompleted`,
- `AssessmentCompleted`, `LearnerObservationRecorded`, `CompetencyUpdated`,
- `LearningItemCreated`, `ReviewAttemptRecorded`, `LearningPlanActivated`, `PlanActivityCompleted`,
- `SpeechAssetReady`, `TranscriptCompleted`, `PronunciationAnalysisCompleted`,
- `AiRunCompleted`, `AiRunFailed`, `CostBudgetExceeded`,
- `ModerationReportCreated`, `ModerationReportResolved`,
- `SubscriptionStateChanged`, `EntitlementChanged`, `UsageRecorded`,
- `NotificationRequested`, `DeviceRegistered`, `StreakUpdated`.

Payload zawiera identyfikatory i niezbędne fakty, nie pełne transkrypcje/audio/purchase token. Zdarzenia są addytywnie rozwijane; breaking change zwiększa `schemaVersion`. Konsument obsługuje wersję jawnie i używa inbox.

## 13. Autoryzacja zasobowa

| Zasób | User | Support | Moderator | Admin |
|---|---|---|---|---|
| Własny profil/plan/rozmowy | RW | brak treści | brak | brak domyślnie |
| Konto operacyjne | własne | maskowany odczyt | brak | maskowany odczyt |
| Zgłoszenie moderacji | własne create/read | metadata | assigned content | zarządzanie |
| Subskrypcja | własny odczyt | operacyjny odczyt | brak | reconcile |
| Prompty/flags | brak | brak | brak | four-eyes workflow |
| Audit | własne security events ograniczone | brak | brak | filtrowany odczyt |

Każdy use case sprawdza ownership, role, stan, zgodę i entitlement. Rola sama nie daje dostępu do treści.

## 14. Rate limiting i quota

Limity są warstwowe i zwracają `Retry-After`:

- auth: IP + account hash + device risk,
- zwykłe API: user + IP,
- AI: task + user + plan + koszt dzienny/miesięczny,
- voice: liczba równoległych sesji + sekundy/minutę,
- privacy/report: antyspam bez blokowania legalnego żądania,
- admin: actor + akcja, konserwatywnie,
- webhook: provider identity + global circuit protection.

Quota nie jest jedyną kontrolą kosztu: przed taskiem rezerwujemy budżet, po tasku zapisujemy usage, a osierocona rezerwacja wygasa.

## 15. Cache i semantyka HTTP

- Public scenarios/config: `ETag`, krótki `Cache-Control`, CDN tylko dla danych publicznych.
- `/me`, profile, billing, privacy: `private, no-store` lub krótkie private cache zgodnie z analizą ryzyka.
- Presigned URLs i tokeny: `no-store`.
- Mutacje: brak cache.
- `304` dla stabilnych read resources.
- Idempotentne `PUT/DELETE`; `POST` zabezpieczony kluczem tam, gdzie powoduje efekt.

## 16. Wersjonowanie i deprecacja

- `/v1` zmienia się addytywnie: nowe opcjonalne pola, endpointy i enumy tylko jeśli klient ma safe default.
- Usunięcie/zmiana semantyki wymaga `/v2` lub migracji wieloetapowej.
- Android client wysyła `X-Client-Platform`, `X-Client-Version`, `X-Client-Version-Code`, `X-OS-Api-Level`.
- Serwer zwraca `minimumSupportedVersionCode` w public config i kontrolowany `426 CLIENT_UPGRADE_REQUIRED` wyłącznie dla niebezpiecznie starej wersji.
- Deprecation/Sunset headers i telemetria użycia poprzedzają wyłączenie.
- OpenAPI i event schemas są diffowane w CI; breaking change blokuje merge.

## 17. OpenAPI i walidacja kontraktu

- `docs/api/openapi.yaml` jest źródłem transportowej specyfikacji V1.
- Backend generuje runtime validation z tych samych schematów Zod lub utrzymuje test równoważności.
- Klient web/Android nie ręcznie duplikuje typów.
- Każdy endpoint ma operationId, auth, request/response, błędy, idempotency i przykłady.
- Spectral lint, OpenAPI validation i breaking-change diff są obowiązkowe w CI.
- Contract tests uruchamiają prawdziwy kontroler z syntetyczną bazą i porównują odpowiedź ze schematem.

## 18. Kryteria ukończenia etapu

- Wszystkie piony V1 mają endpointy i reguły autoryzacji.
- Zdefiniowano jednolite błędy, paginację, concurrency i idempotencję.
- Tekst ma wznawialny SSE, a głos wersjonowany protokół WebSocket.
- Stripe i Google Play mają zweryfikowane, deduplikowane webhooki i reconciliation.
- Moderacja AI, usunięcie konta i wymagania Android są częścią publicznego kontraktu.
- Zdarzenia wewnętrzne są minimalne, wersjonowane i bez wrażliwej treści.
- OpenAPI może generować klientów i testy kontraktowe.
- Projekt może przejść do implementacji frontendowej bez wymyślania nowych granic API.

## 19. Następny etap

Następnym etapem jest frontend: scaffold monorepo w wymaganym zakresie, design system, routing, stany aplikacji, klient API, uwierzytelnienie, onboarding, dashboard i pionowe interfejsy V1. Backend będzie implementowany w kolejnym etapie zgodnie z kontraktami, przy użyciu kontrolowanych adapterów testowych umożliwiających uruchomienie frontendu.
