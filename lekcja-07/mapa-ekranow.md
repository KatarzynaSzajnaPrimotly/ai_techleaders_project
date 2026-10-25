# Mapa ekranów: Epik 01, konta i role (E01, #29)

Status: **zatwierdzona** razem z odpowiedziami na wszystkie luki. Niczego nie zbudowano. Identyfikatory ekranów (s01…s10) i scenariuszy (P01…P10) są stałe od zatwierdzenia mapy.

## 0. Materiały, wybory i założenia

**Historie.** W `.ai/specs/backlog.md` przepływ to nie #12, #13 i #14, tylko:

| Epik / historia | Numer | Tytuł |
|---|---|---|
| E01 | #29 | Accounts and roles |
| E01-S01 | #36 | A developer or invited mentor signs in with GitHub and lands in their role's home |
| E01-S02 | #37 | A user without GitHub signs in with email and password |
| E01-S03 | #38 | A signed-in user sees only their role's screens; the operator role belongs to the two founders |

**Specyfikacja.** Pliku `2026-09-04-accounts-and-roles.md` nie ma. Wybrałem `.ai/specs/2026-10-21-auth.md` (spec Epiku 01, nazywam ją „spec”) razem ze stałym dokumentem `.ai/specs/platform-foundations.md` („foundations”). Treści historii i kryteriów akceptacji biorę z `.ai/specs/backlog-snapshot.md`, bo `backlog.md` to tylko mapa numerów. Spec sama mówi, że zastępuje część treści #36–#38 (patrz luka G20), więc tam, gdzie się różnią, **na czas mapy idę za specem** i pytam o to właściciela.

**Czego nie ma w repozytorium** (to też wynik):
- `.ai/specs/research/personas.md` nie istnieje. Zamiast person użyłem wywiadów: fintech (`2026-09-01-interview-backend-dev-fintech.md`: „nie że zakładam konto, weryfikacja maila, potem czekam”, „github wystarczy”), mentor (`2026-08-22-interview-mentor.md`: „my GitHub is my profile”) i dev przed releasem (`2026-08-20-interview-working-dev.md`).
- `packages/ui/.storybook` nie istnieje i `storybook` nie występuje w żadnym `package.json` (luka DS D-01). W `AGENTS.md` nie ma sekcji z zasadami dla agentów o design systemie poza tabelą miejsc (`ui/src/components/ui`, `ui/src/backend`, `ui/src/components/<concept>`) i podziałem stylów (Tailwind publicznie, shadcn w adminie).
- Nic z Epiku 01 nie jest zaimplementowane. W kodzie jest tylko `/admin/mentors` (publiczny), `/mentors` i `/`.

**Założenia mapy** (do potwierdzenia, nie decyzje):
1. Język UI prototypu to angielski (beachhead D24, istniejące napisy „Registered mentors”, `lang="en"`); sama mapa jest po polsku. Pytanie G24.
2. Adresy, nazwy i dane w sekcji 3 są fikcyjne (`@devmentor.test`).
3. Prototyp pokazuje stan docelowy Epiku 01 po S03, chyba że stan jest oznaczony „wariant etapu”.

### Kryteria akceptacji z odnośnikami

Odniesienia: `E-n` to kryteria epiku #29, `36-Kn`, `37-Kn`, `38-Kn` to kryteria historii w kolejności z issue. `spec:` to miejsce w specyfikacji (UI/UX, Edge Cases, API, Validation), `kod:` to istniejące zachowanie kodu.

| Ref | Kryterium (skrót) |
|---|---|
| E-1 | Rola po zalogowaniu (GitHub lub e-mail) trafia na własną stronę główną i nie widzi ekranów innych ról (R06, D07) |
| E-2 | Anonim na chronionej trasie albo stronie dostaje 401 albo przekierowanie do logowania, nic ze strony się nie renderuje |
| E-3 | `POST /api/mentors` bez sesji operatora jest odrzucone |
| 36-K1 | GitHub, zgoda, powstaje konto, widać stronę mentee |
| 36-K2 | Zapisana rola mentor, logowanie GitHubem, ląduje na stronie mentora |
| 36-K3 | Anulowanie zgody w GitHubie, brak konta, ekran logowania mówi o tym wprost |
| 36-K4 | Sesja wygasła lub zmieniona, otwarcie ekranu, przekierowanie do logowania, nic z danych użytkownika nie pokazane |
| 36-K5 | Każdy ekran logowania: GitHub pierwszy, e-mail drugi (D07) |
| 36-K6 | Callback z brakującym lub błędnym `state`, brak sesji i konta |
| 36-K7 | GitHub nie zwraca zweryfikowanego e-maila, brak konta, użytkownik wie dlaczego |
| 37-K1 | Rejestracja e-mailem, potwierdzenie linku, konto i strona mentee |
| 37-K2 | Złe hasło, błąd bez wskazania co było złe, brak sesji |
| 37-K3 | E-mail powiązany z GitHubem, rejestracja z hasłem, odmowa ze wskazaniem GitHuba (**zastąpione w specu**, G20) |
| 37-K4 | Zaproszony mentor bez GitHuba kończy e-mailem i hasłem, dostaje rolę mentora; test `returnTo` tu, akceptacja w E02-S01 |
| 37-K5 | Niepotwierdzony e-mail, logowanie, brak sesji (**przeformułowane w specu**, G03, G20) |
| 37-K6 | E-mail z kontem, ponowna rejestracja, ta sama odpowiedź jak dla nowego adresu, konto bez zmian |
| 37-K7 | `returnTo` bezwzględny lub protocol-relative jest odrzucany |
| 37-K8 | Powtarzane nieudane próby, po limicie odmowa do końca cooldownu |
| 38-K1 | Mentee otwiera ekran mentora, odmowa i przekierowanie do własnej strony |
| 38-K2 | Mentor otwiera ekran lub trasę operatora, odmowa |
| 38-K3 | Założyciel A lub B po zalogowaniu ma rolę operatora; nikt inny jej nie dostaje poza ręczną akcją założyciela (D19, R18) |
| 38-K4 | Mentee i mentor widzą tylko swoje sesje (asercja w E03-S04; tu lista mentorów tylko dla operatora) |
| 38-K5 | Zalogowany bez zaproszenia nie znajduje sposobu, by zostać mentorem (R07) |
| 38-K6 | Anonim woła `POST /api/mentors` albo otwiera `/admin/mentors`, 401 lub przekierowanie, mentor nie powstaje |
| 38-K7 | Konto z adresu z listy, ale niezweryfikowanego, nie dostaje roli operatora |
| 38-K8 | Adres operatora z kontem mentora, loguje się jako mentor bez dostępu operatora (D31) |

Reguły, które ograniczają treść ekranów: R03 (sesje są tekstowe), R06/D07 (GitHub pierwszy), R07/D08 (żadnego „zostań mentorem”), R14 (żadnej obietnicy szybkości w tekstach), R18/D19 (operator = dwóch założycieli), R23/D31 (jedna rola na konto), N01, N02.

## 1. Mapa ekranów

Legenda komponentów: nazwa bez gwiazdki istnieje w `packages/ui/src`, `*Nazwa` = brakuje (numer luki DS w sekcji 5). Źródło stanu: kryterium (np. `36-K3`), `spec:` albo `kod:`; **„brak”** = stan, którego przepływ potrzebuje, a żadne kryterium go nie opisuje (zawsze ma numer luki).

| ID | Ekran | Rola | Stany | Historia lub kryterium | Komponenty DS |
|---|---|---|---|---|---|
| s01 | Logowanie `/sign-in` | anonim; zalogowany jest przekierowany na swoją stronę główną | s01.1 domyślny: GitHub pierwszy, formularz e-mail drugi, link do rejestracji (36-K5)<br>s01.2 wariant etapu S01b: formularz e-mail wyłączony z notką (spec: UI/UX)<br>s01.3 ładowanie: wysyłanie formularza e-mail, przycisk zablokowany (spec: UI/UX)<br>s01.4 walidacja pól e-mail i hasło (spec: Validation `login.schema`)<br>s01.5 błąd: nieudane logowanie, jeden ogólny komunikat (37-K2)<br>s01.6 anulowano w GitHubie `?cancelled=1` (36-K3)<br>s01.7 `?error=state` (36-K6)<br>s01.8 `?error=no-verified-email` (36-K7)<br>s01.9 GitHub niedostępny `?error=unavailable` (spec: Edge Cases, G14)<br>s01.10 limit prób 429 z `Retry-After` (37-K8; G10)<br>s01.11 po utracie sesji, z `returnTo` (36-K4, E-2; G07)<br>s01.12 po wylogowaniu (spec: UI/UX sign-out; G15) | 36-K3…K7, 37-K2, 37-K8, E-1, E-2, D07 | Card, Button (`asChild` jako link do GitHuba); *PublicForm (D-02), *Input/Label/Alert (D-04), *AuthCard (D-05), *ikona GitHuba (D-06) |
| s02 | Rejestracja `/register` | anonim; zalogowany przekierowany | s02.1 domyślny: e-mail i display name (spec: UI/UX)<br>s02.2 ładowanie (spec: UI/UX)<br>s02.3 walidacja: e-mail, display name 1–80 znaków bez znaków sterujących, nowych linii i URL (spec: Validation `register.schema`)<br>s02.4 sukces, przejście do s03 (spec: API register)<br>s02.5 konflikt: adres ma już konto, wygląda dokładnie jak sukces (37-K6, spec: Edge Cases)<br>s02.6 błąd usługi: poczta nie wysłała wiadomości (spec: Edge Cases)<br>s02.7 limit 429, 5 na godzinę z IP (spec: Assumptions; G10) | 37-K1 (pierwsza część), 37-K4, 37-K6, 37-K7 | Card, Button; *PublicForm (D-02), *Input/Label/Alert (D-04), *AuthCard (D-05) |
| s03 | Sprawdź skrzynkę (po rejestracji) | anonim | s03.1 domyślny: ten sam tekst dla każdego adresu (37-K6, spec: UI/UX)<br>s03.2 cichy cooldown: czwarta rejestracja w godzinę wygląda tak samo, a mail nie wychodzi (spec: API register; G11) | 37-K1, 37-K6 | Card, *Alert (D-04), *AuthCard (D-05). Czy to osobny ekran: G12 |
| s04 | Ustawienie hasła `/register/confirm?token=` | anonim | s04.1 domyślny: tylko formularz hasła, GET niczego nie zmienia (spec: API)<br>s04.2 ładowanie (spec: UI/UX)<br>s04.3 walidacja hasła: min. 12 znaków, maks. 72 bajty (spec: Validation `confirm.schema`)<br>s04.4 link wygasł lub zmieniony: prosta strona „zarejestruj się ponownie” (spec: Edge Cases)<br>s04.5 konflikt: link już użyty lub konto już istnieje, „zaloguj się” (spec: Edge Cases, API)<br>s04.6 limit 429, 10 na godzinę z IP (spec: Assumptions; G10)<br>s04.7 sukces, przekierowanie na `returnTo` albo stronę roli (37-K1, 37-K4)<br>s04.8 brak tokenu w adresie (brak, G13)<br>s04.9 zalogowany otwiera link (brak, G13) | 37-K1, 37-K4, 37-K5, 37-K6 | Card, Button; *PublicForm (D-02), *Input/Label/Alert (D-04), *AuthCard (D-05) |
| s05 | Strona główna mentee `/home` w `RoleShell` | mentee | s05.1 domyślny (36-K1, E-1; zawartość: G08)<br>s05.2 brak dostępu, niezalogowany: przekierowanie do s01 z `returnTo` (E-2)<br>s05.3 brak dostępu, inna rola: przekierowanie na własną stronę główną (38-K1)<br>s05.4 sesja wygasła w trakcie pracy: 401 i przekierowanie do s01 (spec: UI/UX; 36-K4)<br>s05.5 stary cookie z rolą mentee po nadaniu roli mentor (brak, G18) | 36-K1, 36-K4, 38-K1, 38-K5, E-1, E-2 | *RoleShell/navFor (D-03), Card, Badge (slot odznaki), Button (wyloguj), EmptyState (jeśli strona pusta, G08) |
| s06 | Strona główna mentora `/mentor` w `RoleShell` | mentor | s06.1 domyślny (36-K2; zawartość: G08)<br>s06.2 brak dostępu, niezalogowany (E-2)<br>s06.3 brak dostępu, inna rola: mentee na `/home`, operator na `/admin/mentors` (38-K1)<br>s06.4 sesja wygasła w trakcie pracy (spec: UI/UX)<br>s06.5 konto z adresu operatora, zapisana rola mentor: strona mentora bez dostępu operatora (38-K8; G19) | 36-K2, 38-K1, 38-K8, E-1, E-2 | *RoleShell/navFor (D-03), Card, Badge, Button, EmptyState |
| s07 | Strona operatora `/admin/mentors` w `RoleShell` z zawartością shadcn | operator | s07.1 domyślny: lista mentorów i formularz dodania (38-K3; kod: `admin-mentors`)<br>s07.2 pusty: brak mentorów (kod: `EmptyState`)<br>s07.3 ładowanie listy (kod: `LoadingMessage`)<br>s07.4 błąd listy z „Retry” (kod: `ErrorMessage`)<br>s07.5 formularz dodania: błędy pól i konflikt zduplikowanego e-maila (kod: `CrudForm`; G09)<br>s07.6 brak dostępu, niezalogowany: przekierowanie do s01 (38-K6, E-3)<br>s07.7 brak dostępu, mentee lub mentor: przekierowanie na własną stronę (38-K2, 38-K1)<br>s07.8 sesja wygasła w trakcie pracy: 401 z `apiCall` (spec: UI/UX) | 38-K2, 38-K3, 38-K6, E-3 | *RoleShell/navFor (D-03), Card, CardHeader/Title/Description/Content, Badge, DataTable, CrudForm, Table, EmptyState, ErrorMessage, LoadingMessage (wszystkie istnieją) |
| s08 | Brak dostępu (wynik przekierowania; **ekranu nie ma w specyfikacji**) | zalogowany z niewłaściwą rolą | s08.1 przekierowanie na własną stronę główną bez komunikatu (38-K1, 38-K2, E-1; spec: Edge Cases „Wrong role”) | 38-K1, 38-K2, E-1; G06 | brak: nic nie jest rysowane (G06: A, ciche przekierowanie); `s08` zostaje wpisem w mapie |
| s09 | GitHub: zgoda (**atrapa zewnętrznej usługi**, nie ekran produktu) | prototyp | s09.1 zgoda: wybór fikcyjnego profilu GitHuba (36-K1)<br>s09.2 anulowanie zgody (36-K3) | 36-K1, 36-K3, 36-K6, 36-K7 | tylko prototyp (Card, Button) |
| s10 | Skrzynka pocztowa (**atrapa**, w produkcji adapter `log`, G11) | prototyp | s10.1 mail z linkiem rejestracji, ważny 24 h (spec: API register)<br>s10.2 mail „masz już konto”, z podpowiedzią GitHub, gdy konto ma `github_id` (37-K6)<br>s10.3 pusta skrzynka: cooldown albo błąd wysyłki (spec: API, Edge Cases) | 37-K1, 37-K6 | tylko prototyp (Card, EmptyState) |

Wylogowanie to akcja w `RoleShell` (przycisk, `POST /api/auth/logout`, potem s01), nie osobny ekran; jej stany: s01.12 i G15.

**Stany, które dla danego ekranu nie dotyczą** (świadomie pominięte, z powodu):
- ładowanie na s05, s06: nic się nie ładuje, a spec zakazuje `loading.tsx` i `Suspense` nad `guardedPage`, żeby przekierowanie było 307 (foundations: Streaming constraint);
- pusty na s01–s04: nie ma listy; na s05, s06: spec mówi „No empty state exists yet”, a zawartość stron jest luką G08;
- konflikt na s01: logowanie celowo nie odróżnia przypadków (37-K2); na s02 konflikt jest niewidoczny z założenia (37-K6);
- brak dostępu na s01–s04: strony publiczne.

### 1b. Kto widzi ekran

| Ekran | Anonim | Mentee | Mentor | Operator |
|---|---|---|---|---|
| s01, s02 | widzi | przekierowanie na `/home` | przekierowanie na `/mentor` | przekierowanie na `/admin/mentors` |
| s03 | widzi (spec nie mówi, co ze zalogowanym, G12) | j.w. (G12) | j.w. (G12) | j.w. (G12) |
| s04 | widzi | spec milczy (G13) | spec milczy (G13) | spec milczy (G13) |
| s05 `/home` | s01 z `returnTo=/home` | widzi | przekierowanie na `/mentor` | przekierowanie na `/admin/mentors` |
| s06 `/mentor` | s01 z `returnTo=/mentor` | przekierowanie na `/home` | widzi | przekierowanie na `/admin/mentors` |
| s07 `/admin/mentors` | s01 z `returnTo=/admin/mentors` | przekierowanie na `/home` | przekierowanie na `/mentor` | widzi |
| API `POST/GET /api/mentors` | 401 | 403 | 403 | 200 / 201 |

Źródła: spec (Guard layers, Edge Cases „Wrong role”), 38-K1, 38-K2, 38-K6, E-2, E-3. Konsekwencja zapisana tylko pośrednio: skoro dostęp to równość roli, operator nie widzi `/home` ani `/mentor`.

## 2. Scenariusze do przełączania w prototypie

To kontrolki prototypu (panel „Scenariusz”), nie funkcje produktu. Każda ma wartość domyślną w pierwszej kolumnie wartości.

| ID | Kontrolka | Wartości | Działa na | Źródło |
|---|---|---|---|---|
| P01 | Wynik GitHuba | zgoda i wszystko dobrze / anulowano / zły lub brak `state` / brak zweryfikowanego e-maila / GitHub niedostępny (API lub brak konfiguracji) / e-mail ma konto z innym `github_id` | s09 → s01.6–s01.9 lub s05/s06/s07 | 36-K1, K3, K6, K7; spec: Edge Cases |
| P02 | Profil GitHuba w atrapie | nowy użytkownik / mentee z kontem / mentor z kontem / operator (z listy) / adres konta hasłowego bez `github_id` (łączenie) / adres konta z innym `github_id` | s09.1 | 36-K1, K2; spec: Edge Cases |
| P03 | Rejestracja e-mailem | nowy adres / adres, który ma już konto / błąd wysyłki maila / trzecia i kolejne rejestracje w godzinę (cichy cooldown) | s02 → s03, s10 | 37-K6; spec: API register |
| P04 | Link z maila | ważny / wygasły (starszy niż 24 h) / zmieniony / już użyty / brak tokenu | s04 | spec: Edge Cases; G13 |
| P05 | Logowanie e-mailem | dane poprawne / złe hasło / nieznany e-mail / konto tylko z GitHubem / limit prób | s01 | 37-K2, K8; spec: Edge Cases |
| P06 | Sesja | ważna / wygasła (cookie starsze niż 24 h) / zmieniona / wygasa w trakcie pracy (401 na kolejnym wywołaniu) | s05, s06, s07 | 36-K4; spec: UI/UX |
| P07 | Rola zapisana dla konta z listy operatorów | mentee (operator) / mentor (zostaje mentorem) | s09 → s06 lub s07 | 38-K8, D31 |
| P08 | Kto otwiera jaki adres | rola (anonim, mentee, mentor, operator) × adres (`/sign-in`, `/register`, `/home`, `/mentor`, `/admin/mentors`) | wszystkie | E-1, E-2, 38-K1, K2, K6 |
| P09 | Stary cookie z rolą | zgodny z rolą / mentee, a konto już mentorem | s05 | spec: Role derivation; G18 |
| P10 | Wolna sieć i lista mentorów | szybko / wolno (stan ładowania) / błąd serwera / lista pusta | s01–s04 (ładowanie), s07 | spec: UI/UX; kod |

Zegar prototypu ma osobną kontrolkę „Teraz” (stały, patrz sekcja 3), bo od niego zależą P04 i P06.

## 3. Konta i dane demo

Wszystko fikcyjne. **Stałe „teraz”: poniedziałek 2026-11-02, 10:00 czasu środkowoeuropejskiego (09:00 UTC)**; po 25 października obowiązuje już czas zimowy.

**Konta.** Jedno na rolę plus przypadki brzegowe. „Połączenia ról” nie ma z założenia (D31, R23: jedna rola na konto), więc jej odpowiednikiem są A7 i przełącznik P07.

| ID | Konto | Adres | Rola | Logowanie | Po co |
|---|---|---|---|---|---|
| A1 | Marta Kowalczyk | marta.kowalczyk@devmentor.test | mentee | GitHub `marta-k` | ścieżka główna mentee |
| A2 | Tomasz Brzozowski | tomasz.brzozowski@devmentor.test | mentee | e-mail i hasło (`demo-haslo-12345`) | logowanie hasłem, łączenie z GitHubem (P02) |
| A3 | Piotr Zieliński | piotr.zielinski@devmentor.test | mentor | GitHub `piotr-z` | 36-K2 |
| A4 | Ewa Lis | ewa.lis@devmentor.test | mentor | e-mail i hasło | mentor bez GitHuba (37-K4) |
| A5 | Założyciel A (demo) | founder.a@devmentor.test | operator (adres w `OPERATOR_EMAILS`, rola zapisana: mentee) | GitHub `founder-a` | 38-K3; przełącznik P07 zmienia zapisaną rolę na mentor (38-K8) |
| A6 | Założyciel B (demo) | founder.b@devmentor.test | operator (adres w `OPERATOR_EMAILS`) | e-mail i hasło | operator bez GitHuba |
| A7 | Założyciel B jako mentor | founder.b.mentor@devmentor.test | mentor (adresu **nie ma** na liście) | GitHub `founder-b-mentor` | D31: ta sama osoba, dwa konta, dwa logowania |

**Profile GitHuba w atrapie s09** (nie są kontami; „nowy użytkownik” tworzy konto mentee):

| Login GitHuba | Adres główny | Zachowanie |
|---|---|---|
| `lena-w` | lena.wojcik@devmentor.test (zweryfikowany) | nowy użytkownik, powstaje konto (36-K1) |
| `no-mail-user` | brak zweryfikowanego | 36-K7 |
| `tomasz-b` | tomasz.brzozowski@devmentor.test (zweryfikowany) | łączy się z A2 (spec: Edge Cases) |
| `marta-k-alt` | marta.kowalczyk@devmentor.test (zweryfikowany) | konto ma już inny `github_id`, odmowa (spec: Edge Cases, G14) |

**Rejestracja i maile.** Nowy adres: `new.user@devmentor.test`, display name „Nowy Użytkownik”; adres z kontem: `ewa.lis@devmentor.test`. Link rejestracji ważny 24 h (`REGISTRATION_TOKEN_TTL`).

**Czas względem „teraz”** (żeby P04, P06 i P10 były powtarzalne):

| Zdarzenie | Czas |
|---|---|
| ważny link rejestracji, wysłany | 2026-11-02 09:30 (30 min temu), ważny do 2026-11-03 09:30 |
| wygasły link, wysłany | 2026-11-01 07:00 (26 h temu) |
| sesja ważna, wydana | 2026-11-02 08:00, wygasa 2026-11-03 08:00 |
| sesja wygasła, wydana | 2026-11-01 08:00 (25 h temu) |
| limit prób logowania | `Retry-After` 540 s (9 min z okna 15 min); liczby z specu to wartości startowe do strojenia (spec: Assumptions) |

**Lista na s07** (istniejąca encja `Mentor`: tylko nazwa, e-mail i data dodania): Anna Kaczmarek (anna.kaczmarek@devmentor.test, 2026-10-27), Piotr Zieliński (2026-10-29), Ewa Lis (2026-10-30). Wariant pusty: zero wierszy (P10).

**Dane z briefu.** Epik 01 nie pokazuje cen, długości sesji ani terminów, więc ich nie używam i nic nie zmyślam. Przypominam, co brief wiąże na tych ekranach: nazwa produktu to DevMentor („Mentora” tylko w nazwach tokenów, D-09), kwoty będą w EUR (D29), sesje to 25 lub 50 minut tekstowo (D01, N01), granice cen jeszcze nie ustalone (Q24), a żaden tekst nie obiecuje szybkości (R14).

## 4. Luki w specyfikacji

Pytania zostały zadane, a przy każdej luce jest zapisana decyzja (pogrubiona). Każda luka ma pytanie do właściciela produktu (founder A). Typy: **A** kryterium bez ekranu lub stanu, **B** stan potrzebny przepływowi bez kryterium, **C** sprzeczność, **D** decyzja, której nikt nie podjął. „Blokuje” = bez odpowiedzi nie da się narysować stanu w prototypie.

### A. Kryterium bez ekranu lub stanu

| ID | Luka | Pytanie do właściciela | Blokuje |
|---|---|---|---|
| G01 | 38-K4 („mentee widzi tylko swoje sesje”) nie ma żadnego ekranu w Epiku 01: lista sesji powstanie w E03-S04, a tutaj mentee i mentor dostają tylko pustą odpowiedź z listy mentorów operatora. | Czy to kryterium wypada z prototypu Epiku 01 i wraca w E03-S04, czy ma mieć w prototypie jakiś widok? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): kryterium 38-K4 wypada z prototypu Epiku 01 i wraca w E03-S04; brak ekranu.** | nie (rozstrzygnięta) |
| G02 | 38-K7 („adres z listy, ale niezweryfikowany”) nie ma stanu: spec mówi, że niezweryfikowanego konta nie ma (Q8; „every account has a verified e-mail by construction”). | Czy to kryterium usuwamy z historii (zostaje test jednostkowy), czy istnieje droga do takiego konta, której spec nie opisuje? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): kryterium 38-K7 zostaje testem jednostkowym; w prototypie nie ma dla niego stanu.** | nie (rozstrzygnięta) |
| G03 | 37-K5 („niepotwierdzony e-mail nie zaloguje”): konto powstaje dopiero po potwierdzeniu, hasło ustawia się przy potwierdzeniu. Ktoś, kto zarejestrował adres i próbuje się zalogować przed kliknięciem w link, dostaje ogólny błąd s01.5, bez słowa o skrzynce. | Czy ten ogólny błąd wystarcza, czy s01.5 ma w tym przypadku podpowiedzieć „sprawdź skrzynkę”? (Podpowiedź ujawniłaby, że adres jest w obiegu.) **Rozstrzygnięte: ogólny błąd s01.5 bez podpowiedzi o skrzynce.** | nie (rozstrzygnięta) |
| G04 | 37-K4 (zaproszony mentor bez GitHuba, `returnTo`): zaproszenie to E02-S01, ale s01, s02 i s04 muszą wiedzieć, że ktoś przychodzi z zaproszenia. Nie wiadomo, czy ekran to pokazuje, jaką rolę widzi taki użytkownik zaraz po potwierdzeniu (spec: konto powstaje jako mentee) i co się dzieje, gdy mentor zaloguje się GitHubem z innym adresem niż w zaproszeniu. | Czy w Epiku 01 prototyp pokazuje wejście „z zaproszenia” (osobny tekst na s01, s02), czy tylko `returnTo` bez żadnej wzmianki? Co widzi mentor po potwierdzeniu, zanim zaakceptuje zaproszenie? **Rozstrzygnięte: w Epiku 01 prototyp pokazuje tylko `returnTo`, bez tekstu o zaproszeniu; po potwierdzeniu mentor widzi `/home` (rola mentee do czasu akceptacji w E02-S01).** | nie (rozstrzygnięta) |
| G05 | 38-K5 / R07 („nie ma sposobu, by zostać mentorem”) to kryterium negatywne: jedyny dowód to brak linku. Nie wiadomo, czy ekran mentee może powiedzieć, że mentorzy dołączają na zaproszenie, czy to już „oferowanie” drogi. | Czy zdanie „mentors join by invitation” wolno pokazać na s05 lub s02, czy ma być milczenie? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): bez żadnego tekstu o dołączaniu mentorów; dowodem jest brak linku.** | nie (rozstrzygnięta) |
| G06 | 38-K1 i 38-K2 mówią „odmowa i przekierowanie”, spec: przekierowanie na własną stronę główną i 403 na trasach. Żaden komunikat ani ekran „brak dostępu” nie jest opisany (s08 ma tylko przekierowanie). Użytkownik, który kliknął zakładkę ze starym adresem, ląduje gdzie indziej bez wyjaśnienia. | Czy przekierowanie ma być ciche, czy ma pokazać krótką informację („Ta strona jest dla innej roli”)? **Rozstrzygnięte: A, ciche przekierowanie, bez komunikatu i bez ekranu.** | nie (rozstrzygnięta) |
| G07 | 36-K4 / E-2 („wysłany do logowania, nic z danych użytkownika nie pokazane”): nie ma komunikatu o wygaśnięciu sesji ani o tym, że po zalogowaniu wrócimy na `returnTo`. Spec opisuje tylko przekierowanie. | Czy s01.11 mówi „sesja wygasła”, czy wygląda jak zwykły s01.1? **Rozstrzygnięte: s01.11 mówi „Your session expired. Sign in to continue.”** | nie (rozstrzygnięta) |

### B. Stan potrzebny, którego nie opisuje żadne kryterium

| ID | Luka | Pytanie do właściciela | Blokuje |
|---|---|---|---|
| G08 | Zawartość `/home` i `/mentor` nie jest opisana. Spec: `RoleShell` z wylogowaniem i „linkami tylko do własnych ekranów”, ale w Epiku 01 nie ma żadnego innego ekranu roli, a spec mówi „No empty state exists yet”. Nie wiadomo, co jest w slocie odznaki w `RoleShell`, czy przy pierwszym logowaniu jest powitanie, skąd bierze się wyświetlane imię ani co pokazać, gdy konto GitHuba nie ma imienia lub avatara. | Co dokładnie widzi mentee na `/home`, a mentor na `/mentor` w tej iteracji: tylko nagłówek i wylogowanie, tekst powitalny, pusty stan? Jak nazywa się rola w odznace? **Rozstrzygnięte (propozycja przyjęta): `RoleShell` z imieniem, odznaką roli („Mentee”, „Mentor”, „Operator”) i „Sign out”, puste menu; jedna karta „Welcome, <imię>” z jednym neutralnym zdaniem; bez osobnego powitania przy pierwszym logowaniu; imię z `display_name`, a gdy go brak, login GitHuba.** | nie (rozstrzygnięta) |
| G09 | Strona operatora to istniejące `/admin/mentors` z formularzem dodawania „mentora” (nazwa i e-mail, bez konta użytkownika). Spec zostawia ją bez zmian, ale brief mówi: mentorzy tylko na zaproszenie (R07, D08), a zaproszenia to E02-S01 i 1.1. `RoleShell` operatora ma jedną pozycję. | Czy w wersji docelowej Epiku 01 formularz dodawania zostaje, czy operator widzi tylko listę? Czy jest to „strona główna” operatora, czy będzie osobna? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): prototyp pokazuje istniejącą stronę `/admin/mentors` bez zmian, z formularzem dodawania.** | nie (rozstrzygnięta) |
| G10 | Komunikat limitu 429 (logowanie, rejestracja, potwierdzenie) nie ma treści. Wiadomo tylko, że jest `Retry-After`. Nie wiadomo, czy pokazujemy odliczanie, czy zostawiamy formularz aktywny. | Jaki tekst i czy z czasem oczekiwania? Czy pole zostaje wypełnione? **Rozstrzygnięte: „Too many attempts. Try again in N minutes.” z `Retry-After`; formularz zostaje wypełniony, przycisk zablokowany na ten czas.** | nie (rozstrzygnięta) |
| G11 | Teksty dwóch maili (link rejestracji, „masz już konto”) nie istnieją; spec ustala tylko, że imię nie trafia do tematu ani pierwszych linii. Rejestrowanie ponownie to „ponowne wysłanie”, ale po trzecim mailu w godzinę użytkownik nie dostaje nic i nie widzi dlaczego (s03.2, s10.3). Transport maili to „log” do czasu Q26. | Jakie są teksty obu maili? Czy na s03 ma być zdanie „nie dotarło? zarejestruj się ponownie” i co zobaczy ktoś po limicie? **Rozstrzygnięte: link rejestracji: „Confirm your DevMentor account” (link, ważność 24 h); „masz już konto”: „You already have a DevMentor account” z podpowiedzią GitHub, gdy konto ma `github_id`; na s03 „Didn't get it? Register again.”; po limicie bez zmian i bez komunikatu. Teksty to placeholdery.** | nie (rozstrzygnięta) |
| G12 | Stan „sprawdź skrzynkę” jest w specu w dwóch miejscach: „/register: e-mail i nazwa, potem ‘check your e-mail’” oraz „‘check your e-mail’ state after registering” na `/sign-in`. Nie wiadomo, czy to osobna strona, stan s02, czy stan s01, i co z zalogowanym, który ją otworzy. | Który z trzech wariantów jest wiążący? Mapa trzyma go jako s03 do czasu odpowiedzi. **Rozstrzygnięte: osobny ekran s03; zalogowany jest przekierowany na swoją stronę główną.** | nie (rozstrzygnięta) |
| G13 | `/register/confirm` nie opisuje: braku tokenu w adresie, zalogowanego użytkownika, który otwiera link, ani tego, czy strona pokazuje adres, który zostanie potwierdzony. | Co widzi osoba bez tokenu? Co zalogowany? Czy pokazujemy adres? **Rozstrzygnięte: brak tokenu: ten sam ekran co „link wygasł” (s04.4); zalogowany: przekierowanie na jego stronę główną; adres z tokenu pokazany nad polem hasła.** | nie (rozstrzygnięta) |
| G14 | `?error=unavailable` oznacza cztery różne sytuacje: GitHub API nie działa, brak konfiguracji, konto z tym adresem ma inny `github_id` (spec celowo nie ujawnia różnicy). Komunikat każe „spróbować ponownie lub użyć e-maila”, co przy konflikcie `github_id` nie pomoże, a konto może nie mieć hasła. | Czy jeden komunikat dla wszystkich przypadków jest do przyjęcia? Co użytkownik z kontem na inny GitHub ma zrobić (operator, R18)? **Rozstrzygnięte: jeden komunikat: „We couldn't sign you in with GitHub. Try again or use your e-mail.”; konflikt `github_id` pozostaje nierozróżnialny.** | nie (rozstrzygnięta) |
| G15 | Po wylogowaniu spec kieruje na `/sign-in`, bez potwierdzenia. Nie opisano też błędu samego wylogowania (sieć). | Czy s01.12 mówi „Wylogowano”? Co przy błędzie wylogowania? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): s01.12 bez komunikatu; błąd samego wylogowania poza prototypem.** | nie (rozstrzygnięta) |
| G16 | Zapomniane hasło to zamierzony ślepy zaułek (nie ma resetu w backlogu; ścieżka to operator i GitHub), ale żaden ekran nie mówi użytkownikowi, co ma zrobić ani jak dotrzeć do operatora. Nie ma żadnego adresu kontaktowego w materiałach. | Czy s01 ma w ogóle wspominać o zapomnianym haśle i dokąd odsyłać? Jaki jest kontakt do operatora? **Rozstrzygnięte: s01.5 ma linię „Forgot your password? Password reset isn't available yet — sign in with GitHub or contact the DevMentor team.”; kontakt to placeholder `support@devmentor.test` do wymiany na prawdziwy adres.** | nie (rozstrzygnięta) |
| G17 | Konto tylko z GitHubem, logowanie e-mailem: ten sam ogólny błąd (s01.5). Użytkownik nie dowie się, że ma użyć GitHuba, choć obie wiadomości (mail „masz już konto”) to mówią. | Czy ogólny komunikat może zawsze dodawać „albo zaloguj się przez GitHub” (nie ujawnia istnienia konta)? **Rozstrzygnięte: ogólny błąd logowania dopisuje „or sign in with GitHub”.** | nie (rozstrzygnięta) |
| G18 | Sesja jest bezstanowa 24 h (Q7): mentee awansowany na mentora z jeszcze starym cookie widzi `/home` do 24 h, a usunięcie adresu z listy operatora działa od następnego logowania. Ekran nie wie o różnicy. | Czy to cicha niedogodność, czy s05 ma wykryć nowszą rolę i przekierować? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): bez ostrzeżeń; scenariusz P09 pokazuje sam stan.** | nie (rozstrzygnięta) |
| G19 | Założyciel z adresem z listy, który ma konto mentora (38-K8), loguje się jako mentor bez żadnego wyjaśnienia, że operatora nie dostanie. Spec zostawia to notatce operatora. | Czy s06.5 ma jakąkolwiek wzmiankę, czy to wyłącznie sprawa założycieli? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): bez żadnej wzmianki na s06.5; scenariusz P07 pokazuje sam stan.** | nie (rozstrzygnięta) |

### C. Sprzeczności

| ID | Luka | Pytanie do właściciela | Blokuje |
|---|---|---|---|
| G20 | Treści historii różnią się od specu, a spec zapowiada ich edycję dopiero przy merge: 37-K3 („odmowa i wskazanie GitHuba”) kontra spec („identyczna odpowiedź, bez ujawniania”); 37-K5 („niepotwierdzony nie zaloguje”) kontra spec („nie ma niepotwierdzonego konta”); #36 „link do e-maila, wyłączony do S02” kontra spec „formularz e-mail na stronie logowania”; #37 „rejestracja z hasłem” kontra spec „hasło ustawiane po kliknięciu w link”. Mapa idzie za specem. | Czy potwierdzasz, że prototyp ma iść za specem, a treść #36–#38 zostanie poprawiona? **Rozstrzygnięte: prototyp idzie za specem; treść #36–#38 poprawiana przy merge.** | nie (rozstrzygnięta) |
| G21 | Brief i spec: Q22 (rola „mentee” czy `student`) w briefie nadal otwarte, w specu zamknięte (Q3: `mentee`; brief ma go zamknąć w kroku 26 S03). Słownik briefu mówi, że kod nazywa rolę `student`, a kod żadnej takiej nazwy nie ma. | Czy w odznace i w tekstach widzimy „Mentee”, i czy zamykamy Q22 teraz? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): rola nazywa się „Mentee”; zamknięcie Q22 w briefie jest osobną sprawą poza mapą.** | nie (rozstrzygnięta) |
| G22 | Spec (Q9): wszystkie strony publiczne, mentee i mentora w Tailwindzie, tylko operator i admin w shadcn, chrom `RoleShell` taki sam wszędzie. Design system ma dwa języki: tokeny shadcn i cała aplikacja są ciemne (`#141313`, limonkowy `#e5f520`), a publiczne komponenty Tailwind (`SiteHeader`, `SiteFooter`, `SearchBar`, `TutorCard`) są jasne, na palecie `mentora-*`. Nie wiadomo, w którym wyglądzie są s01–s06. | Którego wyglądu mają używać strony publiczne i role: ciemnego z tokenów, czy jasnego z palety `mentora-*`? **Rozstrzygnięte: ciemny wygląd z `tokens.css` dla wszystkich ekranów.** | nie (rozstrzygnięta) |
| G23 | `TutorCard` w design systemie pokazuje ★ ocenę, liczbę opinii i cenę za godzinę. Brief zakazuje ocen (N02) i mówi o sesjach 25 lub 50 minut (D01); brief sam wiąże to z otwartym Q29 (fikcyjny pas mentorów i opinie). W Epiku 01 nie jest używany. | Czy komponent ma zostać poprawiony lub usunięty zanim ktokolwiek użyje go w następnych epikach? **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): `TutorCard` nie jest używany w prototypie; poprawa komponentu poza mapą.** | nie (rozstrzygnięta) |

### D. Decyzje, których nikt nie podjął

| ID | Luka | Pytanie do właściciela | Blokuje |
|---|---|---|---|
| G24 | Język interfejsu. Beachhead to angielskojęzyczni deweloperzy (D24), kod i teksty są po angielsku, wywiady i materiały po polsku. | Czy prototyp jest po angielsku? **Rozstrzygnięte: angielski.** | nie (rozstrzygnięta) |
| G25 | Teksty publicznych ekranów: nagłówek i podtytuł przy logowaniu i rejestracji. Brief nie ma tekstu o wartości produktu na te ekrany, a ograniczają go R14 (bez obietnicy szybkości) i R03 (tekst). | Czy dajemy minimalny tekst (nazwa i jedno zdanie), czy czekamy na tekst od Ciebie? Na razie użyję neutralnego placeholdera. **Rozstrzygnięte: nazwa DevMentor i jedno neutralne zdanie, np. „Sign in to DevMentor.”, bez wartości produktu.** | nie (rozstrzygnięta) |
| G26 | Zgoda na regulamin i prywatność przy rejestracji. Pilotażowa decyzja D10 (zarchiwizowana) miała właściciela regulaminu; brief 1.0 o tym nie mówi. | Czy rejestracja ma link do regulaminu i polityki prywatności albo checkbox? (Nie dodaję nic, dopóki nie odpowiesz.) **Rozstrzygnięte (zatwierdzona odpowiedź domyślna): rejestracja bez linku do regulaminu i bez checkboxa.** | nie (rozstrzygnięta) |

### Zatwierdzone odpowiedzi domyślne

Dziesięć luk, które nie blokowały prototypu, dostało najprostszy wariant, zatwierdzony razem z mapą: G01 i G02 bez ekranu i stanu; G05 bez żadnego tekstu o dołączaniu mentorów; G09 istniejąca strona operatora bez zmian; G15 s01.12 bez komunikatu; G18 i G19 bez ostrzeżeń (P09 i P07 pokazują sam stan); G21 rola nazywa się „Mentee”; G23 `TutorCard` nie jest używany; G26 bez linku do regulaminu.

## 5. Luki w design systemie

Sprawdzone w `packages/ui/src`: istnieją `Button`, `Badge`, `Card` (z podkomponentami), `Table`, `DataTable`, `CrudForm`, `EmptyState`, `ErrorMessage`, `LoadingMessage`, `apiCall`, `MentorCard`, `SiteHeader`, `SiteFooter`, `SearchBar`, `TutorCard`, `Backdrop`.

| ID | Brak lub problem | Dotyczy | Uwagi |
|---|---|---|---|
| D-01 | Nie ma Storybooka (`packages/ui/.storybook` i zależność nie istnieją), nie ma też zasad dla agentów o design systemie poza tabelą miejsc w `AGENTS.md`. | cały prototyp | Komponenty prototypu nie mają stron do podlinkowania; zasady wyglądu trzeba wziąć z `tokens.css` i istniejących komponentów. Pytanie wyżej: G22 |
| D-02 | `PublicForm` (Tailwind, skin publiczny) nie istnieje; powstanie w S02. `CrudForm` jest w `backend` (shadcn) i ma tylko pola `text`, `email`, `password`, bez „Saving…” i bez fokusu na pierwszym błędzie. | s01, s02, s04 | Spec: foundations, Form layer |
| D-03 | `RoleShell` i `navFor` (nawigacja, wylogowanie, slot odznaki) nie istnieją; powstaną w S01b, wersja operatora w S03. Brakuje też awatara i chipu użytkownika (w bazie jest `avatar_url`). | s05, s06, s07 | G08 |
| D-04 | Prymitywy shadcn: są tylko `Button`, `Badge`, `Card`, `Table`. Brak `Input`, `Label`, `Alert` (inline: błąd, informacja, sukces), `Separator`, `Avatar`. `ErrorMessage` to wyśrodkowany blok z „Retry”, a nie komunikat formularza ani informacja o anulowaniu, limicie czy „sprawdź skrzynkę”. | s01–s04, s05–s06 | Spec wymaga `role="alert"`, etykiet i kolejności fokusu |
| D-05 | Brak układu strony uwierzytelniania: wyśrodkowana karta ze stanem, wspólna dla s01–s04 (formularz, „sprawdź skrzynkę”, „link wygasł”). `Card` istnieje, ale bez układu strony. | s01–s04 | Do decyzji, czy to nowy komponent, czy wzór z `Card` |
| D-06 | Przycisk „Sign in with GitHub” z ikoną: `Button` z `asChild` da link w kształcie przycisku, ale w `ui` nie ma biblioteki ikon ani ikony GitHuba. Spec chce prawdziwego linku (nawigacja, nie `fetch`). | s01 | |
| D-07 | Dwa języki wizualne: ciemne tokeny i shadcn kontra jasna paleta `mentora-*` w komponentach publicznych (G22). | wszystkie | |
| D-08 | `TutorCard` ma ocenę, liczbę opinii i cenę za godzinę (sprzeczne z N02 i D01, G23). Nie używany w Epiku 01. | poza E01 | |
| D-09 | `SiteHeader` i `SiteFooter` nie mają wariantu dla zalogowanego (rola, wylogowanie); tokeny noszą nazwę `mentora-*`, a `AGENTS.md` mówi, że „Mentora” nie ma pojawiać się w tekstach (nazwy klas nie są tekstem, ale warto uzgodnić nazwy tokenów); `metadata.title` w `packages/app/src/app/layout.tsx` to nadal „Next.js starter”, czyli tytuł karty na stronie logowania. | s01–s06 | Do zgłoszenia, nie do rozstrzygania tutaj |

Elementy tylko prototypu (panel scenariuszy, atrapy s09 i s10, zegar „Teraz”) nie są luką w design systemie; mają je dostarczyć narzędzia z `lekcja-07/silnik-przegladu`.

## 6. Liczby

| Co | Liczba |
|---|---|
| Identyfikatory ekranów | 10 (s01–s10) |
| w tym ekrany produktu z własnym wyglądem | 7 (s01–s07) |
| w tym wynik przekierowania, ekranu nie ma w specu | 1 (s08) |
| w tym atrapy zewnętrzne (GitHub, skrzynka) | 2 (s09, s10) |
| Stany ogółem | 54 |
| w tym ze źródłem w kryterium lub specu | 47 |
| w tym z istniejącego kodu (s07) | 4 |
| w tym bez źródła, wynik luki | 3 (s04.8, s04.9, s05.5) |
| Scenariusze do przełączania | 10 (P01–P10) |
| Konta demo | 7 (A1–A7) plus 4 profile GitHuba w atrapie |
| Luki w specyfikacji | 26 (A: 7, B: 12, C: 4, D: 3); rozstrzygnięte 26 (wszystkie), otwartych 0 |
| w tym blokujące prototyp | 0 (wszystkie blokujące rozstrzygnięte) |
| Luki w design systemie | 9 (D-01–D-09) |

**Koniec etapu.** Mapa jest zatwierdzona, wszystkie luki mają zapisaną decyzję. Specyfikacja, backlog i design system pozostały bez zmian: poprawki treści #36–#38, zamknięcie Q22 w briefie i luki D-01–D-09 są osobnymi zadaniami.
