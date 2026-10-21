# Run: DevMentor discovery, product brief and pilot backlog

Brief: `.ai/specs/product-brief.md`. Backlog map: `.ai/specs/backlog.md`. PR: #21.

## Asked
Add the product layer to the agent pipeline, run a quick own-mode discovery on the supplied research, write the product
brief, turn it into a GitHub backlog, then tidy the repository.

## Done
- `om-setup-discovery-pipeline`: `discovery` block in `.ai/agentic.config.json` (no domain expert, no designer);
  Discovery stage, Product owner role, Definition of Ready, protected product decisions and an amending note in `SDLC.md`
  (marked blocks). No routing row: `AGENTS.md` has no task-routing table.
- `om-discover` (quick pass, then two refreshes): `.ai/specs/product-brief.md`; decision records D03–D15 and two capture
  templates in `.ai/specs/research/decisions/` and `templates/`. Research material flattened from a nested
  `lekcja-04-wsad-discovery-devmentor/.ai/specs/research/` copy to `.ai/specs/research/`.
- `om-backlog` (dry run, then filed on confirmation): GitHub issues #5–#20 in `KatarzynaSzajnaPrimotly/ai_techleaders_project`
  (epics #5–#9, stories #10–#12, #14–#18, tasks #13, #19, #20); no issue adopted; map in `.ai/specs/backlog.md`.
- Git: commit `a4d1f1c` on `docs/devmentor-discovery`, PR #21 stacked on #1 (base `ci/status-badge`); a separate local branch
  `chore/skills-update` (`48332f4`) holds the updated `.agents/skills/` and `skills-lock.json`.

- 2026-10-21: accounts and roles. Decisions D16–D19 (guest mentee with e-mail, invited mentor accounts, coordinator sees metadata
  only, roles mentor and coordinator), rules R08–R11 and records in `.ai/specs/research/decisions/`; epic E06 and stories
  #22–#26 filed, and ten existing issues (#5, #6, #8, #10–#15, #18, #19) updated; `backlog.md` extended.
- 2026-10-21: design decisions D20–D22 (answers in an e-mail thread, offers recorded by hand, window clock stops while waiting
  for the mentee) with rules R12–R14; new open questions Q20 (how the platform learns that the mentor answered; blocking for
  #14, #16 and #18) and Q21; issues #8, #14, #15, #16, #18 and #25 updated.
- 2026-10-21: D23 (e-mail relay through a platform address, resolves Q20); new story E02-S04 (#27); issues #6, #14, #15, #16 and
  #18 updated; Q22 and Q23 open (Q23 blocks #27 and #16).
- 2026-10-21: D24–D26 (two relay addresses per request, the mentor keeps seeing the mentee's e-mail, text deleted after delivery),
  rules R16–R17; Q22 and Q23 closed, Q24 open (non-blocking); issues #14, #15, #16 and #27 updated.

## Key decisions (all by the product owner, founder A, 2026-10-20)
Now is a four-to-six-week pilot of prepaid written answers through the mentor's own link: PLN 200, PLN 150 to the mentor,
answer within four business hours of published availability or a full refund, success = 3 paid requests from 3 different
mentees with at least 10 mentees offered (D03, D05–D15).

## Verification
- Read back: labels on issues #5, #11, #13, #17, #19; the checklist in epics #5–#8; staged files before the commit.
- Not run: lint, typecheck, test:coverage and build (no code changed). The brief's skeptical reading was inline, not an
  independent subagent.

## Open for a human
- Done after the first version of this log: the flattened research path and the log/lessons commit (`7e45fe0`) were pushed
  to PR #21, and the one line naming the old nested path was corrected in the bodies of issues #5–#20 and read back.
- `chore/skills-update` (`48332f4`) is not pushed. Retarget PR #21 to `main` after #1 merges.
- Questions kept open in the brief: Q05 (vault), Q12 (time zone and clock), Q13 (payout timing), Q14 (mentee identification),
  Q15 (mentor sign-in) and Q16 (wait for a mentee's reply); Q14–Q16 are also in the issues.
- Not done from the tidy-up list: archive the Mentora concept, remove the zip in the repository root.

## 2026-10-21 re-baseline to the reference backlog
- Asked: compare the backlog with the reference `full-backlog.md` and rebuild the scope on it.
- Done: archived the pilot brief, backlog map and decisions D03-D26 in `.ai/specs/archive/2026-10-20-pilot/`; new brief with the reference decisions (D01-D05, D07-D11, D13, D16, D18-D22, D24) and decisions made here (D27-D32); five agents adapted the reference issues to this repository's real code into drafts; GitHub: pilot issues #5-#27 renamed to the P series and closed as not planned, the 1.0 tree filed as #29-#56 (epics #29-#35, 21 stories #36-#56); `backlog.md` map and `backlog-snapshot.md`.
- Verified: ids, titles, dependencies and iterations of the new index against the reference index (identical except E06, the parked epic, and the E04-S01 title changed by D27); labels read back on sample issues; open issues 29 and closed 22 after the change.
- Not verified: Stripe API details, MikroORM partial unique indexes, Next 16 behaviours (recalled from docs, not run); the drafts were not re-read line by line after the last decision updates; no code was built.
- Open: Q20 before 2026-11-28; Q24-Q29 as listed in the brief; the money flow of D28 to be checked with a lawyer or Stripe before the first payout; the first iteration is far above the 25 build hours and is not estimated.
