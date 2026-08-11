# Roadmapa produktu i realizacji — AI English Mentor

## 1. Cel roadmapy

Roadmapa prowadzi od pustego repozytorium do komercyjnego V1 przez kompletne pionowe przyrosty. Każdy przyrost obejmuje interfejs, API, dane, bezpieczeństwo, obserwowalność i testy. Funkcje niegotowe nie będą eksponowane jako atrapy.

Roadmapa jest oparta na [analizie produktu](./PRODUCT_ANALYSIS.md). Daty kalendarzowe zostaną ustalone po oszacowaniu zespołu; kolejność, zależności i bramki jakości są wiążącym szkieletem realizacji.

## 2. Zasady realizacji

1. Najpierw redukujemy ryzyko wartości i jakości AI, potem skalujemy zakres.
2. Budujemy pionowe ścieżki użytkownika, nie odizolowane warstwy techniczne.
3. Każdy kamień milowy ma właściciela, mierzalny rezultat i kryteria wyjścia.
4. Bez testów, telemetrii, dostępności i stanów błędów funkcja nie jest ukończona.
5. Migracje danych są wstecznie kompatybilne i mają procedurę rollbacku.
6. Prompty, modele i reguły pedagogiczne są wersjonowane oraz ewaluowane.
7. Publikacja odbywa się stopniowo za flagami funkcji, z możliwością wycofania.
8. Prywatność i bezpieczeństwo są kryteriami akceptacji, nie osobnym etapem końcowym.

## 3. Definicje gotowości

### Definition of Ready

Element może wejść do realizacji, gdy ma:

- opis problemu i grupę użytkowników,
- kryteria akceptacji oraz zdarzenia analityczne,
- projekt stanów: sukces, ładowanie, pusty, błąd i brak uprawnień,
- zidentyfikowane dane osobowe, ryzyka oraz zależności,
- kontrakt API/danych i plan testów,
- uzgodniony sposób wycofania zmiany.

### Definition of Done

Element jest ukończony, gdy:

- działa end-to-end na wspieranych urządzeniach,
- spełnia kryteria akceptacji i WCAG AA,
- ma testy jednostkowe, integracyjne i właściwe E2E,
- ma logi, metryki, tracing i alerty adekwatne do ryzyka,
- nie zawiera krytycznych podatności ani znanych regresji,
- dokumentacja użytkowa, operacyjna i API jest aktualna,
- migracja oraz rollback zostały sprawdzone,
- właściciel produktu zaakceptował wynik na środowisku testowym.

## 4. Strumienie prac

- **Produkt i badania:** walidacja potrzeb, zakres, metryki i eksperymenty.
- **UX i design system:** przepływy, dostępność, responsywność i spójność.
- **Platforma:** repozytorium, środowiska, dane, bezpieczeństwo i CI/CD.
- **Learning Engine:** profil uczącego się, plan, błędy, mastery i powtórki.
- **AI Runtime:** adaptery, routing, prompty, streaming, pamięć i ewaluacje.
- **Experience:** onboarding, dashboard, mentor tekstowy/głosowy i feedback.
- **Commerce i operacje:** subskrypcje, administracja, moderacja i support.
- **Quality/SRE:** automatyzacja testów, wydajność, odporność, backup i incydenty.

## 5. Fazy i kamienie milowe

## Faza 0 — Walidacja problemu i jakości interwencji

**Cel:** potwierdzić segment, rytuał dziennej sesji i format informacji zwrotnej przed kosztowną budową.

### Zakres

- 15–20 wywiadów z profesjonalistami B1–B2.
- Test przepływu: onboarding → misja → feedback → ponowna próba → plan.
- Concierge test pięciu sesji dla minimum 8 uczestników.
- Porównanie pełnej korekty z trzema priorytetowymi korektami.
- Pierwszy zestaw ekspercki: próbki, rubryki, poprawne oceny i odpowiedzi.
- Walidacja gotowości do płacenia oraz preferencji głos/tekst.
- Rejestr ryzyk, decyzji i hipotez z wynikiem walidacji.

### Kryteria wyjścia

- ≥70% uczestników rozumie obietnicę bez dodatkowego wyjaśnienia.
- ≥60% kończy co najmniej 4 z 5 sesji concierge.
- Większość wskazuje ponowną próbę i kontekstowy feedback jako istotną wartość.
- Ustalono jeden segment startowy, pięć scenariuszy V1 i podstawową rubrykę.
- Krytyczne błędy korekty są skatalogowane i mają plan ograniczenia.
- Decyzja go/no-go udokumentowana; wynik negatywny zmienia zakres przed architekturą.

## Faza 1 — Fundament produktu i platformy

**Cel:** stworzyć bezpieczny, wdrażalny szkielet z jednym przepływem testowym end-to-end.

### Zakres

- Monorepo, standardy kodu, środowiska local/test/staging/production.
- Bazowy frontend, design tokens, tryb jasny/ciemny i dostępny shell aplikacji.
- Backend, PostgreSQL, Redis, kolejki, storage S3-compatible i health checks.
- Kontrakty API, walidacja, obsługa błędów, identyfikatory korelacji i idempotencja.
- CI/CD: lint, typy, testy, skany bezpieczeństwa, migracje i artefakty.
- Observability: strukturalne logi, metryki, tracing, dashboardy i alerty bazowe.
- Zarządzanie konfiguracją i sekretami; lokalne emulatory zależności.
- Pierwszy adapter AI oraz atrapę dostawcy wyłącznie w testach automatycznych.
- Pionowy smoke flow: zabezpieczone żądanie → kolejka → baza → odpowiedź UI.

### Kryteria wyjścia

- Nowy deweloper uruchamia system zgodnie z README bez ręcznych poprawek.
- Każde środowisko powstaje powtarzalnie; deployment i rollback są przetestowane.
- Migracje działają na czystej i istniejącej bazie.
- CI blokuje błędy typów, testów, sekretów i podatności o ustalonym progu.
- Smoke E2E przechodzi na stagingu, a telemetria pokazuje pełny ślad żądania.
- Brak krytycznych i wysokich luk bez zaakceptowanego wyjątku.

## Faza 2 — Tożsamość, zgody i profil uczącego się

**Cel:** użytkownik może bezpiecznie utworzyć konto, zarządzać danymi i rozpocząć personalizację.

### Zakres

- Rejestracja e-mail, weryfikacja, logowanie, wylogowanie i reset hasła.
- Google OAuth; architektura gotowa na Apple, GitHub i magic link.
- Krótkotrwały access token, rotowane refresh tokeny, unieważnianie i lista sesji.
- Opcjonalne 2FA, rate limiting, ochrona CSRF/CORS i audyt zdarzeń bezpieczeństwa.
- Wersjonowane zgody, ustawienia prywatności, eksport i usunięcie konta.
- Profil celów, terminu, czasu, zainteresowań, języka objaśnień i stylu mentora.
- RBAC użytkownik/support/admin z zasadą najmniejszych uprawnień.
- Pierwsze centrum prywatności i zarządzania pamięcią.

### Kryteria wyjścia

- Wszystkie ścieżki konta mają pozytywne i negatywne E2E.
- Ponowne użycie refresh tokenu wykrywa naruszenie i unieważnia rodzinę tokenów.
- Użytkownik widzi aktywne sesje i może je zakończyć.
- Eksport oraz usunięcie obejmują dane i udokumentowaną retencję backupów.
- Admin nie widzi treści użytkownika bez jawnego uprawnienia i śladu audytowego.
- Testy OWASP dla zakresu uwierzytelnienia przechodzą bez problemów krytycznych.

## Faza 3 — Onboarding, diagnoza i pierwszy plan

**Cel:** nowy użytkownik dociera do pierwszej wartości w jednej sesji.

### Zakres

- Adaptacyjny onboarding B1–B2 z alternatywą tekstową dla głosu.
- Krótka diagnoza mówienia/pisania, samoocena i kalibracja preferencji korekty.
- Rubryka diagnozy z poziomem pewności i możliwością ręcznej korekty profilu.
- Model kompetencji rozdzielający fakty, obserwacje i wnioski AI.
- Generator pierwszego tygodnia i dziennego planu z uzasadnieniem.
- Dashboard z jednym głównym działaniem oraz pierwszą misją.
- Zdarzenia lejka i eksperymenty bez zapisywania wrażliwej treści.

### Kryteria wyjścia

- Mediana czasu do pierwszej misji ≤8 minut w teście użyteczności.
- ≥80% testerów kończy onboarding bez pomocy moderatora.
- Oceny AI osiągają uzgodnioną zgodność z ekspertami na golden setach.
- Niska pewność nie jest przedstawiana użytkownikowi jako pewny fakt.
- Plan zawsze mieści się w deklarowanym czasie i wyjaśnia rekomendację.
- Przerwanie onboardingu pozwala bezpiecznie wznowić proces.

## Faza 4 — Mentor tekstowy i feedback

**Cel:** dostarczyć pierwszą kompletną, powtarzalną sesję komunikacyjną.

### Zakres

- Streaming rozmowy tekstowej, anulowanie, retry i odzyskanie sesji.
- Pięć scenariuszy V1 z celem, rolą, poziomami i kryteriami sukcesu.
- Trzy style mentora oraz ustawienie intensywności korekty.
- Podpowiedź, tłumaczenie, uproszczenie, wyjaśnienie i ponowna próba.
- Pamięć sesji oraz kontrolowana pamięć długoterminowa ze źródłem i pewnością.
- Podsumowanie: realizacja celu, trzy priorytety, przykłady przed/po i next action.
- Wersjonowane prompty, routing modeli, budżety kosztowe i fallback.
- Moderacja wejścia/wyjścia i odporność na prompt injection.

### Kryteria wyjścia

- Wszystkie scenariusze przechodzą eksperckie testy jakości i regresji.
- p95 czasu do pierwszego fragmentu odpowiedzi mieści się w ustalonym SLO.
- Zerwany stream można wznowić bez podwójnego naliczenia lub zapisu.
- Pamięć nie zapisuje zakazanych kategorii i jest edytowalna/usuwalna.
- Feedback odnosi się do faktycznej wypowiedzi i nie wymyśla błędów.
- Koszt sesji mieści się w budżecie planu przy p95 użycia.

## Faza 5 — Learning Engine: błędy, słownictwo i powtórki

**Cel:** każda sesja poprawia następne doświadczenie, a nauka utrwala się w czasie.

### Zakres

- Taksonomia błędów, ważność, częstotliwość, kontekst i status opanowania.
- Ekstrakcja fraz/kolokacji z kontrolą duplikatów i trafności.
- Kolejka powtórek uwzględniająca retencję, cel, termin i trudność.
- Formy: przypomnienie, uzupełnienie, parafraza, produkcja i użycie w rozmowie.
- Model mastery z historią obserwacji i poziomem pewności.
- Reguły stabilności planu oraz „minimum na trudny dzień”.
- Dashboard trendu, elementów do powtórki i powodu rekomendacji.

### Kryteria wyjścia

- Elementy z sesji trafiają do powtórek zgodnie z regułami i zgodą.
- Użytkownik może oznaczyć znane, odrzucić, edytować i zgłosić element.
- Harmonogram jest deterministycznie testowalny i odporny na zmianę strefy czasu.
- Ponowna demonstracja umiejętności aktualizuje mastery bez gwałtownych skoków.
- Plan nie przekracza czasu i priorytetyzuje zaległe, wartościowe elementy.
- Testy potwierdzają izolację danych między użytkownikami.

## Faza 6 — Mentor głosowy i wymowa

**Cel:** zapewnić płynną, bezpieczną praktykę mówienia oraz wiarygodną informację o zrozumiałości.

### Zakres

- Uprawnienia mikrofonu, nagrywanie, VAD, odtwarzanie, anulowanie i ponowna próba.
- Streaming STT, obsługa niepewności transkrypcji i poprawianie finalnego zapisu.
- TTS z wariantem akcentu, regulacją prędkości i jawnym oznaczeniem syntezy.
- Turn-taking, przerwanie mentora i degradacja do tekstu.
- Metryki zrozumiałości, płynności, tempa, rytmu i intonacji.
- Analiza fragmentów tylko dla danych o wystarczającej jakości.
- Kontrola retencji nagrań i oddzielna zgoda na przechowywanie.
- Golden set głosowy obejmujący różne akcenty, urządzenia i warunki szumu.

### Kryteria wyjścia

- Pełna sesja działa na wspieranych przeglądarkach i urządzeniach.
- Odmowa mikrofonu prowadzi do równoważnej ścieżki tekstowej.
- p95 opóźnienia tury mieści się w SLO określonym po pomiarach regionalnych.
- Wyniki nie karzą systematycznie akcentów, płci lub jakości urządzenia.
- System odróżnia brak pewności STT od błędu wymowy.
- Usunięcie nagrania działa i pozostawia tylko dane dozwolone polityką.

## Faza 7 — Subskrypcje i egzekwowanie uprawnień

**Cel:** bezpiecznie monetyzować wartość bez niespójnych stanów konta.

### Zakres

- Plany Free/Pro, miesięczne/roczne ceny, trial, kupony i limity.
- Stripe Checkout, portal klienta, faktury i metody płatności.
- Podpisane webhooki, idempotencja, obsługa zdarzeń poza kolejnością i retry.
- Entitlements jako źródło praw dostępu niezależne od UI.
- Okres karencji, nieudane płatności, anulowanie i reaktywacja.
- Metryki lejka, MRR, churn, koszt sesji i marża po kosztach AI.
- Jasne komunikaty limitów bez ujawniania tokenowej złożoności.

### Kryteria wyjścia

- Macierz stanów subskrypcji ma testy integracyjne i E2E w środowisku Stripe test.
- Powtórzony webhook nie powoduje podwójnych skutków.
- Uprawnienia są egzekwowane po stronie serwera.
- Awaria Stripe nie odbiera natychmiast legalnego dostępu.
- Kwoty, podatki, waluta, trial i warunki anulowania są czytelne przed zakupem.
- Procedura refundu i obsługi chargebacku jest udokumentowana.

## Faza 8 — Administracja, moderacja i operacje

**Cel:** zespół może bezpiecznie obsługiwać produkt, jakość AI i incydenty.

### Zakres

- Użytkownicy, role, status kont, zgody i subskrypcje.
- Maskowanie danych, kontrolowany dostęp supportu i pełny audit log.
- Prompt management: wersje, porównanie, zatwierdzanie, canary i rollback.
- Dashboard kosztów, opóźnień, błędów, jakości i wykorzystania modeli.
- Kolejka moderacji, zgłoszenia użytkowników i procedury eskalacji.
- Feature flags, konfiguracja scenariuszy i kill switches.
- Runbooki: dostawca AI, głos, płatności, wyciek danych i przeciążenie kosztowe.

### Kryteria wyjścia

- Każda uprzywilejowana akcja wymaga właściwej roli i jest audytowana.
- Dane wrażliwe są zamaskowane domyślnie.
- Publikacja promptu wymaga ewaluacji i zatwierdzenia; rollback jest natychmiastowy.
- Moderator nie może eksportować pełnych treści bez dodatkowej kontroli.
- Alarmy mają właściciela, próg i działający runbook.
- Ćwiczenie incydentu potwierdza ścieżkę wykrycia, komunikacji i odtworzenia.

## Faza 9 — Utwardzenie, beta i gotowość komercyjna

**Cel:** potwierdzić jakość, ekonomię i operacyjność V1 w realnym ruchu.

### Zakres

- Audyt bezpieczeństwa, threat modeling, test penetracyjny i naprawy.
- Testy obciążeniowe, chaos/failure tests, limity kosztów i degradacja usług.
- Test odtworzenia backupu oraz procedury DR.
- Pełny audyt WCAG AA i testy z technologiami asystującymi.
- Kompatybilność urządzeń, przeglądarek, słabego łącza i przerwanych sesji.
- Closed beta → expanded beta → canary production z kohortami.
- Support, status page, polityki, regulaminy, prywatność i proces zgłoszeń.
- SEO techniczne stron publicznych, sitemap, robots i structured data.
- Raport jakości AI, kosztów jednostkowych i wyników retencji.

### Kryteria wyjścia do GA

- Zero otwartych podatności krytycznych/wysokich; średnie mają właściciela i termin.
- SLO podstawowych funkcji są spełniane przez uzgodniony okres obserwacji.
- Backup został odtworzony w ramach RPO/RTO.
- Krytyczne ścieżki przechodzą E2E i ręczną certyfikację release candidate.
- Jakość AI przekracza uzgodnione progi na zestawach eksperckich i becie.
- Koszt p95 aktywnego użytkownika mieści się w modelu marżowym.
- D7/D30 i użycie potwierdzają sens komercyjnego uruchomienia albo wywołują iterację.
- Support, on-call, alerty, rollback i komunikacja incydentowa są aktywne.

## 6. Zakres V1 i świadome wyłączenia

### V1 obejmuje

- konto e-mail i Google, sesje, reset hasła i podstawowe 2FA,
- zgody, centrum prywatności i kontrolowaną pamięć,
- onboarding, diagnozę, dashboard i plan,
- mentora tekstowego i głosowego,
- pięć kompletnych scenariuszy,
- feedback, grammar coaching, osobiste frazy i inteligentne powtórki,
- wiarygodną podstawową analizę wymowy,
- Free/Pro, trial, kupony, faktury i portal Stripe,
- panel administracyjny, moderację, prompt management i monitoring,
- pełne wymagania bezpieczeństwa, dostępności, SEO publicznego i operacji.

### Poza V1

- pełne moduły czytania, słuchania i pisania,
- pozostałe scenariusze, rankingi i rozbudowane osiągnięcia,
- Apple/GitHub/magic link, jeśli nie potwierdzi ich walidacja,
- organizacje, SSO, B2B analytics i zarządzanie miejscami,
- aplikacje natywne, marketplace i certyfikacja językowa.

Elementy poza V1 nie pojawią się jako nieaktywne przyciski. Ich fundamenty danych można zaprojektować, ale nie kosztem ukończenia pionów V1.

## 7. Roadmapa po V1

### V1.1 — Rozszerzenie pętli uczenia

- Pisanie z zachowaniem głosu użytkownika i wersjami przed/po.
- Czytanie z interaktywnymi frazami i zadaniami rozumienia.
- Słuchanie, shadowing i różnorodność akcentów.
- Pełna biblioteka scenariuszy z briefu.
- Rozbudowane raporty kontrolne oraz spokojna gamifikacja.

Warunek wejścia: stabilna retencja V1, sprawdzona ekonomia głosu i wiarygodny Learning Engine.

### V2 — Produkt zespołowy

- Organizacje, miejsca, role firmowe, SSO i ścieżki branżowe.
- Prywatność B2B oraz zagregowane raporty bez inwazyjnego monitoringu.
- Integracje kalendarza/LMS po potwierdzeniu potrzeb.

Warunek wejścia: powtarzalny kanał sprzedaży B2B i osobna analiza prawna/produktowa.

## 8. Zależności krytyczne

1. Walidacja rubryk poprzedza diagnozę, mastery i raporty.
2. Tożsamość, zgody i model danych poprzedzają pamięć długoterminową.
3. Mentor tekstowy stabilizuje scenariusze i prompty przed głosem.
4. Zdarzenia sesji i taksonomia błędów poprzedzają powtórki.
5. Entitlements i idempotencja poprzedzają uruchomienie płatności.
6. Ewaluacje oraz wersjonowanie promptów poprzedzają panel prompt management.
7. Monitoring kosztu i jakości poprzedza szeroką betę.
8. Backup restore, audyt bezpieczeństwa i runbooki poprzedzają GA.

## 9. Strategia testów w roadmapie

- **Jednostkowe:** reguły domenowe, mastery, plan, harmonogram, uprawnienia i billing state machine.
- **Kontraktowe:** API, zdarzenia, providerzy AI/STT/TTS, Stripe i storage.
- **Integracyjne:** baza, Redis, kolejki, auth, webhooki i transakcje.
- **E2E:** krytyczne ścieżki użytkownika i administratora.
- **AI evals:** golden sety, stabilność, bezpieczeństwo, poziom, ton i koszty.
- **Głosowe:** akcenty, szum, urządzenia, opóźnienia i błędy STT.
- **Niefunkcjonalne:** wydajność, obciążenie, WCAG, bezpieczeństwo i disaster recovery.

Cel ≥90% pokrycia dotyczy kodu domenowego i krytycznych usług; nie zastępuje testów zachowania. Krytyczne reguły auth, płatności, dostępu i retencji wymagają pełnego pokrycia gałęzi lub udokumentowanego wyjątku.

## 10. Strategia wdrożeń

1. Środowisko lokalne i automatyczne preview dla zmian interfejsu/API.
2. Integracja na stagingu z syntetycznymi danymi i sandboxami dostawców.
3. Internal alpha dla zespołu i ekspertów językowych.
4. Closed beta na zaproszenie z limitami kosztowymi.
5. Expanded beta z segmentacją oraz obserwacją D7/D30.
6. Canary produkcyjny: mały procent użytkowników, automatyczne stop conditions.
7. General Availability po przejściu bramki fazy 9.

Każde wdrożenie zawiera migrację expand/contract, feature flag, monitorowane okno, kryteria rollbacku i właściciela decyzji.

## 11. Bramki decyzyjne

### Gate A — Problem/Solution Fit

Po fazie 0: czy użytkownicy wracają do sesji i cenią feedback? Jeśli nie, iterujemy propozycję wartości bez rozbudowy platformy.

### Gate B — Jakość rdzenia

Po fazie 4: czy tekstowy mentor jest poprawny, pomocny, stabilny i ekonomiczny? Jeśli nie, głos i płatności czekają.

### Gate C — Efekt uczenia

Po fazie 5: czy użytkownicy ponownie używają poprawionych wzorców i zachowują je w czasie? Jeśli nie, poprawiamy Learning Engine.

### Gate D — Voice Readiness

Po fazie 6: czy rozmowa głosowa ma akceptowalne opóźnienie i uczciwą ocenę? Jeśli nie, głos pozostaje kontrolowaną betą.

### Gate E — Commercial Readiness

Po fazie 9: czy retencja, jakość, bezpieczeństwo, niezawodność i marża wspierają GA? Brak jednego krytycznego warunku blokuje szerokie uruchomienie.

## 12. Własność i rytm zarządzania

- Product Lead odpowiada za rezultat, zakres i KPI.
- Learning/AI Lead odpowiada za pedagogikę, prompty, ewaluacje i jakość modeli.
- Engineering Lead odpowiada za architekturę, dostarczenie i niezawodność.
- Security/Privacy Owner zatwierdza dane, zagrożenia, dostawców i retencję.
- Design Lead odpowiada za przepływy, system wizualny i dostępność.
- QA/SRE Owner utrzymuje strategię testów, SLO, release gates i gotowość operacyjną.

Rytm: cotygodniowy przegląd rezultatów i ryzyk, dwutygodniowa demonstracja pionu, miesięczny przegląd KPI/kosztów/AI quality oraz formalna decyzja na każdej bramce.

## 13. Rejestr mierzalnych rezultatów V1

Przed rozpoczęciem implementacji wartości docelowe zostaną zamrożone po baseline z fazy 0. V1 musi jednak mierzyć co najmniej:

- czas do pierwszej wartości,
- ukończenie onboardingu i pierwszej misji,
- D1/D7/D30 oraz trzy wartościowe sesje tygodniowo,
- udział mówienia i liczbę ponownych prób,
- retencję fraz oraz spadek powtarzalnych błędów,
- zgodność oceny AI z ekspertem i odsetek zgłoszonych korekt,
- p50/p95 opóźnień tekstu i głosu,
- koszt na sesję, aktywnego użytkownika i płacącego użytkownika,
- konwersję trial/paid, churn i marżę brutto,
- incydenty bezpieczeństwa, moderacji i prywatności.

## 14. Kryteria ukończenia etapu roadmapy

Etap roadmapy jest ukończony, gdy:

- analiza została rozbita na kolejność pionowych, testowalnych faz,
- każda faza ma cel, zakres i jednoznaczne kryteria wyjścia,
- wskazano zależności, bramki decyzyjne i świadome wyłączenia V1,
- bezpieczeństwo, AI quality, dostępność i operacje są częścią każdej fazy,
- zdefiniowano strategię testów, wdrożeń i zarządzania wydaniami,
- można zaprojektować architekturę bez ponownego definiowania zakresu produktu.

## 15. Następny etap

Następnym etapem jest kompletna architektura systemu: granice domen, komponenty, przepływy synchroniczne i asynchroniczne, strategia danych, bezpieczeństwo, multi-provider AI, skalowanie, obserwowalność, deployment oraz kluczowe Architecture Decision Records. Po jej zatwierdzeniu powstanie docelowa struktura katalogów.
