# Aktualizacja specyfikacji fundamentów i uwierzytelniania

## Prośba

Zastosować rekomendacje z przeglądu plików `2026-10-21-platform-foundations.md` i `2026-10-21-auth.md`, usuwając niespójności, wzajemnie wykluczające się założenia, antywzorce i zbędną złożoność.

## Wykonane

- Zastąpiono niestandardowy eksport `access` z `page.tsx` manifestem sąsiednim.
- Doprecyzowano granicę `core`–`app` i sposób przekazywania konfiguracji JWT.
- Uściślono kontrakt testu dostępu oraz ograniczono wymagania fake servera do adapterów HTTP.
- Dodano wymagania dla produkcyjnego `APP_URL`, bezpiecznych ciasteczek OAuth i wyjątków od JSON envelope dla redirectów.
- Ujednolicono błędy logowania, aby nie ujawniać istnienia konta.
- Dodano atomową, współbieżną weryfikację e-maila i testy tego przypadku.
- Doprecyzowano transakcyjne zastępowanie niezweryfikowanego konta oraz zachowanie przy awarii mailera.
- Udokumentowano ograniczenie stateless JWT operatora i plan ponownej oceny przed modułami finansowymi.

## Zmienione pliki

- `.ai/specs/2026-10-21-platform-foundations.md`
- `.ai/specs/2026-10-21-auth.md`

## Weryfikacja i dalsze kroki

- `git diff --check` nie zgłosił błędów.
- Nie uruchamiano testów ani builda, ponieważ zmieniono wyłącznie dokumentację/specyfikacje.
- Niezwiązany plik `full-backlog.md` pozostawiono bez zmian.
