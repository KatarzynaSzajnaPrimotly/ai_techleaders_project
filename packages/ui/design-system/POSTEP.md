# POSTEP — design system DevMentor

Data rozpoczęcia: 2026-10-26. To jest dziennik etapów i decyzji. Pracę prowadzę etapami; po każdym etapie zatrzymuję się do odpowiedzi „dalej”.

## Status

- [x] Etap 0 — inwentaryzacja i plan; propozycje P-R01.1, P-R01.2, P-R02.1, P-A01.1, P-CONFLICT.1 i P-TOKEN.1 zaakceptowane.
- [x] Etap 1 — fundamenty (zakończony; zatwierdzone tokeny i motywy wdrożone, Storybook zbudowany; istniejące naruszenia w starych komponentach zarejestrowane, bez zmian do akceptacji).
- [~] Etap 2 — komponenty bazowe, partie po ok. 6; pierwsza partia sześciu komponentów gotowa.
- [ ] Etap 3 — komponenty produktu, wzorce i ekrany.
- [ ] Etap 4 — strony instruktażowe i skrót dla agentów.
- [ ] Etap 5 — weryfikacja i raport.

## Inwentaryzacja etapu 0

- Produkt: DevMentor, marketplace tekstowych sesji 25 lub 50 minut z zaproszonymi senior engineerami dla developerów z pilnym, konkretnym problemem; każda sesja kończy się odpowiedzią i prywatną notatką do zatwierdzenia (D01, D02, D05, D08, D24).
- Źródła przejrzane: `.ai/lessons.md`, `.ai/specs/product-brief.md`, `.ai/specs/backlog.md`, `.ai/specs/backlog-snapshot.md`, `.ai/specs/platform-foundations.md`, `.ai/specs/2026-10-21-auth.md`, `full-backlog.md`, prompt Storybooka i materiały ćwiczeń z `lekcja-06-cwiczenia.zip`, istniejące `packages/ui`.
- Wyniki ćwiczeń `lekcja-06/referencje.md` i `lekcja-06/tokeny.md` nie istnieją w katalogu roboczym; z archiwum pozyskano jedynie prompty/karty. Zatwierdzone propozycje zapisano w tym pliku jako decyzje robocze. Raportu ćwiczenia 1 brak (README archiwum mówi, że wynik miał zostać zapisany osobno). `full-backlog.md` jest dostępny i zawiera projekty ekranów E01–E05 oraz historie stanów; dwa sprawdzone odnośniki do zrzutów E01/E02 zwróciły 404 („link, nie otwarty”).
- Repozytorium: npm workspaces; Next.js 16.4.2 / React 19, Tailwind 4 w aplikacji, Vitest 5. `@devmentor/ui` już istnieje i ma komponenty oraz `src/tokens.css`; Storybooka nie znaleziono w manifestach ani katalogach pakietów.
- Obecny styl w `packages/ui/src/tokens.css` miesza historyczną paletę Mentora, ciemne wartości i ogólne tokeny. Zgodnie z zasadą 12 niczego tu nie zmieniamy bez decyzji właściciela. Interfejs i dokumentacja mają być po angielsku (AGENTS.md).
- Baza wskazana w promptcie ćwiczenia: shadcn/ui na Radix. W bieżącym pakiecie są pojedyncze elementy Radix, CVA i shadcn-podobne pliki (`button`, `card`, `badge`, `table`); styl z tych plików nie stanowi decyzji wizualnej.
- W repozytorium jest też rozpakowany snapshot `ai-techleaders-project-after-lesson-06/` z osobnym pakietem UI i Storybookiem. Traktuję go jako dostarczony snapshot/przykład; nie kopiuję ani nie modyfikuję. Właściwym celem pozostaje `packages/ui` bieżącego workspace.

## Decyzje materiałów — 10 linijek

Karty z promptu ćwiczenia są dostępne, ale nie ma wynikowego pliku z zatwierdzonymi decyzjami; obserwacje poniżej nie są jeszcze regułami design systemu.

1. Charakter (zaakceptowana propozycja): czytelny, skupiony, ciepły, rozmowny; antycharakter: generyczny, hałaśliwy, ozdobny, chłodny.
2. R01 GitHub: dużo informacji pozostaje czytelne, kod/nazwy plików mają inny font, między wierszami są cienkie linie; priorytet „musi być”.
3. R01: nie podoba się jednolita szarość, brak ciepła i nieczytelna hierarchia; zaakceptowano kontekstowe zastosowanie ciepła i mocniejszej hierarchii.
4. R02 Slack: rozmowa jest w centrum, szybko się pisze/odpisuje, widać autora i czas; priorytet „warto”.
5. R02: nie podobają się nadmiar powiadomień, emoji wszędzie i bałagan w bocznym pasku; zaakceptowano ograniczone powiadomienia/emoji i uporządkowany pasek.
6. A01 odrzuca rozpoznawalne cechy generycznej strony startupu AI: fioletowy gradient, szklane karty i iskierki.
7. Numery cech R01.1–A01.1 w tym pliku są przyjętymi decyzjami roboczymi; brak formalnego wyniku ćwiczenia 2.
8. Konflikt gęstości R01 i rozmowy R02 rozstrzygnięto kontekstowo: workspace/listy są informacyjne, ekrany sesji skupione na rozmowie.
9. Sesje trwają 25 albo 50 minut (D01); są tekstowe (N01/R03), a treści nie publikuje się bez zgody mentee (D02/R02).
10. Zaproszenia są wymagane (D08/R07), oceny odrzucone (N02), GitHub poprzedza fallback e-mail (D07/R06), a płatności sesji idą przez Stripe (D04/R05).

### Propozycje do decyzji właściciela

Odpowiedź właściciela z 2026-10-26: prośba o pomoc w uzupełnieniu brakujących decyzji referencyjnych, status tokenów i kompletność kart pozostają nieznane. Właściciel zaakceptował wszystkie propozycje P-R01.1, P-R01.2, P-R02.1, P-A01.1, P-CONFLICT.1 i P-TOKEN.1. Akceptacja tych propozycji nie potwierdza brakujących zrzutów ani wyników ćwiczeń.

| ID propozycji | Propozycja | Źródło i uzasadnienie | Skutek, jeśli przyjęta |
|---|---|---|---|
| P-R01.1 | **Przyjęta.** Charakter: czytelny i skupiony. | R01: dużo informacji pozostaje czytelne; hierarchia ma wskazywać najważniejsze. | Gęstość informacji nie oznacza, że wszystkie elementy mają równy ciężar. |
| P-R01.2 | **Przyjęta.** Charakter: ciepły. | R01 wprost odrzuca „wszystko szare, mało ciepła”. | Paleta i powierzchnie unikają wrażenia chłodnej, jednolicie szarej aplikacji; konkretne barwy wymagają osobnej decyzji/tokenów. |
| P-R02.1 | **Przyjęta.** Charakter: rozmowny. | R02: rozmowa w centrum, szybkie pisanie i odpowiedź, widoczny autor i czas. | Na ekranach sesji punktem uwagi jest wymiana tekstowa; autor i czas są widoczne przy wiadomościach. |
| P-A01.1 | **Przyjęta.** Antycharakter: generyczny, hałaśliwy, ozdobny. | A01: gradient, szklane karty i iskierki; R02 odrzuca też nadmiar powiadomień i emoji. | Nie używać tych wzorców jako ozdobników; statusy i powiadomienia pozostają oszczędne. |
| P-CONFLICT.1 | **Przyjęta.** Gęste, czytelne informacje dla workspace/list (R01); rozmowa na pierwszym planie ekranów sesji (R02). | R01 dotyczy repozytorium/PR, R02 kanału z wątkiem — są to różne konteksty produktu. | Hierarchia zależy od zadania ekranu, a nie od jednego globalnego szablonu. |
| P-TOKEN.1 | **Przyjęta.** Zachować obecny `tokens.css` bez zmian jako niezweryfikowaną warstwę zgodności; nie przyjmować go automatycznie jako źródła nowego stylu. | Właściciel nie wie, czy to aktywna decyzja; zasada 12 zabrania nadpisywania bez zgody. | Najpierw zatwierdzić mapowanie i nowe wartości. Nie proponuję teraz konkretnych kolorów. |

Słowa charakteru (propozycja): **czytelny, skupiony, ciepły, rozmowny**. Antycharakter (propozycja): **generyczny, hałaśliwy, ozdobny, chłodny**. „Chłodny” wynika z odrzucenia jednolitej szarości w R01; pozostałe słowa streszczają cechy kart, nie dodają nowej referencji.

Proponowane wiersze do późniejszego `referencje.md`: R01.1 gęstość i hierarchia; R01.2 osobny font kodu/nazw plików; R01.3 cienkie separatory; R01.4 ciepło i hierarchia jako korekta; R02.1 rozmowa w centrum; R02.2 autor i czas; R02.3 szybkie pisanie/odpowiadanie; R02.4 ograniczenie powiadomień/emoji i porządek paska; A01.1 zakaz gradientu/szkła/iskier. Wszystkie mają status **propozycja**, bo brak zatwierdzonego wyniku ćwiczenia.

## Braki materiałów i decyzje potrzebne do wartości tokenów

1. Nie ma zatwierdzonego `tokeny.md` ani dokładnych wartości koloru, typografii, odstępów, promieni, cieni, ruchu i ikon. Karty określają cechy jakościowe, ale nie wartości liczbowe.
2. Właściciel nie wie, czy obecne tokeny są aktywne. Przyjęto P-TOKEN.1: zachować plik bez zmian jako niezweryfikowaną warstwę zgodności, nie używać go automatycznie jako źródła nowego stylu.
3. Dwa sprawdzone linki do screenów w `full-backlog.md` zwróciły 404. Kompletność pozostałych materiałów wizualnych jest nieznana; raportu audytu nie ma.
4. Do ustalenia: czy design system ma oferować tylko istniejący ciemny motyw, czy parę jasny/ciemny. Obecny CSS ustawia wyłącznie ciemny motyw, ale właściciel nie potwierdził, czy jest to decyzja produktowa.
5. Przed zapisaniem wartości tokenów przygotować tabelę propozycji z kontrastami do akceptacji; nie wpisywać żadnej nowej palety ani skali w kodzie przed tym krokiem.

## Zatwierdzone tokeny i propozycje

Właściciel zaakceptował wszystkie propozycje P-COLOR.1, P-TYPE.1, P-SPACE.1, P-SHAPE.1, P-MOTION.1, P-THEME.1 i P-ICONS.1 dnia 2026-10-26. Materiały określają czytelność, ciepło, hierarchię i spokojny przepływ rozmowy, lecz nie podają konkretnych kodów kolorów, rozmiarów ani trybu jasnego; zaakceptowane wartości są propozycjami projektowymi. Kolory oznaczone „istniejąca wartość” pochodzą z `packages/ui/src/tokens.css`; nowa semantyczna warstwa jest oddzielna, a oryginalny plik pozostaje bez zmian.

### P-COLOR.1 — propozycja semantycznych kolorów light/dark

| Token znaczeniowy | Jasny | Ciemny | Pochodzenie i przeznaczenie |
|---|---|---|---|
| `surface-canvas` | `#FBF8F2` (nowa propozycja) | `#141313` (istniejąca wartość) | R01.4 — ciepłe tło i brak jednolitej szarości; jasna wartość to propozycja. |
| `surface-panel` | `#FFFDF9` (nowa propozycja) | `#1C1B1B` (istniejąca wartość) | P-R01.2 — ciepła, spokojna powierzchnia; nie oznacza każdej sekcji jako karty. |
| `surface-subtle` | `#E6F3EF` (istniejąca wartość) | `#262524` (istniejąca wartość) | P-R01.2 oraz rozdzielenie powierzchni; tylko grupowanie, nigdy jedyny sygnał stanu. |
| `text-strong` | `#1B2430` (istniejąca wartość) | `#EDF5CD` (istniejąca wartość) | R01.1 — wyraźna hierarchia. |
| `text-muted` | `#5B6673` (istniejąca wartość) | `#948D85` (istniejąca wartość) | R01.1 — drugorzędne metadane nadal czytelne. |
| `action-primary` / `state-success` | `#1F6F5C` (istniejąca wartość) | `#63B69C` (nowa propozycja) | R01.2 — zielona, cieplejsza rodzina; jaśniejszy wariant ciemny zaproponowano dla kontrastu. |
| `action-primary-label` | `#FBF8F2` (nowa propozycja) | `#141313` (istniejąca wartość) | Kontrast tekstu na przycisku głównym. |
| `state-warning` | `#8C5908` (nowa propozycja; przyciemniona względem istniejącego `#A66A12`) | `#E98A3C` (istniejąca wartość) | Czytelny tekst/status z podpisem i ikoną, nie sam kolor. |
| `state-error` | `#B42318` (nowa propozycja) | `#FF667A` (nowa propozycja) | Czytelny tekst/status z podpisem i ikoną. |
| `stroke-control` / `focus-visible` | `#5B6673` (istniejąca wartość) | `#948D85` (istniejąca wartość) | Pary kontrolka/tło i widoczny fokus; nie używać niskiego kontrastu dla obrysu kontrolki. |
| `stroke-divider` | `#E1E5EA` (istniejąca wartość) | `#948D85` (istniejąca wartość) | R01.3 — cienkie separatory wierszy. Jasny separator jest wyłącznie dekoracyjny i nie może definiować granicy kontrolki ani stanu. |

Surowa paleta do wydzielenia w pliku tokenów (warstwa raw): istniejące wartości `#1F6F5C`, `#E6F3EF`, `#1B2430`, `#5B6673`, `#E1E5EA`, `#141313`, `#EDF5CD`, `#948D85`, `#1C1B1B`, `#262524`, `#E98A3C`; nowe propozycje `#FBF8F2`, `#FFFDF9`, `#63B69C`, `#8C5908`, `#B42318`, `#FF667A`. Żadna z nich nie jest jeszcze zapisana ani zatwierdzona jako nowy styl.

### Kontrast P-COLOR.1

Zmierzono z luminancji względnej WCAG na dokładnych wartościach powyżej. Tekst wymaga co najmniej 4,5:1; istotne granice kontrolek i fokus co najmniej 3:1 (WCAG 2.2, 1.4.3 i 1.4.11). Każda komórka ma kolejno kontrast na `surface-canvas` / `surface-panel` / `surface-subtle`.

| Motyw | Tekstowa rola | Wartość tekstu | Kontrast na canvas / panel / subtle | Ocena |
|---|---|---:|---:|---|
| Jasny | `text-strong` | `#1B2430` | 14,77 / 15,41 / 13,74 : 1 | spełnia |
| Jasny | `text-muted` | `#5B6673` | 5,51 / 5,75 / 5,13 : 1 | spełnia |
| Jasny | `action-primary` i sukces | `#1F6F5C` | 5,68 / 5,93 / 5,29 : 1 | spełnia |
| Jasny | ostrzeżenie | `#8C5908` | 5,58 / 5,83 / 5,20 : 1 | spełnia |
| Jasny | błąd | `#B42318` | 6,20 / 6,47 / 5,77 : 1 | spełnia |
| Ciemny | `text-strong` | `#EDF5CD` | 16,38 / 15,17 / 13,51 : 1 | spełnia |
| Ciemny | `text-muted` | `#948D85` | 5,66 / 5,24 / 4,67 : 1 | spełnia |
| Ciemny | `action-primary` i sukces | `#63B69C` | 7,69 / 7,12 / 6,34 : 1 | spełnia |
| Ciemny | ostrzeżenie | `#E98A3C` | 7,21 / 6,68 / 5,95 : 1 | spełnia |
| Ciemny | błąd | `#FF667A` | 6,57 / 6,08 / 5,42 : 1 | spełnia |

| Element interfejsu | Para | Kontrast | Ocena / poprawka |
|---|---|---:|---|
| Przycisk główny, jasny | etykieta `#FBF8F2` na wypełnieniu `#1F6F5C` | 5,68 : 1 | spełnia |
| Przycisk główny, ciemny | etykieta `#141313` na wypełnieniu `#63B69C` | 7,69 : 1 | spełnia |
| Przycisk błędu, jasny | etykieta `#FBF8F2` na wypełnieniu `#B42318` | 6,20 : 1 | spełnia |
| Przycisk błędu, ciemny | etykieta `#141313` na wypełnieniu `#FF667A` | 6,57 : 1 | spełnia |
| Granica kontrolki i fokus, jasny | `#5B6673` na `surface-subtle` `#E6F3EF` | 5,13 : 1 | spełnia |
| Granica kontrolki i fokus, ciemny | `#948D85` na `surface-subtle` `#262524` | 4,67 : 1 | spełnia |
| Separator wiersza, jasny | `#E1E5EA` na `surface-canvas` `#FBF8F2` | 1,19 : 1 | **poniżej 3:1**; zostaje tylko dekoracyjnym separatorem. Gdy separator ma oznaczać granicę kontrolki, użyć `stroke-control` `#5B6673` (5,51:1). |

W statusach tekstowa etykieta (np. „Confirmed”, „Needs attention”) i/lub ikona towarzyszy kolorowi, zgodnie z wymaganiem z zadania. Nie proponuję używać koloru jako jedynego nośnika znaczenia.

### P-TYPE.1 — typografia (propozycja)

| Rola | Rodzina | Rozmiar / interlinia | Źródło |
|---|---|---|---|
| Nagłówek strony | system-ui | 32 / 40 px, semibold | Propozycja; R01.1 wymaga hierarchii, nie wskazuje kroju ani rozmiaru. |
| Nagłówek sekcji | system-ui | 24 / 32 px, semibold | Propozycja hierarchii z R01.1. |
| Tekst ciągły | system-ui | 16 / 24 px | Propozycja; maksymalnie 65ch zgodnie z wymaganiem zadania. |
| Etykieta | system-ui | 14 / 20 px, medium | Propozycja dla gęstego, ale czytelnego formularza (R01.1). |
| Metadane | system-ui | 12 / 16 px | Propozycja; pozostają czytelne i nie konkurują z treścią (R01.1). |
| Liczby | system-ui, tabular numerals | 16 / 24 px | Propozycja ułatwiająca skanowanie cen i terminów (R01.1, D01, D29). |
| Kod i nazwy plików | system monospace | 14 / 20 px | R01.2. Używać systemowego mono, bez zewnętrznego CDN ani nowej font-dependency. |

### P-SPACE.1 — odstępy i układ (propozycja)

Jedna skala z przykładu w zadaniu: `4, 8, 12, 16, 24, 32, 48 px`. Proponowane relacje: 8 px wewnątrz grupy, 16 px między grupami powiązanych pól, 24 px wewnątrz panelu, 48 px między sekcjami. Gęsta tabela może używać 8 px odstępu pionowego między wierszami i 12 px paddingu komórki (R01.1, R01.3); to propozycja do późniejszego zatwierdzenia z komponentami.

| Szerokość widoku | Gutter strony | Maksymalna szerokość treści | Źródło |
|---:|---:|---:|---|
| 320 px | 16 px | szerokość dostępna | Szerokość wymagana zadaniem; gutter to propozycja. |
| 768 px | 24 px | szerokość dostępna | Szerokość wymagana zadaniem; gutter to propozycja. |
| 1440 px | 32 px | 1200 px | Szerokość wymagana zadaniem; max 1200 px to propozycja. |

### P-SHAPE.1 — kształt i głębia (propozycja)

- Obrys kontrolek i kart: 1 px; kontrolki radius 4 px, karty/panele 8 px, dialog/popover 8 px. Propozycja realizująca czytelne grupowanie (R01.1) i cienkie linie (R01.3); bez kapsułek jako domyślnego kształtu (A01.1, What to avoid z zadania).
- Cień tylko dla nakładki nad treścią, nigdy jako jedyny sposób rozdzielenia sekcji. Token `shadow-overlay` proponuję jako `0 12px 24px rgb(20 19 19 / 16%)`; konkretna wartość jest propozycją, a nie obserwacją z referencji.
- Jasny separator `#E1E5EA` nie może być granicą pola ani fokusu; te używają kontrastowego `stroke-control`.

### P-MOTION.1 — ruch (propozycja)

Proponowane tokeny: `duration-fast: 120ms`, `duration-standard: 180ms`, `duration-slow: 240ms`, easing `cubic-bezier(.2, 0, 0, 1)`. Ograniczyć animacje do reakcji na działanie, nie animować dekoracyjnie tła. Przy `prefers-reduced-motion: reduce` skrócić przejścia do 0 ms i wyłączyć ruch nieistotny dla przekazania stanu (wymóg zadania; WCAG 2.3.3 jako źródło dla animacji wywoływanych interakcją).

### P-ICONS.1 — ikony (propozycja, zależność niezatwierdzona)

Proponuję `lucide-react`, rozmiary 16 px dla metadanych, 20 px dla kontrolek, 24 px dla akcji; ikona akcji bez widocznej etykiety musi mieć dostępną nazwę. Biblioteki brak w bieżącym pakiecie i nie ma jej w zatwierdzonym planie zależności, więc **nie instaluję jej przed Twoją zgodą**. Źródło wyboru biblioteki to propozycja, nie R01/R02; rozmiary to propozycja. Cele dotykowe co najmniej 24×24 px zgodnie z kryterium z zadania.

### Decyzje zaakceptowane

- **P-THEME.1:** przyjęta para motywów jasny + ciemny; stories będą testowane w obu.
- **P-COLOR.1:** przyjęte proponowane mapowanie istniejących surowych wartości i nowe kolory.
- **P-TYPE.1, P-SPACE.1, P-SHAPE.1, P-MOTION.1:** przyjęte proponowane wartości.
- **P-ICONS.1:** przyjęto `lucide-react` jako nową zależność; instalacja i użycie są zatwierdzone.

## Plan techniczny (zatwierdzony)

- Lokalizacja: komponenty w istniejącym pakiecie `packages/ui`, konfiguracja Storybooka w `packages/ui/.storybook/`, postęp w `packages/ui/design-system/POSTEP.md`; prawdziwe komponenty pozostają w `packages/ui/src/`.
- Storybook: 10.6.4 (zgodny z Vitest 5; weryfikacja oficjalnej dokumentacji odbyła się przed instalacją).
- Dodatki dodane: Docs/MDX, `@storybook/addon-a11y` z `a11y.test = 'error'`, `@storybook/addon-vitest` dla stories/interaction play, `remark-gfm` dla tabel Markdown, MSW 2 do symulowania odpowiedzi API, Vite/React i Tailwind Vite plugin.
- Skrypty: `storybook`, `build-storybook`, `test-storybook`, `test-storybook:themes`, `check-design-tokens`, `typecheck:storybook`.
- Przyjęto light i dark jako motywy. Warstwa semantyczna w `src/design-system-tokens.css` jest osobna; istniejący `src/tokens.css` i komponenty pozostają bez zmian.
- Ograniczenie: nie zmieniać aplikacji poza skryptami/konfiguracją wymaganymi dla Storybooka; nie publikować i nie wysyłać zmian zdalnie.

### Wykonane w etapie 1 do tej pory

- Dodano konfigurację Storybook React/Vite, branding DevMentor, dokumentację MDX z `remark-gfm`, a11y jako błąd testu, Vitest browser runner dla stories, integrację MSW i Tailwind v4 bez preflight.
- Wyłączono telemetry, What's New i onboarding checklisty.
- Dodano skrypty pakietowe i rootowe `storybook`, `build-storybook`, `test-storybook` oraz `typecheck:storybook`; Storybookowy build jest ignorowany w Git.
- Po instalacji `npm audit` zgłosił podatność high w Vite 8.2.2; podniesiono Vite do 8.3.4. Ponowne `npm audit --audit-level=high`: brak podatności.
- Dodano zatwierdzone tokeny raw i semantyczne w `src/design-system-tokens.css`, z komentarzami źródeł, wariantem light/dark, fontami systemowymi i rolami typografii, odstępami, layoutem, kształtem, głębią i ruchem. Nowy plik jest podłączony do Tailwinda Storybooka i globalnego CSS aplikacji (wyłącznie import konfiguracji); `src/tokens.css` bez zmian. Domyślny motyw tokenów jest dark, zgodnie z istniejącym rootem aplikacji.
- Dodano pasek motywu Storybooka ustawiający `data-theme` i `color-scheme` na elemencie głównym dokumentu; portale dziedziczą motyw. Dodano skrypt testujący stories osobno w obu motywach.
- Dodano siedem stron Foundations: Color, Typography, Spacing and layout, Shape and depth, Motion, Icons, Themes. Są to rzeczywiste zmienne CSS. Kontrast ponownie policzono z wartości zapisanych w tokenach; macierz jest w stronie Color. Pary tekstowe spełniają 4.5:1, granice funkcjonalne 3:1. Jasny divider ma 1.19:1 na canvas i 1.11:1 na subtle, więc może być wyłącznie dekoracyjny.
- Skrypt `check-design-tokens` zwraca błąd dla zastanych naruszeń w istniejących plikach; nie modyfikowałem tych plików z powodu zasady 12. Lista: `src/backdrop.tsx:35` (`#f8fec6`), `src/backdrop.tsx:123` (`#fff`), `src/search-bar.tsx:27` (`text-[15px]`), `src/site-footer.tsx:11` (`max-w-[1160px]`, `text-[13px]`), `src/site-header.tsx:15` (`h-[68px]`, `max-w-[1160px]`), `src/tutor-card.tsx:16` (`text-[11px]`), `src/tutor-card.tsx:23-25` (`text-[15px]` i `text-[13px]`). Istnieje też literal w `src/backdrop.test.tsx:111`; test wymaga decyzji, czy należy go zamienić na fixture tokenowy.
- Sprawdzone: `typecheck:storybook` i `build-storybook` przechodzą; zbudowany indeks zawiera 7 stron Foundations. Build zgłasza ostrzeżenia o dużym chunku (>500 kB) i dyrektywach `use client` biblioteki ikon; output jest wygenerowany. `git diff --check` przechodzi.
- Nie uruchamiałem testów stories, lintu, testów aplikacji ani przeglądarki. Skrypty testowe są skonfigurowane; sprawdzenie historii, obu motywów oraz viewportów przeglądarką należy do dalszych etapów/Etapu 5.
- Etap 1: fundamenty i konfiguracja gotowe. Otwarte pozostaje zatwierdzenie migracji wskazanych istniejących komponentów i test fixture; nie wolno ich przepisać bez decyzji. Mogą być partiami w etapie 2 po zatwierdzeniu zakresu.

## Inwentarz komponentów i ekranów z backlogu

To propozycja mapowania ekranów do elementów, nie zatwierdzenie wariantów. Pierwsza iteracja obejmuje E01–E04, 14 stories; następne 7 stories są w 1.1 (E02/E03/E05). `full-backlog.md` zawiera kompozycje ekranów i stany, które trzeba odzwierciedlić w stories.

| Kandydat | Ekrany/story, które go potrzebują |
|---|---|
| Przycisk, link, pole tekstowe/hasło, pole wielowierszowe, etykieta/pole formularza, checkbox, radio, select, alert, dialog, potwierdzenie, status, karta, zakładki, loading/empty/error | E01 logowanie GitHub i e-mail, rejestracja z zaproszenia, przekierowanie do roli; E02 edycja profilu i cen, publikacja terminów; E03 wybór terminu, Checkout/przekierowanie i sesje nadchodzące; E04 tekstowa sesja, odpowiedź, notatka do akceptacji/odrzucenia z komentarzem. Konkretne kontrolki zależą od ekranów w brakujących specyfikacjach.
| Komponent produktu: karta profilu mentora / publiczna strona mentora | E02-S02; wejście do E03-S02. Nie dodawać ocen (N02).
| Komponent produktu: pozycja terminu/slotu i stan zajętości | E02-S03, E03-S02.
| Komponent produktu: podsumowanie ceny i długości sesji | E02-S04, E03-S02–S03; ceny w EUR (D29), kwoty/limity nadal częściowo otwarte (Q24).
| Komponent produktu: karta/wiersz nadchodzącej sesji i status płatności/potwierdzenia | E03-S03–S04.
| Komponent produktu: panel sesji tekstowej, odpowiedzi i prywatnej notatki z akceptacją/odrzuceniem | E04-S01–S04; treść niepublikowana bez zgody (D02).
| Wzorce: formularz, szczegóły, lista z filtrami, potwierdzenie usunięcia, toast, widok dialogowy | Formularze E01–E02 i E04; szczegóły E02/E03/E04; lista E02-S03 i E03-S04; potwierdzenie destrukcyjnych działań (do potwierdzenia, bo brak opisu usuwania w aktywnym backlogu); toast tylko po ustaleniu zachowania. E03-S01 to dopiero 1.1.
| E05 operator: zaproszenia, limity cen, spór | `full-backlog.md` pokazuje E05-S01–S03 jako 1.0, natomiast `.ai/specs/product-brief.md` i `.ai/specs/backlog.md` oznaczają je jako 1.1 (D13). Konflikt wymaga rozstrzygnięcia; do tego czasu stories traktujemy jako poza zakresem wdrażania.
| E06 / E07 | E06 zaparkowany, bez stories; E07 epik publicznej strony bez stories/specyfikacji. Nie tworzyć ekranów z domysłu.

### Przewidywane menu i wielkość (propozycja)

Nazwy po angielsku, zgodnie z językiem dokumentacji.

```text
Design System
  Start here
  Components
  How to choose
  Usage and accessibility
  Content
  What to avoid
  What is missing
  Contributing
  Product flows
    E01 Accounts and roles
    E02 Mentors become bookable
    E03 Booking and payment
    E04 Session, answer, and note
Foundations
  Color / Typography / Spacing and layout / Shape and depth / Motion / Icons / Themes
Primitives
Product
  E01 / E02 / E03 / E04 (oraz E05+ jako brak, jeśli zatwierdzone)
Patterns
  Form / Filtered list / Details / Delete confirmation / backlog patterns
```

Szacunek wstępny: 8 stron instruktażowych + 7 foundations + ok. 12–18 komponentów bazowych (zależnie od tego, które już istnieją i co pokażą specyfikacje), 5–8 komponentów produktu dla E01–E04, 4 wymagane wzorce + wzorce ze specyfikacji, 4 strony epików. Każdy komponent/wariant dostanie kilka stories (playground, warianty, stany, responsywność, interakcja), więc dokładna liczba zależy od zatwierdzonego zakresu i nie jest jeszcze obietnicą.

## Istniejący design system — zakres bez zmian i propozycje do decyzji

- Zostaje bez zmian: `packages/ui/src/tokens.css`, pozostałe komponenty poza zatwierdzonym zakresem partii, konfiguracja Tailwinda i strony aplikacji. Powód: zasada 12 oraz brak materiałów z ćwiczenia 2.
- Propozycja: utworzyć Storybook w `packages/ui/.storybook` i dokumentację w `packages/ui/design-system`, bez nadpisywania istniejących komponentów. Uzasadnienie: wykorzystać istniejący pakiet UI oraz odseparować instrukcję obsługi.
- Migracja Button, Badge, Card i Table do zatwierdzonej warstwy semantycznej została wykonana w Etapie 2, partia 1. Pozostałe komponenty wymagają osobnej partii i konkretnych źródeł.
- Usuwanie: niczego nie proponuję usuwać.

## Zatwierdzone decyzje, otwarte kwestie, następny krok

- Zatwierdzone w tej sesji (2026-10-26): baza shadcn/ui na Radix, lokalizacja `packages/ui`, Storybook `packages/ui/.storybook`, język angielski UI i dokumentacji, P-R01.1, P-R01.2, P-R02.1, P-A01.1, P-CONFLICT.1, P-TOKEN.1, brak raportu audytu, P-COLOR.1, P-TYPE.1, P-SPACE.1, P-SHAPE.1, P-MOTION.1, P-THEME.1 i P-ICONS.1. Zatwierdzono także `lucide-react`.
- Otwarte: niepewna kompletność referencji; konflikt iteracji E05 między backlogami; decyzja o naprawie istniejących naruszeń tokenów (lista wyżej) oraz dodaniu ikony Lucide do testów, jeśli występuje w testowym backdrop.
- Wykonano w Etapie 2, partia 1: Button, Badge, Card, Table, Input i Textarea. Zachowano istniejące API i przypisano przykłady do zaakceptowanych tokenów oraz wzorców R01/R02; szczegóły i weryfikacja w dzienniku uruchomienia.
- Następny krok: kontynuować Etap 2 kolejną partią komponentów bazowych (etykieta, checkbox/radio, select, alert/dialog) i zatrzymać się po ukończeniu etapu przed Etapem 3.
