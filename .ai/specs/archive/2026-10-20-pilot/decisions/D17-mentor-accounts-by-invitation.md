# D17 — Mentor accounts are created on invitation; sign-in with e-mail and password
- Date, owner: 2026-10-21, founder A (Oliwia), confirmed in the om-discover refresh
- Context and the options weighed: invitation-only accounts created by the founders for mentors from the list of 50, or open self-registration. The board plans to hand-pick and invite mentors; the pilot needs a few mentors, not open registration. Origin: agent recommendation, accepted by founder A.
- Decision and why: in the pilot only the founders create mentor accounts, for mentors they have invited. A mentor signs in with e-mail and password under the engineering standards in `AGENTS.md` (bcrypt cost of at least 12, session in an HttpOnly cookie, rate-limited login, generic error messages). There is no self-registration in the pilot.
- Consequences, and what would make us revisit it: onboarding is manual and a mentor cannot join alone. How an invited mentor sets the first password, and how the coordinator account is created, are details for the spec.
- Status: active
