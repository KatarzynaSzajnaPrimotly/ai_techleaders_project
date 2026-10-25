# Browser checks of a clickable prototype: four gotchas

Found while running the stage 3 check of `prototypes/konta-i-role/` (`_src/checks/`).

- **A closed `<details>` still reports client rects.** `getClientRects().length` and `display` say "visible" for controls inside it, so a check counted the Scenarios panel's buttons as part of the toolbar and expected 20 tab stops instead of 18. Use `el.checkVisibility({ checkVisibilityCSS: true, contentVisibilityAuto: true })`.
- **One long `agent-browser eval` dies after about 30 s** (`CDP command timed out: Runtime.evaluate`), and it takes the whole run with it. Give the page one short call per item (per state, per option, per button) and let Node do the looping and the logging.
- **`@theme inline { --color-destructive: #ef4444 }` compiles the literal into the utility**, so a theme cannot override it with a CSS variable. The light theme had 3.3:1 error text. Scope a rule on `html[data-theme="light"] .text-destructive` (mixing existing tokens) and report the gap; the fix belongs in `tokens.css`.
- **Real Tab walks need two exceptions.** A radio group is one tab stop (arrows move inside it), and Chrome makes a sideways-scrolling region (the design system's `Table` wrapper at 320 px) a tab stop. Without both, an honest page "fails" the walk.
- Sandbox Chrome needs `LD_LIBRARY_PATH=/tmp/chromelibs/usr/lib/x86_64-linux-gnu:/tmp/chromelibs/lib/x86_64-linux-gnu` (the `lib/` half holds `libdbus`) and `AGENT_BROWSER_ARGS=--no-sandbox`.
