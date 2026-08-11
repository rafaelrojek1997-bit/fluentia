# Analiza produktu — AI English Mentor

## 1. Streszczenie wykonawcze

AI English Mentor to platforma do nauki praktycznej komunikacji po angielsku, której rdzeniem jest codzienny, spersonalizowany mentor AI. Produkt nie jest katalogiem kursów ani chatbotem do swobodnej rozmowy. Jest systemem prowadzącym użytkownika przez zamkniętą pętlę uczenia: diagnoza → praktyka w realistycznym kontekście → precyzyjna informacja zwrotna → utrwalenie → adaptacja kolejnego planu.

Najważniejszą obietnicą jest mierzalny wzrost samodzielności komunikacyjnej: użytkownik ma szybciej i z mniejszym stresem radzić sobie w rzeczywistych sytuacjach, takich jak rozmowa kwalifikacyjna, spotkanie biznesowe, podróż lub small talk.

Produkt będzie działał w modelu freemium/subskrypcyjnym, z płatnymi limitami rozmów głosowych, zaawansowaną analizą wymowy, planami specjalistycznymi i pogłębioną historią postępów. Architektura docelowa musi wspierać wielu dostawców AI, lecz wartość produktu nie może zależeć od jednego modelu ani od niekontrolowanego generowania treści.

## 2. Problem użytkownika

### 2.1 Problemy funkcjonalne

- Użytkownik zna reguły i słownictwo, ale nie potrafi użyć ich spontanicznie.
- Tradycyjne kursy mają sztywny program, który nie odpowiada aktualnym potrzebom.
- Brakuje bezpiecznego miejsca do częstej praktyki mówienia.
- Informacja zwrotna jest opóźniona, ogólna albo przytłaczająca.
- Aplikacje uczą elementów języka osobno, bez przenoszenia ich do realnej komunikacji.
- Użytkownik nie wie, co powinien ćwiczyć danego dnia.

### 2.2 Problemy emocjonalne

- Lęk przed oceną i popełnianiem błędów.
- Poczucie utknięcia mimo długiego czasu nauki.
- Spadek motywacji przez brak widocznych, życiowych rezultatów.
- Przeciążenie wyborem materiałów i metod.
- Wstyd związany z akcentem lub wolnym tempem wypowiedzi.

### 2.3 Zadanie, do którego użytkownik „zatrudnia” produkt

„Pomóż mi regularnie ćwiczyć dokładnie te sytuacje, których potrzebuję, poprawiaj mnie bez odbierania płynności i pokaż, że z tygodnia na tydzień komunikuję się lepiej.”

## 3. Segmenty użytkowników

### 3.1 Główne segmenty

1. **Ambitny profesjonalista (B1–C1)** — potrzebuje angielskiego do spotkań, prezentacji, negocjacji i awansu. Ma mało czasu i wysoką gotowość do płacenia.
2. **Osoba przygotowująca się do konkretnego wydarzenia (A2–C1)** — rozmowa kwalifikacyjna, relokacja, podróż, egzamin ustny lub wystąpienie. Oczekuje szybkiego, celowego planu.
3. **Zablokowany uczeń (A2–B2)** — uczy się od lat, ale boi się mówić. Potrzebuje bezpiecznej progresji i wsparcia emocjonalnego.
4. **Zaawansowany użytkownik (B2–C2)** — chce naturalności, idiomów, precyzji, wymowy i dostosowania rejestru.

### 3.2 Segment startowy

Pierwszym segmentem komercyjnym powinien być ambitny profesjonalista na poziomie B1–B2. Ma jasne scenariusze użycia, łatwo rozpoznaje wartość poprawy, korzysta regularnie i akceptuje subskrypcję. Projekt pozostaje dostępny dla A1–C2, ale komunikacja, onboarding i pierwsze ścieżki powinny być zoptymalizowane pod B1–B2.

### 3.3 Persony antydocelowe na start

- Dzieci wymagające zgód opiekunów i odrębnego reżimu bezpieczeństwa.
- Użytkownicy oczekujący akredytowanego certyfikatu językowego.
- Szkoły i korporacje wymagające od pierwszej wersji rozbudowanego LMS, SSO i rozliczeń zbiorczych.

Te grupy mogą stać się osobnymi liniami produktu, ale nie powinny komplikować pierwszego wdrożenia B2C.

## 4. Pozycjonowanie i przewaga

### 4.1 Kategoria

Osobisty system treningu komunikacyjnego z AI, nie biblioteka lekcji i nie uniwersalny chatbot.

### 4.2 Kluczowe wyróżniki

- **Ciągłość nauczyciela:** mentor pamięta cele, zainteresowania, ograniczenia, przećwiczone sytuacje i wzorce błędów.
- **Adaptacja na poziomie umiejętności:** system steruje trudnością oddzielnie dla płynności, słownictwa, gramatyki, rozumienia, wymowy i pewności siebie.
- **Informacja zwrotna we właściwym momencie:** tryb rozmowy chroni płynność; najważniejsze błędy są korygowane selektywnie, a pełna analiza pojawia się po ćwiczeniu.
- **Transfer do życia:** każda sesja ma scenariusz, cel komunikacyjny i mierzalny rezultat.
- **Pętla danych:** błędy z rozmów zasilają powtórki, pisanie, gramatykę, słownictwo i następny plan.
- **Dowód postępu:** użytkownik widzi zmianę w czasie na przykładach własnych wypowiedzi, nie tylko liczbę zdobytych punktów.

### 4.3 Zasada defensibility

Przewagą nie będzie sam dostęp do modelu AI. Będą nią: ustrukturyzowany profil uczącego się, historia kompetencji, silnik pedagogiczny, biblioteka ocenianych scenariuszy, modele jakości sesji, dane o skuteczności interwencji oraz zaufanie wynikające z prywatności i przewidywalnej jakości.

## 5. Zasady pedagogiczne

1. **Komunikacja przed perfekcją:** najpierw skuteczne przekazanie intencji, potem precyzja.
2. **Comprehensible input + pushed output:** treść jest nieco powyżej poziomu użytkownika, a zadania wymagają aktywnej produkcji języka.
3. **Retrieval practice:** użytkownik przypomina sobie język zamiast tylko go rozpoznawać.
4. **Spaced repetition w kontekście:** powtarzane są nie tylko słowa, lecz frazy, intencje i poprawione wzorce z własnych wypowiedzi.
5. **Interleaving:** plan miesza umiejętności, ale zachowuje jeden wyraźny cel sesji.
6. **Deliberate practice:** sesje izolują najsłabszy element, zapewniają natychmiastową korektę i ponowną próbę.
7. **Minimalna skuteczna korekta:** w trakcie rozmowy mentor nie poprawia wszystkiego; priorytetem są błędy blokujące sens, powtarzalne lub związane z celem sesji.
8. **Mastery learning:** trudność rośnie po wykazaniu stabilnej umiejętności, nie tylko po ukończeniu ekranu.
9. **Wsparcie autonomii:** użytkownik zna cel, może zmienić intensywność korekt i rozumie, dlaczego system proponuje dane ćwiczenie.
10. **Bezpieczna motywacja:** streak i XP wspierają nawyk, ale nie karzą za przerwę i nie zastępują wskaźników kompetencji.

## 6. Główna pętla produktu

1. Użytkownik otrzymuje dzienny plan 10–25 minut z krótkim uzasadnieniem.
2. Rozpoczyna główną misję komunikacyjną, tekstową lub głosową.
3. Mentor reaguje w roli, dynamicznie dopasowuje rozmowę i rejestruje sygnały jakości.
4. Po sesji użytkownik otrzymuje maksymalnie trzy priorytetowe obserwacje, poprawione przykłady i możliwość natychmiastowej ponownej próby.
5. Wybrane błędy i nowe zwroty trafiają do inteligentnych powtórek.
6. Model uczącego się aktualizuje poziom kompetencji i pewność estymacji.
7. Plan następnego dnia uwzględnia wynik, cel długoterminowy, dostępny czas i zaplanowane powtórki.

## 7. Model uczącego się

Profil powinien rozdzielać fakty deklarowane, obserwacje i wnioski modelu.

### 7.1 Dane deklarowane

- język ojczysty i preferowany język objaśnień,
- cele i terminy,
- branża, rola, zainteresowania i scenariusze,
- dostępny czas i preferowane dni,
- preferowana osobowość mentora oraz intensywność korekt,
- samoocena i bariery emocjonalne.

### 7.2 Dane obserwowane

- transkrypcje, odpowiedzi pisemne i wyniki zadań,
- błędy z kategorią, kontekstem, wagą i częstotliwością,
- użyte oraz opanowane frazy,
- tempo, pauzy, płynność i sygnały wymowy,
- retencja w powtórkach,
- czas, rezygnacje, powtórne próby i reakcje na korekty.

### 7.3 Estymowane kompetencje

- CEFR ogólny oraz osobno dla mówienia, słuchania, czytania i pisania,
- gramatyka według cech i konstrukcji,
- zakres oraz aktywność słownictwa,
- płynność, wymowa, intonacja i zrozumiałość,
- skuteczność funkcjonalna w konkretnych scenariuszach,
- pewność estymacji oraz data ostatniego potwierdzenia.

Każdy wniosek AI musi być odróżniony od faktu podanego przez użytkownika i możliwy do skorygowania lub usunięcia.

## 8. Zakres funkcjonalny

### 8.1 Onboarding i diagnoza

- Rejestracja, zgody, wybór celu i harmonogramu.
- Krótka adaptacyjna diagnoza tekstowa i głosowa.
- Kalibracja poziomu oraz preferencji informacji zwrotnej.
- Pierwszy plan i pierwsza szybka wygrana w jednej sesji.
- Możliwość pominięcia nagrywania bez blokowania produktu.

### 8.2 Dashboard

- Jedno dominujące wezwanie: „Rozpocznij dzisiejszą sesję”.
- Plan dnia z czasem i powodem rekomendacji.
- Postęp względem celu życiowego oraz kompetencji.
- Streak z mechanizmem łagodnego powrotu.
- Ostatnie odkrycia, błędy do poprawy i następne powtórki.
- Rekomendacje AI ograniczone do kilku decyzji, bez przeładowania.

### 8.3 Codzienny mentor i rozmowy AI

- Tekst i głos, streaming, przerwanie odpowiedzi oraz ponowienie.
- Scenariusze z rolą, celem, poziomem, ograniczeniami i kryteriami sukcesu.
- Tryby: wspierający, neutralny, wymagający; osobowość nie może zmieniać standardów oceny.
- Przyciski: podpowiedź, prostsze sformułowanie, tłumaczenie, powtórz, zwolnij, wyjaśnij korektę.
- Pamięć sesji, pamięć długoterminowa za zgodą i panel zarządzania pamięcią.
- Podsumowanie, priorytetowe korekty, zapis fraz i powtórna próba.
- Bezpieczne zakończenie lub przekierowanie rozmów wysokiego ryzyka.

### 8.4 Wymowa

- Nagrywanie, kontrola urządzenia, odtwarzanie i ponowne nagranie.
- Transkrypcja z oznaczeniem niepewności.
- Ocena zrozumiałości, płynności, tempa, rytmu i intonacji.
- Analiza segmentów/fonemów tylko wtedy, gdy dostawca zapewnia wiarygodne dane czasowe.
- Referencyjne audio w wybranym wariancie angielskiego.
- Porównanie fragment po fragmencie i konkretna wskazówka artykulacyjna.
- Wyraźne zastrzeżenie: celem jest zrozumiałość, nie eliminacja tożsamościowego akcentu.

### 8.5 Grammar AI

- Wyjaśnienie oparte na wypowiedzi użytkownika i jego intencji.
- Kontrast: wersja użytkownika, wersja poprawna, wersja naturalniejsza.
- Ćwiczenia generowane z walidacją odpowiedzi i kontrolowanym zakresem.
- Ponowna próba użycia konstrukcji w realnym zdaniu lub dialogu.
- Śledzenie opanowania konstrukcji i nawrotów błędu.

### 8.6 Vocabulary i inteligentne powtórki

- Kandydaci pochodzą z rozmów, tekstów, celów i zainteresowań.
- Jednostką nauki jest głównie fraza lub kolokacja z kontekstem.
- Priorytet uwzględnia użyteczność, osobistą trafność, trudność i częstotliwość błędu.
- Harmonogram łączy algorytm retencji z terminami celów użytkownika.
- Formy powtórek: przypomnienie, uzupełnienie, parafraza, mówienie i użycie w scenariuszu.
- Użytkownik może odrzucić element lub oznaczyć go jako znany.

### 8.7 Pisanie

- Rodzaje zadań: e-mail, wiadomość, raport, post, esej, CV i tekst własny.
- Ocena: realizacja celu, klarowność, gramatyka, naturalność, słownictwo, ton i rejestr.
- Korekta z uzasadnieniem i trybem „zachowaj mój głos”.
- Wersje przed/po i ćwiczenia wynikające z najważniejszych błędów.
- Ochrona przed bezrefleksyjnym zastępowaniem pracy użytkownika gotowym tekstem.

### 8.8 Czytanie

- Materiały redakcyjne/licencjonowane lub generowane z oznaczeniem pochodzenia.
- Poziom, temat, długość i cel językowy.
- Klikalne słowa i frazy: znaczenie kontekstowe, wymowa, synonimy i przykłady.
- Quiz rozumienia, pytania otwarte i streszczenie własnymi słowami.
- Zapis elementu do powtórek bez opuszczania tekstu.

### 8.9 Słuchanie

- Dialogi, historie i krótkie audycje z naturalnym tempem i wariantami akcentu.
- Kontrola prędkości, odcinkowe powtórki i opcjonalna transkrypcja.
- Pytania o sens, szczegóły, intencję i wnioskowanie.
- Tryb shadowing oraz rekonstrukcja usłyszanej wypowiedzi.
- Treści generowane głosem syntetycznym są jasno oznaczone.

### 8.10 Plan nauki

- Cel długoterminowy rozbity na tygodniowe rezultaty i dzienne działania.
- Dostosowanie do czasu, terminów, retencji, słabych stron i zmęczenia.
- Reguły stabilności zapobiegające chaotycznej zmianie programu każdego dnia.
- Możliwość zamiany zadania, skrócenia sesji i „minimum na trudny dzień”.
- Wyjaśnialność każdej rekomendacji.

### 8.11 Gamifikacja

- XP za wartościowe zachowania, nie samo klikanie.
- Poziomy kompetencji oddzielone od poziomu aktywności.
- Misje oparte na zachowaniach prowadzących do transferu.
- Osiągnięcia, odznaki i nagrody kosmetyczne lub funkcjonalne.
- Rankingi wyłącznie opt-in, z uczciwymi grupami i ochroną prywatności.
- Mechanizmy odzyskania rytmu po przerwie bez manipulacyjnego poczucia winy.

### 8.12 Tożsamość, konto i płatności

- E-mail/hasło, magic link, Google, Apple i GitHub.
- Reset hasła, weryfikacja adresu, zarządzanie sesjami i opcjonalne 2FA.
- Trial, plany miesięczne/roczne, kupony, faktury i portal klienta.
- Jednoznaczne limity, stan subskrypcji, ponowienia płatności i okres karencji.
- Eksport i usunięcie danych oraz kontrola zgód.

### 8.13 Panel administratora

- Użytkownicy, role, subskrypcje, refundy i status konta.
- Wersjonowane prompty, konfiguracje modeli, eksperymenty i bezpieczny rollback.
- Koszt, opóźnienia, błędy i jakość odpowiedzi według funkcji i dostawcy.
- Kolejka moderacji oraz obsługa zgłoszeń.
- Audyt każdej uprzywilejowanej operacji.
- Dane wrażliwe domyślnie zamaskowane; podszywanie się pod użytkownika tylko kontrolowane i audytowane.

## 9. Onboarding i pierwsza sesja

Docelowy onboarding powinien trwać 5–8 minut i zakończyć się realnym ćwiczeniem, nie ankietą.

1. Obietnica dopasowana do wybranego celu.
2. Minimalny profil: cel, termin, poziom samooceny, czas i preferowany tryb.
3. Krótka rozmowa diagnostyczna lub alternatywa tekstowa.
4. Natychmiastowy wgląd: jedna mocna strona i jeden obszar największej dźwigni.
5. Wybór stylu mentora i intensywności korekt.
6. Pierwsza 5-minutowa misja z podsumowaniem.
7. Dopiero po pokazaniu wartości: trial lub plan darmowy.

## 10. System oceny i dowód postępu

Ocena musi być stabilna, wyjaśnialna i odporna na losowość modelu.

- Rubryki funkcjonalne mapowane na CEFR, ale przedstawiane prostym językiem.
- Osobne wyniki: wykonanie zadania, zrozumiałość, płynność, poprawność, zakres i interakcja.
- Próbki kontrolne powtarzane co 2–4 tygodnie w porównywalnych warunkach.
- Wynik AI kalibrowany na zestawie ocen ekspertów; automatyczna ocena niskiej pewności nie jest prezentowana jako fakt.
- Trend wymaga kilku obserwacji, a nie pojedynczej sesji.
- Raport pokazuje przykłady własnych wypowiedzi i umiejętności, które użytkownik potrafi już zastosować.

## 11. Zakres wydań

### 11.1 Pierwsza wersja produkcyjna (V1)

- Kompletne konto: e-mail, Google, reset hasła, sesje i podstawowe 2FA.
- Onboarding, diagnoza, profil, cele i preferencje.
- Dashboard oraz codzienny plan.
- Mentor tekstowy i głosowy z 5 dopracowanymi scenariuszami.
- Podsumowania, pamięć kontrolowana przez użytkownika i model błędów.
- Grammar feedback, osobiste słownictwo i kontekstowe powtórki.
- Podstawowa analiza wymowy oparta na wiarygodnych metrykach.
- Stripe: trial, miesięczny/roczny plan, kupony, webhooki, portal i faktury.
- Panel administratora w zakresie operacyjnym, kosztowym, promptowym i moderacyjnym.
- Pełne stany UX, responsywność, WCAG AA, obserwowalność, backupy i wymagane testy.

### 11.2 V1.1

- Pisanie, czytanie i słuchanie jako pełne moduły zasilające model uczącego się.
- Pozostałe scenariusze rozmów.
- Rozbudowane próbki kontrolne i raporty postępu.
- Apple/GitHub/magic link, jeśli dane z V1 potwierdzą potrzebę.
- Osiągnięcia, misje i prywatne ligi opt-in.

### 11.3 V2

- Ścieżki branżowe i zespołowe.
- Konta organizacji, administracja B2B, SSO i raportowanie zagregowane.
- Marketplace treści/mentorów po walidacji jakości.
- Własne modele rankingowe i predykcja retencji na podstawie zgromadzonych danych.

Podział wydań nie oznacza atrap. Każda udostępniona funkcja musi być kompletna; elementy poza wydaniem nie pojawiają się jako niedziałające kontrolki.

## 12. Model biznesowy

### 12.1 Proponowane pakiety

- **Free:** ograniczony dzienny mentor tekstowy, krótka praktyka głosowa, podstawowy plan i powtórki.
- **Pro:** większe limity głosu i AI, pełna analiza, wszystkie scenariusze, pamięć długoterminowa, raporty i ścieżki celowe.
- **Teams (później):** zarządzanie miejscami, prywatność organizacyjna, ścieżki firmowe i raporty zagregowane.

Limity powinny być przedstawiane w zrozumiałych jednostkach produktu, np. minuty rozmowy głosowej, a nie tokeny.

### 12.2 Ekonomia jednostkowa

Należy mierzyć koszt AI, STT, TTS, pamięci i storage per aktywny użytkownik oraz per ukończona sesja. Routing modeli powinien rezerwować najdroższe modele dla zadań o wysokiej wartości: planowania, złożonej informacji zwrotnej i trudnych ocen. Prostsze operacje mogą korzystać z modeli szybszych, cache i deterministycznej logiki.

## 13. KPI i model pomiaru

### 13.1 North Star Metric

**Liczba tygodniowo aktywnych użytkowników, którzy ukończyli co najmniej trzy wartościowe sesje komunikacyjne i wykazali potwierdzony postęp kompetencji.**

Definicja „wartościowej sesji” wymaga minimalnego czasu/udziału, realizacji celu i zakończenia co najmniej jednej aktywnej próby. „Potwierdzony postęp” opiera się na stabilnej rubryce, nie na subiektywnym wyniku pojedynczego promptu.

### 13.2 Wskaźniki wiodące

- ukończenie onboardingu i pierwszej misji,
- czas do pierwszej wartości,
- D1, D7, D30 oraz retencja tygodniowa,
- liczba wartościowych sesji na aktywnego użytkownika,
- udział mówienia użytkownika w sesji,
- wykonane ponowne próby po korekcie,
- terminowość i skuteczność powtórek,
- odsetek użytkowników powracających po przerwie.

### 13.3 Wskaźniki jakości i bezpieczeństwa

- zgodność informacji zwrotnej z oceną eksperta,
- stabilność oceny tej samej próbki,
- współczynnik błędnych lub halucynowanych korekt,
- skuteczność moderacji i liczba incydentów,
- opóźnienie pierwszego tokenu/audio i przerwane sesje,
- zgłoszenia prywatności oraz czas ich obsługi.

### 13.4 Wskaźniki biznesowe

- konwersja free → trial → paid,
- MRR/ARR, churn, LTV i CAC,
- marża brutto po koszcie modeli i głosu,
- wykorzystanie limitów oraz koszt per wartościowa sesja,
- chargebacki, zaległe płatności i odzysk przychodu.

## 14. Prywatność, bezpieczeństwo i zaufanie

### 14.1 Klasy danych

- Dane konta i rozliczeń.
- Dane profilu edukacyjnego.
- Treści rozmów, nagrania i transkrypcje.
- Wnioski AI o kompetencjach i preferencjach.
- Telemetria techniczna i produktowa.
- Dane administracyjne i audytowe.

### 14.2 Zasady

- Privacy by default: nagrania nie są przechowywane dłużej, niż wymaga tego funkcja, bez wyraźnej zgody.
- Oddzielne zgody na personalizację, analitykę i użycie treści do ulepszania modeli.
- Brak wykorzystywania treści użytkownika do treningu zewnętrznych modeli bez świadomego opt-in i właściwych umów.
- Minimalizacja PII w promptach, redakcja danych i kontrola regionu przetwarzania.
- Szyfrowanie w tranzycie i spoczynku, rotacja sekretów, least privilege i audyt.
- Eksport, korekta i usunięcie danych wraz z udokumentowaną retencją backupów.
- Ochrona promptów przed wstrzyknięciami i separacja instrukcji systemowych od treści użytkownika.
- Oceny językowe nie mogą być używane do decyzji zatrudnieniowych bez niezależnej weryfikacji.

### 14.3 Bezpieczeństwo rozmów

System nie udaje lekarza, terapeuty, prawnika ani służb ratunkowych w symulacjach. Scenariusze wysokiego ryzyka są oznaczone jako ćwiczenia językowe, a realne sygnały zagrożenia uruchamiają bezpieczną odpowiedź i właściwe źródła pomocy. Moderatorzy otrzymują minimalny niezbędny kontekst.

## 15. Jakość AI

### 15.1 Warstwy odpowiedzialności

- Reguły produktu wyznaczają cel sesji, dopuszczalne działania i format danych.
- Silnik pedagogiczny wybiera interwencję oraz aktualizuje model uczącego się.
- Adapter dostawcy odpowiada za wywołanie modelu, streaming, retry, koszt i telemetrię.
- Walidatory sprawdzają struktury, zakres, bezpieczeństwo i spójność odpowiedzi.
- Model generatywny realizuje zadanie w kontrolowanych granicach, ale nie samodzielnie steruje uprawnieniami ani rozliczeniami.

### 15.2 Ewaluacja

- Zestawy „golden” dla poziomów, języków ojczystych i typów błędów.
- Automatyczne testy schematów, języka, tonu, poziomu, długości i reguł bezpieczeństwa.
- Ocena ekspertów dla poprawności, użyteczności, kalibracji i jakości pedagogicznej.
- Testy regresji przed publikacją promptu lub zmianą modelu.
- Shadow traffic i stopniowe wdrożenia z możliwością natychmiastowego rollbacku.
- Monitorowanie driftu jakości, kosztu i opóźnień według dostawcy.

### 15.3 Odporność

- Fallback modeli tylko między kompatybilnymi klasami zadań.
- Odpowiedzi częściowe i bezpieczne wznowienie po zerwaniu streamu.
- Idempotencja operacji generujących koszty lub zapisujących wynik.
- Jasny komunikat, gdy analiza jest niedostępna; brak sfabrykowanych wyników.

## 16. UX i dostępność

- Interfejs skupiony na jednym kolejnym działaniu.
- Jasne rozróżnienie treści użytkownika, słów mentora i korekt.
- Pełna obsługa klawiatury, widoczny fokus, semantyka i czytniki ekranu.
- Kontrast WCAG AA, skalowanie tekstu, reduced motion i brak znaczenia przekazywanego wyłącznie kolorem.
- Napisy/transkrypcje i alternatywa tekstowa dla funkcji głosowych.
- Odporność na słabe łącze, utratę mikrofonu i przerwanie sesji.
- Skeletony tylko tam, gdzie zachowują układ; komunikaty błędów zawierają bezpieczny następny krok.
- Tryb jasny i ciemny z zachowaniem ustawień systemowych oraz użytkownika.
- Mobile-first dla codziennej praktyki; desktop zoptymalizowany pod pisanie, raporty i administrację.

## 17. SEO i akwizycja

Prywatna aplikacja ma ograniczoną wartość SEO. Organiczny wzrost powinny obsługiwać publiczne, wysokiej jakości strony celów i scenariuszy, narzędzia diagnostyczne oraz redakcyjne materiały edukacyjne. Nie należy indeksować prywatnych rozmów, profili ani masowo generowanych stron niskiej jakości.

Pętle wzrostu:

- udostępnialny, pozbawiony danych wrażliwych raport postępu,
- zaproszenia/referral z obustronną korzyścią,
- publiczne mini-symulacje i testy gotowości do konkretnej sytuacji,
- powrót przez wartościowe przypomnienia o celu, nie spam,
- treści kierowane na intencje „jak przygotować się do…”.

## 18. Wymagania niefunkcjonalne

### 18.1 Dostępność i niezawodność

- Docelowe SLO po stabilizacji: 99,9% dla podstawowych funkcji aplikacji.
- Degradacja funkcji głosowej nie może blokować tekstu, planu ani powtórek.
- Recovery Point Objective i Recovery Time Objective zostaną ustalone według klasy danych; backup musi być regularnie testowany odtworzeniem.

### 18.2 Wydajność

- Web Vitals w zielonych progach na reprezentatywnych urządzeniach.
- Pierwsza odpowiedź tekstowa odczuwalna przez streaming; metryki p50/p95 osobno dla typów zadań.
- Niskie opóźnienie turn-taking w głosie; ciężka analiza może kończyć się asynchronicznie.
- Budżety bundle, obrazów, zapytań i kosztu AI egzekwowane w CI/monitoringu.

### 18.3 Skalowalność

- Bezstanowe API tam, gdzie to możliwe; stan sesji w jawnych magazynach.
- Kolejki dla analiz, generowania audio, raportów, webhooków i powiadomień.
- Limity per użytkownik, plan, IP i koszt, z ochroną przed gwałtownym wzrostem wydatków.
- Partycjonowanie i archiwizacja zdarzeń o dużej objętości.

### 18.4 Obserwowalność

- Strukturalne logi bez treści wrażliwych.
- Metryki aplikacji, AI, kolejek, płatności i jakości nauki.
- Tracing żądań przez frontend, backend, kolejkę i dostawcę AI.
- Alerty powiązane ze skutkiem dla użytkownika i procedury reagowania.

## 19. Główne ryzyka i sposoby ograniczenia

| Ryzyko | Skutek | Ograniczenie |
|---|---|---|
| AI udziela błędnej korekty | Utrata zaufania i nauka błędu | Rubryki, walidacja, golden sety, progi pewności, zgłaszanie |
| Oceny są niestabilne | Fałszywy obraz postępu | Próbki kontrolne, kilka obserwacji, kalibracja ekspertów |
| Głos ma duże opóźnienie | Nienaturalna rozmowa i rezygnacje | Streaming, VAD, krótkie tury, regionalizacja, fallback tekstowy |
| Koszt AI rośnie szybciej niż przychód | Ujemna marża | Routing, limity, cache, budżety, monitoring jednostkowy |
| Pamięć zapisuje błędne lub wrażliwe wnioski | Ryzyko prywatności i zła personalizacja | Źródło/pewność, zgoda, edycja, retencja, zakazane kategorie |
| Gamifikacja wypiera naukę | Duża aktywność bez postępu | XP za zachowania jakościowe, oddzielny mastery score |
| Użytkownik uzależnia się od podpowiedzi | Brak samodzielności | Stopniowe wycofywanie wsparcia, retrieval i ponowne próby |
| Nadużycia płatności i kont | Straty oraz dostęp nieuprawniony | Webhooki, idempotencja, risk signals, 2FA, audyt |
| Vendor lock-in | Wzrost cen i brak ciągłości | Adaptery, własny format zadań, ewaluacje przenośne |
| Zbyt szeroki zakres | Opóźnienie wartości i niska jakość | Pełne pionowe V1, bramki jakości, brak atrap modułów |

## 20. Decyzje wymagające walidacji produktowej

Przed zamrożeniem roadmapy należy przeprowadzić rozmowy i testy z użytkownikami, ale można rozpocząć projektowanie na poniższych hipotezach:

- Segment B1–B2 professional osiągnie wyższą retencję niż szeroka grupa „każdy uczący się”.
- Największą wartość daje 10–15-minutowa codzienna sesja głosowa z szybką ponowną próbą.
- Użytkownicy wolą trzy priorytetowe korekty od pełnej listy błędów.
- Raport oparty na przykładach zwiększy retencję bardziej niż XP.
- Wysoka jakość pięciu scenariuszy da lepszy wynik niż płytka biblioteka kilkudziesięciu.
- Użytkownik zaakceptuje pamięć mentora, jeśli ma podgląd, edycję i jasną korzyść.

Minimalny plan walidacji: 15–20 wywiadów, test klikalnego przepływu, concierge test pięciu sesji, ocena gotowości do płacenia oraz ekspercka kalibracja przykładowych informacji zwrotnych.

## 21. Kryteria gotowości etapu analizy

Etap jest gotowy, gdy:

- zdefiniowano problem, segment startowy i obietnicę produktu,
- opisano pętlę uczenia i zasady pedagogiczne,
- określono moduły wraz z ich rzeczywistą wartością i granicami,
- ustalono zakres V1, kolejnych wydań i świadome wyłączenia,
- zdefiniowano model przychodu, North Star i metryki jakości,
- zidentyfikowano wymagania prywatności, bezpieczeństwa, dostępności i niezawodności,
- wskazano największe ryzyka i hipotezy do walidacji,
- można na tej podstawie utworzyć priorytetyzowaną roadmapę bez zmiany wizji produktu.

## 22. Rekomendowany następny etap

Następnym etapem jest roadmapa produktu i realizacji. Powinna zamienić tę analizę w pionowe kamienie milowe, zależności, bramki jakości, plan walidacji i jasne kryteria akceptacji. Dopiero po zatwierdzeniu roadmapy należy projektować architekturę techniczną.
