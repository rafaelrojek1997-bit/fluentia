# Publikacja Fluentia na Render - krok po kroku

Projekt jest przygotowany jako jeden Blueprint Render. Plik `render.yaml` tworzy automatycznie strone Next.js, API NestJS, baze PostgreSQL i tabele przez migracje Prisma.

## Co trzeba przygotowac

1. Konto GitHub z tym projektem.
2. Konto Render z potwierdzonym adresem e-mail.
3. Klucz OpenAI API. Nigdy nie dodawaj go do GitHub.
4. Publiczny adres e-mail do kontaktu w polityce prywatnosci.

## Wdrozenie

1. Wejdz na `https://dashboard.render.com/blueprint/new`.
2. Wybierz repozytorium `https://github.com/rafaelrojek1997-bit/fluentia`.
3. Render wykryje `render.yaml` z katalogu glownego.
4. Kliknij **Connect**.
5. Wpisz `OPENAI_API_KEY` i `NEXT_PUBLIC_PRIVACY_EMAIL`.
6. Kliknij **Deploy Blueprint** lub **Apply**.
7. Poczekaj, az baza, API i strona uzyskaja stan **Available** lub **Live**.

## Kontrola po wdrozeniu

- `https://fluentia-api.onrender.com/api/v1/health/live` - status `ok`.
- `https://fluentia-api.onrender.com/api/v1/health/ready` - baza ma status `ok`.
- `https://fluentia-web.onrender.com/sign-up` - utworz konto.
- `https://fluentia-web.onrender.com/conversation` - sprawdz czat angielski i niemiecki.

## Jesli Render nada inne adresy

1. W `fluentia-api` ustaw `WEB_ORIGIN` na dokladny adres strony, bez ukosnika na koncu.
2. W `fluentia-web` ustaw `NEXT_PUBLIC_API_URL` na adres API zakonczony `/api/v1`.
3. Wykonaj **Manual Deploy > Deploy latest commit** dla obu uslug.

## Gdy wdrozenie jest czerwone

1. Otworz usluge ze statusem **Failed** i zakladke **Logs**.
2. Skopiuj pierwsza czerwona linie bledu i okolo 20 linii pod nia.
3. Nie kopiuj klucza OpenAI ani wartosci sekretow.

## Wazne ograniczenia

- Bezplatne serwisy moga zasypiac; pierwsze wejscie po przerwie trwa dluzej.
- Bezplatna baza jest rozwiazaniem testowym. Przed wiekszym ruchem wybierz trwaly plan i backupy.
- OpenAI API jest platne. Ustaw limit budzetu w OpenAI Platform.

## Aktualizacje i ZIP

Po zmianie kodu wykonaj commit i push do `main`; Render wdrozy nowa wersje. Plik `Fluentia-Hosting-Ready.zip` zawiera ten sam kod, ale automatyczne aktualizacje Render dzialaja przez GitHub.
