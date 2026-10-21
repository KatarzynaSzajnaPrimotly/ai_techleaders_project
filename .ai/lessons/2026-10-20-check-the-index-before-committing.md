# Check what is actually staged before committing

A directory `git add` plus a hand-picked file list is not proof of what will be committed: a large unrelated archive
(`ai-techleaders-project-after-lesson-03.zip`, 1.9 MB) showed up in the index although it was never added by the commit's
author. It was only caught because `git diff --cached --stat` was read before committing.

- Run `git diff --cached --name-only | grep -v '<expected prefixes>'` and expect no output before every commit.
- Unstage a stray file with `git restore --staged <path>`; the file stays on disk.
- A branch that is ahead of `main` by commits from another open PR needs a stacked PR (base = that PR's branch), or its
  diff shows someone else's work; retarget to `main` after the base PR merges.
