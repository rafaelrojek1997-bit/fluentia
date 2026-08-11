# Publikacja Fluentia na Render

Projekt zawiera plik `render.yaml`, który tworzy:

- publiczną stronę Next.js,
- publiczne API NestJS,
- PostgreSQL,
- migracje Prisma wykonywane przed wdrożeniem API.

## Pierwsze wdrożenie

1. Umieść repozytorium na GitHubie lub GitLabie.
2. Zaloguj się do Render i wybierz **New > Blueprint**.
3. Połącz repozytorium i wskaż plik `render.yaml`.
4. Podaj sekrety wymagane przez kreator:
   - `OPENAI_API_KEY` — produkcyjny klucz OpenAI,
   - `NEXT_PUBLIC_PRIVACY_EMAIL` — publiczny adres kontaktowy.
5. Zatwierdź utworzenie zasobów.
6. Po zakończeniu sprawdź:
   - `https://fluentia-web.onrender.com/sign-up`,
   - `https://fluentia-api.onrender.com/api/v1/health/ready`.

## Ważne przed udostępnieniem użytkownikom

Bezpłatny PostgreSQL na Render wygasa po 30 dniach. Przed upływem terminu zmień plan bazy na płatny i włącz kopie zapasowe. Bezpłatne serwisy WWW mogą usypiać przy braku ruchu, więc pierwsze otwarcie może potrwać dłużej.

Jeśli Render zmieni nazwę subdomeny z powodu konfliktu, zaktualizuj:

- `WEB_ORIGIN` w usłudze `fluentia-api`,
- `NEXT_PUBLIC_API_URL` w usłudze `fluentia-web`,

a następnie wykonaj ponowne wdrożenie obu usług.
