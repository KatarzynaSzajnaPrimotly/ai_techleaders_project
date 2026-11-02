# Dopisz do ~/.zshrc albo ~/.bashrc, potem otwórz nowy terminal.
# Listuje pliki, które konfigurują agenta w bieżącym repozytorium.
alias agent-audit='find . \( -path ./node_modules -o -path ./.git \) -prune -o \
  \( -name ".mcp.json" -o -name "CLAUDE.md" -o -name "AGENTS.md" -o -name ".cursorrules" \
     -o -path "*/.claude/*" -o -path "*/.agents/*" -o -path "*/.codex/*" -o -path "*/.github/workflows/*" \) \
  -type f -print'

# Szybki podgląd tego, co w tych plikach jest najgroźniejsze:
# hooki, automatyczne zatwierdzanie serwerów MCP i reguły allow.
alias agent-audit-hot='grep -RInE "\"hooks\"|enableAllProjectMcpServers|\"allow\"|mcpServers|npx|curl|wget" \
  .claude .mcp.json .codex 2>/dev/null'
