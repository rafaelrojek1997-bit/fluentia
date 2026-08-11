# Fluentia Web

## Uruchomienie

Z katalogu głównego:

```bash
pnpm install
pnpm dev
```

Aplikacja działa pod `http://localhost:3000`. Do czasu implementacji backendu używa jawnego adaptera demonstracyjnego z trwałym stanem w `localStorage`. Nie wysyła danych do zewnętrznych modeli AI.

## Kontrola jakości

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Główne trasy

- `/onboarding`
- `/sign-in`
- `/dashboard`
- `/conversation`
- `/review`
- `/pronunciation`
- `/progress`
- `/learning-plan`
- `/library`
- `/settings`
