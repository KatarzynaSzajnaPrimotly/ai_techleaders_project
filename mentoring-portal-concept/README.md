# Mentoring Portal — Initial Concept

An initial product concept for a mentoring/tutoring portal, using Preply.com as a **functional and UX benchmark only** — no visual identity, copy, or code was copied from Preply. The product is branded "Mentora" with an original, neutral design system.

## What's in this package

```
docs/
  01-users-and-needs.md              System users and their needs
  02-use-cases-and-user-flows.md     Main use cases and complete user flows
  03-screen-and-navigation-map.md    Full screen list, IA and navigation graph
  04-screen-specifications.md        Per-screen purpose, features, components,
                                      states (loading/empty/error/success),
                                      validation, and related API endpoints

mockups/
  (clickable HTML/CSS/TypeScript prototype — see mockups/README.md)
```

## How to review

1. Start with `docs/01-users-and-needs.md` through `docs/04-screen-specifications.md` in order — each builds on the previous one.
2. Open `mockups/index.html` directly in a browser (double-click — no server or build step required) to click through the live prototype. See `mockups/README.md` for details, including how to demo the loading/empty/error/success states via the floating toolbar at the bottom of data-driven screens.

## Scope & assumptions

- This is a **concept-level, front-end-only prototype**: there is no real backend. The mockups use mock data and `localStorage` to simulate persistence across page loads (login state, favorites, messages, a booking draft) so the click-through flows feel continuous.
- The documented API endpoints (`docs/04-screen-specifications.md`) describe the intended real backend contract; they are not implemented.
- Video calling, payment processing, email/calendar sync, and file uploads are represented as UI affordances only (clearly simulated, e.g. with a toast notification), not functional integrations.
- Admin screens (tutor application moderation, reported content, disputes, platform metrics) are consolidated into a single **Admin Overview** page in the prototype to demonstrate the moderation pattern without duplicating four near-identical CRUD screens; all four are still individually specified in `docs/04-screen-specifications.md`.
