#!/usr/bin/env bash
# Szuka w skillach dynamicznego kontekstu (!`komenda`) i podejrzanych wywołań.
# Uruchom w katalogu projektu: bash narzedzia/grep-skille.sh
# Każde trafienie przeczytaj. Pusty wynik nie znaczy „bezpiecznie”,
# znaczy tylko, że nie ma tych konkretnych wzorców.
grep -RInE '!`|curl |wget |base64 |~/\.ssh|~/\.aws|\.env' \
  ~/.claude/skills/ .claude/skills/ ~/.agents/skills/ .agents/skills/ 2>/dev/null
