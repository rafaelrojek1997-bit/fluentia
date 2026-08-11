# Plan wydania w Google Play — AI English Mentor

**Status:** obowiązujące rozszerzenie [roadmapy](./ROADMAP.md) i [aneksu Android](./ROADMAP_ANDROID_ADDENDUM.md). Polityki Google Play są zmienne; właściciel wydania weryfikuje ich aktualną treść przed każdym release.

## 1. Decyzje wydania V1

- Platforma: telefony i tablety Android.
- Dystrybucja: Google Play jako Android App Bundle (`.aab`).
- Target: `targetSdk >= 36` (Android 16); wyższy, jeśli aktualna polityka Play będzie tego wymagać.
- Grupa docelowa V1: **dorośli 18+**. Produkt nie jest kierowany do dzieci.
- Kategoria bazowa: **Education**; `Tools` tylko jeśli pozycjonowanie produktu faktycznie się zmieni.
- Monetyzacja w aplikacji: Google Play Billing jako wariant domyślny; alternatywny billing wyłącznie po formalnym zapisaniu się do programu dostępnego w danym regionie i wdrożeniu jego API, UX, raportowania oraz opłat.
- Języki listingu startowego: polski i angielski, z osobnymi tekstami oraz grafikami, gdy grafika zawiera tekst.

## 2. Konto deweloperskie

### Przed utworzeniem aplikacji

- Wybrać świadomie typ konta: Personal albo Organization.
- Utworzyć konto Play Console i uiścić aktualną opłatę rejestracyjną pokazaną przez Google; kwota nie jest zakodowana w wymaganiach produktu.
- Ukończyć weryfikację tożsamości oraz wymagane weryfikacje urządzenia i danych kontaktowych.
- Zweryfikować publiczny e-mail supportu i telefon konta deweloperskiego.
- Włączyć MFA dla wszystkich właścicieli i ograniczyć role zgodnie z least privilege.
- Utworzyć płatniczy profil sprzedawcy przed konfiguracją produktów/subskrypcji.
- Zapisać w rejestrze zgodności typ i datę utworzenia konta, ponieważ wpływa to na wymaganie closed testing.

## 3. Tożsamość aplikacji

Przed pierwszym utworzeniem wpisu w Play Console wymagane jest formalne zatwierdzenie:

- nazwy produktu,
- `applicationId`/package name, np. w kontrolowanej domenie organizacji,
- właściciela praw do marki i domen,
- środowiskowych identyfikatorów OAuth/deep links,
- polityki podpisywania i odzyskiwania kluczy.

`applicationId` identyfikuje aplikację w Google Play i nie może zostać zmieniony dla istniejącego listingu. Zmiana oznacza nową aplikację, nowy listing oraz utratę ciągłości instalacji i aktualizacji. Nie używamy tymczasowej nazwy package w produkcji.

## 4. Build i wersjonowanie

### Obowiązkowa konfiguracja

- Artefakt publikacyjny: `.aab`; APK może służyć lokalnym testom, ale nie jest artefaktem nowej publikacji Play.
- `targetSdk = 36` co najmniej; `compileSdk` nie niższy niż wymagany do tego targetu.
- `minSdk` zostanie ustalony osobnym ADR-em na podstawie danych o urządzeniach, audio, bezpieczeństwie i kosztu testów.
- `versionCode` jest dodatnią liczbą całkowitą, unikalną i rośnie w każdym kolejnym artefakcie wysyłanym na dany track.
- `versionName` jest czytelną wersją produktu zgodną z przyjętą strategią release.
- Release build jest debuggable=false, minifikowany zgodnie z testami i pozbawiony sekretów/logowania wrażliwych danych.
- Symbole/mapy deobfuskacji oraz native debug symbols są wysyłane do Play Console, jeśli dotyczą buildu.
- Finalny AAB przechodzi analizę uprawnień, SDK, target API, rozmiaru, podpisu i zawartości.

### Play App Signing

- Aplikacja zostaje zapisana do Play App Signing.
- **Google chroni app signing key** i podpisuje artefakty dystrybuowane użytkownikom.
- **Deweloper zachowuje upload key**, którym podpisuje AAB wysyłany do Play. Google weryfikuje go przez upload certificate.
- Upload key jest przechowywany w bezpiecznym systemie CI/secret managerze, ma ograniczony dostęp, backup i procedurę resetu po utracie lub kompromitacji.
- Klucz nie trafia do repozytorium, obrazu kontenera, logów ani laptopów bez uzasadnionej potrzeby.
- Jeśli aplikacja ma być dystrybuowana w innych sklepach z tym samym podpisem, decyzja o własnym app signing key musi zapaść przed enrollmentem.

### Automatyczna bramka CI

Pipeline odczytuje dane z finalnego AAB i blokuje publikację, jeśli:

- target API jest niższy niż 36 lub aktualny wymóg Play,
- `versionCode` nie jest większy od ostatnio opublikowanego,
- podpis/certyfikat jest nieoczekiwany,
- wykryto niedozwolone uprawnienie lub SDK,
- build zawiera endpoint testowy, debug flagę, sekret albo niewłaściwe środowisko,
- krytyczne testy i skany nie przechodzą.

## 5. Closed testing i dostęp produkcyjny

### Kiedy obowiązuje 12/14

Dla **osobistego konta deweloperskiego utworzonego po 13 listopada 2023 r.**:

- closed test musi mieć minimum **12 testerów**, którzy pozostają opted-in,
- każdy z wymaganych testerów pozostaje opted-in przez co najmniej **14 kolejnych dni**,
- po spełnieniu warunku deweloper **składa wniosek o production access** i odpowiada na pytania o aplikację, przebieg testu, feedback i gotowość produkcyjną,
- spełnienie 12/14 umożliwia złożenie wniosku, ale nie gwarantuje automatycznej akceptacji.

Internal testing do 100 testerów jest zalecanym wcześniejszym etapem, ale nie zastępuje wymaganego closed testu. Wymóg nie jest automatycznie przypisywany kontom organizacyjnym ani starszym kontom osobistym; rzeczywisty status pokazuje Play Console.

### Plan testu

- Rekrutujemy co najmniej 15–18 osób, aby utrzymać zapas ponad wymagane 12.
- Testerzy używają kont Google i świadomie wybierają opt-in.
- Track closed test ma stabilny release candidate; aktualizacje naprawcze nie mogą łamać ciągłości dostępu testerów.
- Testerzy otrzymują scenariusze: rejestracja, onboarding, rozmowa tekstowa/głosowa, zgłoszenie AI, zakup testowy, anulowanie, eksport i usunięcie konta.
- W aplikacji działa łatwy kanał feedbacku i zgłaszania błędów.
- Zbieramy zgodnie z prywatnością: urządzenie/API, wersję, crash/ANR, ukończenie scenariuszy i jawny feedback.
- Prowadzimy dziennik napraw oraz podsumowanie wymagane przy wniosku o production access.
- Nie kupujemy pozornych opt-inów ani nie manipulujemy aktywnością testerów.

## 6. Main Store Listing

### Teksty

- Nazwa aplikacji: maksymalnie 30 znaków.
- Krótki opis: maksymalnie 80 znaków.
- Pełny opis: maksymalnie 4000 znaków.
- Teksty są lokalizowane, poprawne językowo i zgodne z rzeczywistymi funkcjami dostępnymi w danym wydaniu.
- Nie używamy deklaracji rankingu, np. „#1”, „best”, „App of the Year”, ani informacji cenowo-promocyjnych typu „free”, rabat czy „no ads” w sposób zabroniony przez Metadata policy.
- Brak upychania słów kluczowych, ALL CAPS, nieuzasadnionych emoji, porównań wprowadzających w błąd i obietnic gwarantowanego efektu nauki.
- Nie twierdzimy, że AI jest człowiekiem, certyfikowanym egzaminatorem, lekarzem lub bezbłędnym nauczycielem.

### Grafiki

- Ikona Play: 512 × 512 px, 32-bit PNG z alpha, maksymalnie 1024 KB, zgodna ze specyfikacją ikon Play.
- Feature graphic: 1024 × 500 px, zgodny ze strefami bezpieczeństwa i bez zwodniczych badge'y.
- Minimum dwa screenshoty spełniające aktualną specyfikację Play; dla jakości listingu przygotowujemy 4–8 na każdy wspierany form factor.
- Osobne zestawy dla telefonu i tabletu, jeżeli oba są wspierane.
- Screenshoty pokazują realny build i stan produktu; brak makiet funkcji, których użytkownik nie otrzyma.
- Materiały nie pokazują danych osobowych, realnych rozmów ani niezatwierdzonych znaków towarowych.
- Zrzuty obejmują: dzienny plan, rozmowę, bezpieczny feedback, wymowę, powtórki i kontrolę prywatności.

### Informacje kontaktowe i listing

- Publiczny, monitorowany e-mail supportu.
- Publiczna strona produktu/supportu i polityki prywatności.
- Kategoria Education, odpowiednie tagi oraz kraje dystrybucji.
- Store listing jest gotowy także dla closed testu, ponieważ jest współdzielony między trackami.

## 7. Polityka prywatności i Data Safety

### Publiczna polityka

- Publiczny URL HTTPS, dostępny bez logowania, geoblokady i aplikacji zewnętrznej.
- Dokument jest stroną HTML, nie PDF-em, i działa na urządzeniach mobilnych.
- Link znajduje się w Play Console oraz w aplikacji: onboarding/zgody i Ustawienia → Prywatność.
- Polityka identyfikuje operatora, kontakt, cele, podstawy, kategorie danych, odbiorców, transfery, retencję, bezpieczeństwo, prawa i proces usunięcia.
- Każda zmiana dostawcy lub celu danych uruchamia przegląd polityki i Data Safety przed release.

### Data Safety

Formularz jest obowiązkowy i musi odpowiadać zachowaniu aplikacji, backendu oraz wszystkich SDK. Rejestr danych obejmuje co najmniej:

- identyfikatory konta i dane kontaktowe,
- treść wiadomości, transkrypcje i opcjonalne nagrania głosu,
- cele nauki, zainteresowania, pamięć mentora i obserwacje kompetencji,
- dane zakupu/subskrypcji,
- diagnostykę, crash reports, urządzenie i analitykę,
- zgłoszenia treści oraz komunikację z supportem.

Dla każdej kategorii określamy: collected/shared, cel, obligatoryjność, retencję, szyfrowanie w tranzycie, możliwość usunięcia i odbiorców. Przekazanie do OpenAI, Anthropic, Google, dostawcy STT/TTS, hostingu, analityki lub supportu jest oceniane zgodnie z definicjami Google i jawnie opisane tam, gdzie stanowi zbieranie/udostępnianie.

„Zaszyfrowane w tranzycie” oraz „można zażądać usunięcia” można zaznaczyć tylko po technicznym teście tych funkcji.

### Usunięcie konta i danych

Jeśli konto można utworzyć w aplikacji:

- aplikacja zawiera łatwą ścieżkę rozpoczęcia usunięcia konta,
- publiczna strona web pozwala rozpocząć żądanie bez konieczności ponownej instalacji aplikacji,
- link webowy jest podany w Play Console,
- interfejs jasno opisuje dane usuwane, dane legalnie zachowywane i terminy,
- proces obejmuje backend, storage, pamięć AI, transkrypcje, audio, system supportu i podprocesorów,
- użytkownik otrzymuje potwierdzenie, a proces jest idempotentny i audytowany.

## 8. Bezpieczeństwo treści generowanych przez AI

Mentor jest objęty polityką AI-Generated Content. Wymagane są:

- moderacja wejścia i wyjścia, reguły systemowe oraz kontrola scenariuszy,
- blokowanie lub bezpieczne przekierowanie treści naruszających Restricted Content, w tym wykorzystywania dzieci, treści seksualnych bez zgody, nienawiści, przemocy, oszustw i nielegalnych instrukcji,
- brak generowania zwodniczych treści i brak fałszywych deklaracji możliwości AI,
- jasne oznaczenie, że mentor i syntetyczny głos są generowane przez AI,
- wbudowany przy każdej odpowiedzi dostępny mechanizm „Zgłoś treść”; zgłoszenie nie wymaga wyjścia z aplikacji,
- kategorie zgłoszenia, opcjonalny komentarz, bezpieczny kontekst i potwierdzenie przyjęcia,
- kolejka moderacji, SLA według severity, blokada treści/modelu oraz audyt decyzji,
- mechanizm apelacji/supportu i użycie raportów do poprawy filtrów,
- testy red-team oraz golden safety set przed każdym istotnym modelem/promptem.

Deweloper pozostaje odpowiedzialny za wynik niezależnie od zewnętrznego providera. Awaria moderacji prowadzi do kontrolowanej degradacji, a nie do nieograniczonego generowania.

## 9. Content Rating i grupa docelowa

- Wypełniamy kwestionariusz IARC uczciwie dla faktycznej treści, otwartego inputu, rozmów AI i interakcji użytkownika.
- Powtarzamy kwestionariusz, gdy zmiana funkcji wpływa na odpowiedzi.
- Target audience V1: wyłącznie grupy dorosłe 18+ dostępne w Play Console.
- Marketing, onboarding i store listing nie są kierowane do dzieci.
- Nie korzystamy z Families programu ani reklam kierowanych do dzieci.
- Weryfikujemy wymagania ochrony małoletnich właściwe dla krajów dystrybucji, nawet przy deklarowanym 18+.
- Rozszerzenie do 13+ wymaga osobnej analizy prawnej, privacy/safety design, moderacji i aktualizacji IARC; nie jest zwykłą zmianą pola w Console.

## 10. Uprawnienia Android

### Zasada minimalizacji

- Każde uprawnienie ma właściciela, funkcję, uzasadnienie i test cofnięcia.
- Prośba następuje dopiero w momencie użycia funkcji, po krótkim ekranie kontekstowym.
- Odmowa, „nie pytaj ponownie” i cofnięcie w ustawieniach mają działające ścieżki UX.
- Nie prosimy o kamerę, lokalizację, kontakty, SMS, call log ani storage, jeśli V1 ich faktycznie nie potrzebuje.

### Mikrofon

- `RECORD_AUDIO` jest wymagane tylko przy rozpoczęciu rozmowy/nagrania głosowego.
- Ekran wyjaśnia cel, przetwarzanie przez backend/STT, retencję i alternatywę tekstową.
- Wskaźnik nagrywania jest stale widoczny; użytkownik może natychmiast zatrzymać i usunąć nagranie.
- Nagrywanie nie rozpoczyna się w tle bez jawnej akcji i zgodności z platformą.
- Manifest i Play Console zawierają tylko wymagane deklaracje.

Każdy nowy SDK przechodzi analizę manifest merger, aby nie wnosił niepotrzebnych uprawnień.

## 11. Subskrypcje i płatności

- Dostęp Pro, minuty AI i inne cyfrowe funkcje kupowane w aplikacji używają Google Play Billing, chyba że użytkownik/region i zapis do oficjalnego programu pozwalają na alternatywę.
- Nie dodajemy linków, komunikatów ani ścieżek prowadzących do płatności webowej bez potwierdzonej zgodności z programem danego regionu.
- Backend weryfikuje zakup przez Google Play Developer API i utrzymuje lokalne entitlements.
- Obsługiwane są acknowledgement, pending purchase, renewal, grace period, account hold, pause, cancellation, expiry, refund i revoke.
- Real-time developer notifications i okresowa reconciliation naprawiają utracone/nieuporządkowane zdarzenia.
- Użytkownik ma cenę, okres, trial, warunki odnowienia, zarządzanie i anulowanie przed zakupem.
- Zakup można odtworzyć po ponownej instalacji i na innym urządzeniu tego samego konta.
- Stripe pozostaje kanałem webowym. Mapowanie uprawnień Stripe/Play nie może umożliwiać podwójnego trialu ani niespójnego dostępu.
- Przed wydaniem w każdym regionie ponownie sprawdzamy programy billing choice i aktualne obowiązki raportowania/opłat.

## 12. Stabilność i jakość

Release jest blokowany przy:

- krytycznym crashu, ANR lub braku uruchomienia na wspieranym API,
- niedziałającej rejestracji, rozmowie, zakupie, usunięciu konta lub zgłoszeniu AI,
- pustym ekranie, niedostępnym głównym działaniu albo braku obsługi błędu sieci,
- rozbieżności Data Safety z telemetrią/SDK,
- brakującym supportem lub polityką prywatności,
- problemie krytycznym z pre-launch report, bezpieczeństwa lub dostępności.

Monitorujemy: crash-free users/sessions, ANR, start time, p95 API/AI/audio, battery/data usage, błędy Billing, problemy urządzeń audio, rating i zgłoszenia policy.

## 13. Materiały operacyjne

Przed produkcją muszą istnieć:

- support inbox z SLA i procedurą eskalacji,
- publiczna strona supportu/statusu,
- runbook odrzucenia Play i appeal,
- runbook utraty upload key,
- runbook błędnych subskrypcji/refundów,
- proces odpowiedzi na zgłoszenia AI i prywatności,
- changelog/release notes dla każdej wersji,
- rejestr deklaracji Play z właścicielem i datą ostatniej weryfikacji.

## 14. Sekwencja wydania

1. Utworzyć i zweryfikować konto deweloperskie oraz płatnicze.
2. Zatwierdzić ostateczny `applicationId`, markę, domeny i politykę kluczy.
3. Utworzyć wpis aplikacji, zapisać ją do Play App Signing i skonfigurować upload key.
4. Zbudować AAB z `targetSdk >= 36`, rosnącym `versionCode` i produkcyjną konfiguracją.
5. Uruchomić internal testing oraz naprawić problemy automatyczne/pre-launch.
6. Przygotować i zweryfikować listing, grafiki, support oraz politykę prywatności.
7. Wypełnić Data Safety, account deletion, IARC, target audience, AI, ads i wymagane deklaracje uprawnień.
8. Skonfigurować produkty/subskrypcje Play Billing i pełne testy licencyjne.
9. Jeśli konto podlega wymaganiu: uruchomić closed testing z zapasem testerów i utrzymać ≥12 opted-in przez 14 kolejnych dni.
10. Zebrać feedback, wdrożyć poprawki i złożyć wniosek o production access.
11. Wykonać Gate F oraz formalny go/no-go produktu, bezpieczeństwa, prywatności, AI i operacji.
12. Wysłać release do review i rozpocząć staged rollout z aktywnym monitoringiem oraz kill switchami.

Nie zakładamy, że review potrwa określoną liczbę dni. Harmonogram zawiera bufor na dodatkowe pytania, odrzucenie, poprawki i ponowną weryfikację.

## 15. Checklista go/no-go

### Konto i dostęp

- [ ] Typ/data konta i obowiązek 12/14 potwierdzone w Play Console.
- [ ] Tożsamość, kontakt, MFA, role i payments profile gotowe.
- [ ] Support e-mail jest monitorowany.

### Artefakt

- [ ] Finalny `.aab`, właściwy `applicationId`, target API i `versionCode`.
- [ ] Play App Signing oraz upload key zweryfikowane.
- [ ] Manifest, SDK Index, SBOM, uprawnienia i skany bez problemów blokujących.
- [ ] Symbole i mapy deobfuskacji przesłane.

### Listing

- [ ] Nazwa ≤30, short ≤80, full ≤4000.
- [ ] Ikona, feature graphic i screenshoty zgodne oraz prawdziwe.
- [ ] Lokalizacje, kategoria, kontakt i kraje sprawdzone.

### Dane i AI

- [ ] Polityka HTTPS dostępna w webie i aplikacji.
- [ ] Data Safety odzwierciedla kod, SDK, backend i providerów AI/głosu.
- [ ] Usunięcie konta działa in-app i przez publiczny link webowy.
- [ ] Raportowanie treści AI działa bez opuszczania aplikacji.
- [ ] Moderacja, kolejka zgłoszeń i safety evals przechodzą.

### Audience i billing

- [ ] IARC oraz target audience 18+ są aktualne.
- [ ] Google Play Billing i wszystkie stany subskrypcji przechodzą testy.
- [ ] Brak niedozwolonego steeringu do płatności zewnętrznej.

### Testy i produkcja

- [ ] Internal/closed test oraz production access spełnione według statusu konta.
- [ ] Pre-launch report bez blockerów.
- [ ] Krytyczne E2E, accessibility, security, privacy i Android 16 przechodzą.
- [ ] Staged rollout, monitoring, rollback i on-call aktywne.

## 16. Źródła polityk do ponownej weryfikacji

Właściciel release sprawdza bezpośrednio przed wysyłką oficjalne strony Google dotyczące:

- Target API level,
- wymagań testowania nowych osobistych kont,
- Play App Signing,
- Store Listing i preview assets,
- Data Safety i account deletion,
- AI-Generated Content,
- Content Ratings oraz target audience,
- Permissions,
- Payments i regionalnych programów alternatywnego billing.

Datę, wynik i link do każdej weryfikacji zapisujemy w release record.
