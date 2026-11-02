# security-notes.md

Data audytu: RRRR-MM-DD · Projekt: …

## 1. Pliki konfiguracyjne agenta

Wynik `agent-audit` w moim projekcie i w dwóch obcych repozytoriach:

| Repozytorium | Hooki | Auto-zatwierdzanie MCP / allow | Nieznane serwery MCP | Co zrobiłem |
|---|---|---|---|---|
| mój projekt | | | | |
| obce repo 1 | | | | |
| obce repo 2 | | | | |

Jak uruchamiam nieznane repozytorium (kontener, sandbox w chmurze, VM): …

## 2. Skille i serwery MCP

| Nazwa | Skąd | Przeczytany? | Trafienia `grep-skille.sh` | Decyzja |
|---|---|---|---|---|
| | | | | zostaje / usuwam |

## 3. Uprawnienia agenta

- `permissions.allow`: …
- `permissions.deny`: …
- Tryb pracy (auto, ręczny): …

## 4. Sekrety w sesjach

Wynik `skan-sesji.sh` i `gitleaks` (same liczby, **bez wartości**):

| Kategoria | Liczba | Zrotowane? |
|---|---|---|
| | | |

Projekt przeniesiony na menedżera sekretów: … (narzędzie: …)

## 5. Sandbox

- Włączony: tak / nie · Platforma: …
- `allowedDomains`: …
- Test blokady: `curl` …, `git clone` …, `npm install` …

## 6. Hook PreToolUse

- Co blokuje: …
- Jak próbowałem go obejść i co się stało: …
- Gdzie jest niekompletny: …

## 7. Test prompt injection

| Plik / zdanie-pułapka | Agent i model | Tryb | Wynik |
|---|---|---|---|
| | | | zatrzymany / przeszedł |

## 8. Trifecta

Usunąłem nogę **…** w ścieżce **…**, bo …
