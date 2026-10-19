# Mentora — Clickable Mockup

A static, framework-free HTML/CSS/TypeScript prototype covering all key paths described in `../docs/02-use-cases-and-user-flows.md`. No build step is required to view it — `dist/` already contains the compiled JavaScript.

## Open it

Just double-click `index.html` (or any other `.html` file) to open it in your browser. Everything runs via `file://`, with no server and no bundler — the TypeScript is compiled into plain global `<script>` tags (see "How it's built" below).

Login is simulated: use **Sign up** (top right) with any email/password, choosing "Learn" or "Teach" to explore the Student or Tutor experience. Switch roles any time by logging out and back in with the other choice. The **Admin** area (`admin.html`) has its own "Enter as Admin (demo)" gate, since admin isn't a real public sign-up path.

Your session, favorites, messages and last booking are kept in the browser's `localStorage` (key `mentorapp_state_v1`), so they survive navigating between pages. Clear it any time via your browser's dev tools, or open in a private/incognito window to start fresh.

## Demonstrating loading / empty / error / success states

Screens that fetch data show a floating **"Simulate:"** toolbar at the bottom with four buttons. Click one to re-render that screen in the corresponding state, exactly as specified per-screen in `../docs/04-screen-specifications.md`. This works by setting a `?state=` query parameter, so you can also share/bookmark a specific state directly (e.g. `search.html?state=empty`).

## Key paths to try

- **Guest → booking:** `index.html` → search "Spanish" → open a tutor profile → "Book a trial lesson" → sign up → pick a slot → pay (use any 16-digit card; a card starting with `0000` simulates a decline) → confirmation → dashboard.
- **Messaging:** from any tutor profile, click "Message" (requires login) → send a message → a simulated reply arrives after ~1s.
- **Become a tutor:** `become-tutor.html` → "Apply now" → 3-step wizard → submission screen, which lets you simulate **pending / approved / rejected** outcomes via its own toolbar.
- **Tutor side:** once signed up as a tutor (or after a simulated approval), explore `tutor-dashboard.html`, `tutor-calendar.html`, `tutor-bookings.html`, `tutor-earnings.html`, `tutor-reviews.html`.
- **Admin:** `admin.html` → "Enter as Admin (demo)" → approve/reject applications, resolve reports and disputes.

## How it's built

- Plain HTML pages (one per screen) share a CSS design system (`css/styles.css`) and a set of TypeScript source files (`src/`) compiled with `tsc` into `dist/` as **global scripts** (TypeScript `namespace MentorApp { ... }`, no ES modules/bundler) — this is what lets every page work by double-clicking the file, with no local server and no CORS issues.
- `src/data.ts` — mock domain data (tutors, reviews) and types.
- `src/state.ts` — tiny `localStorage`-backed store standing in for the backend (session, favorites, threads, bookings, notifications) plus the `?state=` demo-state helper.
- `src/components.ts` — shared UI: header/footer, auth modal, toasts, modals/confirm dialogs, the dev toolbar, tutor cards, skeleton/empty/error state renderers.
- `src/pages/*.ts` — one file per group of screens, each exporting an `init*()` function.
- `src/main.ts` — reads `<body data-page="...">` and calls the matching `init*()`.

To modify and rebuild:

```bash
npm install
npm run build      # compiles src/**/*.ts -> dist/**/*.js
# or, while editing:
npm run watch
```

No other tooling (bundler, dev server, framework) is used on purpose, to keep the prototype trivially shareable as a flat folder of files.
