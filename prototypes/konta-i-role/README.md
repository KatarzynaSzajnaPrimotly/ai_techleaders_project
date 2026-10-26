# DevMentor: klikalny prototyp Epiku 01 (konta i role)

Prototyp do klikania i komentowania, zanim powstanie kod produkcyjny. Pokazuje logowanie GitHubem i e-mailem, rejestrację, strony główne trzech ról i bramki dostępu. Niczego nie wysyła, nigdzie się nie loguje i nie zbiera prawdziwych danych. Ekrany i stany mają identyfikatory z `lekcja-07/mapa-ekranow.md` (s01 do s10, stany s01.1 do s10.3, scenariusze P01 do P10); komentarze są przypięte do tych identyfikatorów, więc nie zmieniaj ich.

Prototyp jest po angielsku (G24). Nie jest częścią aplikacji i nic go nie importuje.

## Jak uruchomić

Gotowy wynik budowania (`index.html` i `assets/`) nie jest w git. W podglądzie sandboxa Storybook serwuje pliki z `packages/ui/.storybook/public`. Zbuduj prototyp z katalogu głównego repozytorium:

```bash
npx vite build --config prototypes/konta-i-role/_src/vite.config.mts --outDir ../../../packages/ui/.storybook/public/prototypes/konta-i-role
```

Potem otwórz `http://localhost:3000/prototypes/konta-i-role/index.html` w podglądzie sandboxa.

Sprawdzanie typów: `npx tsc -p prototypes/konta-i-role/_src/tsconfig.json`.

## Jak się po nim poruszać

- Pasek u góry: **Prototyp** (oznaczenie), lista ekranów, stały „teraz” (Mon 2 Nov 2026, 10:00 CET), panel **Scenarios**, **Reset demo**, przełącznik motywu (ciemny jest domyślny; jasny to luka D-07), a z silnika przeglądu tryby klikania, komentarzy i prezentacji, mapa ekranów i „Back”.
- Nad każdym ekranem są trzy linie notatki: które historie obsługuje, co jest symulacją, czego prototyp nie rozstrzyga. Tryb prezentacji je ukrywa.
- Komentarze: tryb „Comment”, kliknięcie elementu, uwaga. Zapisują się w przeglądarce recenzenta; „Export for repository” daje nowy `_src/src/engine/comments.js` do commita, „Export Markdown” daje `prototype-feedback.md`.

## Konta demo

Wybierasz je w panelu Scenarios, w polu „Signed in as”. Hasło kont z hasłem (A2, A4, A6): `demo-haslo-12345`.

| ID | Konto | Rola | Logowanie |
|---|---|---|---|
| A1 | Marta Kowalczyk | mentee | GitHub `marta-k` |
| A2 | Tomasz Brzozowski | mentee | e-mail i hasło |
| A3 | Piotr Zieliński | mentor | GitHub `piotr-z` |
| A4 | Ewa Lis | mentor | e-mail i hasło |
| A5 | Founder A (demo) | operator (adres z listy; zapisana rola: mentee) | GitHub `founder-a` |
| A6 | Founder B (demo) | operator (adres z listy) | e-mail i hasło |
| A7 | Founder B as mentor | mentor (adresu nie ma na liście) | GitHub `founder-b-mentor` |

Profile w atrapie GitHuba (s09): `lena-w` (nowy użytkownik), `marta-k`, `piotr-z`, `founder-a`, `founder-b-mentor`, `tomasz-b` (łączy się z A2), `marta-k-alt` (adres A1, inny identyfikator GitHuba), `no-mail-user` (brak zweryfikowanego e-maila).

## Scenariusze (panel Scenarios)

Kontrolki są osobno od nawigacji produktu i działają na następną akcję. Pierwsza wartość to domyślna.

| ID | Kontrolka | Wartości |
|---|---|---|
| P01 | Wynik GitHuba | sukces, anulowano, zły lub brak `state`, brak zweryfikowanego e-maila, niedostępny, e-mail ma inny `github_id` |
| P03 | Rejestracja e-mailem | z wpisanego adresu, adres ma już konto, błąd wysyłki, cichy cooldown |
| P04 | Link z maila | ważny, wygasły, zmieniony, już użyty, brak tokenu |
| P05 | Logowanie e-mailem | z wpisanych danych, złe hasło, nieznany e-mail, konto tylko z GitHubem, limit prób |
| P06 | Sesja | ważna, wygasła, zmieniona, wygasa w trakcie pracy |
| P07 | Zapisana rola konta A5 | mentee (zostaje operatorem), mentor (zostaje mentorem) |
| P08 | Kto otwiera jaki adres | rola (anonim, mentee, mentor, operator) razy adres, przycisk Open |
| P09 | Rola w cookie | zgodna z kontem, mentee mimo że konto jest już mentorem |
| P10 | Sieć i lista mentorów | szybko, wolno, błąd serwera, pusta lista |
| next | Następne żądanie formularza | udane, 429, błąd serwera |
| s01.2 | Wariant etapu | formularz e-mail włączony, wyłączony |
| | Clear rate limits | zdejmuje limity prób |

## Ograniczenia symulacji

Prototyp pokazuje, jak ma wyglądać i działać Epik 01. Nie dowodzi, że to zadziała w produkcji.

- **Nic nie jest prawdziwe.** Dane są w pamięci strony; odświeżenie lub „Reset demo” przywraca stan początkowy. Nie ma serwera, bazy, cookie ani tokenów; sesja, jej 24 godziny i stary cookie (P09) są modelowane, nie egzekwowane.
- **GitHub (s09) i skrzynka (s10) to atrapy**, nie ekrany produktu. Profile są wymyślone; prawdziwa zgoda GitHuba, jej zakresy i komunikaty błędów mogą wyglądać inaczej. W produkcji adapter poczty tylko zapisuje wiadomości do logu (Q26).
- **Limity** (5 rejestracji i 10 potwierdzeń na godzinę z jednego IP, 3 maile na adres na godzinę, 9 minut po serii nieudanych logowań) są liczone w pamięci i są wartościami startowymi ze specyfikacji, nie strojonymi. Liczba „9 minut” i „60 minut” w komunikatach to wartości ilustracyjne.
- **Hasło** jest sprawdzane tylko pod kątem długości (12 do 72 bajtów); nie jest zapisywane ani porównywane z niczym poza kontami demo.
- **Nowa rejestracja** tworzy konto mentee tylko w tej sesji przeglądarki.
- **Lista mentorów na s07** jest w pamięci; dodanie mentora zmienia tylko tę stronę i nie tworzy konta.
- **Teksty zamienniki** (placeholdery, nie decyzje): komunikaty dla `error=state`, braku zweryfikowanego e-maila, błędu serwera, 429 na `/api/mentors`; teksty obu maili; adres `support@devmentor.test`; podtytuły na s01 i s02 (G25).
- **Ciemny motyw** pochodzi z `packages/ui/src/tokens.css`. Jasny motyw jest złożony w prototypie z istniejącej palety `mentora-*` (luka D-07), a ciemnoczerwony tekst błędu w jasnym motywie to obejście luki D-10.
- **Brak ekranów spoza mapy**: nie ma zaproszeń mentorów (E02-S01), resetu hasła, listy sesji (E03-S04) ani zgody na regulamin (G26). `s08` (brak dostępu) nie rysuje nic: przekierowanie jest ciche (G06).

## Sprawdzanie

Z katalogu głównego repozytorium, po zbudowaniu prototypu:

```bash
# testy nawigacji między ekranami (macierz dostępu, returnTo, wszystkie konta demo, P07, P08, P09)
npx vitest run --config prototypes/konta-i-role/_src/vitest.config.mts

# sprawdzenie w przeglądarce: każdy stan w 320 i 1440 px, jasny i ciemny motyw, każdy przycisk,
# każda opcja scenariusza, obsługa klawiaturą; wynik w _src/evidence/stage3/dziennik.log
AGENT_BROWSER_ARGS=--no-sandbox node prototypes/konta-i-role/_src/checks/stage3.mjs
```

Testy nie należą do jednostkowych projektów repozytorium (`unit-node`, `unit-dom`) i nie wchodzą w próg 100% pokrycia, bo prototyp leży poza `packages/`.

## Struktura

- `_src/src/screens/`: ekrany; `_src/src/gaps.tsx`: komponenty, których design system jeszcze nie ma (każdy z numerem luki `LUKA DS D-xx`); `flows.ts`: logika przepływów i scenariuszy; `store.ts`: stan i bramki dostępu; `data.ts`: konta i stałe; `ScenarioPanel.tsx`: panel scenariuszy.
- `_src/src/engine/`: silnik przeglądu skopiowany z `lekcja-07/silnik-przegladu/` bez zmian.
- `_src/checks/`: sprawdzenie w przeglądarce; `_src/evidence/`: dzienniki i zrzuty z etapów 1 do 3.
- `POSTEP.md`: postęp i decyzje.
