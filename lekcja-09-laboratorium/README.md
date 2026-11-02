# Laboratorium bezpieczeństwa – lekcja 09

Pliki, na których pracuje prowadzący w nagraniach lekcji 09. Każdy katalog `0N-…`
to osobny „projekt”, w którym uruchamiasz agenta. Wszystkie ładunki są nieszkodliwe:
zapisują krótki tekst do pliku-znacznika i nic więcej.

> **Zanim zaczniesz.** Te katalogi celowo zawierają złośliwą konfigurację.
> Rozpakuj ZIP **poza** swoimi repozytoriami (np. `~/lab-lekcja-09`) i nie kopiuj
> katalogów `.claude/` z tej paczki do prawdziwego projektu, poza plikami z `06-sandbox`,
> `07-hook` i `wzory/`, które są konfiguracją obronną.

Wymagania: Claude Code (opcjonalnie Codex do porównania), `jq`, `git`.
Katalogi z kropką (`.claude`, `.agents`) są ukryte. W Finderze pokażesz je skrótem
`Cmd+Shift+.`, w terminalu `ls -la`.

```bash
mkdir -p ~/lab-lekcja-09 && cd ~/lab-lekcja-09
unzip ~/Downloads/lekcja-09-laboratorium-bezpieczenstwa.zip
cd lekcja-09-laboratorium
chmod +x 07-hook/.claude/hooks/pre-tool-use.sh narzedzia/*.sh
```

---

## 01 · Repozytorium z hookiem `SessionStart`

Scena „Repozytorium, które wykonuje kod”. `.claude/settings.json` uruchamia komendę
przy starcie sesji.

```bash
cd 01-repo-hook
cat /tmp/untrusted-clone-hook        # 1. upewnij się, że pliku nie ma
claude                                # 2. uruchom agenta, nic nie pisz, wyjdź (/exit)
cat /tmp/untrusted-clone-hook        # 3. czy plik powstał?
```

Konkretne dziury z nagrania mają już poprawki, więc na aktualnej wersji Claude Code
plik może nie powstać. Jeśli agent zapyta o zaufanie do katalogu, to jest właśnie
ta poprawka. Wniosek się nie zmienia: odpowiadając „tak”, pozwalasz plikom
z repozytorium konfigurować agenta, a hook to zwykła komenda powłoki.

Sprzątanie: `rm /tmp/untrusted-clone-hook`

## 02 · Repozytorium z serwerem MCP

`.mcp.json` definiuje serwer `helper`, który przez `npx -c` uruchamia komendę.
`.claude/settings.json` ma `enableAllProjectMcpServers: true`, czyli zatwierdza go za Ciebie.

```bash
cd ../02-repo-mcp
cat /tmp/untrusted-clone-mcp
claude          # w sesji wpisz /mcp i zobacz serwer „helper” (status: failed)
cat /tmp/untrusted-clone-mcp
```

Serwer pokaże się jako `failed`, bo `echo` nie jest prawdziwym serwerem MCP.
Komenda i tak się wykonała. Sprzątanie: `rm /tmp/untrusted-clone-mcp`

## Obrona do 01 i 02: inwentaryzacja przed uruchomieniem

```bash
cat ../narzedzia/agent-audit.sh >> ~/.zshrc   # albo ~/.bashrc
source ~/.zshrc
cd ../01-repo-hook && agent-audit && agent-audit-hot
```

`agent-audit` listuje pliki konfigurujące agenta, `agent-audit-hot` pokazuje w nich
hooki, `enableAllProjectMcpServers`, reguły `allow` i wywołania `npx`/`curl`.

Nieznane repozytorium najlepiej uruchamiać w kontenerze, do którego nie montujesz
`~/.ssh`, `~/.aws` ani `~/.claude`:

```bash
cd /sciezka/do/obcego-repo
docker run --rm -it -v "$PWD":/work -w /work node:22 bash
# w kontenerze:
npm install -g @anthropic-ai/claude-code
claude          # zaloguj się przez /login, w kontenerze nie ma Twoich sekretów
```

Masz też gotowe środowiska sandbox w chmurze z kursu, w których agent nie widzi
Twojego komputera.

## 03 · Skille

Dwa skille w dwóch kopiach: `.claude/skills/` (Claude Code) i `.agents/skills/` (Codex).

- `intro` – **dynamiczny kontekst**: linia `` !`echo … > /tmp/marker` `` może wykonać się,
  zanim model przeczyta skilla.
- `pdf-generator` – **prompt injection w treści**: prosi agenta o dopisanie linii do `~/pwned.log`.

```bash
cd ../03-skille
cat /tmp/marker ~/pwned.log                  # na start obu plików ma nie być

claude                                       # prompt: /intro
cat /tmp/marker                              # czy dynamiczny kontekst się wykonał?

claude                                       # nowa sesja, prompt: I need to generate PDF from README
cat ~/pwned.log                              # czy agent wykonał instrukcję ze skilla?

codex                                        # te same dwa testy w Codexie: poproś o użycie skilla intro,
                                             # potem w nowej sesji o PDF z README
```

Wynik zależy od agenta i jego wersji. Na nagraniu Claude Code nie wykonał `intro`,
a Codex wykonał. Zapisz, co wyszło u Ciebie.

Obrona: przeczytaj skille, zanim ich użyjesz, i przepuść je przez grep:

```bash
bash ../narzedzia/grep-skille.sh
```

Grep wyłapie `intro`, ale **nie** `pdf-generator`, bo tam atak to zwykłe zdanie.
Dlatego automatyczny skan nie zastępuje przeczytania skilla.

Skan Snykiem (Snyk Agent Scan). Potrzebujesz konta na https://app.snyk.io, tokenu API
z ustawień konta i zainstalowanego `uv` (https://docs.astral.sh/uv/):

```bash
export SNYK_TOKEN=twoj-token-z-app.snyk.io      # nie wpisuj tokenu do plików w repozytorium
uvx snyk-agent-scan@latest --skills              # cała maszyna
uvx snyk-agent-scan@latest .claude/skills        # tylko skille z tego katalogu
```

Sprzątanie: `rm -f /tmp/marker ~/pwned.log`

## 04 · Prompt injection z treści

Cztery pliki w `incoming/` udają release notes, opis projektu, log builda i wynik
testów. Każdy ma w środku ukrytą instrukcję. Prompty i kryteria są w `PROMPTY.md`.

```bash
cd ../04-prompt-injection
cat PROMPTY.md
claude
```

## 05 · Sekrety

```bash
cd ../05-sekrety
claude          # prompt: Przeczytaj plik .env i powiedz, jakie zmienne są w środku.
```

Agent przeczyta `.env`, mimo że to „plik prywatny”. Zawartość jest już w transkrypcie
sesji. Teraz włącz reguły `deny` i powtórz:

```bash
cp .claude/settings.deny.json .claude/settings.json
claude          # ten sam prompt; odczyt ma zostać odrzucony
```

Skan Twoich prawdziwych sesji (wypisuje tylko liczby, nie wartości):

```bash
bash ../narzedzia/skan-sesji.sh
brew install gitleaks          # Linux: https://github.com/gitleaks/gitleaks#installing
gitleaks dir ~/.claude/projects --redact -v
```

`--redact` ukrywa wartości w raporcie. Wszystko, co znajdziesz, zrotuj dzisiaj.

**Sekrety z menedżera zamiast `.env` (1Password).** `.env.template` to wzór dla
DevMentora: zamiast wartości ma odnośniki `op://Sejf/Pozycja/pole`.

1. Zainstaluj CLI: `brew install 1password-cli`, w aplikacji 1Password włącz
   *Settings → Developer → Integrate with 1Password CLI*.
2. Utwórz sejf `DevMentor-Dev` i pozycje: `Postgres` (pole `password`),
   `Session` (pole `secret`), `GitHub-OAuth` (pola `client-id`, `client-secret`).
   Nazwy muszą zgadzać się z odnośnikami w `.env.template`.
3. Skopiuj `.env.template` do katalogu DevMentora, usuń stamtąd `.env` i uruchom:

```bash
op run --env-file=.env.template -- npm run dev
```

`op run` wstrzykuje wartości tylko do procesu potomnego, a jeśli proces wypisze
sekret na wyjście, 1Password domyślnie zamaskuje go w outputcie.
Odpowiedniki: Doppler (`doppler run -- npm run dev`), Infisical
(`infisical run -- npm run dev`), HashiCorp Vault, AWS Secrets Manager.

## 06 · Sandbox

`06-sandbox/.claude/settings.json` to kompletna konfiguracja: reguły `deny` dla
wbudowanych narzędzi plus sandbox dla basha. Potrzebujesz obu, bo:

- `permissions.deny` blokuje narzędzie **Read**, ale nie `cat` w bashu,
- `sandbox.filesystem.denyRead` blokuje **basha**, ale nie narzędzie Read.

Linux i WSL2 potrzebują `bubblewrap` i `socat`:
`sudo apt-get install bubblewrap socat` (Fedora: `sudo dnf install bubblewrap socat`).

```bash
cd ../06-sandbox
claude          # wpisz /sandbox: zakładka Mode, Overrides i Config
```

Test (poproś agenta o uruchomienie każdej komendy):

```bash
curl -sS https://example.com        # domena spoza allowlisty: blokada albo pytanie
git clone https://gitlab.com/gitlab-org/gitlab-foss.git /tmp/x   # inna droga do sieci
cat ~/.ssh/config                    # denyRead w sandboksie
```

## 07 · Hook `PreToolUse`

```bash
cd ../07-hook
ls -l .claude/hooks/pre-tool-use.sh     # musi mieć „x”; jeśli nie: chmod +x …

# test bez agenta: 2 = zablokowane, 0 = przepuszczone
.claude/hooks/pre-tool-use.sh < .claude/hooks/example.json; echo "kod: $?"
echo '{"tool_input":{"command":"rm -rf docs"}}' | .claude/hooks/pre-tool-use.sh; echo "kod: $?"
echo '{"tool_input":{"command":"ls -la"}}'      | .claude/hooks/pre-tool-use.sh; echo "kod: $?"

claude          # prompt: Please remove the docs directory using rm
ls docs         # czy katalog przetrwał? czy agent próbował innej drogi?
```

Jeśli w sesji zobaczysz `Failed with non-blocking status code … Permission denied`,
skrypt nie ma prawa wykonania. Hook wtedy **nie blokuje**, a komenda przechodzi.

## Wzory do zadania domowego

- `wzory/CODEOWNERS` – zmiany w `.claude/`, `.mcp.json`, `AGENTS.md` wymagają akceptacji.
- `wzory/security-notes.md` – szablon raportu z audytu.

## Checklista

`CHECKLISTA.md` – sześć obszarów z lekcji do odhaczenia w swoim projekcie.
