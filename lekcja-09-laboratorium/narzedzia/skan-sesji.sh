#!/usr/bin/env bash
# Zlicza potencjalne sekrety w transkryptach sesji Claude Code.
# Wypisuje tylko liczby, nigdy samych wartości.
# Użycie: bash narzedzia/skan-sesji.sh [katalog]   (domyślnie ~/.claude/projects)
dir="${1:-$HOME/.claude/projects}"
if [ ! -d "$dir" ]; then
  echo "Nie ma katalogu $dir" >&2
  exit 1
fi

count() {
  local n
  n=$(grep -rIhoE -e "$2" "$dir" 2>/dev/null | wc -l | tr -d ' ')
  printf '%-34s %s\n' "$1" "$n"
}

echo "Skan: $dir"
count "Connection string Postgres z hasłem" 'postgres(ql)?://[^:/ "]+:[^@ "]+@'
count "Inny URL z hasłem"                    '(mysql|mongodb(\+srv)?|redis|amqp)://[^:/ "]+:[^@ "]+@'
count "Klucz API Anthropic"                  'sk-ant-[A-Za-z0-9_-]{20,}'
count "Klucz API OpenAI"                     'sk-(proj-)?[A-Za-z0-9]{32,}'
count "Token GitHub"                         '(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}'
count "Klucz AWS"                            'AKIA[0-9A-Z]{16}'
count "Token JWT"                            'eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
count "Klucz prywatny (SSH, PEM)"            '-----BEGIN [A-Z ]*PRIVATE KEY-----'
echo
echo "Pliki z trafieniami (pierwsze 20):"
grep -rIlE -e 'postgres(ql)?://[^:/ "]+:[^@ "]+@|sk-ant-|(ghp|gho|ghs)_|github_pat_|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{10,}\.eyJ|-----BEGIN [A-Z ]*PRIVATE KEY-----' \
  "$dir" 2>/dev/null | head -20
