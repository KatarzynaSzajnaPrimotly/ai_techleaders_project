# Postęp: klikalny prototyp Epiku 01 (konta i role)

Zasady pracy: etapy 0 do 3, po każdym stop i czekanie na „dalej”. Identyfikatory ekranów s01…s10 i scenariuszy P01…P10 pochodzą z `lekcja-07/mapa-ekranow.md` i się nie zmieniają.

## Materiały (wybrane 2026-10-24)

- Mapa ekranów: `lekcja-07/mapa-ekranow.md` (zatwierdzona)
- Szary prototyp: `.ai/prototypes/discovery/mentor-onboarding/revision-001/` (jedyna wersja; nowszej nie ma)
- Specyfikacja Epiku 01: `.ai/specs/2026-10-21-auth.md` (pliku `2026-09-04-accounts-and-roles.md` nie ma; ten sam wybór jak w mapie) oraz `.ai/specs/platform-foundations.md`
- Design system: `packages/ui/src` (tokeny: `packages/ui/src/tokens.css`)
- Silnik przeglądu: `lekcja-07/silnik-przegladu/`

## Etap 0. Plan: ZAKOŃCZONY (2026-10-24)

Odpowiedzi właściciela: (1) podgląd wariant A, serwer statyczny uruchamia właściciel; (2) jasny motyw z palety `mentora-*` jako luka D-07; (3) bez ekranu zaproszenia, zgodnie z G04; (4) hasło min. 12 znaków i maks. 72 bajty (spec ponad PA07); (5) zgoda na wpisy w `.gitignore` i `eslint.config.mjs`.

## Etap 1. Szkielet i ścieżka bez błędów: ZAKOŃCZONY, czeka na „dalej” (2026-10-24)

Zbudowane: projekt Vite w `_src/` (bez nowych zależności), silnik przeglądu skopiowany bez zmian, pasek przeglądu (ekrany, motyw, „Prototyp”, zegar demo, konta demo, reset), ekrany s01 s02 s03 s04 s05 s06 s07 s09 s10 w stanach domyślnych, dane w pamięci, bramki dostępu (ciche przekierowania, G06). Wynik budowania: `index.html` i `assets/` w katalogu prototypu (zignorowane przez git).

Budowanie: `npx vite build --config prototypes/konta-i-role/_src/vite.config.mts` (z katalogu głównego repozytorium).
Sprawdzanie typów: `npx tsc -p prototypes/konta-i-role/_src/tsconfig.json`.

Sprawdzone w przeglądarce (file://): 32 kontrole, zero błędów (dziennik w `_src/evidence/stage1/`, zrzuty obok).
Poza zakresem etapu 1, ale już działa, bo było tanie: walidacja pól (s01.4, s02.3, s04.3), ładowanie (s01.3, s02.2, s04.2), błąd logowania (s01.5), anulowanie w GitHubie (s01.6), konflikt adresu (s02.5), link już użyty (s04.5), brak tokenu (s04.4), konflikt e-maila na s07 (s07.5).
Nie zrobione (etap 2): s01.2, s01.7 do s01.12, s02.6, s02.7, s03.2, s04.6, s04.8, s04.9, s05.4, s05.5, s06.4, s06.5, s07.2 do s07.4, s07.8, scenariusze P01 do P10, przełącznik kont.

## Etap 2. Stany, role i scenariusze: ZAKOŃCZONY, czeka na „dalej” (2026-10-24)

Zbudowane: wszystkie 54 stany z mapy (s01.1 do s10.3; s08 nie ma ekranu, G06), osiągalne kliknięciem albo kontrolką. Logika przepływów w `_src/src/flows.ts`, stan i bramki w `store.ts`, panel „Scenarios” w pasku przeglądu (`ScenarioPanel.tsx`): P01, P03 do P07, P09, P10, „Next form request” (429 albo błąd serwera), wariant s01.2, wybór konta (A1 do A7), P08 (rola × adres), „Clear rate limits”. Reset przywraca domyślne wartości.

Odstępstwa od mapy, do potwierdzenia:
- Pierwsza wartość P03 i P05 to „z wpisanych danych” (auto), nie „nowy adres” i „dane poprawne”: dla zwykłych danych daje ten sam wynik, a wpisany istniejący adres nadal działa.
- P06 „wygasła” i „zmieniona” zachowują się tak samo jak „wygasa w trakcie pracy”: natychmiastowe przekierowanie do s01.11 (G07: jeden komunikat). P06 przy wylogowanym nic nie robi i mówi, że trzeba się najpierw zalogować.
- Etap 2 w poleceniu mówi o bramkach „zaloguj się” i „ta strona wymaga innej roli”. Zatwierdzona G06 mówi: ciche przekierowanie bez komunikatu. Poszedłem za G06; bramką „zaloguj się” jest s01 z `returnTo`.
- Limit 5 rejestracji na godzinę z jednego IP i limit 3 maili na adres są liczone naprawdę (szósta rejestracja w godzinie dostaje 429; czwarta do tego samego adresu wygląda tak samo i nie wysyła maila). „Next form request” daje te same stany od razu.
- „Wybór zostaje po nieudanej płatności” z polecenia: w Epiku 01 nie ma płatności ani wyboru terminu; zachowanie dotyczy pól formularzy (po błędzie zostają wpisane dane; sprawdzone na s01, s02, s04, s07).

Sprawdzone w przeglądarce (file://): 122 kontrole bez błędów (dziennik i 28 zrzutów w `_src/evidence/stage2/`). Po drodze znalazłem i poprawiłem: panel scenariuszy wysuwał się poza okno; lista kont pokazywała zapisaną rolę zamiast faktycznej.

Teksty-zamienniki do potwierdzenia (placeholdery, nie decyzje): komunikaty dla `error=state`, braku zweryfikowanego e-maila, błędu serwera przy logowaniu i potwierdzeniu, 429 na `/api/mentors`; „Try again in 60 minutes” dla rejestracji i potwierdzenia (spec podaje okno godziny, nie Retry-After).
## Etap 3. Uczciwość i sprawdzenie: nie rozpoczęty

## Decyzje i odpowiedzi

(uzupełnić po odpowiedziach na pytania z etapu 0)
