# D19 — Roles in the pilot: mentor and coordinator; `/admin/*` for the coordinator only
- Date, owner: 2026-10-21, founder A (Oliwia), confirmed in the om-discover refresh
- Context and the options weighed: the code has session helpers with a single `role` string and no defined values; `/admin/*` and `POST /api/mentors` are public today (`AGENTS.md`, known gap). The roles were proposed by the agent in the session and confirmed by founder A.
- Decision and why: the pilot has two account roles, mentor and coordinator; the pilot coordinator is also the administrator. `/admin/*` and the creation of mentor accounts need the coordinator role. Mentees have no account (D16).
- Consequences, and what would make us revisit it: the public `/admin/*` pages and `POST /api/mentors` must be protected by the coordinator role before the pilot; how the coordinator account is first created (for example a seed) is a detail for the spec.
- Status: active
