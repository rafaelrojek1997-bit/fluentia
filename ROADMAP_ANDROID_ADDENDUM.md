# Aneks do roadmapy — Android 16 / API 36

**Status:** obowiązująca część [roadmapy produktu](./ROADMAP.md). W przypadku sprzeczności ten aneks ma pierwszeństwo w zakresie wydania Android.

## Decyzja zakresowa

Produkt V1 obejmuje aplikację na telefony i tablety Android dystrybuowaną przez Google Play. Wcześniejsze wyłączenie aplikacji natywnych z V1 zostaje zawężone wyłącznie do aplikacji iOS; Android wchodzi do V1.

## Wymaganie Target API

- `targetSdk` wynosi co najmniej **36 (Android 16)**.
- Jeśli Google Play podniesie wymagany poziom przed publikacją, obowiązuje wyższy poziom aktualny w dniu wysyłki.
- Bazowy termin zgodności dla nowych aplikacji i aktualizacji to **31 sierpnia 2026 r.**
- Możliwe przedłużenie do 1 listopada 2026 r. nie jest częścią planu podstawowego ani buforem harmonogramu.
- `compileSdk` musi obsługiwać wybrany target.
- `minSdk` jest odrębną decyzją produktowo-techniczną; zostanie wybrany na podstawie udziału urządzeń, bezpieczeństwa, funkcji audio i kosztu macierzy testowej.

## Zmiany w roadmapie

### Fundament platformy

- Powstaje klient Android korzystający ze wspólnych kontraktów API i tokenów design systemu.
- CI buduje kontrolny artefakt Android od początku prac mobilnych.
- CI odczytuje target z finalnego AAB/APK, nie tylko z konfiguracji, i blokuje release poniżej API 36.
- Wybór technologii klienta Android zostanie zapisany w osobnym ADR przed scaffoldem aplikacji.

### Głos i urządzenia

- Natywna obsługa mikrofonu, audio focus, przerwań, Bluetooth/headset i cyklu życia aplikacji.
- Testy obejmują zmianę konfiguracji, przejście do tła, process death, utratę sieci i zmianę urządzenia audio.
- Odmowa lub cofnięcie uprawnienia mikrofonu prowadzi do pełnej ścieżki tekstowej.

### Zgodność Android 16

Testowane są zmiany zachowania Androida 16 dotyczące użytych funkcji, w szczególności:

- uprawnień i prywatności,
- edge-to-edge i dostępności interfejsu,
- procesów oraz ograniczeń działania w tle,
- powiadomień,
- udostępniania plików,
- nagrywania i odtwarzania audio,
- bezpieczeństwa komponentów i intentów.

### Publikacja Google Play

- Format: Android App Bundle.
- Podpisywanie: Play App Signing z kontrolowanym kluczem uploadu.
- Wymagane artefakty: polityka prywatności, Data safety, klasyfikacja treści, deklaracje uprawnień i zgodność użytych SDK z Google Play SDK Index.
- Ścieżka wydania: internal testing → closed testing → staged production rollout.
- Release candidate przechodzi Play pre-launch report, testy bezpieczeństwa, dostępności, płatności i głosu.
- Aktualna polityka Google Play jest ponownie weryfikowana bezpośrednio przed każdą wysyłką.

## Harmonogram zgodności

- **T−12 tygodni:** zamrożenie toolchainu, audyt SDK/zależności i rozpoczęcie pełnej macierzy urządzeń.
- **T−8 tygodni:** zakończenie migracji zachowań Android 16 i uruchomienie closed testing.
- **T−4 tygodnie:** release candidate, pre-launch report i usunięcie problemów blokujących.
- **T−0:** staged rollout z monitoringiem crash-free users, ANR, start time, audio failures i regresji sesji.

## Gate F — Android / Google Play Compliance

Wydanie Android jest zablokowane, dopóki:

- finalny AAB nie targetuje co najmniej API 36,
- testy zmian zachowania Androida 16 nie przechodzą,
- Play pre-launch report nie ma problemów blokujących,
- Data safety, polityka prywatności i deklaracje uprawnień nie są zgodne z rzeczywistym przetwarzaniem,
- krytyczne przepływy konta, głosu, płatności, prywatności i usunięcia danych nie przechodzą na urządzeniach Android,
- aktualne wymagania Google Play nie zostały zweryfikowane.

## Metryki Android V1

- crash-free users i crash-free sessions,
- ANR rate,
- cold/warm start time,
- odsetek udanych sesji głosowych,
- błędy uprawnień i urządzeń audio,
- użycie pamięci, baterii i danych,
- wyniki accessibility oraz kompatybilność według API/urządzenia,
- powodzenie aktualizacji aplikacji bez utraty lokalnego stanu sesji.

## Źródło wymagania

Oficjalna dokumentacja Google Play wskazuje, że od 31 sierpnia 2026 r. nowe aplikacje i aktualizacje na telefony/tablety muszą targetować Android 16 (API 36) lub wyższy poziom, aby można było przesłać je do Google Play. Wymaganie należy ponownie sprawdzić przed publikacją, ponieważ polityka jest zmienna w czasie.
