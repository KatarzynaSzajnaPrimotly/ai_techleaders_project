# Vitest 5 and coverage gotchas

- Vitest 5 needs `@types/node` ^22 or ^24; the create-next-app default `^20` made `npm install` fail with ERESOLVE.
  We use `^24` (matches `.nvmrc`).
- A test file that matches no project `include` pattern is silently never run (a `*.test.ts` in `ui` was ignored by a
  `.tsx`-only pattern). After adding tests, check the file count in the Vitest summary.
- Testing Library only auto-cleans with global test APIs; without globals add `afterEach(cleanup)` in a setup file.
- Coverage `include` makes new untested files count as 0%, which is what makes the 100% gate strict.
- Test fixtures can alias with the code under test: a mask pattern `i % 3` never matched the 6px sampling grid on a
  1200px canvas, so a branch looked unreachable. Use a coprime modulus (`i % 7`).
- `Backdrop` has a defensive branch the real noise field never reaches (field min -0.82 vs the -1.05 needed).
  Cover such branches by forcing the input (`vi.spyOn(Math, "exp")`), do not exclude them from coverage.
- React 19 server rendering emits an empty `<head></head>`; assert on the parts that matter, not the whole string.
