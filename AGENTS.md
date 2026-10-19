<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI-Assisted Development Workflow (SDD + Run Logs + Lessons)

This project uses a lightweight Spec-Driven Development (SDD) workflow backed by a `.ai/` folder.
Every AI agent (and human) working in this repo MUST follow these conventions — they are not optional.

## Directory structure

```
.ai/
  specs/                   # Specifications for Spec-Driven Development
    YYYY-MM-DD-slug.md       # Active specs — not yet fully implemented
    implemented/              # Specs whose work has fully shipped (moved here, never deleted)
    archive/                  # Specs that were abandoned or superseded (moved here, never deleted)
  runs/                    # One log file per autonomous AI run
    YYYY-MM-DD-slug.md
  lessons.md               # Rolling index of lessons learned (newest first)
  lessons/                 # One detailed write-up per lesson, linked from lessons.md
    YYYY-MM-DD-slug.md
```

Naming rule for every file created under `.ai/` (specs and runs alike): `YYYY-MM-DD-slug.md`, where
`YYYY-MM-DD` is the date the file was authored and `slug` is a short kebab-case description
(e.g. `2026-10-19-mentor-matching.md`). Never rename the date when a spec is later moved between
`specs/`, `specs/implemented/`, or `specs/archive/` — it records when it was written, not when it moved.

## Specs (`.ai/specs/`)

- Before starting any non-trivial feature or change, write a spec at `.ai/specs/YYYY-MM-DD-slug.md`
  describing the problem, the approach, and acceptance criteria — or check whether one already exists.
- Once the work described in a spec has fully shipped, move the file to `.ai/specs/implemented/`.
- If a spec is abandoned or superseded before being implemented, move it to `.ai/specs/archive/`
  instead of deleting it.

## Run logs (`.ai/runs/`)

- Every autonomous AI run — any multi-step agentic session that makes changes without a human
  driving each individual step — must produce a log at `.ai/runs/YYYY-MM-DD-slug.md`.
- Include: what was asked, what was done, which files were touched, key decisions, and any
  follow-ups or open questions left for a human or a future run.

## Lessons learned (`.ai/lessons.md` + `.ai/lessons/`)

- When you fix a non-obvious bug, hit a gotcha, or learn something worth remembering long-term,
  record it — don't let it live only in chat history.
- Write the detailed finding to `.ai/lessons/YYYY-MM-DD-slug.md`.
- Add a one-line pointer to it at the top of `.ai/lessons.md` (newest entries first).
- Before starting new work, skim `.ai/lessons.md` for relevant prior findings so past mistakes
  aren't repeated.

Note: `.ai/cezar/` is unrelated tooling/runtime state (not part of this workflow) — leave it alone.

# Working principles

1. **Plan complex work first.** For anything multi-step or ambiguous, plan before coding, and capture
   the plan in a spec (see Specs above). Put the effort into the plan so implementation goes in one
   pass. If the implementation goes off track, stop and re-plan; don't keep pushing.
2. **Verify every change.** Never report work as done without proof it works. At minimum run
   `npm run lint` and `npm run build`. For UI changes, run `npm run dev` and check the affected pages
   in a browser. If something could not be verified, say so explicitly.
3. **Learn from corrections.** When a human corrects you or a fix reveals a mistake, record a lesson
   (see Lessons learned above). If the lesson is a rule that applies to all future work, also add
   it to this file in one line.
4. **Fix bugs on your own.** Given a bug report, failing build, or logs, find the root cause and fix
   it without asking for step-by-step direction. Don't patch symptoms or bypass checks.
5. **Choose the elegant solution.** If a fix feels hacky, scrap it and do it properly before
   presenting it. Keep changes minimal and focused on the task.
6. **Use subagents for wide research.** Hand broad exploration or independent parallel tasks to
   subagents so the main context stays focused.
7. **Turn repeated workflows into skills.** If the same multi-step procedure is done more than
   occasionally, make it a skill or command under `.claude/` and commit it.
