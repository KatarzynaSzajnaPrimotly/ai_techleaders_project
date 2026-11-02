# Checklista bezpieczeństwa warsztatu AI – lekcja 09

Sześć miejsc z lekcji 09 „Bezpieczeństwo narzędzi AI”. Przejdź listę w swoim projekcie
i odhacz to, co masz. Każdy brak to konkretna zmiana do zrobienia od jutra.

Przy każdym przebiegu agenta zadaj sobie jedno pytanie z lethal trifecta:
**której nogi tu brakuje?** Dostępu do prywatnych danych, kontaktu z niezaufaną treścią
czy możliwości komunikacji na zewnątrz. Jednej z nich zawsze powinno brakować.

## 1. Repozytorium, które wykonuje kod

- [ ] Mam alias `agent-audit` i uruchamiam go w każdym świeżo sklonowanym repozytorium, zanim odpalę agenta.
- [ ] Czytam znalezione pliki pod kątem hooków, `enableAllProjectMcpServers`, list `allow` i nieznanych serwerów MCP.
- [ ] Nieznane repozytorium uruchamiam w kontenerze albo w sandboksie, bez montowania `~/.ssh`, `~/.aws` i `~/.claude`.
- [ ] Nie potwierdzam zaufania do katalogu, którego konfiguracji nie przeczytałem.

## 2. Skille

- [ ] Mam spisaną listę skilli, z których korzystam (globalnych i w projekcie, także `.agents/skills/`).
- [ ] Przeczytałem każdy skill, którego nie napisałem sam.
- [ ] Skanuję skille grepem pod kątem dynamicznego kontekstu (`` !` ``), `curl`, `wget`, `base64`, `.env`, `~/.ssh`, `~/.aws`.
- [ ] Nowe skille trafiają do projektu przez pull request z review, z przypiętą wersją.
- [ ] Wiem, że skill bezpieczny w jednym agencie może nie być bezpieczny w innym (Claude Code, Codex).

## 3. Prompt injection z treści

- [ ] Wiem, które źródła niezaufanej treści czyta mój agent: zgłoszenia, dokumentacja z sieci, README, logi, output narzędzi.
- [ ] Przetestowałem agenta na pliku z ukrytą instrukcją i zapisałem wynik.
- [ ] Nie traktuję odporności modelu jako granicy bezpieczeństwa. Granica jest w uprawnieniach, sandboksie i hookach.

## 4. Sekrety i historia sesji

- [ ] Przeskanowałem `~/.claude/projects/` (skrypt `skan-sesji.sh` albo `gitleaks dir ~/.claude/projects --redact`).
- [ ] Wszystko, co znalazłem, zrotowałem. Dzisiaj, nie kiedyś.
- [ ] Mam reguły `permissions.deny` na `.env`, `.env.*`, klucze `*.pem`, `~/.ssh/**` i `~/.aws/**`.
- [ ] Przynajmniej jeden projekt bierze sekrety z menedżera (`op run`, `doppler run`, `infisical run`), a nie z `.env` na dysku.
- [ ] Agent dostaje własny, krótkożyjący token z minimalnym zakresem, a nie mój osobisty.

## 5. Sandbox i ruch wychodzący

- [ ] Sandbox jest włączony (`sandbox.enabled: true`), a `allowUnsandboxedCommands` ustawione na `false`.
- [ ] `sandbox.filesystem.denyRead` blokuje katalogi z poświadczeniami. Mam też reguły `permissions.deny`, bo każda z nich chroni inną drogę.
- [ ] `allowedDomains` zawiera tylko potrzebne domeny, bez szerokich wildcardów. `deniedDomains` blokuje endpointy metadanych chmury.
- [ ] Allowlistę przetestowałem nie tylko `curl`em, ale też `git clone` i `npm install`.
- [ ] Wiem, że Read, Edit, Write, serwery MCP i hooki działają poza sandboksem basha.

## 6. Guardraile deterministyczne

- [ ] Mam co najmniej jeden hook `PreToolUse`, który blokuje (kod wyjścia 2).
- [ ] Skrypt hooka ma `chmod +x` i przetestowałem go bez agenta (`echo '{…}' | hook; echo $?`).
- [ ] Próbowałem obejść własny hook i wiem, gdzie jest niekompletny.
- [ ] Przeczytałem każdy hook przed wdrożeniem, także te z gotowych zestawów.

## Proces w zespole

- [ ] `.claude/`, `.mcp.json`, `.agents/`, `CLAUDE.md` i `AGENTS.md` są w `CODEOWNERS`, a ochrona gałęzi wymaga review od właścicieli kodu.
- [ ] Wyniki audytu są w `security-notes.md`: uprawnienia, skille, serwery MCP, wynik skanu sesji (bez wartości), wynik próby wstrzyknięcia i jedno zdanie o tym, którą nogę trifekty usunąłem i w której ścieżce.
